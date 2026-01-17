
import React from 'react';
import { Mic, CheckCircle2, XCircle, MapPin, Radio, Activity, Phone, MessageSquare, ShieldOff } from 'lucide-react';
import { Contact, ContactType } from '../types';

interface VoiceAlertScreenProps {
  contacts: Contact[];
  onCancel: () => void;
}

const VoiceAlertScreen: React.FC<VoiceAlertScreenProps> = ({ contacts, onCancel }) => {
  const sosContact = contacts.find(c => c.type === ContactType.SOS);
  const normalContacts = contacts.filter(c => c.type === ContactType.NORMAL);

  return (
    <div className="min-h-full p-8 flex flex-col mesh-gradient relative">
      {/* Background Alerts Visual - Emerald Theme */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-emerald-500/5 blur-[120px] rounded-full animate-pulse"></div>
      
      <div className="flex-1 flex flex-col items-center pt-16 relative z-10">
        <div className="relative mb-12">
          {/* Futuristic Radar Rings */}
          <div className="absolute inset-0 scale-[1.5] bg-emerald-500/10 rounded-full animate-ping duration-[3000ms]"></div>
          <div className="absolute inset-0 scale-[2] bg-emerald-500/5 rounded-full animate-ping duration-[5000ms]"></div>
          
          <div className="relative z-10 w-48 h-48 rounded-[3.5rem] flex flex-col items-center justify-center bg-slate-900 border-[8px] border-white shadow-[0_40px_80px_rgba(0,0,0,0.2)] tactile-button">
            <Mic size={64} className="text-emerald-500 mb-2 drop-shadow-[0_0_15px_rgba(16,185,129,0.6)]" />
            <div className="flex items-center gap-2">
              <span className="text-white text-[10px] font-black tracking-[0.4em] uppercase">Trigger Detected</span>
            </div>
          </div>
        </div>

        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase">Help Requested</h2>
          <p className="text-emerald-600 text-[10px] font-black mt-2 uppercase tracking-[0.3em] bg-emerald-50 py-1.5 px-6 rounded-full inline-block border border-emerald-100">AI Rescue Protocol Active</p>
        </div>

        <div className="w-full space-y-6">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-2">Notification Cascade</h3>
          
          {/* Primary Alert Card - Emerald theme */}
          <ProtocolCard 
            title="Tier 1: High Priority" 
            name={sosContact?.name || 'SOS Leader'} 
            actions={['Call', 'SMS', 'Location']} 
            color="emerald"
            isActive
          />

          {/* Secondary & Tertiary Stacked Glass - Green tones */}
          <div className="grid grid-cols-2 gap-4">
            {normalContacts.length > 0 && (
              <SmallProtocolCard 
                title="Tier 2" 
                name={normalContacts[0].name} 
                actions={['SMS', 'Location']} 
                color="teal"
              />
            )}
            {normalContacts.length > 1 && (
              <SmallProtocolCard 
                title="Tier 3" 
                name={normalContacts[1].name} 
                actions={['SMS']} 
                color="green"
              />
            )}
          </div>

          <div className="glass-card rounded-[2rem] p-5 flex items-center justify-between opacity-50 border-white/40 grayscale shadow-none">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-slate-300 border border-slate-100">
                <ShieldOff size={18} />
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Global Rescue</p>
                <p className="text-[11px] font-bold text-slate-400">Not Activated (Voice Rule)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 mb-8 px-4 relative z-10">
        <button 
          onClick={onCancel}
          className="w-full bg-slate-900 text-white py-6 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.3em] shadow-[0_20px_50px_rgba(0,0,0,0.2)] active:scale-95 transition-all flex items-center justify-center gap-3 border border-white/20"
        >
          <XCircle size={20} />
          Safe Stop & Reset
        </button>
      </div>
    </div>
  );
};

const ProtocolCard = ({ title, name, actions, color, isActive }: any) => {
  const colorMap: any = {
    emerald: 'bg-emerald-50 border-emerald-200/50 text-emerald-600',
  };

  return (
    <div className={`glass-card rounded-[2.5rem] p-8 border-2 shadow-2xl relative overflow-hidden ${colorMap[color]}`}>
      {isActive && <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -mr-16 -mt-16"></div>}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">{title}</p>
          <p className="text-xl font-black text-slate-900 mt-1">{name}</p>
        </div>
        <div className="bg-emerald-500 text-white p-2 rounded-2xl shadow-lg">
          <Activity size={24} className="animate-pulse" />
        </div>
      </div>
      <div className="flex gap-3">
        {actions.includes('Call') && <ActionTag icon={Phone} label="Calling" active />}
        {actions.includes('SMS') && <ActionTag icon={MessageSquare} label="SMS Sent" active />}
        {actions.includes('Location') && <ActionTag icon={MapPin} label="Live GPS" active />}
      </div>
    </div>
  );
};

const SmallProtocolCard = ({ title, name, actions, color }: any) => {
  const colorStyle: any = {
    teal: 'border-teal-100/50 bg-teal-50',
    green: 'border-emerald-100/50 bg-emerald-50',
  };
  return (
    <div className={`glass-card rounded-[2rem] p-5 border shadow-xl ${colorStyle[color]}`}>
      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{title}</p>
      <p className="text-sm font-black text-slate-900 mt-1 truncate">{name}</p>
      <div className="flex flex-wrap gap-1.5 mt-4">
        {actions.map((a: string) => (
          <div key={a} className="w-7 h-7 bg-white rounded-lg border border-slate-50 flex items-center justify-center text-slate-400 shadow-sm">
            {a === 'SMS' && <MessageSquare size={12} />}
            {a === 'Location' && <MapPin size={12} />}
          </div>
        ))}
      </div>
    </div>
  );
};

const ActionTag = ({ icon: Icon, label, active }: any) => (
  <div className={`flex items-center gap-2 py-2 px-4 rounded-xl border font-black text-[9px] uppercase tracking-widest transition-all ${active ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-white text-slate-400 border-slate-100'}`}>
    <Icon size={12} className={active ? 'text-emerald-400' : ''} />
    {label}
  </div>
);

export default VoiceAlertScreen;
