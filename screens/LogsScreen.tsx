
import React from 'react';
import { Calendar, Clock, AlertTriangle, ShieldCheck, Trash2, Phone, MessageSquare, MapPin, Mic, HandMetal, ShieldOff } from 'lucide-react';
import { LogEntry } from '../types';

interface LogsScreenProps {
  logs: LogEntry[];
  onClear: () => void;
}

const LogsScreen: React.FC<LogsScreenProps> = ({ logs, onClear }) => {
  return (
    <div className="p-6 pb-32">
      <header className="mb-8 pt-4">
        <h2 className="text-2xl font-black tracking-tight text-slate-900">Activity Logs</h2>
        <p className="text-slate-500 text-sm font-medium mt-1">Incident history for the last 7 days.</p>
      </header>

      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl mb-10 relative overflow-hidden">
        <div className="relative z-10 flex items-end justify-between">
          <div>
            <p className="text-[10px] uppercase font-black tracking-[0.2em] opacity-70 mb-2">Weekly Summary</p>
            <p className="text-5xl font-black mb-1">{logs.length}</p>
            <p className="text-[10px] font-black opacity-90 uppercase tracking-widest">Alerts Sent</p>
          </div>
          <div className="text-right pb-1">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest mb-1">
              <Mic size={12} className="text-orange-400" /> {logs.filter(l => l.type === 'Voice Trigger').length} Voice
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
              <HandMetal size={12} className="text-red-400" /> {logs.filter(l => l.type === 'Manual SOS').length} Manual
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="font-black text-slate-400 text-[10px] uppercase tracking-widest">Incident Feed</h3>
          {logs.length > 0 && (
            <button onClick={onClear} className="text-[10px] font-black text-red-500 flex items-center gap-1.5 uppercase tracking-widest transition-all">
              <Trash2 size={12} /> Clear History
            </button>
          )}
        </div>

        <div className="space-y-6">
          {logs.map((log) => (
            <div key={log.id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2">
              <div className="p-6 pb-4 flex items-center justify-between border-b border-slate-50">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${log.type === 'Voice Trigger' ? 'bg-orange-50 text-orange-500' : 'bg-red-50 text-red-500'}`}>
                    {log.type === 'Voice Trigger' ? <Mic size={20} /> : <AlertTriangle size={20} />}
                  </div>
                  <div>
                    <p className="font-black text-slate-900 text-sm tracking-tight">{log.type}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1"><Calendar size={10} /> {log.date}</span>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1"><Clock size={10} /> {log.time}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 pt-4 space-y-4 bg-slate-50/30">
                <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Alert Protocol Executed</p>
                
                {/* SOS Contact Protocol */}
                <LogActionRow 
                  label="SOS Contact (Primary)" 
                  name={log.details?.sosContact || 'Unknown'} 
                  actions={log.type === 'Voice Trigger' ? ['Call', 'SMS', 'Location'] : ['Call', 'SMS', 'Location']} 
                  color="orange" 
                />

                {/* Normal Contacts Protocols based on Index */}
                {log.details?.normalContacts.map((name, i) => {
                  let actions: string[] = [];
                  if (log.type === 'Voice Trigger') {
                    if (i === 0) actions = ['SMS', 'Location']; // Secondary
                    else if (i === 1) actions = ['SMS']; // Tertiary
                    else actions = []; // No action for others in voice trigger
                  } else {
                    actions = ['SMS', 'Location']; // Manual SOS sends all to everyone
                  }

                  if (actions.length === 0) return null;

                  return (
                    <LogActionRow 
                      key={i} 
                      label={`${i === 0 ? 'Secondary' : i === 1 ? 'Tertiary' : 'Contact'}`} 
                      name={name} 
                      actions={actions} 
                      color="teal" 
                    />
                  );
                })}

                {/* Emergency Number Protocol */}
                <LogActionRow 
                  label="Emergency Line" 
                  name={log.details?.emergencyNumber || 'Not Configured'} 
                  actions={log.type === 'Voice Trigger' ? [] : ['Call']} 
                  color="slate"
                  skipped={log.type === 'Voice Trigger'}
                />
              </div>
            </div>
          ))}

          {logs.length === 0 && (
            <div className="py-24 flex flex-col items-center justify-center text-slate-300 text-center">
              <ShieldCheck size={48} className="opacity-20 mb-4" />
              <p className="font-black uppercase text-[10px] tracking-widest">All Clear</p>
              <p className="text-xs font-medium mt-1">No emergency logs found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const LogActionRow = ({ label, name, actions, color, skipped }: any) => {
  const colorMap: any = {
    orange: 'text-orange-500 bg-orange-50 border-orange-100',
    teal: 'text-teal-500 bg-teal-50 border-teal-100',
    slate: 'text-slate-600 bg-slate-100 border-slate-200'
  };

  return (
    <div className={`flex items-center justify-between ${skipped ? 'opacity-40' : ''}`}>
      <div className="flex-1">
        <p className="text-[8px] font-black uppercase tracking-widest opacity-60">{label}</p>
        <p className="text-[10px] font-bold text-slate-800 tracking-tight truncate max-w-[120px]">{name}</p>
      </div>
      <div className="flex gap-1.5">
        {skipped ? (
          <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
            <ShieldOff size={10} className="text-slate-400" />
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Bypassed</span>
          </div>
        ) : (
          actions.map((action: string) => (
            <div key={action} className={`w-7 h-7 rounded-lg border flex items-center justify-center ${colorMap[color]}`}>
              {action === 'Call' && <Phone size={12} />}
              {action === 'SMS' && <MessageSquare size={12} />}
              {action === 'Location' && <MapPin size={12} />}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LogsScreen;
