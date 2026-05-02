import { Video, Star, Code } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-brand-border bg-[#050505] pt-16 pb-8 mt-auto z-10 relative">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        <div className="flex flex-col items-center justify-center text-center mb-12">
          <div className="flex items-center mb-4">
            <Video className="w-8 h-8 text-brand-orange mr-3" />
            <h1 className="text-xl font-bold tracking-tight">Stream<span className="text-gradient">Grab</span></h1>
          </div>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            The fastest and most reliable way to download YouTube videos in 4K with embedded chapters and metadata.
          </p>
          <div className="flex items-center justify-center mt-8">
            <a 
              href="https://github.com/ShashwatChaubey04/StreamGrab" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center bg-[#24292e] hover:bg-[#2f363d] text-white px-5 py-3 rounded-xl text-sm font-bold transition-all border border-white/10 shadow-lg hover:scale-[1.05] active:scale-95 group"
            >
              <Star className="w-5 h-5 mr-3 fill-yellow-400 text-yellow-400 group-hover:rotate-12 transition-transform" />
              Star on GitHub if you find it useful
            </a>
          </div>
        </div>
        
        <div className="border-t border-brand-border pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600">
          <p>&copy; {new Date().getFullYear()} StreamGrab Inc. All rights reserved.</p>
          <p className="mt-4 md:mt-0">Designed with passion for creators.</p>
        </div>
      </div>
    </footer>
  );
}
