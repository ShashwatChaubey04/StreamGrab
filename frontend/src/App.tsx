import { useState, useEffect } from 'react';
import Hero from './components/Hero';
import DownloaderCard from './components/DownloaderCard';
import ProgressView from './components/ProgressView';
import Header from './components/Header';
import Footer from './components/Footer';
import Loader from './components/loader';
import { AlertCircle } from 'lucide-react';

export type VideoInfo = {
  id: string;
  title: string;
  thumbnail: string;
  description?: string;
  transcript_data?: { time: number; text: string }[];
  subtitles?: any;
  automatic_captions?: any;
  is_playlist?: boolean;
  playlist_count?: number;
  duration_string?: string;
  uploader?: string;
};

function App() {
  const [url, setUrl] = useState(() => localStorage.getItem('sg_url') || '');
  const [status, setStatus] = useState<'idle' | 'fetching' | 'ready' | 'downloading' | 'completed' | 'error'>(() => {
    return (localStorage.getItem('sg_status') as any) || 'idle';
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(() => {
    const saved = localStorage.getItem('sg_videoInfo');
    return saved ? JSON.parse(saved) : null;
  });
  const [taskId, setTaskId] = useState<string | null>(() => localStorage.getItem('sg_taskId'));

  useEffect(() => {
    localStorage.setItem('sg_url', url);
    localStorage.setItem('sg_status', status);
    if (videoInfo) {
      localStorage.setItem('sg_videoInfo', JSON.stringify(videoInfo));
    } else {
      localStorage.removeItem('sg_videoInfo');
    }
    if (taskId) {
      localStorage.setItem('sg_taskId', taskId);
    } else {
      localStorage.removeItem('sg_taskId');
    }
  }, [url, status, videoInfo, taskId]);

  const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setStatus('fetching');
    setErrorMsg('');
    try {
      const res = await fetch(`${API_BASE}/api/info?url=${encodeURIComponent(url)}`);
      if (!res.ok) {
        throw new Error('Failed to fetch video information.');
      }
      const data = await res.json();
      setVideoInfo({
        id: data.id,
        title: data.title || data.playlist_title,
        thumbnail: data.thumbnail,
        description: data.description,
        transcript_data: data.transcript_data,
        subtitles: data.subtitles,
        automatic_captions: data.automatic_captions,
        is_playlist: data.is_playlist,
        playlist_count: data.playlist_count,
        duration_string: data.duration_string,
        uploader: data.uploader
      });
      setStatus('ready');
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while fetching.');
      setStatus('error');
    }
  };

  const handleDownloadStart = async (quality: string, isPlaylist: boolean, mode: 'video' | 'audio') => {
    setStatus('downloading');
    setErrorMsg('');
    try {
      const res = await fetch(`${API_BASE}/api/download`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, quality, isPlaylist, mode })
      });
      if (!res.ok) {
        throw new Error('Failed to start download.');
      }
      const data = await res.json();
      setTaskId(data.taskId);
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred starting the download.');
      setStatus('error');
    }
  };

  const reset = () => {
    setStatus('idle');
    setUrl('');
    setTaskId(null);
    setVideoInfo(null);
  };

  return (
    <div className="min-h-screen text-white relative overflow-hidden font-sans flex flex-col">
      <Header onHome={reset} />
      
      {/* Background Blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-brand-orange/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-brand-purple/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-brand-orange/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <main className="w-full px-4 md:px-6 py-5 pb-50 relative z-10 flex flex-col flex-grow items-center">

        {status === 'idle' || status === 'error' ? (
          <div className="flex flex-col items-center w-full max-w-4xl mt-12">
            <Hero
              url={url}
              setUrl={setUrl}
              handleFetch={handleFetch}
              isLoading={false}
            />
            {errorMsg && (
              <div className="glass w-full rounded-xl p-4 mt-8 flex items-center text-red-400 border-red-500/30">
                <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                <p>{errorMsg}</p>
              </div>
            )}
          </div>
        ) : null}

        {status === 'fetching' && <Loader />}

        {status === 'ready' && videoInfo && (
          <div className="w-full flex justify-center">
            <DownloaderCard
              info={videoInfo}
              onStart={handleDownloadStart}
              onBack={reset}
            />
          </div>
        )}

        {(status === 'downloading' || status === 'completed') && taskId && (
          <div className="w-full flex justify-center mt-10">
            <ProgressView
              taskId={taskId}
              info={videoInfo!}
              onReset={reset}
            />
          </div>
        )}

      </main>
      
      <Footer />
    </div>
  );
}

export default App;
