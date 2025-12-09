'use client';

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface ProfileHeroProps {
  reliabilityScore?: number;
  userName?: string;
  avatarUrl?: string;
  netWorth?: number;
  totalTasksCompleted?: number;
  activePositions?: number;
  currentStreak?: number;
}

const getBuilderVibe = (score: number, tasksCompleted: number) => {
  const hasVolume = tasksCompleted >= 50;
  
  // New highest tier for >95 - "Ascended" with amber/gold theme
  if (score > 95) {
    return { tagline: 'GETS SHIT DONE', tier: 'ASCENDED', color: '#fbbf24' };
  }
  if (score >= 90 && hasVolume) {
    return { tagline: 'GETS SHIT DONE', tier: 'LEGENDARY', color: '#fbbf24' };
  }
  if (score >= 90) {
    return { tagline: 'RELIABLE AF', tier: 'ELITE', color: '#00FF94' };
  }
  if (score >= 80) {
    return { tagline: 'SOLID BUILDER', tier: 'PROVEN', color: '#60a5fa' };
  }
  if (score >= 70) {
    return { tagline: 'LEVELING UP', tier: 'RISING', color: '#a78bfa' };
  }
  return { tagline: 'GRINDING', tier: 'STARTER', color: '#94a3b8' };
};

export default function ProfileHero({
  reliabilityScore = 96,
  userName = 'Alex',
  avatarUrl,
  netWorth = 9100,
  totalTasksCompleted = 127,
  activePositions = 12,
  currentStreak = 47,
}: ProfileHeroProps) {
  const vibe = getBuilderVibe(reliabilityScore, totalTasksCompleted);
  
  const formattedNetWorth = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(netWorth);

  return (
    <div 
      className="relative flex flex-col w-[340px] rounded-2xl overflow-hidden border border-white/10"
      style={{
        background: 'linear-gradient(165deg, rgba(15, 10, 30, 0.95) 0%, rgba(30, 20, 55, 0.9) 40%, rgba(50, 30, 80, 0.85) 70%, rgba(60, 35, 95, 0.8) 100%)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05) inset, 0 0 80px -20px rgba(124, 58, 237, 0.3)',
      }}
    >
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(139, 92, 246, 0.15) 0%, transparent 60%)',
        }}
      />
      
      <div className="relative flex flex-col items-center pt-8 pb-5 px-6">
        <div className="flex items-baseline gap-0.5 mb-2">
          <span 
            className="text-7xl font-black tracking-tighter font-mono"
            style={{
              color: vibe.color,
              textShadow: `0 0 20px ${vibe.color}, 0 0 40px ${vibe.color}80, 0 0 60px ${vibe.color}40`,
            }}
          >
            {reliabilityScore}
          </span>
          <span 
            className="text-3xl font-bold"
            style={{ 
              color: vibe.color,
              textShadow: `0 0 15px ${vibe.color}60`,
            }}
          >
            %
          </span>
        </div>
        
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base">🔥</span>
          <span 
            className="text-xs font-black tracking-[0.2em] uppercase"
            style={{ 
              color: vibe.color,
              textShadow: `0 0 10px ${vibe.color}50`,
            }}
          >
            {vibe.tagline}
          </span>
          <span className="text-base">🔥</span>
        </div>
        
        <div 
          className="px-4 py-1.5 rounded-full text-[10px] font-bold tracking-[0.15em] border"
          style={{ 
            borderColor: `${vibe.color}50`,
            backgroundColor: `${vibe.color}15`,
            color: vibe.color,
          }}
        >
          {vibe.tier} TIER
        </div>
      </div>

      <div className="mx-6 h-px bg-white/10" />

      <div className="relative flex items-center gap-4 px-6 py-5">
        <Avatar className="h-12 w-12 border-2 border-white/20 shadow-lg">
          <AvatarImage src={avatarUrl} alt={userName} />
          <AvatarFallback className="bg-gradient-to-br from-violet-500 to-cyan-500 text-white text-base font-bold">
            {userName.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-base font-semibold text-white">{userName}</span>
          <span className="text-xs text-zinc-400">Active Trader</span>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-6 h-px bg-white/10" />

      {/* Net Worth Display */}
      <div className="relative flex flex-col px-6 py-5">
        <span className="text-[10px] text-zinc-400 uppercase tracking-[0.15em] mb-1">
          Net Worth
        </span>
        <span className="text-4xl font-bold font-mono tracking-tight text-white">
          {formattedNetWorth}
        </span>
      </div>

      {/* Stats Row - Bottom */}
      <div className="relative flex justify-between px-6 py-4 bg-black/20">
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Completed</span>
          <span className="text-lg font-bold text-emerald-400 font-mono">{totalTasksCompleted}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Active</span>
          <span className="text-lg font-bold text-white font-mono">{activePositions}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Streak</span>
          <span className="text-lg font-bold text-amber-400 font-mono">
            🔥 {currentStreak}
          </span>
        </div>
      </div>
    </div>
  );
}
