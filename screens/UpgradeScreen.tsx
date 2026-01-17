
import React, { useState } from 'react';
import { CreditCard, QrCode, X, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

interface UpgradeScreenProps {
  onCancel: () => void;
  onSuccess: (plan: 'Monthly' | 'Yearly') => void;
}

const UpgradeScreen: React.FC<UpgradeScreenProps> = ({ onCancel, onSuccess }) => {
  const [method, setMethod] = useState<'card' | 'qr'>('card');
  const [plan, setPlan] = useState<'Monthly' | 'Yearly'>('Monthly');

  return (
    <div className="min-h-full bg-white flex flex-col p-6 animate-in fade-in slide-in-from-bottom-10">
      <header className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-black tracking-tight">Upgrade Protection</h2>
        <button onClick={onCancel} className="p-2 bg-slate-50 rounded-full text-slate-400"><X size={24} /></button>
      </header>

      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => setPlan('Monthly')}
          className={`flex-1 p-6 rounded-[2rem] border-2 transition-all text-left relative overflow-hidden ${plan === 'Monthly' ? 'bg-slate-900 border-slate-900 text-white shadow-xl' : 'bg-white border-slate-100 text-slate-900'}`}
        >
          {plan === 'Monthly' && <div className="absolute top-0 right-0 p-2"><CheckCircle2 size={16} /></div>}
          <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Monthly</p>
          <p className="text-2xl font-black mt-1">₹199</p>
        </button>
        <button 
          onClick={() => setPlan('Yearly')}
          className={`flex-1 p-6 rounded-[2rem] border-2 transition-all text-left relative overflow-hidden ${plan === 'Yearly' ? 'bg-orange-500 border-orange-500 text-white shadow-xl' : 'bg-white border-slate-100 text-slate-900'}`}
        >
          {plan === 'Yearly' && <div className="absolute top-0 right-0 p-2"><CheckCircle2 size={16} /></div>}
          <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Yearly</p>
          <p className="text-2xl font-black mt-1">₹499</p>
          <div className="mt-2 inline-block bg-white/20 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest">Save 80%</div>
        </button>
      </div>

      <div className="bg-slate-50 rounded-[2.5rem] p-8 flex-1 flex flex-col">
        <div className="flex bg-white p-1.5 rounded-2xl mb-8 border border-slate-100 shadow-sm">
          <button 
            onClick={() => setMethod('card')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${method === 'card' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400'}`}
          >
            <CreditCard size={14} /> Card
          </button>
          <button 
            onClick={() => setMethod('qr')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${method === 'qr' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400'}`}
          >
            <QrCode size={14} /> UPI / QR
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          {method === 'card' ? (
            <div className="w-full space-y-4">
              <div className="space-y-1">
                <input className="w-full bg-white border border-slate-200 rounded-xl py-4 px-4 text-sm font-bold outline-none" placeholder="Card Number" />
              </div>
              <div className="flex gap-4">
                <input className="flex-1 bg-white border border-slate-200 rounded-xl py-4 px-4 text-sm font-bold outline-none" placeholder="MM/YY" />
                <input className="flex-1 bg-white border border-slate-200 rounded-xl py-4 px-4 text-sm font-bold outline-none" placeholder="CVV" />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100 mb-6">
                <QrCode size={160} className="text-slate-900" strokeWidth={1.5} />
              </div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Scan to pay ₹{plan === 'Monthly' ? '199' : '499'}</p>
            </div>
          )}
        </div>

        <div className="mt-12 space-y-4">
          <div className="flex items-center gap-3 text-slate-400">
            <ShieldCheck size={16} className="text-teal-500" />
            <p className="text-[10px] font-bold uppercase tracking-widest">Secure encrypted transaction</p>
          </div>
          <button 
            onClick={() => onSuccess(plan)}
            className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Zap size={14} />
            Complete Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpgradeScreen;
