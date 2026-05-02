import { Video } from 'lucide-react';
interface HeaderProps {
  onHome?: () => void;
}

export default function Header({ onHome }: HeaderProps) {
  return (
    <header className="w-full border-b border-brand-border bg-[#050505]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 lg:px-12 max-w-[1800px] h-20 flex items-center justify-between">
        <div 
          onClick={onHome}
          className="flex items-center cursor-pointer hover:scale-105 transition-transform duration-300 active:scale-95"
        >
          <Video className="w-7 h-7 text-brand-orange mr-3" />
          <h1 className="text-xl font-bold tracking-tight">Stream<span className="text-gradient">Grab</span></h1>
        </div>
      </div>
    </header>
  );
}
