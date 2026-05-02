import { useState } from 'react';
import { Download, List, Video, Music, Globe, FileText, ArrowLeft, Copy, Check } from 'lucide-react';
import type { VideoInfo } from '../App';

interface DownloaderCardProps {
  info: VideoInfo;
  onStart: (quality: string, isPlaylist: boolean, mode: 'video' | 'audio') => void;
  onBack: () => void;
}

export default function DownloaderCard({ info, onStart, onBack }: DownloaderCardProps) {
  const [viewMode, setViewMode] = useState<'transcript' | 'subtitles'>('subtitles');
  const [quality, setQuality] = useState('1080p');
  const [isPlaylist, setIsPlaylist] = useState(info.is_playlist || false);
  const [downloadMode, setDownloadMode] = useState<'video' | 'audio'>('video');
  const [copied, setCopied] = useState(false);

  const qualities = ['4K', '2K', '1080p', '720p', '480p'];
  const audioQualities = ['320kbps', '256kbps', '128kbps'];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopy = () => {
    if (!info.transcript_data) return;
    
    const textToCopy = info.transcript_data
      .map(item => `[${formatTime(item.time)}] ${item.text}`)
      .join('\n');
    
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card rounded-[2rem] md:rounded-[3rem] overflow-hidden flex flex-col md:flex-row w-full min-h-[auto] md:min-h-[850px] shadow-[0_0_80px_rgba(0,0,0,0.6)] border border-white/10 relative">
      <button 
        onClick={onBack}
        className="absolute top-4 left-4 md:top-8 md:left-8 z-50 flex items-center justify-center w-12 h-12 md:w-auto md:h-auto md:px-6 md:py-3 rounded-2xl bg-black/80 backdrop-blur-3xl text-white hover:text-brand-orange transition-all border border-white/20 shadow-[0_10px_40px_rgba(0,0,0,0.8)] group active:scale-90"
        title="Go Back"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
      </button>

      {/* Left Column: Media & Metadata */}
      <div className="w-full md:w-5/12 bg-black/40 p-12 flex flex-col border-r border-white/10">
        <div className="relative rounded-[2rem] overflow-hidden aspect-video mb-10 shadow-[0_30px_60px_rgba(0,0,0,0.7)] group">
          <img
            src={info.thumbnail || 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80'}
            alt={info.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
          <span className="absolute bottom-5 right-5 px-4 py-2 glass rounded-xl text-xs font-black text-white uppercase tracking-[0.2em] border border-white/20">
            {info.duration_string || 'ULTRA HD'}
          </span>
        </div>

        <div className="space-y-12 flex-grow">
          <div>
            <div className="flex items-center justify-between gap-4 mb-8 relative z-20">
              <div className="flex bg-black/40 p-1 rounded-2xl border border-white/5 shadow-inner w-full md:w-fit overflow-hidden">
                <button 
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setViewMode('transcript'); }}
                  className={`flex-1 md:flex-none flex items-center justify-center px-4 md:px-6 py-3 rounded-xl text-[10px] md:text-xs font-black transition-all cursor-pointer ${viewMode === 'transcript' ? 'bg-white/10 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  <FileText className="w-4 h-4 mr-2" /> TRANSCRIPT
                </button>
                <button 
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setViewMode('subtitles'); }}
                  className={`flex-1 md:flex-none flex items-center justify-center px-4 md:px-6 py-3 rounded-xl text-[10px] md:text-xs font-black transition-all cursor-pointer ${viewMode === 'subtitles' ? 'bg-white/10 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  <Globe className="w-4 h-4 mr-2" /> SUBTITLES
                </button>
              </div>

              <button
                onClick={handleCopy}
                className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all border border-white/5 flex items-center justify-center group shrink-0"
                title="Copy with timestamps"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 group-hover:scale-110 transition-transform" />}
              </button>
            </div>

            <div className="glass rounded-[2rem] p-8 text-[15px] text-gray-400 leading-relaxed max-h-[500px] overflow-y-auto custom-scrollbar border border-white/5 bg-black/30">
              {info.transcript_data && info.transcript_data.length > 0 ? (
                viewMode === 'subtitles' ? (
                  <div className="space-y-8">
                    {info.transcript_data.map((item, idx) => (
                      <div key={idx} className="space-y-2">
                        <span className="text-blue-500 font-black text-sm tracking-widest">{formatTime(item.time)}</span>
                        <p className="text-gray-300 font-medium">{item.text}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6">
                    <p className="text-gray-300 font-medium leading-loose">
                      {info.transcript_data.map(item => item.text).join(' ')}
                    </p>
                  </div>
                )
              ) : info.description ? (
                <p className="whitespace-pre-wrap text-sm">{info.description}</p>
              ) : (
                <p className="italic opacity-50 text-sm">Content currently unavailable.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Download Options */}
      <div className="w-full md:w-7/12 p-12 flex flex-col justify-between bg-gradient-to-br from-transparent to-white/[0.02]">
        <div className="space-y-12">
          <div>
            <h2 className="text-4xl font-black leading-tight mb-4 tracking-tighter text-white drop-shadow-sm line-clamp-3">{info.title}</h2>
            <div className="flex items-center space-x-6">
              <p className="text-[10px] font-black flex items-center bg-gradient-brand text-white px-4 py-1.5 rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.3)] uppercase tracking-[0.2em]">
                {info.uploader || 'Creator'}
              </p>
              {info.is_playlist && (
                <p className="text-violet-500 text-sm font-bold flex items-center bg-violet-500/10 px-3 py-1 rounded-lg border border-violet-500/20">
                  <List className="w-4 h-4 mr-2" /> {info.playlist_count} videos
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Video Qualities */}
            <div 
              className={`p-6 rounded-[2rem] border-2 transition-all cursor-pointer flex flex-col justify-between ${downloadMode === 'video' ? 'border-brand-orange bg-brand-orange/[0.03]' : 'border-transparent bg-white/[0.02] hover:bg-white/[0.05]'}`}
              onClick={() => setDownloadMode('video')}
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <label className="text-sm font-black uppercase tracking-widest flex items-center">
                    <Video className="w-5 h-5 mr-3 text-brand-orange" /> Video
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {qualities.map(q => (
                    <button
                      key={q}
                      onClick={(e) => { e.stopPropagation(); setQuality(q); setDownloadMode('video'); }}
                      className={`py-3 rounded-2xl border-2 text-[10px] font-black transition-all ${quality === q && downloadMode === 'video'
                        ? 'border-brand-orange bg-brand-orange text-white shadow-lg'
                        : 'border-white/10 text-gray-500 hover:border-white/30'
                        }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Audio Qualities */}
            <div 
              className={`p-6 rounded-[2rem] border-2 transition-all cursor-pointer flex flex-col justify-between ${downloadMode === 'audio' ? 'border-violet-500 bg-violet-500/[0.03]' : 'border-transparent bg-white/[0.02] hover:bg-white/[0.05]'}`}
              onClick={() => setDownloadMode('audio')}
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <label className="text-sm font-black uppercase tracking-widest flex items-center">
                    <Music className="w-5 h-5 mr-3 text-violet-500" /> Audio
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {audioQualities.map(q => (
                    <button
                      key={q}
                      onClick={(e) => { e.stopPropagation(); setQuality(q); setDownloadMode('audio'); }}
                      className={`py-3 rounded-2xl border-2 text-[10px] font-black transition-all ${quality === q && downloadMode === 'audio'
                        ? 'border-violet-500 bg-violet-500 text-white shadow-lg'
                        : 'border-white/10 text-gray-500 hover:border-white/30'
                        }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-start pt-8">
          <button
            onClick={() => onStart(quality, isPlaylist, downloadMode)}
            className={`w-full py-6 rounded-[2rem] text-sm font-black flex items-center justify-center transition-all hover:scale-[1.01] active:scale-[0.98] shadow-2xl tracking-[0.2em] ${
              downloadMode === 'video' ? 'bg-brand-orange text-white' : 'bg-violet-500 text-white'
            }`}
          >
            <Download className="w-5 h-5 mr-3" />
            DOWNLOAD {downloadMode === 'video' ? 'VIDEO' : 'MP3'}
          </button>
        </div>
      </div>
    </div>
  );
}


