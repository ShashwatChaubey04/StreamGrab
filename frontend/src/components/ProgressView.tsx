import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save } from 'lucide-react';
import type { VideoInfo } from '../App';

interface ProgressViewProps {
  taskId: string;
  info: VideoInfo;
  onReset: () => void;
}

export default function ProgressView({ taskId, info, onReset }: ProgressViewProps) {
  const [status, setStatus] = useState<string>('initializing');
  const [progress, setProgress] = useState<number>(0);
  // @ts-ignore
  const [message, setMessage] = useState<string>('');

  const isAudio = (info as any).formats?.some((f: any) => f.acodec !== 'none' && f.vcodec === 'none') || false;

  const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  const handleDownload = () => {
    window.location.href = `${API_BASE}/api/file/${taskId}`;
  };

  useEffect(() => {
    const eventSource = new EventSource(`${API_BASE}/api/progress/${taskId}`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'init' || data.type === 'progress') {
        setStatus('downloading');
        setProgress(data.progress || 0);
      } else if (data.type === 'status') {
        setStatus('processing');
        setMessage(data.message);
      } else if (data.type === 'completed') {
        setStatus('completed');
        setProgress(100);
        eventSource.close();
      } else if (data.type === 'error') {
        setStatus('error');
        setMessage(data.message);
        eventSource.close();
      }
    };

    return () => {
      eventSource.close();
    };
  }, [taskId]);

  return (
    <div className="glass-card rounded-[3rem] overflow-hidden w-full max-w-xl mx-auto shadow-[0_0_120px_rgba(0,0,0,0.6)] border border-white/10 relative">
      <div className="relative flex flex-col items-center justify-center p-12 md:p-24 text-center z-10 bg-[#050505]/40 backdrop-blur-3xl">
        
        <AnimatePresence mode="wait">
          {status === 'completed' ? (
            <motion.div 
              key="completed"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative w-32 h-32 mb-12 flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-brand-orange/20 rounded-full blur-3xl animate-pulse" />
              <svg 
                width="80" 
                height="80" 
                viewBox="0 0 24 24" 
                fill="none" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="relative z-10"
              >
                <defs>
                  <linearGradient id="success-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ff7a00" />
                    <stop offset="100%" stopColor="#9b4dff" />
                  </linearGradient>
                </defs>
                <motion.path
                  d="m22 8-6 4 6 4V8Z"
                  stroke="url(#success-gradient)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <motion.rect
                  x="2" y="6" width="14" height="12" rx="2" ry="2"
                  stroke="url(#success-gradient)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </svg>
            </motion.div>
          ) : (
            <motion.div 
              key="progress"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative w-52 h-52 mb-12"
            >
              <svg className="w-full h-full transform -rotate-90">
                <defs>
                  <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ff7a00" />
                    <stop offset="100%" stopColor="#ff4d00" />
                  </linearGradient>
                  <filter id="ring-glow">
                    <feGaussianBlur stdDeviation="3" result="glow"/>
                    <feMerge>
                      <feMergeNode in="glow"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                <circle
                  cx="104"
                  cy="104"
                  r="92"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  className="text-white/5"
                />
                <motion.circle
                  cx="104"
                  cy="104"
                  initial={{ cx: 104, cy: 104, strokeDashoffset: 578.05 }}
                  r="92"
                  stroke="url(#progress-gradient)"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray="578.05"
                  animate={{ strokeDashoffset: 578.05 - (578.05 * progress) / 100 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  strokeLinecap="round"
                  filter="url(#ring-glow)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-7xl font-black tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                  {Math.round(progress)}%
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tighter uppercase text-white leading-tight">
          {status === 'completed' ? 'DOWNLOAD READY' : isAudio ? 'DOWNLOADING MUSIC' : 'DOWNLOADING VIDEO'}
        </h2>
        
        <p className="text-gray-400 max-w-sm mb-16 text-sm md:text-base font-medium line-clamp-2 px-4 leading-relaxed">
          {info.title}
        </p>

        <AnimatePresence mode="wait">
          {status === 'completed' && (
            <motion.div
              key="success-actions"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="w-full space-y-4"
            >
              <button
                onClick={handleDownload}
                className="w-full bg-gradient-brand text-white py-4 rounded-[1.5rem] font-black text-[10px] md:text-xs uppercase tracking-[0.2em] flex items-center justify-center shadow-[0_15px_40px_rgba(255,122,0,0.3)] hover:scale-[1.02] active:scale-95 transition-all group"
              >
                <Save className="w-5 h-5 mr-3 group-hover:animate-bounce" />
                SAVE TO DEVICE
              </button>

              <button 
                onClick={onReset}
                className="w-full py-3 rounded-xl text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 hover:text-white transition-all hover:bg-white/5"
              >
                DOWNLOAD ANOTHER
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
