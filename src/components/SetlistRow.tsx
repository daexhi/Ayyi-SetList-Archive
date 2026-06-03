import React from 'react';
import { Clock, Play, Pause } from 'lucide-react';
import type { Setlist } from '../types';

interface SetlistRowProps {
  key?: string;
  setlist: Setlist;
  isCurrent: boolean;
  isPlaying: boolean;
  onPlay: (setlist?: Setlist) => void;
  actualDuration?: string;
}

export default function SetlistRow({ setlist, isCurrent, isPlaying, onPlay, actualDuration }: SetlistRowProps): React.JSX.Element {
  return (
    <div 
      onClick={() => onPlay(setlist)}
      className={`group flex items-center gap-4 p-3 rounded-md transition-all cursor-pointer ${
        isCurrent ? 'bg-white/10' : 'hover:bg-white/5'
      }`}
    >
      <div className="w-10 h-10 flex items-center justify-center relative">
        <div className={`absolute inset-0 bg-gradient-to-br from-neon-purple to-neon-cyan rounded opacity-20 ${isCurrent ? 'opacity-40' : 'group-hover:opacity-30'}`} />
        {isCurrent && isPlaying ? (
          <Pause className="w-5 h-5 text-neon-cyan relative z-10" />
        ) : (
          <Play className={`w-5 h-5 relative z-10 ${isCurrent ? 'text-neon-cyan' : 'text-zinc-400 group-hover:text-white'}`} />
        )}
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <h3 className={`text-sm font-bold truncate ${isCurrent ? 'text-neon-cyan' : 'text-white'}`}>
          {setlist.title}
        </h3>
        <div className="mt-0.5">
          <p className="text-[9px] text-zinc-500 font-mono uppercase tracking-widest truncate">
            {setlist.tags.join(' / ')}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] font-mono flex-shrink-0">
        <Clock className="w-3 h-3" />
        <span className="whitespace-nowrap">
          {isCurrent && actualDuration ? actualDuration : setlist.duration}
        </span>
      </div>
    </div>
  );
}
