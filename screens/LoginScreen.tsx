
import React, { useState } from 'react';
import { Mail, Lock, ShieldCheck } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (email: string) => void;
  onGoToSignup: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onGoToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      onLogin(email);
    }
  };

  return (
    <div className="min-h-full flex flex-col items-center justify-center p-8 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-indigo-400/10 blur-[100px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-emerald-400/10 blur-[100px] rounded-full"></div>

      <div className="mb-12 flex flex-col items-center relative z-10">
        <div className="w-24 h-24 glass-card flex items-center justify-center rounded-[2rem] mb-6 border-white shadow-xl tactile-button">
          <ShieldCheck size={48} className="text-indigo-600" />
        </div>
        <h1 className="text-5xl font-black tracking-tighter text-slate-900 uppercase italic">Help</h1>
        <p className="text-slate-500 mt-3 text-center text-[10px] font-black uppercase tracking-[0.4em]">Stay Safe • Stay Connected</p>
      </div>

      <div className="w-full glass-card rounded-[3rem] p-10 border-white shadow-2xl relative z-10">
        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Secure Email</label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="identity@help.com"
                className="w-full bg-white/50 border border-slate-100 rounded-2xl py-4 pl-14 pr-6 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold text-slate-700"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Identity Token</label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/50 border border-slate-100 rounded-2xl py-4 pl-14 pr-6 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold text-slate-700"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl mt-4 shadow-[0_20px_40px_rgba(0,0,0,0.1)] active:scale-95 transition-all text-xs uppercase tracking-[0.3em]"
          >
            Access Shield
          </button>
        </form>
      </div>

      <button 
        type="button"
        onClick={onGoToSignup}
        className="relative z-10 mt-10 text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] hover:text-indigo-700"
      >
        Create New Safety Account
      </button>
    </div>
  );
};

export default LoginScreen;
