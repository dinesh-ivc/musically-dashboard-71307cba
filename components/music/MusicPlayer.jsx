'use client';

import { useState, useEffect } from 'react';
import WaveformVisualization from './WaveformVisualization';

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);

  useEffect(() => {
    const fetchCurrentTrack = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await fetch('/api/music/tracks?limit=1', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.data && data.data.length > 0) {
            setCurrentTrack(data.data[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching track:', error);
      }
    };

    fetchCurrentTrack();
  }, []);

  return (
    <div className="bg-[rgba(71,2,36,0.5)] rounded-lg p-4">
      <WaveformVisualization isPlaying={isPlaying} />
      {currentTrack && (
        <div className="mt-2 text-center">
          <p className="text-white text-xs truncate">{currentTrack.title}</p>
          <p className="text-white/60 text-xs truncate">{currentTrack.artist}</p>
        </div>
      )}
    </div>
  );
}