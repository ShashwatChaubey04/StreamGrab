import { motion } from 'framer-motion';
import { Video, Search, ArrowRight } from 'lucide-react';

interface HeroProps {
  url: string;
  setUrl: (v: string) => void;
  handleFetch: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export default function Hero({ url, setUrl, handleFetch, isLoading }: HeroProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center mt-12 md:mt-24 w-full">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="flex items-center justify-center mb-6 relative"
      >
        <motion.div 
          animate={{ y: [0, -15, 0], rotate: [0, -10, 10, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="absolute -left-16 md:-left-24 opacity-90"
        >
          <Video className="w-16 h-16 md:w-20 md:h-20 text-brand-orange drop-shadow-[0_0_15px_rgba(255,122,0,0.5)]" fill="currentColor" />
        </motion.div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
          Next-Gen <br className="md:hidden" />
          <span className="text-gradient">YouTube Video</span><br className="hidden md:block" /> Downloader
        </h1>
      </motion.div>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="mt-6 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-light"
      >
        Download high-quality videos, entire playlists, and audio tracks in seconds. 
        Embedded chapters, 4K resolution, and zero ads.
      </motion.p>

      <motion.form 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
        onSubmit={handleFetch}
        className="mt-14 w-full max-w-3xl relative group z-10"
      >
        <div className="absolute inset-0 bg-brand-orange/30 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition duration-700"></div>
        <div className="relative flex items-center bg-white rounded-full p-2 pl-6 border-4 border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.2)] overflow-hidden transition-all">
          <Search className="w-7 h-7 text-gray-400 shrink-0" />
          <input 
            type="text" 
            placeholder="Paste YouTube Video URL here..."
            className="w-full bg-transparent border-none outline-none text-black px-4 py-3 text-lg placeholder:text-gray-400 font-medium"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isLoading}
          />
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isLoading || !url.trim()}
            className="bg-gradient-brand text-white px-8 py-3 rounded-full font-bold text-base flex items-center shadow-lg shadow-brand-orange/30 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            {isLoading ? 'Scanning...' : 'Start'} 
            {!isLoading && <ArrowRight className="w-6 h-6 ml-2" />}
          </motion.button>
        </div>
      </motion.form>
    </div>
  );
}
