import { motion } from "motion/react";
import FeaturedSection from "./components/FeaturedSection";
import SetlistCollection from "./components/SetlistCollection";
import { Github, Twitter } from "lucide-react";

export default function App() {
  return (
    <div className="min-h-screen relative selection:bg-neon-cyan selection:text-black">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-dark-bg/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-neon-cyan via-white to-neon-purple rounded-lg rotate-45 flex items-center justify-center">
              <span className="text-black font-black text-xs -rotate-45">A</span>
            </div>
            <span className="font-black text-xl tracking-tighter text-white">AYYI</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-xs font-bold tracking-widest uppercase text-gray-400">
            <a href="#" className="hover:text-neon-cyan transition-colors">Home</a>
            <a href="#" className="hover:text-neon-cyan transition-colors">Setlists</a>
            <a href="#" className="hover:text-neon-cyan transition-colors">Contact</a>
          </div>

          <div className="flex items-center gap-4">
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        <FeaturedSection />
        <SetlistCollection />
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 bg-black">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-white/10 rounded flex items-center justify-center">
                <span className="text-white font-black text-[10px]">A</span>
              </div>
              <span className="font-black text-sm tracking-tighter text-white">AYYI VIRTUAL DJ</span>
            </div>
            <p className="text-gray-500 text-xs font-mono">© 2024 Ayyi Studio. All rights reserved.</p>
          </div>

          <div className="flex items-center gap-6">
            <Twitter className="w-5 h-5 text-gray-500 hover:text-neon-cyan cursor-pointer transition-colors" />
            <Github className="w-5 h-5 text-gray-500 hover:text-white cursor-pointer transition-colors" />
            <div className="h-4 w-[1px] bg-white/10" />
            <span className="text-[10px] uppercase tracking-widest text-gray-600 font-bold">Built for Roblox Virtual Rave Community</span>
          </div>
        </div>
      </footer>

      {/* Noise Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] contrast-150 brightness-100 mix-blend-overlay" />
    </div>
  );
}
