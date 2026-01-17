
import React, { useState, useEffect } from 'react';
import { AppScreen, UserSession, Contact, ContactType, LogEntry } from './types';
import SignupScreen from './screens/SignupScreen';
import LoginScreen from './screens/LoginScreen';
import PermissionsScreen from './screens/PermissionsScreen';
import TrialScreen from './screens/TrialScreen';
import DashboardScreen from './screens/DashboardScreen';
import ContactsScreen from './screens/ContactsScreen';
import LogsScreen from './screens/LogsScreen';
import AccountScreen from './screens/AccountScreen';
import SOSScreen from './screens/SOSScreen';
import VoiceAlertScreen from './screens/VoiceAlertScreen';
import UpgradeScreen from './screens/UpgradeScreen';
import BottomNav from './components/BottomNav';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.SIGNUP);
  const [session, setSession] = useState<UserSession | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [emergencyNumber, setEmergencyNumber] = useState(() => localStorage.getItem('help_emergency_number') || '911');

  useEffect(() => {
    const savedSession = localStorage.getItem('help_session');
    const savedContacts = localStorage.getItem('help_contacts');
    const savedLogs = localStorage.getItem('help_logs');

    if (savedSession) {
      const parsed = JSON.parse(savedSession);
      setSession(parsed);
      setCurrentScreen(AppScreen.HOME);
    }
    
    if (savedContacts) setContacts(JSON.parse(savedContacts));
    
    if (savedLogs) {
      const parsedLogs: LogEntry[] = JSON.parse(savedLogs);
      const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      const filteredLogs = parsedLogs.filter(log => log.timestamp > sevenDaysAgo);
      setLogs(filteredLogs);
      localStorage.setItem('help_logs', JSON.stringify(filteredLogs));
    }
  }, []);

  const saveSession = (newSession: UserSession) => {
    setSession(newSession);
    localStorage.setItem('help_session', JSON.stringify(newSession));
  };

  const addLog = (type: LogEntry['type']) => {
    const now = new Date();
    const sos = contacts.find(c => c.type === ContactType.SOS);
    const normals = contacts.filter(c => c.type === ContactType.NORMAL);

    const newLog: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      date: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      timestamp: Date.now(),
      type,
      details: {
        sosContact: sos?.name || 'Not Set',
        normalContacts: normals.map(c => c.name),
        emergencyNumber: emergencyNumber
      }
    };
    const updatedLogs = [newLog, ...logs];
    setLogs(updatedLogs);
    localStorage.setItem('help_logs', JSON.stringify(updatedLogs));
  };

  const handleSignup = (email: string) => {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    const newSession: UserSession = {
      email,
      trialStartDate: startDate.toLocaleDateString(),
      trialEndDate: endDate.toLocaleDateString(),
      isLoggedIn: true,
      isTrialActive: true,
      planType: 'Trial',
      permissionsGranted: { microphone: false, location: false }
    };
    saveSession(newSession);
    setCurrentScreen(AppScreen.PERMISSIONS);
  };

  const handleLogin = (email: string) => {
    handleSignup(email);
    setCurrentScreen(AppScreen.HOME);
  };

  const updateContacts = (newContacts: Contact[]) => {
    setContacts(newContacts);
    localStorage.setItem('help_contacts', JSON.stringify(newContacts));
  };

  const handleSOS = () => {
    addLog('Manual SOS');
    setCurrentScreen(AppScreen.SOS);
  };

  const handleVoiceTrigger = () => {
    addLog('Voice Trigger');
    setCurrentScreen(AppScreen.VOICE_ALERT);
  };

  const renderScreen = () => {
    if (!session && currentScreen !== AppScreen.SIGNUP && currentScreen !== AppScreen.LOGIN) {
      return <SignupScreen onSignup={handleSignup} onGoToLogin={() => setCurrentScreen(AppScreen.LOGIN)} />;
    }

    switch (currentScreen) {
      case AppScreen.SIGNUP:
        return <SignupScreen onSignup={handleSignup} onGoToLogin={() => setCurrentScreen(AppScreen.LOGIN)} />;
      case AppScreen.LOGIN:
        return <LoginScreen onLogin={handleLogin} onGoToSignup={() => setCurrentScreen(AppScreen.SIGNUP)} />;
      case AppScreen.PERMISSIONS:
        return <PermissionsScreen onGrant={() => {
          if (session) {
            const updated = { ...session, permissionsGranted: { microphone: true, location: true } };
            saveSession(updated);
            setCurrentScreen(AppScreen.TRIAL);
          }
        }} />;
      case AppScreen.TRIAL:
        return <TrialScreen session={session!} onProceed={() => setCurrentScreen(AppScreen.HOME)} />;
      case AppScreen.HOME:
        return <DashboardScreen session={session!} onTrigger={handleVoiceTrigger} onManualSOS={handleSOS} />;
      case AppScreen.CONTACTS:
        return <ContactsScreen contacts={contacts} onUpdate={updateContacts} />;
      case AppScreen.SOS:
        return (
          <SOSScreen 
            onSOS={handleSOS}
            emergencyNumber={emergencyNumber} 
            onUpdateNumber={(n) => { setEmergencyNumber(n); localStorage.setItem('help_emergency_number', n); }} 
            contacts={contacts}
            onCancel={() => setCurrentScreen(AppScreen.HOME)}
          />
        );
      case AppScreen.VOICE_ALERT:
        return (
          <VoiceAlertScreen 
            contacts={contacts}
            onCancel={() => setCurrentScreen(AppScreen.HOME)}
          />
        );
      case AppScreen.LOGS:
        return <LogsScreen logs={logs} onClear={() => { setLogs([]); localStorage.removeItem('help_logs'); }} />;
      case AppScreen.ACCOUNT:
        return <AccountScreen session={session!} onUpgrade={() => setCurrentScreen(AppScreen.UPGRADE)} onLogout={() => { localStorage.clear(); window.location.reload(); }} />;
      case AppScreen.UPGRADE:
        return <UpgradeScreen onCancel={() => setCurrentScreen(AppScreen.ACCOUNT)} onSuccess={(plan) => {
          if (session) {
            const updated = { ...session, planType: plan, isTrialActive: true };
            saveSession(updated);
            setCurrentScreen(AppScreen.ACCOUNT);
          }
        }} />;
      default:
        return <SignupScreen onSignup={handleSignup} onGoToLogin={() => setCurrentScreen(AppScreen.LOGIN)} />;
    }
  };

  const hideNav = [AppScreen.SIGNUP, AppScreen.LOGIN, AppScreen.PERMISSIONS, AppScreen.TRIAL, AppScreen.UPGRADE, AppScreen.SOS, AppScreen.VOICE_ALERT].includes(currentScreen);

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-slate-50 relative overflow-hidden shadow-2xl border-x border-slate-200">
      <main className="flex-1 overflow-y-auto scrollbar-hide bg-white">
        {renderScreen()}
      </main>
      {!hideNav && <BottomNav activeScreen={currentScreen} onNavigate={setCurrentScreen} />}
    </div>
  );
};

export default App;
