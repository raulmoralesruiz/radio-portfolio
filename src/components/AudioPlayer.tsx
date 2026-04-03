import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { Play, Pause } from 'lucide-react';

interface AudioPlayerProps {
  id: string;
  title: string;
  url: string;
  duration: string;
  category: string;
}

export default function AudioPlayer({ id, title, url, duration, category }: AudioPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    wavesurferRef.current = WaveSurfer.create({
      container: containerRef.current,
      waveColor: '#475569', // slate-600
      progressColor: '#a855f7', // purple-500
      cursorColor: '#d8b4fe',
      barWidth: 3,
      barGap: 3,
      barRadius: 3,
      height: 48,
      normalize: true,
      cursorWidth: 2,
    });

    wavesurferRef.current.load(url);

    wavesurferRef.current.on('ready', () => {
      setIsReady(true);
    });

    wavesurferRef.current.on('play', () => {
      setIsPlaying(true);
      // Dispatch custom event to coordinate sibling players
      window.dispatchEvent(new CustomEvent('audioplay', { detail: { id } }));
    });

    wavesurferRef.current.on('pause', () => setIsPlaying(false));
    wavesurferRef.current.on('finish', () => setIsPlaying(false));

    return () => {
      wavesurferRef.current?.destroy();
    };
  }, [url, id]);

  useEffect(() => {
    // Listen to custom event to pause if another player starts
    const handleAudioPlay = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail.id !== id && wavesurferRef.current?.isPlaying()) {
        wavesurferRef.current.pause();
      }
    };

    window.addEventListener('audioplay', handleAudioPlay);
    return () => {
      window.removeEventListener('audioplay', handleAudioPlay);
    };
  }, [id]);

  const togglePlay = () => {
    if (wavesurferRef.current && isReady) {
      if (isPlaying) {
        wavesurferRef.current.pause();
      } else {
        wavesurferRef.current.play();
      }
    }
  };

  return (
    <div className="glass-card p-4 md:p-5 flex flex-col sm:flex-row items-center gap-4 w-full">
      <button 
        onClick={togglePlay}
        disabled={!isReady}
        className="flex-shrink-0 w-14 h-14 flex items-center justify-center rounded-full bg-slate-800/80 border border-slate-700 hover:border-purple-500 hover:text-purple-400 text-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed group"
      >
        {isPlaying ? (
          <Pause size={24} fill="currentColor" className="text-purple-400" />
        ) : (
          <Play size={24} fill="currentColor" className="ml-1 group-hover:text-purple-400 transition-colors" />
        )}
      </button>

      <div className="flex-1 w-full min-w-0 flex flex-col justify-center pt-1">
        <div className="flex justify-between items-end mb-2">
          <div className="truncate pr-4">
            <span className="text-[10px] font-bold text-blue-400 mb-1 block uppercase tracking-wider">{category}</span>
            <h4 className="text-sm font-medium truncate text-slate-100">{title}</h4>
          </div>
          <span className="text-xs text-slate-400 font-mono tracking-wider tabular-nums">{duration}</span>
        </div>
        <div className="w-full relative">
          <div ref={containerRef} className="w-full" />
          {!isReady && (
            <div className="absolute inset-0 flex items-center">
              <div className="h-0.5 w-full bg-slate-800 rounded animate-pulse"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
