
import React, { useState, useEffect, useRef } from 'react';
import { Globe, ChevronDown, ShieldCheck, MessageSquare, Mic, MicOff } from 'lucide-react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { UserSession, TRIGGER_PHRASES } from '../types';

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

interface DashboardScreenProps {
  session: UserSession;
  onTrigger: () => void;
  onManualSOS: () => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ session, onTrigger, onManualSOS }) => {
  const [language, setLanguage] = useState(() => localStorage.getItem('help_language') || 'English (US)');
  const [isListening, setIsListening] = useState(false);
  const [isMonitoringEnabled, setIsMonitoringEnabled] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  
  const sessionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const transcriptBufferRef = useRef('');
  const processorRef = useRef<ScriptProcessorNode | null>(null);

  useEffect(() => {
    localStorage.setItem('help_language', language);
    if (isMonitoringEnabled && session.permissionsGranted.microphone && session.isTrialActive) {
      startVoiceMonitoring();
    } else {
      stopVoiceMonitoring();
    }
    return () => stopVoiceMonitoring();
  }, [language, session.isTrialActive, isMonitoringEnabled]);

  const startVoiceMonitoring = async () => {
    try {
      if (sessionRef.current) return;
      const ai = new GoogleGenAI({ apiKey: (process.env.API_KEY as string) });
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      if (inputCtx.state === 'suspended') await inputCtx.resume();
      audioContextRef.current = inputCtx;

      const phrases = TRIGGER_PHRASES[language] || TRIGGER_PHRASES['English (US)'];

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsListening(true);
            const source = inputCtx.createMediaStreamSource(stream);
            const processor = inputCtx.createScriptProcessor(4096, 1, 1);
            processorRef.current = processor;
            processor.onaudioprocess = (e) => {
              const data = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(data.length);
              for (let i = 0; i < data.length; i++) int16[i] = data[i] * 32768;
              const base64 = encode(new Uint8Array(int16.buffer));
              sessionPromise.then(s => {
                if (s) s.sendRealtimeInput({ media: { data: base64, mimeType: 'audio/pcm;rate=16000' } });
              });
            };
            source.connect(processor);
            processor.connect(inputCtx.destination);
          },
          onmessage: async (msg: LiveServerMessage) => {
            if (msg.serverContent?.inputTranscription) {
              const chunk = msg.serverContent.inputTranscription.text;
              transcriptBufferRef.current += chunk;
              const currentFullText = transcriptBufferRef.current.toLowerCase();
              setLiveTranscript(transcriptBufferRef.current);
              if (phrases.some(p => currentFullText.includes(p.toLowerCase()))) {
                onTrigger();
                transcriptBufferRef.current = '';
                setLiveTranscript('');
              }
            }
            if (msg.serverContent?.turnComplete) {
              transcriptBufferRef.current = '';
              setTimeout(() => setLiveTranscript(''), 2000);
            }
          },
          onerror: (e) => { console.error(e); setIsListening(false); },
          onclose: () => setIsListening(false),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {},
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (e) {
      console.error(e);
      setIsMonitoringEnabled(false);
    }
  };

  const stopVoiceMonitoring = () => {
    if (sessionRef.current) { try { sessionRef.current.close(); } catch(e) {} sessionRef.current = null; }
    if (processorRef.current) { processorRef.current.disconnect(); processorRef.current = null; }
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
    if (audioContextRef.current) { audioContextRef.current.close(); audioContextRef.current = null; }
    setIsListening(false);
    setLiveTranscript('');
    transcriptBufferRef.current = '';
  };

  const toggleMonitoring = () => {
    if (!session.isTrialActive) {
      alert("Please upgrade your plan to use voice activation.");
      return;
    }
    setIsMonitoringEnabled(!isMonitoringEnabled);
  };

  return (
    <div className="flex flex-col h-full bg-[#F0FDF4]">
      {/* Top Bar */}
      <header className="flex items-center justify-between px-6 py-4 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)] relative z-20">
        <h1 className="text-2xl font-black tracking-tight text-[#1F2937] italic uppercase">Help</h1>
        
        <div className="relative">
          <button 
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="flex items-center gap-2 py-2 px-4 rounded-xl border border-[#E5E7EB] text-xs font-bold text-[#2563EB] active:scale-95 transition-all bg-[#F8FAFC]"
          >
            <Globe size={14} />
            {language.split(' ')[0]}
            <ChevronDown size={14} className="opacity-40" />
          </button>
          {showLangMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden border border-[#E5E7EB] animate-in fade-in slide-in-from-top-2">
              {Object.keys(TRIGGER_PHRASES).map(lang => (
                <button 
                  key={lang}
                  onClick={() => { setLanguage(lang); setShowLangMenu(false); }}
                  className="w-full text-left px-6 py-4 text-xs font-bold text-[#1F2937] hover:bg-[#F0FDF4] transition-colors border-b border-[#F3F4F6] last:border-0"
                >
                  {lang}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 p-8 flex flex-col items-center justify-center">
        {/* Monitoring Status */}
        <div className="mb-10 text-center">
          {isListening ? (
            <div className="flex flex-col items-center gap-2 animate-in fade-in duration-500">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#10B981] flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-[#10B981] rounded-full animate-ping"></div>
                Quantum Guard Active
              </span>
              {liveTranscript && (
                <p className="text-xs font-bold text-[#6B7280] italic px-4 py-2 bg-white/60 backdrop-blur-sm rounded-lg border border-white/50">
                  "{liveTranscript}"
                </p>
              )}
            </div>
          ) : (
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6B7280]">Listening for help</span>
          )}
        </div>

        {/* Voice Trigger Card (Gradient Design) */}
        <div className="w-full max-w-sm relative group">
          <div className={`absolute inset-0 rounded-[3rem] blur-2xl transition-all duration-1000 ${isListening ? 'bg-[#10B981]/10' : 'bg-transparent'}`}></div>
          
          <button
            onClick={toggleMonitoring}
            className={`w-full aspect-square rounded-[3rem] flex flex-col items-center justify-center border-2 transition-all duration-500 tactile-button relative z-10 ${
              isListening 
              ? 'bg-gradient-to-br from-[#FFF4E5] to-[#FFE8CC] border-[#FDBA74]' 
              : 'bg-white border-[#E5E7EB]'
            }`}
          >
            {isListening ? (
              <>
                <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center shadow-lg mb-6 border border-[#FDBA74]/30">
                  <Mic size={64} className="text-[#F97316] animate-pulse" strokeWidth={2.5} />
                </div>
                <p className="text-lg font-extrabold text-[#7C2D12] uppercase tracking-wider">Listening...</p>
                <p className="text-[10px] font-bold text-[#9A3412] mt-1 opacity-70">SAY YOUR EMERGENCY PHRASE</p>
              </>
            ) : (
              <>
                <div className="w-40 h-40 bg-[#F0FDF4] rounded-full flex items-center justify-center mb-6 border border-[#DCFCE7] shadow-inner group-active:scale-95 transition-transform">
                  <MicOff size={64} className="text-[#64748B] opacity-40" />
                </div>
                <p className="text-lg font-extrabold text-[#1F2937] uppercase tracking-wider">Touch to Start</p>
                <p className="text-[10px] font-bold text-[#6B7280] mt-1 opacity-60">VOICE TRIGGER INACTIVE</p>
              </>
            )}
          </button>
        </div>

        {/* Info Card */}
        <div className="mt-12 w-full max-w-sm bg-white rounded-[2.5rem] p-8 border border-[#E5E7EB] shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#F0FDF4] flex items-center justify-center text-[#10B981]">
              <MessageSquare size={18} />
            </div>
            <h3 className="text-xs font-black text-[#374151] uppercase tracking-[0.2em]">Safety Phrases</h3>
          </div>
          
          <div className="space-y-4">
            {(TRIGGER_PHRASES[language] || TRIGGER_PHRASES['English (US)']).map((p, i) => (
              <div key={i} className="flex items-start gap-4 p-3 rounded-2xl hover:bg-[#F0FDF4] transition-colors group">
                <span className="text-[10px] font-black text-[#059669] bg-[#DCFCE7] w-6 h-6 rounded-lg flex items-center justify-center shrink-0">0{i+1}</span>
                <p className="text-sm font-bold text-[#374151] italic leading-snug">"{p}"</p>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-8 text-[10px] font-black text-[#6B7280] uppercase tracking-[0.2em]">Say your emergency phrase or tap SOS</p>
      </main>

      <footer className="mb-20 flex items-center justify-center">
        <div className={`px-5 py-2 rounded-full border flex items-center gap-2 transition-all ${isListening ? 'bg-[#D1FAE5] border-[#A7F3D0] text-[#065F46]' : 'bg-white/50 border-[#E5E7EB] text-[#64748B]'}`}>
          <ShieldCheck size={14} />
          <p className="text-[10px] font-black uppercase tracking-widest">{isListening ? 'Shield Enabled' : 'Safe Standby'}</p>
        </div>
      </footer>
    </div>
  );
};

export default DashboardScreen;
