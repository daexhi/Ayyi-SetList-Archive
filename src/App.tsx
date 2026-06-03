/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Disc, Music2, Share2, Volume2 } from 'lucide-react';
import Visualizer from './components/Visualizer';
import SetlistRow from './components/SetlistRow';
import type { Setlist } from './types';

const INITIAL_SETLISTS: Setlist[] = [
  {
    id: 'indobounce-mix-2',
    title: 'IndoBounce Mix Set 2',
    duration: '--:--',
    audioUrl: 'https://dl.dropboxusercontent.com/scl/fi/jzejtd2ftc292fa1rkynh/IndoBounce-Mix-Set-2.MP3?rlkey=62vtqwy6pv95i8wdfwot18b40&st=8zydo034',
    tags: ['IndoBounce', 'Bassline']
  },
  {
    id: 'featured',
    title: 'Hardcore & Rawstyle Mix #01',
    duration: '24:15',
    audioUrl: 'https://dl.dropboxusercontent.com/scl/fi/gi9qf0xxstknhqp0qcg6g/hardcore_rawstyle_mix.MP3?rlkey=osd62cqf4gmuv6vcka8pbf754&st=rulxqy4d',
    tags: ['Hardcore', 'Rawstyle'],
    bpm: 160
  },
  {
    id: 'fest-mix-2024',
    title: 'Fest Mix: Closing Party of 2024',
    duration: '39:48',
    audioUrl: 'https://dl.dropboxusercontent.com/scl/fi/wu8kn07wqf83diornavma/Fest-Mix-_-Closing-Party-of-2024-_-Big-Room-x-Techno-x-Oldskool-Ayyi-SoundLoadMate.com.mp3?rlkey=cpusm4q0zuak5b93txdumosud&st=e2d9t1i9',
    tags: ['Big Room', 'Techno', 'Oldskool'],
    bpm: 128
  },
  {
    id: 'indobounce-mix',
    title: 'IndoBounce x Big Room Party Mix',
    duration: '28:12',
    audioUrl: 'https://dl.dropboxusercontent.com/scl/fi/cxt495g9lko4oponme73m/IndoBounce-x-Big-Room-Party-Mix-Ayyi.mp3?rlkey=ggd4x5oeknwph9oa6yzaphxjk&st=wvl9ilis',
    tags: ['IndoBounce', 'Big Room', 'Hard Dance'],
    bpm: 130
  }
];

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSetlist, setCurrentSetlist] = useState<Setlist>(INITIAL_SETLISTS[0]);
  const [volume, setVolume] = useState(0.8);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [actualDurations, setActualDurations] = useState<Record<string, string>>({});
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    // Pre-load metadata for all setlists to get actual duration
    const preloadAudio = INITIAL_SETLISTS.map(setlist => {
      const audio = new Audio();
      audio.crossOrigin = 'anonymous';
      audio.src = setlist.audioUrl;
      audio.preload = 'metadata';
      
      const handleMetadata = () => {
        setActualDurations(prev => ({
          ...prev,
          [setlist.id]: formatTime(audio.duration)
        }));
        cleanup();
      };

      const handleError = () => {
        console.warn(`Failed to load metadata for ${setlist.title}`);
        cleanup();
      };

      const cleanup = () => {
        audio.removeEventListener('loadedmetadata', handleMetadata);
        audio.removeEventListener('error', handleError);
      };

      audio.addEventListener('loadedmetadata', handleMetadata);
      audio.addEventListener('error', handleError);
      
      return audio;
    });

    return () => {
      preloadAudio.forEach(a => {
        a.src = '';
        a.load();
      });
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (!isPlaying || !analyserRef.current || !mainRef.current) {
      if (mainRef.current) mainRef.current.style.setProperty('--beat-intensity', '0');
      return;
    }

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const element = mainRef.current;
    let animationId: number;

    const checkBeat = () => {
      animationId = requestAnimationFrame(checkBeat);
      analyser.getByteFrequencyData(dataArray);
      
      // Focus on bass frequencies for the pulse
      let sum = 0;
      const bassBins = 4;
      for (let i = 0; i < bassBins; i++) {
        sum += dataArray[i];
      }
      const average = sum / bassBins;
      const intensity = average / 255;
      
      element.style.setProperty('--beat-intensity', intensity.toFixed(3));
    };

    animationId = requestAnimationFrame(checkBeat);
    return () => cancelAnimationFrame(animationId);
  }, [isPlaying]);

  const initAudio = () => {
    if (!audioContextRef.current && audioRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      
      sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
    }
  };

  const handleTogglePlay = (setlist?: Setlist) => {
    initAudio();

    const targetSetlist = setlist || currentSetlist;

    if (audioRef.current) {
      // If direct setlist passed and it's different from current
      if (setlist && setlist.id !== currentSetlist.id) {
        setCurrentSetlist(setlist);
        audioRef.current.src = setlist.audioUrl;
        audioRef.current.play();
        setIsPlaying(true);
        return;
      }

      // If it's the same setlist but no src set yet (first play)
      if (!audioRef.current.src || audioRef.current.src === '') {
        audioRef.current.src = targetSetlist.audioUrl;
      }

      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch(err => {
            console.error("Playback error:", err);
            setIsPlaying(false);
          });
      }
    }
  };

  const handleSeek = (e: ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  return (
    <div ref={mainRef} className="min-h-screen bg-dark-surface font-sans selection:bg-neon-cyan/30 overflow-x-hidden">
      
      {/* Background Visualizer (Full) */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <Visualizer analyser={analyserRef.current} isActive={isPlaying} isBlurred={true} />
      </div>

      {/* Background Typography */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none select-none z-0">
        <h1 className="absolute -top-10 -left-10 text-[25vw] font-extrabold text-white/[0.02] leading-none tracking-tighter uppercase whitespace-nowrap">
          AYYI AYYI AYYI
        </h1>
        <h1 className="absolute bottom-[-5vw] -right-10 text-[25vw] font-extrabold text-white/[0.02] leading-none tracking-tighter uppercase whitespace-nowrap">
          VIRTUAL DJ
        </h1>
      </div>

      <nav className="relative z-20 px-4 md:px-8 py-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-neon-purple to-neon-cyan rounded-lg flex items-center justify-center p-2 shadow-[0_0_15px_rgba(0,242,255,0.3)]">
            <Disc className="w-full h-full text-white animate-spin-slow" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">AYYI</span>
            <span className="block text-[10px] font-mono text-neon-cyan uppercase tracking-widest">Roblox Virtual DJ</span>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <a 
            href="https://discordapp.com/users/1385949667359068268" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="px-5 py-2 rounded-full border border-white/10 hover:border-white/30 bg-white/5 transition-all text-sm font-medium"
          >
            Contact
          </a>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pb-32">
        {/* Featured Section */}
        <section className="mt-8 md:mt-12 mb-16 md:mb-24 grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-3 py-1 bg-neon-cyan/10 border border-neon-cyan/20 rounded text-[10px] font-mono text-neon-cyan uppercase tracking-widest mb-6">
              {currentSetlist.id === 'featured' ? 'Featured Setlist' : 'Now Playing'}
            </span>
            <h2 className="text-5xl md:text-8xl font-extrabold tracking-tighter leading-none mb-8 text-white uppercase">
              {currentSetlist.id === 'featured' ? (
                <>HARDCORE X <br /><span className="text-neon-cyan neon-glow">RAWSTYLE</span> MIX</>
              ) : (
                <div className="max-w-xl break-words">
                  {currentSetlist.title}
                </div>
              )}
            </h2>
            <p className="text-zinc-400 text-base md:text-lg mb-8 md:mb-10 max-w-md leading-relaxed">
              Explore the latest immersive soundscapes curated by Ayyi.
            </p>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => handleTogglePlay(INITIAL_SETLISTS[0])}
                className="group flex items-center gap-3 px-6 md:px-8 py-3 md:py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.1)]"
              >
                {isPlaying && currentSetlist.id === INITIAL_SETLISTS[0].id ? (
                  <>
                    <Pause className="w-5 h-5 fill-current" />
                    PAUSE MIX
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-current" />
                    PLAY NOW
                  </>
                )}
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative glass-morphism rounded-3xl p-6 md:p-8 overflow-hidden w-full h-[350px] md:h-auto md:aspect-[4/3] flex flex-col justify-end"
          >
            {/* Visualizer Background */}
            <div className="absolute inset-0 z-0">
               <div className="absolute inset-0 bg-gradient-to-t from-dark-surface via-transparent to-transparent opacity-80" />
               <Visualizer analyser={analyserRef.current} isActive={isPlaying} />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex gap-1">
                  {[...Array(3)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-1 bg-neon-cyan rounded-full transition-all duration-300 ${isPlaying ? 'animate-pulse' : 'h-1'}`}
                      style={{ height: isPlaying ? `${Math.random() * 20 + 10}px` : '4px' }}
                    />
                  ))}
                </div>
                <span className="text-xs font-mono text-neon-cyan uppercase">Live Audio Engine</span>
              </div>
              <h3 className="text-2xl font-bold text-white">{currentSetlist.title}</h3>
              <p className="inline-block mt-2 text-zinc-300 font-mono text-sm uppercase tracking-wider bg-black/60 backdrop-blur-sm px-3 py-1 rounded">
                {(isPlaying && duration > 0) ? formatTime(duration) : (actualDurations[currentSetlist.id] || currentSetlist.duration)} — {currentSetlist.tags.join(' / ')}
              </p>
            </div>
          </motion.div>
        </section>

        {/* Setlist Collection */}
        <section className="mb-24">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">More Setlists</h2>
              <p className="text-zinc-500">Archived performances and themed collections.</p>
            </div>
            <button className="text-sm font-medium text-zinc-400 hover:text-white transition-colors border-b border-zinc-800 pb-1">
              View All
            </button>
          </div>

          <div className="glass-morphism rounded-2xl overflow-hidden shadow-2xl">
            <div className="hidden md:grid grid-cols-[auto_1fr_auto] gap-4 px-6 py-4 border-b border-white/5 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
              <span>Status</span>
              <span>Title / Tags</span>
              <span>Duration</span>
            </div>
            <div className="flex md:hidden px-4 py-3 border-b border-white/5 text-[8px] font-mono text-zinc-500 uppercase tracking-widest justify-between">
              <span>Collection</span>
              <span>Time</span>
            </div>
            <div className="p-1 md:p-3 divide-y divide-white/[0.02]">
              {INITIAL_SETLISTS.map((setlist) => (
                <SetlistRow 
                  key={setlist.id} 
                  setlist={{
                    ...setlist,
                    duration: actualDurations[setlist.id] || setlist.duration
                  }}
                  isCurrent={currentSetlist.id === setlist.id}
                  isPlaying={isPlaying && currentSetlist.id === setlist.id}
                  onPlay={handleTogglePlay}
                  actualDuration={(currentSetlist.id === setlist.id && duration > 0) ? formatTime(duration) : undefined}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Footer Info */}
        <footer className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4 text-zinc-500 text-sm">
             <Music2 className="w-4 h-4" />
             <span>© 2026 AYYI SETLIST ARCHIVE</span>
          </div>
          <div className="flex gap-8">
            <a href="https://www.roblox.com/users/2600442975/profile" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-neon-cyan transition-colors text-sm uppercase font-mono tracking-widest">Roblox</a>
            <a href="https://discordapp.com/users/1385949667359068268" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-neon-cyan transition-colors text-sm uppercase font-mono tracking-widest">Discord</a>
            <a href="https://soundcloud.com/daexhi" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-neon-cyan transition-colors text-sm uppercase font-mono tracking-widest">SoundCloud</a>
          </div>
        </footer>
      </main>

      {/* Persistent Player Bar */}
      <AnimatePresence>
        {isPlaying && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 inset-x-0 z-50 p-3 md:px-8 md:py-4 glass-morphism border-t border-white/10"
          >
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-3 md:gap-8">
              {/* Info & Mobile Play Toggle Row */}
              <div className="w-full md:w-auto flex items-center justify-between md:justify-start gap-4 min-w-0 md:min-w-[200px] flex-shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-zinc-800 rounded relative overflow-hidden flex-shrink-0 shadow-[0_0_15px_rgba(0,0,0,0.3)]">
                    <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/30 to-neon-cyan/30 animate-pulse" />
                    <Disc className={`absolute inset-0 m-auto w-5 h-5 md:w-6 md:h-6 text-white ${isPlaying ? 'animate-spin-slow' : ''}`} />
                  </div>
                  <div className="min-w-0 flex-shrink">
                    <h4 className="text-xs md:text-sm font-bold text-white truncate">{currentSetlist.title}</h4>
                    <p className="text-[9px] md:text-[10px] text-zinc-500 uppercase tracking-widest truncate">
                      {currentSetlist.tags.join(' / ')}
                    </p>
                  </div>
                </div>

                {/* Mobile-only Play Button */}
                <button 
                  onClick={() => handleTogglePlay()} 
                  className="md:hidden flex-shrink-0 p-3 bg-white rounded-full text-black shadow-[0_0_15px_rgba(255,255,255,0.2)] active:scale-90 transition-transform"
                >
                  {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                </button>
              </div>

              {/* Progress & Desktop Controls */}
              <div className="flex flex-col items-center gap-1 md:gap-2 flex-1 w-full max-w-full md:max-w-2xl">
                {/* Desktop-only Control Row */}
                <div className="hidden md:flex items-center gap-6">
                  <button onClick={() => handleTogglePlay()} className="p-3 bg-white rounded-full text-black hover:scale-110 transition-transform shadow-lg">
                    {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                  </button>
                </div>
                
                <div className="w-full flex items-center gap-2 md:gap-3">
                  <span className="text-[9px] md:text-[10px] font-mono text-zinc-500 w-8 md:w-10 text-right">{formatTime(currentTime)}</span>
                  <div className="relative flex-1 h-4 flex items-center group">
                    <input 
                      type="range" 
                      min="0" 
                      max={duration || 100} 
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer relative z-10 accent-neon-cyan"
                    />
                    <div 
                      className="absolute left-0 h-1 bg-gradient-to-r from-neon-purple to-neon-cyan pointer-events-none rounded-full transition-all duration-100" 
                      style={{ 
                        width: `${(currentTime / (duration || 1)) * 100}%`,
                        boxShadow: isPlaying ? '0 0 10px rgba(0, 242, 255, 0.4)' : 'none'
                      }}
                    />
                  </div>
                  <span className="text-[9px] md:text-[10px] font-mono text-zinc-500 w-8 md:w-10">-{formatTime(Math.max(0, duration - currentTime))}</span>
                </div>
              </div>

              {/* Volume (Desktop Only) */}
              <div className="hidden md:flex items-center gap-4 min-w-[200px] justify-end">
                <Volume2 className="w-4 h-4 text-zinc-400" />
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.01" 
                  value={volume}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setVolume(val);
                    if (audioRef.current) audioRef.current.volume = val;
                  }}
                  className="w-24 h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-neon-cyan"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <audio 
        ref={audioRef} 
        crossOrigin="anonymous"
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={() => setIsPlaying(false)}
      />
      
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        .neon-glow {
          text-shadow: 0 0 calc(5px + var(--beat-intensity) * 20px) rgba(0, 242, 255, 0.8);
          transition: text-shadow 0.05s ease-out;
        }
        .text-neon-cyan {
          color: rgb(0, 242, 255);
          filter: drop-shadow(0 0 calc(2px + var(--beat-intensity) * 8px) rgba(0, 242, 255, 0.4));
          transition: filter 0.05s ease-out;
        }
        .range-thumb-none::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 0;
          height: 0;
          background: transparent;
          border: none;
        }
        .range-thumb-none::-moz-range-thumb {
          width: 0;
          height: 0;
          background: transparent;
          border: none;
        }
      `}</style>
    </div>
  );
}
