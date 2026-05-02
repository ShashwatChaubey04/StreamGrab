import { Video, Star, Code } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/5 bg-black pt-20 pb-10 mt-auto z-10 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-brand-orange/50 to-transparent"></div>
      
      <div className="container mx-auto px-6 lg:px-12 max-w-[1800px]">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center mb-10 group cursor-pointer">
            <div className="w-12 h-12 rounded-2xl bg-gradient-brand flex items-center justify-center mr-4 shadow-[0_0_20px_rgba(255,122,0,0.3)] group-hover:scale-110 transition-transform">
              <Video className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-black tracking-tighter uppercase">Stream<span className="text-gradient">Grab</span></h1>
          </div>

          <p className="text-gray-400 max-w-xl mx-auto mb-12 leading-relaxed text-sm md:text-base font-medium">
            If you find this project useful, please consider giving it a <span className="text-brand-orange font-black">⭐ on GitHub</span> — it really helps and motivates further development!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16 px-4">
            <a 
              href="https://github.com/ShashwatChaubey04/StreamGrab" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center bg-gradient-brand text-white w-full sm:w-auto px-12 sm:px-8 py-4 rounded-2xl text-sm font-black transition-all hover:scale-105 active:scale-95 shadow-[0_15px_40px_rgba(255,122,0,0.2)] group"
            >
              <Star className="w-5 h-5 mr-3 fill-white transition-transform group-hover:rotate-12" />
              STAR ON GITHUB
            </a>
            
            <a 
              href="https://github.com/ShashwatChaubey04" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center bg-white/5 hover:bg-white/10 text-white w-full sm:w-auto px-12 sm:px-8 py-4 rounded-2xl text-sm font-black transition-all border border-white/10 hover:border-white/20"
            >
              <Code className="w-5 h-5 mr-3 text-brand-purple" />
              SHASHWAT CHAUBEY
            </a>
          </div>
        </div>
        
        <div className="border-t border-white/5 pt-10 flex flex-col items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-center px-4">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-gray-500">
            <span>&copy; {new Date().getFullYear()} StreamGrab</span>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
          <p className="text-gray-600">
            Designed with <span className="text-brand-orange">♥</span> by <span className="text-white">Shashwat Chaubey</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
