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
    <div className="glass-card flex w-full flex-col items-center gap-4 p-4 sm:flex-row md:p-5">
      <button 
        onClick={togglePlay}
        disabled={!isReady}
        className="group flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-slate-700 bg-slate-800/80 text-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:cursor-not-allowed disabled:opacity-50 hover:border-purple-500 hover:text-purple-400"
      >
        {isPlaying ? (
          <Pause size={24} fill="currentColor" className="text-purple-400" />
        ) : (
          <Play size={24} fill="currentColor" className="ml-1 transition-colors group-hover:text-purple-400" />
        )}
      </button>

      <div className="flex-1 flex w-full min-w-0 flex-col justify-center pt-1">
        <div className="mb-2 flex items-end justify-between">
          <div className="pr-4 truncate">
            <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-blue-400">{category}</span>
            <h4 className="truncate text-sm font-medium text-slate-100">{title}</h4>
          </div>
          <span className="font-mono text-xs tabular-nums tracking-wider text-slate-400">{duration}</span>
        </div>
        <div className="w-full relative">
          <div ref={containerRef} className="w-full" />
          {!isReady && (
            <div className="absolute inset-0 flex items-center">
              <div className="h-0.5 w-full animate-pulse rounded bg-slate-800"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
