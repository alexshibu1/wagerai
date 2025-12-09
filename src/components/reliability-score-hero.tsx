'use client';

import { Trophy, TrendingUp } from 'lucide-react';

interface ReliabilityScoreHeroProps {
  rating: 'AAA' | 'AA' | 'A' | 'BBB' | 'BB' | 'B' | 'C';
  percentage: number;
  trend: 'up' | 'down' | 'neutral';
}

const getRatingColor = (rating: string) => {
  switch (rating) {
    case 'AAA':
    case 'AA':
      return 'text-emerald-400';
    case 'A':
    case 'BBB':
      return 'text-teal-400';
    case 'BB':
    case 'B':
      return 'text-yellow-400';
    default:
      return 'text-red-400';
  }
};

const getRatingGlow = (rating: string) => {
  switch (rating) {
    case 'AAA':
    case 'AA':
      return 'shadow-[0_0_40px_rgba(16,185,129,0.4)]';
    case 'A':
    case 'BBB':
      return 'shadow-[0_0_40px_rgba(20,184,166,0.4)]';
    case 'BB':
    case 'B':
      return 'shadow-[0_0_40px_rgba(234,179,8,0.4)]';
    default:
      return 'shadow-[0_0_40px_rgba(239,68,68,0.4)]';
  }
};

export default function ReliabilityScoreHero({ 
  rating = 'AAA', 
  percentage = 92,
  trend = 'up'
}: ReliabilityScoreHeroProps) {
  return (
    <div className="glass-panel p-8 relative overflow-hidden">
      {/* Background gradient orb */}
      <div className={`absolute inset-0 ${getRatingGlow(rating)} opacity-20 blur-3xl pointer-events-none`}></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <Trophy size={16} className="text-zinc-500" />
          <span className="label-text">YOUR FOCUS CREDIT SCORE</span>
        </div>

        {/* Main Rating Display */}
        <div className="flex items-end gap-6 mb-4">
          <div className={`data-text font-black text-[96px] leading-none ${getRatingColor(rating)} tracking-tighter`}>
            {rating}
          </div>
          
          <div className="pb-3">
            <div className={`text-5xl font-bold ${getRatingColor(rating)} mb-1`}>
              {percentage}%
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp 
                size={14} 
                className={trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400 rotate-180' : 'text-zinc-500'}
              />
              <span className="text-xs text-zinc-500">vs last week</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-zinc-400 max-w-md">
          Your reliability rating reflects your wager completion rate, streak consistency, and overall execution velocity.
        </p>

        {/* Mini Stats */}
        <div className="flex items-center gap-6 mt-6 pt-6 border-t border-white/5">
          <div>
            <div className="label-text text-[10px] mb-1">WIN RATE</div>
            <div className="data-text text-lg font-bold text-emerald-400">78%</div>
          </div>
          <div>
            <div className="label-text text-[10px] mb-1">CURRENT STREAK</div>
            <div className="data-text text-lg font-bold text-soft-mint">12 days</div>
          </div>
          <div>
            <div className="label-text text-[10px] mb-1">TOTAL CLOSED</div>
            <div className="data-text text-lg font-bold text-zinc-300">247</div>
          </div>
        </div>
      </div>
    </div>
  );
}
