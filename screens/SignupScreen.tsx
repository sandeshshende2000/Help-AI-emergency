
import React, { useState } from 'react';
import { Mail, Lock, ShieldCheck, ArrowRight } from 'lucide-react';

interface SignupScreenProps {
  onSignup: (email: string) => void;
  onGoToLogin: () => void;
}

const SignupScreen: React.FC<SignupScreenProps> = ({ onSignup, onGoToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      onSignup(email);
    }
  };

  return (
    <div className="min-h-full flex flex-col items-center justify-center p-8 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-indigo-400/10 blur-[100px] rounded-full"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-violet-400/10 blur-[100px] rounded-full"></div>

      <div className="mb-12 flex flex-col items-center relative z-10">
        <div className="w-24 h-24 glass-card flex items-center justify-center rounded-[2rem] mb-6 border-white shadow-xl tactile-button">
          <ShieldCheck size={48} className="text-indigo-600" />
        </div>
        <h1 className="text-5xl font-black tracking-tighter text-slate-900 uppercase italic">Help</h1>
        <p className="text-slate-500 mt-3 text-center text-[10px] font-black uppercase tracking-[0.4em]">Unified Safety Infrastructure</p>
      </div>

      <div className="w-full glass-card rounded-[3rem] p-10 border-white shadow-2xl relative z-10">
        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="emergency@contact.com"
                className="w-full bg-white/50 border border-slate-100 rounded-2xl py-4 pl-14 pr-6 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold text-slate-700"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Master Password</label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 8 Characters"
                className="w-full bg-white/50 border border-slate-100 rounded-2xl py-4 pl-14 pr-6 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold text-slate-700"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl mt-4 flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(0,0,0,0.1)] active:scale-95 transition-all text-xs uppercase tracking-[0.3em]"
          >
            Create Vault
            <ArrowRight size={18} />
          </button>
        </form>
      </div>

      <div className="mt-10 text-center relative z-10">
        <button 
          type="button"
          onClick={onGoToLogin}
          className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] hover:text-indigo-700"
        >
          Already Enrolled? Sign In
        </button>
      </div>
    </div>
  );
};

export default SignupScreen;
