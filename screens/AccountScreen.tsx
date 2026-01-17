
import React from 'react';
import { User, Shield, CreditCard, Bell, ChevronRight, LogOut, CheckCircle2, AlertCircle, Zap, ShieldCheck } from 'lucide-react';
import { UserSession } from '../types';

interface AccountScreenProps {
  session: UserSession;
  onUpgrade: () => void;
  onLogout: () => void;
}

const AccountScreen: React.FC<AccountScreenProps> = ({ session, onUpgrade, onLogout }) => {
  return (
    <div className="p-8 pb-40 min-h-full">
      <header className="mb-14 text-center flex flex-col items-center pt-10">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-slate-900/5 blur-3xl rounded-full scale-150"></div>
          <div className="w-28 h-28 bg-white rounded-[3rem] border-[6px] border-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex items-center justify-center relative z-10 tactile-button">
            <User size={48} className="text-slate-900" strokeWidth={2.5} />
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-teal-500 rounded-2xl flex items-center justify-center shadow-xl border-4 border-white">
              <ShieldCheck size={20} className="text-white" />
            </div>
          </div>
        </div>
        <h2 className="text-3xl font-black tracking-tighter text-slate-900 lowercase">{session.email.split('@')[0]}</h2>
        <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.4em] mt-2 opacity-80">{session.email}</p>
        
        <div className={`mt-8 inline-flex items-center gap-4 py-3 px-6 rounded-[2rem] glass-card border shadow-xl ${
          session.isTrialActive 
          ? 'border-teal-100/50 text-teal-600' 
          : 'border-red-100/50 text-red-600'
        }`}>
          <div className={`w-3 h-3 rounded-full animate-pulse ${session.isTrialActive ? 'bg-teal-500' : 'bg-red-500'}`}></div>
          <div className="text-left">
            <p className="text-[10px] font-black uppercase tracking-widest leading-none">
              {session.planType} Membership
            </p>
            <p className="text-[9px] font-bold mt-1 opacity-60">Expires {session.trialEndDate}</p>
          </div>
        </div>
      </header>

      {session.isTrialActive && (
        <div className="mb-10 bg-slate-900 rounded-[3rem] p-10 text-white shadow-[0_30px_60px_rgba(0,0,0,0.3)] relative overflow-hidden group border border-white/10">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-orange-500/10 rounded-full blur-[100px] group-hover:scale-150 transition-all duration-1000"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <Zap size={24} className="text-orange-400" />
              <h3 className="text-2xl font-black tracking-tight">Pro Shield</h3>
            </div>
            <p className="text-slate-400 text-sm font-medium mb-8 leading-relaxed">Upgrade for 24/7 AI-monitored response and unlimited trigger customisation.</p>
            <button 
              onClick={onUpgrade}
              className="w-full bg-white text-slate-900 font-black py-5 rounded-[2rem] text-[10px] uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all"
            >
              Get Full Protection
            </button>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <button 
          onClick={onLogout}
          className="w-full mt-6 glass-card py-6 rounded-[2.5rem] border border-white flex items-center justify-center gap-3 text-red-500 font-black text-[11px] uppercase tracking-[0.3em] active:bg-red-50 transition-all shadow-xl"
        >
          <LogOut size={18} />
          Safe Disconnect
        </button>
      </div>

      <p className="mt-16 text-center text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 opacity-50">
        HELP v2.5 / GLOBAL
      </p>
    </div>
  );
};

export default AccountScreen;
