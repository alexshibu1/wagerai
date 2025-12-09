'use client';

import { useState } from 'react';
import { Moon, Sunset } from 'lucide-react';

type VibeMode = 'market' | 'cozy';

interface VibeSwitcherProps {
  onVibeChange?: (mode: VibeMode) => void;
}

export default function VibeSwitcher({ onVibeChange }: VibeSwitcherProps) {
  const [activeVibe, setActiveVibe] = useState<VibeMode>('market');
  
  const handleVibeChange = (mode: VibeMode) => {
    setActiveVibe(mode);
    onVibeChange?.(mode);
  };
  
  return (
    <div className="glass-panel p-4 min-w-[200px]">
      <div className="label-text mb-3">VIBE MODE</div>
      
      <div className="flex gap-2">
        <button
          onClick={() => handleVibeChange('market')}
          className={`flex-1 p-3 rounded-lg border transition-all ${
            activeVibe === 'market'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-white/[0.02] border-white/[0.05] text-zinc-500 hover:bg-white/[0.04]'
          }`}
        >
          <Moon size={18} className="mx-auto mb-1" />
          <div className="text-xs font-medium">Market</div>
        </button>
        
        <button
          onClick={() => handleVibeChange('cozy')}
          className={`flex-1 p-3 rounded-lg border transition-all ${
            activeVibe === 'cozy'
              ? 'bg-orange-500/10 border-orange-500/30 text-orange-400'
              : 'bg-white/[0.02] border-white/[0.05] text-zinc-500 hover:bg-white/[0.04]'
          }`}
        >
          <Sunset size={18} className="mx-auto mb-1" />
          <div className="text-xs font-medium">Cozy</div>
        </button>
      </div>
    </div>
  );
}
