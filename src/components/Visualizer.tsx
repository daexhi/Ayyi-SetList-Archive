import { useEffect, useRef } from 'react';

interface VisualizerProps {
  analyser: AnalyserNode | null;
  isActive: boolean;
}

export default function Visualizer({ analyser, isActive, isBlurred = false }: VisualizerProps & { isBlurred?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current || !analyser) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;
      ctx.clearRect(0, 0, width, height);

      const barWidth = (width / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        // Reduce multiplier to prevent cutting off at the top
        const multiplier = isBlurred ? 1.2 : 0.85;
        const barHeight = (dataArray[i] / 255) * height * multiplier;

        if (barHeight > 0) {
          const gradient = ctx.createLinearGradient(0, height, 0, Math.max(0, height - barHeight));
          gradient.addColorStop(0, isBlurred ? 'rgba(188, 19, 254, 0.3)' : '#bc13fe');
          gradient.addColorStop(1, isBlurred ? 'rgba(0, 242, 255, 0.3)' : '#00f2ff');

          ctx.fillStyle = gradient;
          
          if (!isBlurred) {
            ctx.shadowBlur = isActive ? 15 : 0;
            ctx.shadowColor = '#00f2ff';
          }
          
          ctx.fillRect(x, height - barHeight, barWidth - 1, barHeight);
        }

        x += barWidth;
      }
    };

    draw();

    return () => {
      cancelAnimationFrame(animationRef.current);
      resizeObserver.disconnect();
    };
  }, [analyser, isActive, isBlurred]);

  return (
    <div ref={containerRef} className="w-full h-full">
      <canvas 
        ref={canvasRef} 
        className={`w-full h-full ${isBlurred ? 'blur-3xl scale-110 opacity-30' : 'opacity-80'}`}
      />
    </div>
  );
}
