'use client';

import { useState } from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from './ui/button';

export default function VinylPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="glass-panel p-4 w-48">
      <div className="label-text mb-3">FOCUS AUDIO</div>
      
      {/* Rotating Record */}
      <div className="relative w-32 h-32 mx-auto mb-3">
        <div 
          className={`w-full h-full rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 border-2 border-white/10 flex items-center justify-center transition-transform ${
            isPlaying ? 'animate-spin' : ''
          }`}
          style={{ animationDuration: '3s' }}
        >
          <div className="w-8 h-8 rounded-full bg-zinc-950 border border-white/20"></div>
        </div>
      </div>

      {/* Track Info */}
      <div className="text-center mb-3">
        <div className="data-text text-xs text-white">Lo-Fi Focus Beats</div>
        <div className="label-text text-[9px] mt-1">Deep Work Mix</div>
      </div>

      {/* Play/Pause Button */}
      <Button
        onClick={() => setIsPlaying(!isPlaying)}
        variant="ghost"
        size="sm"
        className="w-full bg-white/5 hover:bg-white/10 transition-colors"
      >
        {isPlaying ? (
          <Pause size={14} className="text-neon-mint" />
        ) : (
          <Play size={14} className="text-white" />
        )}
      </Button>
    </div>
  );
}
