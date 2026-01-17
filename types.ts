
export enum AppScreen {
  SIGNUP = 'SIGNUP',
  LOGIN = 'LOGIN',
  PERMISSIONS = 'PERMISSIONS',
  TRIAL = 'TRIAL',
  HOME = 'HOME',
  CONTACTS = 'CONTACTS',
  SOS = 'SOS',
  VOICE_ALERT = 'VOICE_ALERT',
  LOGS = 'LOGS',
  ACCOUNT = 'ACCOUNT',
  UPGRADE = 'UPGRADE'
}

export enum ContactType {
  SOS = 'SOS Contact',
  PRIMARY = 'Primary Contact',
  SECONDARY = 'Secondary Contact',
  NORMAL = 'Normal Contact'
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  type: ContactType;
}

export interface LogEntry {
  id: string;
  date: string;
  timestamp: number;
  time: string;
  type: 'Voice Trigger' | 'Manual SOS';
  details?: {
    sosContact: string;
    normalContacts: string[];
    emergencyNumber: string;
  };
}

export interface UserSession {
  email: string;
  trialStartDate: string;
  trialEndDate: string;
  isLoggedIn: boolean;
  isTrialActive: boolean;
  planType: 'Trial' | 'Monthly' | 'Yearly';
  permissionsGranted: {
    microphone: boolean;
    location: boolean;
  };
}

export const TRIGGER_PHRASES: Record<string, string[]> = {
  'English (US)': [
    'I need help right now',
    'This is an emergency, please help me',
    'I am in danger, help'
  ],
  'Hindi': [
    'मुझे अभी मदद चाहिए',
    'यह एक आपात स्थिति है, कृपया मेरी मदद करें',
    'मैं खतरे में हूँ, मदद करें'
  ],
  'Spanish': [
    'Necesito ayuda ahora mismo',
    'Esto es una emergencia, por favor ayúdame',
    'Estoy en peligro, ayuda'
  ]
};
