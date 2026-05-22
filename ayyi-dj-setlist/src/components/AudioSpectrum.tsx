import { motion } from "motion/react";
import { useEffect, useState } from "react";

export default function AudioSpectrum({ isPlaying }: { isPlaying: boolean }) {
  const [bars, setBars] = useState<number[]>(new Array(40).fill(20));

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setBars(new Array(40).fill(0).map(() => Math.random() * 100 + 10));
      }, 100);
    } else {
      setBars(new Array(40).fill(20));
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="flex items-end gap-1 h-32 md:h-48 w-full max-w-md bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
      {bars.map((height, i) => (
        <motion.div
          key={i}
          animate={{ height: `${height}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="flex-1 bg-gradient-to-t from-neon-purple via-neon-cyan to-white/20 rounded-full"
        />
      ))}
    </div>
  );
}
