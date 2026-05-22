import { MOCK_SETLISTS } from "../types";
import SetlistItem from "./SetlistItem";
import { ListMusic } from "lucide-react";

export default function SetlistCollection() {
  return (
    <section className="py-24 bg-gradient-to-b from-transparent to-black/50">
      <div className="container mx-auto px-6">
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 bg-white/5 rounded-xl border border-white/10">
            <ListMusic className="w-6 h-6 text-neon-cyan" />
          </div>
          <div>
            <h3 className="text-3xl font-bold text-white tracking-tight">SETLIST COLLECTION</h3>
            <p className="text-gray-500 font-mono text-sm">Browse my archived mixes and live sets</p>
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden backdrop-blur-sm">
          {/* Header Row */}
          <div className="hidden md:grid grid-cols-[40px_1fr_120px_40px] gap-4 px-4 py-4 border-b border-white/10 text-gray-500 font-mono text-xs uppercase tracking-widest">
            <span>#</span>
            <span>Title / Tags</span>
            <span>Energy</span>
            <span className="text-right">Time</span>
          </div>

          <div className="p-2 flex flex-col">
            {MOCK_SETLISTS.map((setlist, idx) => (
              <SetlistItem key={setlist.id} setlist={setlist} index={idx} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
