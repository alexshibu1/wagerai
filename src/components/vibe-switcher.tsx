'use client';

import { useState } from 'react';
import { Moon, Sun, Sunset } from 'lucide-react';
import { Button } from './ui/button';

type VibeMode = 'dark' | 'sunset' | 'light';

interface VibeSwitcherProps {
  onVibeChange?: (mode: VibeMode) => void;
}

export default function VibeSwitcher({ onVibeChange }: VibeSwitcherProps) {
  const [activeVibe, setActiveVibe] = useState<VibeMode>('dark');
  
  const handleVibeChange = (mode: VibeMode) => {
    setActiveVibe(mode);
    onVibeChange?.(mode);
  };
  
  const vibes = [
    { 
      mode: 'dark' as VibeMode, 
      icon: Moon, 
      label: 'Dark Night',
      gradient: 'from-slate-950 to-slate-900'
    },
    { 
      mode: 'sunset' as VibeMode, 
      icon: Sunset, 
      label: 'Cozy Sunset',
      gradient: 'from-orange-950 to-purple-950'
    },
    { 
      mode: 'light' as VibeMode, 
      icon: Sun, 
      label: 'Bright Day',
      gradient: 'from-blue-50 to-indigo-100'
    },
  ];
  
  return (
    <div className="glass-panel p-4">
      <div className="label-text mb-3">VIBE MODE</div>
      
      <div className="space-y-2">
        {vibes.map((vibe) => {
          const Icon = vibe.icon;
          const isActive = activeVibe === vibe.mode;
          
          return (
            <button
              key={vibe.mode}
              onClick={() => handleVibeChange(vibe.mode)}
              className={`w-full p-3 rounded-lg border transition-all flex items-center gap-3 ${
                isActive
                  ? 'bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                  : 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.04]'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${vibe.gradient} flex items-center justify-center border border-white/10`}>
                <Icon size={18} className={isActive ? 'text-white' : 'text-zinc-400'} />
              </div>
              
              <div className="text-left flex-1">
                <div className={`text-sm font-medium ${isActive ? 'text-white' : 'text-zinc-400'}`}>
                  {vibe.label}
                </div>
              </div>
              
              {isActive && (
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
