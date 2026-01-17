
import React from 'react';
import { Calendar, Sparkles, ArrowRight } from 'lucide-react';
import { UserSession } from '../types';

interface TrialScreenProps {
  session: UserSession;
  onProceed: () => void;
}

const TrialScreen: React.FC<TrialScreenProps> = ({ session, onProceed }) => {
  return (
    <div className="min-h-full p-8 flex flex-col items-center justify-center bg-white text-center">
      <div className="w-24 h-24 bg-blue-50 flex items-center justify-center rounded-full mb-8 relative">
        <Sparkles size={48} className="text-blue-500" />
        <div className="absolute -top-1 -right-1 w-8 h-8 bg-blue-500 rounded-full border-4 border-white flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
        </div>
      </div>

      <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Welcome Aboard!</h2>
      <p className="text-blue-600 font-bold text-lg mb-8 italic">30-Day Free Trial Activated</p>

      <div className="w-full bg-slate-50 border border-slate-100 rounded-3xl p-8 space-y-6 mb-10 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center">
              <Calendar size={20} className="text-slate-400" />
            </div>
            <div className="text-left">
              <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Start Date</p>
              <p className="font-bold text-slate-800">{session.trialStartDate}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center shadow-sm">
              <Calendar size={20} className="text-white" />
            </div>
            <div className="text-left">
              <p className="text-[10px] uppercase tracking-wider font-bold text-blue-400">Expiration Date</p>
              <p className="font-bold text-slate-800">{session.trialEndDate}</p>
            </div>
          </div>
        </div>
      </div>

      <p className="text-slate-500 text-sm mb-12 px-4 italic">
        "Your safety is our priority. Explore all premium features during your trial period."
      </p>

      <button
        onClick={onProceed}
        className="group w-full flex items-center justify-center gap-2 bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-xl shadow-slate-200 active:scale-[0.98] transition-all"
      >
        Go to Dashboard
        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};

export default TrialScreen;
