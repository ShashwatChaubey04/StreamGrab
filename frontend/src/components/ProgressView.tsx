import { useEffect, useState } from 'react';
import { CheckCircle, RefreshCcw, HardDrive } from 'lucide-react';
import type { VideoInfo } from '../App';

interface ProgressViewProps {
  taskId: string;
  info: VideoInfo;
  onReset: () => void;
}

export default function ProgressView({ taskId, info, onReset }: ProgressViewProps) {
  const [status, setStatus] = useState<string>('initializing');
  const [progress, setProgress] = useState<number>(0);
  const [speed, setSpeed] = useState<string>('');
  const [eta, setEta] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const eventSource = new EventSource(`http://localhost:5000/api/progress/${taskId}`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'init' || data.type === 'progress') {
        setStatus('downloading');
        setProgress(data.progress || 0);
        setSpeed(data.speed || '');
        setEta(data.eta || '');
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

    eventSource.onerror = () => {
      // EventSource might reconnect automatically on error, but if we are completed we close it.
    };

    return () => {
      eventSource.close();
    };
  }, [taskId]);

  return (
    <div className="glass-card rounded-3xl p-8 relative overflow-hidden">
      {/* Background Progress Fill */}
      {status !== 'completed' && status !== 'error' && (
        <div
          className="absolute top-0 left-0 h-full bg-brand-surface border-r border-brand-purple/20 transition-all duration-300 ease-out z-0"
          style={{ width: `${progress}%` }}
        ></div>
      )}

      <div className="relative z-10 flex flex-col items-center text-center">
        {status === 'completed' ? (
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
        ) : status === 'error' ? (
          <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mb-6">
            <RefreshCcw className="w-10 h-10 text-red-500" />
          </div>
        ) : (
          <div className="relative mb-6">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                className="text-gray-700"
              />
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * progress) / 100}
                className="text-brand-purple transition-all duration-300 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-bold text-xl">{Math.round(progress)}%</span>
            </div>
          </div>
        )}

        <h3 className="text-2xl font-bold mb-2">
          {status === 'completed' ? 'Ready to Save' :
            status === 'error' ? 'Download Failed' :
              status === 'processing' ? 'Processing File...' :
                'Downloading Engine'}
        </h3>
        {status === 'error' && (
          <p className="text-red-400 text-sm mb-4">{message}</p>
        )}

        <p className="text-gray-400 mb-8 max-w-md line-clamp-2">
          {info.title}
        </p>

        {status === 'downloading' && (
          <div className="flex gap-8 text-sm font-medium">
            <div className="flex flex-col"><span className="text-gray-500 mb-1">Speed</span>{speed || '-'}</div>
            <div className="flex flex-col"><span className="text-gray-500 mb-1">ETA</span>{eta || '-'}</div>
          </div>
        )}

        {status === 'processing' && (
          <div className="text-sm font-medium text-brand-orange animate-pulse">
            Merging formats and embedding metadata...
          </div>
        )}

        {status === 'completed' ? (
          <div className="w-full flex gap-4 mt-4">
            <a
              href={`http://localhost:5000/api/file/${taskId}`}
              download
              className="flex-1 bg-gradient-brand hover:opacity-90 text-white font-bold py-4 rounded-xl flex items-center justify-center transition-transform hover:scale-[1.02] shadow-lg shadow-brand-purple/20"
            >
              <HardDrive className="w-5 h-5 mr-2" />
              Save to Device
            </a>
            <button
              onClick={onReset}
              className="px-6 py-4 rounded-xl border border-brand-border hover:bg-white/5 transition font-bold"
            >
              New
            </button>
          </div>
        ) : (
          <button
            onClick={onReset}
            className="mt-4 px-8 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-gray-500 hover:text-white transition-all text-xs font-black uppercase tracking-widest"
          >
            Cancel & Back
          </button>
        )}
      </div>
    </div>
  );
}
