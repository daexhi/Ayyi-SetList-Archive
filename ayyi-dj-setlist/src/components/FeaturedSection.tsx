import { motion } from "motion/react";
import { Play } from "lucide-react";
import AudioSpectrum from "./AudioSpectrum";
import { useState } from "react";

export default function FeaturedSection() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="relative min-h-[70vh] flex flex-col justify-center overflow-hidden pt-20">
      {/* Background Typography */}
      <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none opacity-[0.03]">
        <h1 className="text-[40vw] font-black tracking-tighter text-white whitespace-nowrap">
          AYYI
        </h1>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Content Left */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 text-center lg:text-left"
          >
            <span className="inline-block text-neon-cyan font-mono text-xs tracking-[0.3em] uppercase mb-4 px-3 py-1 border border-neon-cyan/20 rounded-full bg-neon-cyan/5">
              Available Now
            </span>
            <h2 className="text-5xl md:text-8xl font-black tracking-tight text-white mb-6 leading-none">
              FEATURED<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-white to-neon-purple italic">
                SETLIST
              </span>
            </h2>
            <p className="text-gray-400 text-lg md:text-xl max-w-xl mb-10 mx-auto lg:mx-0">
              Virtual rhythm for the digital age. Experience the exclusive Roblox DJ series mix by Ayyi.
            </p>
            
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="group relative inline-flex items-center gap-3 bg-white text-black font-bold px-8 py-4 rounded-full hover:bg-neon-cyan transition-all duration-300 scale-100 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(0,243,255,0.4)]"
            >
              <Play className={`w-5 h-5 fill-current transition-transform ${isPlaying ? 'rotate-90' : ''}`} />
              <span className="uppercase tracking-widest text-sm">
                {isPlaying ? 'PAUSE SETLIST' : 'PLAY SETLIST'}
              </span>
            </button>
          </motion.div>

          {/* Visualizer Right */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full lg:w-auto"
          >
            <AudioSpectrum isPlaying={isPlaying} />
          </motion.div>
        </div>
      </div>

      {/* Decorative Glows */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-neon-cyan/10 rounded-full blur-[120px]" />
      <div className="absolute top-1/2 -right-20 w-80 h-80 bg-neon-purple/10 rounded-full blur-[100px]" />
    </section>
  );
}
