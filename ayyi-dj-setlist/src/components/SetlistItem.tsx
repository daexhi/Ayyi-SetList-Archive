import { Play, Clock, MoreHorizontal } from "lucide-react";
import type { Setlist } from "../types";

interface SetlistItemProps {
  setlist: Setlist;
  index: number;
  key?: string;
}

export default function SetlistItem({ setlist, index }: SetlistItemProps) {
  return (
    <div className="group grid grid-cols-[auto_1fr_auto] md:grid-cols-[40px_1fr_120px_40px] items-center gap-4 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/5">
      <div className="text-gray-500 font-mono text-sm">
        <span className="group-hover:hidden">{index + 1}</span>
        <Play className="hidden group-hover:block w-4 h-4 text-neon-cyan fill-neon-cyan" />
      </div>

      <div className="flex flex-col gap-0.5">
        <span className="font-medium text-white group-hover:text-neon-cyan transition-colors">{setlist.title}</span>
        <div className="flex gap-2">
          {setlist.tags.map(tag => (
            <span key={tag} className="text-[10px] uppercase tracking-wider text-gray-500 font-bold border border-gray-800 px-1.5 rounded">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="hidden md:flex items-center text-gray-500 text-sm font-mono uppercase">
        {setlist.bpm} BPM
      </div>

      <div className="flex items-center justify-end gap-4">
        <span className="text-gray-500 font-mono text-sm hidden md:block">{setlist.duration}</span>
        <button className="text-gray-500 hover:text-white transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
