'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause } from 'lucide-react';

// YouTube video ID from the provided URL
const YOUTUBE_VIDEO_ID = 'h_a3tqywv3I';

// Declare YouTube IFrame API types
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function VinylPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load YouTube IFrame API
  useEffect(() => {
    // Check if API is already loaded
    if (window.YT && window.YT.Player) {
      setIsReady(true);
      return;
    }

    // Load the IFrame API script
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // Set up callback for when API is ready
    window.onYouTubeIframeAPIReady = () => {
      setIsReady(true);
    };

    return () => {
      // Cleanup
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          // Ignore errors during cleanup
        }
      }
    };
  }, []);

  // Initialize player when API is ready
  useEffect(() => {
    if (!isReady || !containerRef.current || playerRef.current) return;

    playerRef.current = new window.YT.Player(containerRef.current, {
      videoId: YOUTUBE_VIDEO_ID,
      playerVars: {
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        enablejsapi: 1,
        fs: 0,
        iv_load_policy: 3,
        loop: 1,
        modestbranding: 1,
        playlist: YOUTUBE_VIDEO_ID, // Required for loop to work
        rel: 0,
      },
      events: {
        onReady: () => {
          // Player is ready
        },
        onStateChange: (event: any) => {
          // Update playing state based on YouTube player state
          // 1 = playing, 2 = paused, 0 = ended
          if (event.data === 1) {
            setIsPlaying(true);
          } else if (event.data === 2 || event.data === 0) {
            setIsPlaying(false);
          }
        },
      },
    });
  }, [isReady]);

  // Control playback based on isPlaying state
  useEffect(() => {
    if (!playerRef.current) return;

    try {
      if (isPlaying) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    } catch (error) {
      console.error('Error controlling playback:', error);
    }
  }, [isPlaying]);

  return (
    <div 
      className="relative rounded-2xl border border-cyan-500/20 p-4 flex flex-col items-center justify-center w-fit backdrop-blur-sm"
      style={{
        background: 'linear-gradient(165deg, rgba(6, 182, 212, 0.08) 0%, rgba(10, 10, 15, 0.95) 100%)',
        boxShadow: '0 0 30px rgba(6, 182, 212, 0.1), inset 0 0 20px rgba(255, 255, 255, 0.02)',
      }}
    >
      {/* Hidden YouTube player container - needs dimensions for YouTube API */}
      <div
        ref={containerRef}
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          opacity: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
          top: '-9999px',
          left: '-9999px',
        }}
      />
      
      {/* Spinning Vinyl Disk - Larger and more prominent */}
      <div className="relative w-24 h-24 mb-2">
        <div 
          className={`w-full h-full rounded-full bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-950 border border-cyan-500/30 flex items-center justify-center transition-transform ${
            isPlaying ? 'animate-spin' : ''
          }`}
          style={{ 
            animationDuration: '3s',
            boxShadow: '0 0 30px rgba(0, 0, 0, 0.6), inset 0 0 30px rgba(0, 0, 0, 0.4), 0 0 30px rgba(6, 182, 212, 0.2)'
          }}
        >
          {/* Vinyl grooves */}
          <div className="absolute inset-0 rounded-full border border-cyan-500/10" style={{ width: '90%', height: '90%', margin: '5%' }} />
          <div className="absolute inset-0 rounded-full border border-cyan-500/10" style={{ width: '75%', height: '75%', margin: '12.5%' }} />
          <div className="absolute inset-0 rounded-full border border-cyan-500/10" style={{ width: '60%', height: '60%', margin: '20%' }} />
          <div className="absolute inset-0 rounded-full border border-cyan-500/10" style={{ width: '45%', height: '45%', margin: '27.5%' }} />
          
          {/* Center label */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-600 to-teal-700 border border-cyan-400/30 flex items-center justify-center z-10">
            <div className="w-3 h-3 rounded-full bg-zinc-950"></div>
          </div>
        </div>
      </div>
      
      {/* Status text */}
      <div className="text-xs text-cyan-400/80 font-mono uppercase tracking-widest mb-2">
        Lofi
      </div>
      
      {/* Play/Pause button - Under the text */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsPlaying(!isPlaying);
        }}
        className="flex items-center justify-center rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 transition-all w-8 h-8 hover:scale-105"
      >
        {isPlaying ? (
          <Pause size={14} className="text-cyan-400 drop-shadow-lg" />
        ) : (
          <Play size={14} className="text-cyan-400 drop-shadow-lg ml-0.5" />
        )}
      </button>
    </div>
  );
}
