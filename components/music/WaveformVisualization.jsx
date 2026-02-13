'use client';

import { useEffect, useState } from 'react';

export default function WaveformVisualization({ isPlaying }) {
  const [bars, setBars] = useState([12, 24, 18, 28]);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setBars([
        Math.random() * 28 + 4,
        Math.random() * 28 + 4,
        Math.random() * 28 + 4,
        Math.random() * 28 + 4
      ]);
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="flex items-end justify-center gap-1 h-8">
      {bars.map((height, index) => (
        <div
          key={index}
          className="w-1 bg-white rounded-full transition-all duration-100"
          style={{ height: `${height}px` }}
        ></div>
      ))}
    </div>
  );
}