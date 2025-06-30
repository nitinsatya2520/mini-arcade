import { useEffect, useRef } from "react";

export default function MusicVisualizer({ audioRef }) {
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);

  useEffect(() => {
    let animationId;

    const setupVisualizer = () => {
      if (!audioRef.current || sourceRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 128;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaElementSource(audioRef.current);
      source.connect(analyser);
      analyser.connect(audioCtx.destination);
      sourceRef.current = source;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const draw = () => {
        animationId = requestAnimationFrame(draw);

        analyser.getByteFrequencyData(dataArray);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const barWidth = (canvas.width / bufferLength) * 1.5;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const barHeight = dataArray[i] * 1.4;
          ctx.fillStyle = `hsl(${i * 4}, 100%, 70%)`;
          ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
          x += barWidth + 2;
        }
      };

      draw();
    };

    const handleStart = () => {
      if (!audioContextRef.current) {
        setupVisualizer();
      }
    };

    document.addEventListener("click", handleStart, { once: true });

    return () => {
      cancelAnimationFrame(animationId);
      document.removeEventListener("click", handleStart);
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close();
      }
    };
  }, [audioRef]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-- opacity-5"
      width={window.innerWidth}
      height={window.innerHeight}
    />
  );
}
