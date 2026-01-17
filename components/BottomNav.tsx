
import React from 'react';
import { Home, Users, ShieldAlert, List, User } from 'lucide-react';
import { AppScreen } from '../types';

interface BottomNavProps {
  activeScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeScreen, onNavigate }) => {
  const tabs = [
    { id: AppScreen.HOME, icon: Home, label: 'Home', color: 'text-[#3B82F6]' },
    { id: AppScreen.CONTACTS, icon: Users, label: 'Contacts', color: 'text-[#22C55E]' },
    { id: AppScreen.SOS, icon: ShieldAlert, label: 'SOS', special: true, color: 'text-[#F97316]' },
    { id: AppScreen.LOGS, icon: List, label: 'Logs', color: 'text-[#8B5CF6]' },
    { id: AppScreen.ACCOUNT, icon: User, label: 'Account', color: 'text-[#64748B]' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] flex items-center justify-around py-2 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] px-2">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeScreen === tab.id;

        if (tab.special) {
          return (
            <div key={tab.id} className="relative -top-4 px-2">
              <button
                onClick={() => onNavigate(tab.id)}
                className={`relative flex flex-col items-center justify-center rounded-full w-14 h-14 shadow-[0_10px_25px_rgba(249,115,22,0.3)] border-4 border-white transition-all transform active:scale-90 bg-gradient-to-br from-[#FB923C] to-[#F97316] text-white`}
              >
                <Icon size={24} />
              </button>
            </div>
          );
        }

        return (
          <button
            key={tab.id}
            onClick={() => onNavigate(tab.id)}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all relative ${
              isActive ? tab.color : 'text-[#64748B] opacity-50'
            }`}
          >
            <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            <span className={`text-[9px] mt-1 font-bold uppercase tracking-wider`}>
              {tab.label}
            </span>
            {isActive && (
              <div className={`absolute bottom-0 w-6 h-0.5 rounded-full ${tab.color.replace('text-', 'bg-')} animate-in fade-in duration-300`}></div>
            )}
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
