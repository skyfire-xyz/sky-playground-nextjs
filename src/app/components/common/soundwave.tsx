import React, { useEffect, useRef, useState } from "react";

export default function SoundWave() {
  const waveRef = useRef<HTMLDivElement>(null);
  const [bars, setBars] = useState<number[]>([]);

  useEffect(() => {
    const calculateBars = () => {
      if (waveRef.current) {
        const waveWidth = waveRef.current.offsetWidth;
        const barWidth = 3; // 1px for bar + 2px for margin
        const barCount = Math.floor(waveWidth / barWidth);
        setBars(Array.from({ length: barCount }, (_, i) => i));
      }
    };

    calculateBars();
    window.addEventListener("resize", calculateBars);
    return () => {
      window.removeEventListener("resize", calculateBars);
    };
  }, []);

  useEffect(() => {
    if (waveRef.current) {
      const barElements =
        waveRef.current.querySelectorAll<HTMLDivElement>(".bar");
      barElements.forEach((bar) => {
        bar.style.animationDuration = `${Math.random() * (0.7 - 0.2) + 0.2}s`;
      });
    }
  }, [bars]);

  return (
    <div
      className={`absolute left-0 top-0 z-40 flex h-full w-full items-center justify-center px-20`}
    >
      <div ref={waveRef} className="flex w-full items-center justify-center">
        {bars.map((i) => (
          <div
            key={i}
            className={`bar animate-wave-lg mx-[0.5px] h-[10px] w-[0.33%] bg-blue-900
              ${i < bars.length * 0.04375 || i >= bars.length * 0.95625 ? "animate-wave-md" : ""}
              ${i < bars.length * 0.01875 || i >= bars.length * 0.98125 ? "animate-wave-sm" : ""}`}
          />
        ))}
      </div>
    </div>
  );
}
