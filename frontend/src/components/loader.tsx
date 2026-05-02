import { motion } from 'framer-motion';

export default function Loader() {
  const text = "StreamGrab";
  
  return (
    <div className="flex flex-col items-center justify-center py-32 w-full relative">
      {/* Background Ambience */}
      <div className="absolute inset-0 flex items-center justify-center -z-10">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1] 
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-96 h-96 bg-brand-orange/10 rounded-full blur-[100px]"
        />
      </div>

      <div className="relative mb-16">
        {/* Outer Glow Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[-40px] border border-brand-orange/10 rounded-full border-dashed"
        />

        <svg 
          width="120" 
          height="120" 
          viewBox="0 0 24 24" 
          fill="none" 
          strokeWidth="1.2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="relative z-10"
        >
          <defs>
            <linearGradient id="loader-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff7a00" />
              <stop offset="100%" stopColor="#9b4dff" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Main Drawing Path */}
          <motion.path
            d="m22 8-6 4 6 4V8Z"
            stroke="url(#loader-gradient)"
            filter="url(#glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ 
              duration: 2.5, 
              repeat: Infinity, 
              ease: "easeInOut",
              repeatType: "loop"
            }}
          />
          <motion.rect
            x="2" y="6" width="14" height="12" rx="2" ry="2"
            stroke="url(#loader-gradient)"
            filter="url(#glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ 
              duration: 2.5, 
              repeat: Infinity, 
              ease: "easeInOut",
              repeatType: "loop"
            }}
          />

          {/* Sparkle effect on the path */}
          <motion.circle
            r="0.5"
            fill="white"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 1, 0],
              cx: [2, 16, 2],
              cy: [6, 6, 18, 18, 6] 
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        </svg>
      </div>
      
      <div className="flex flex-col items-center">
        <div className="flex items-center h-12">
          {text.split("").map((char, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.2,
                delay: index * 0.1,
                repeat: Infinity,
                repeatDelay: 4
              }}
              className={`text-4xl font-black tracking-tighter ${index >= 6 ? "text-gradient" : "text-white"}`}
            >
              {char}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
}
