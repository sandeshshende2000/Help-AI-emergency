
import React, { useState } from 'react';
import { Mic, MapPin, CheckCircle2 } from 'lucide-react';

interface PermissionsScreenProps {
  onGrant: () => void;
}

const PermissionsScreen: React.FC<PermissionsScreenProps> = ({ onGrant }) => {
  const [micGranted, setMicGranted] = useState(false);
  const [locGranted, setLocGranted] = useState(false);

  const handleMic = () => setMicGranted(true);
  const handleLoc = () => setLocGranted(true);

  return (
    <div className="min-h-full p-8 flex flex-col justify-center bg-white">
      <div className="max-w-xs mx-auto text-center mb-10">
        <h2 className="text-2xl font-bold text-slate-900">Enable Vital Access</h2>
        <p className="text-slate-500 mt-4 leading-relaxed">
          We need microphone and location access to help you in emergencies.
        </p>
      </div>

      <div className="space-y-6">
        <div className={`p-6 rounded-3xl border transition-all ${micGranted ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-100'}`}>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${micGranted ? 'bg-green-100' : 'bg-slate-100'}`}>
              <Mic size={24} className={micGranted ? 'text-green-600' : 'text-slate-500'} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900">Microphone</h3>
              <p className="text-xs text-slate-500">To listen for your voice emergency triggers.</p>
            </div>
            {micGranted ? (
              <CheckCircle2 className="text-green-500" />
            ) : (
              <button 
                onClick={handleMic}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-full"
              >
                Allow
              </button>
            )}
          </div>
        </div>

        <div className={`p-6 rounded-3xl border transition-all ${locGranted ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-100'}`}>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${locGranted ? 'bg-green-100' : 'bg-slate-100'}`}>
              <MapPin size={24} className={locGranted ? 'text-green-600' : 'text-slate-500'} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900">Location</h3>
              <p className="text-xs text-slate-500">To share your precise position with responders.</p>
            </div>
            {locGranted ? (
              <CheckCircle2 className="text-green-500" />
            ) : (
              <button 
                onClick={handleLoc}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-full"
              >
                Allow
              </button>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={onGrant}
        disabled={!micGranted || !locGranted}
        className={`w-full py-4 rounded-2xl mt-12 font-bold transition-all shadow-lg ${
          micGranted && locGranted 
          ? 'bg-orange-500 text-white shadow-orange-100 active:scale-[0.98]' 
          : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
        }`}
      >
        Continue
      </button>
    </div>
  );
};

export default PermissionsScreen;
