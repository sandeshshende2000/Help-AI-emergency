
import React from 'react';
import { ShieldAlert, Phone, MessageSquare, MapPin, CheckCircle2, XCircle } from 'lucide-react';
import { Contact, ContactType } from '../types';

interface SOSScreenProps {
  onSOS: () => void;
  emergencyNumber: string;
  onUpdateNumber: (n: string) => void;
  contacts: Contact[];
  onCancel: () => void;
}

const SOSScreen: React.FC<SOSScreenProps> = ({ emergencyNumber, onUpdateNumber, contacts, onCancel }) => {
  const primary = contacts.find(c => c.type === ContactType.PRIMARY);
  const secondary = contacts.find(c => c.type === ContactType.SECONDARY);

  return (
    <div className="min-h-full p-8 flex flex-col bg-[#F7F9FC] relative">
      <div className="flex-1 flex flex-col items-center pt-12">
        <div className="relative mb-16">
          <div className="absolute -inset-8 bg-[#F97316]/10 rounded-full animate-ping duration-[3000ms]"></div>
          
          <div className="relative z-10 w-52 h-52 rounded-full flex flex-col items-center justify-center bg-gradient-to-br from-[#FB923C] to-[#F97316] border-[8px] border-white shadow-[0_30px_60px_rgba(249,115,22,0.3)]">
            <ShieldAlert size={64} className="text-white mb-1 drop-shadow-lg" />
            <span className="text-white text-3xl font-black tracking-tighter drop-shadow-md">SOS</span>
            <span className="text-white/80 text-[10px] font-black tracking-widest uppercase">Emergency Active</span>
          </div>
        </div>

        <div className="w-full space-y-6">
          <div className="px-2">
            <h3 className="text-[10px] font-black text-[#6B7280] uppercase tracking-[0.2em] mb-4">Urgent Protocol</h3>
            
            <div className="space-y-4">
              <div className="bg-white rounded-[2rem] p-6 border border-[#E5E7EB] shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-[#F97316]" />
                    <p className="text-[10px] font-black text-[#1F2937] uppercase tracking-widest">SOS Leader</p>
                  </div>
                  <p className="text-sm font-black text-[#F97316]">{primary?.name || 'Not Set'}</p>
                </div>
                <div className="space-y-3">
                  <StatusItem icon={Phone} label="Emergency Call" status="Dialing..." active />
                  <StatusItem icon={MessageSquare} label="SMS Alert" status="Sent" done />
                  <StatusItem icon={MapPin} label="Live GPS" status="Sharing" done />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#FEF2F2] rounded-[2rem] p-6 border border-[#FEE2E2]">
            <div className="flex items-center gap-3 mb-3">
              <Phone size={16} className="text-[#EF4444]" />
              <p className="text-[10px] font-black text-[#991B1B] uppercase tracking-widest">Global Rescue Number</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xl font-black text-[#B91C1C] tracking-tight">{emergencyNumber || "911"}</p>
              {!emergencyNumber && (
                <button onClick={() => {
                  const num = prompt("Set Emergency Number (e.g. 911):");
                  if (num) onUpdateNumber(num);
                }} className="text-[10px] font-black uppercase text-[#EF4444] bg-white py-2 px-4 rounded-xl border border-[#FEE2E2] shadow-sm active:scale-95">Configure</button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 mb-8 px-4">
        <button 
          onClick={onCancel}
          className="w-full bg-[#1F2937] text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 border border-white/10"
        >
          <XCircle size={18} />
          Safe Disconnect
        </button>
      </div>
    </div>
  );
};

interface StatusItemProps {
  icon: any;
  label: string;
  status: string;
  done?: boolean;
  active?: boolean;
}

const StatusItem: React.FC<StatusItemProps> = ({ icon: Icon, label, status, done, active }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className={`p-1.5 rounded-lg ${done ? 'bg-[#ECFDF5] text-[#059669]' : active ? 'bg-[#FEF2F2] text-[#EF4444] animate-pulse' : 'bg-[#F9FAFB] text-[#9CA3AF]'}`}>
        <Icon size={14} />
      </div>
      <p className={`text-[11px] font-bold ${done ? 'text-[#1F2937]' : 'text-[#6B7280]'}`}>{label}</p>
    </div>
    <div className="flex items-center gap-1.5">
      <p className={`text-[9px] font-black uppercase tracking-widest ${done ? 'text-[#059669]' : active ? 'text-[#EF4444]' : 'text-[#D1D5DB]'}`}>
        {status}
      </p>
      {done && <CheckCircle2 size={12} className="text-[#10B981]" />}
    </div>
  </div>
);

export default SOSScreen;
