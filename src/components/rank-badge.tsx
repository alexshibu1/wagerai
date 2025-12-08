'use client';

import { Trophy } from 'lucide-react';

interface RankBadgeProps {
  rank?: string;
  score?: number;
}

export default function RankBadge({ rank = 'DIAMOND', score = 2450 }: RankBadgeProps) {
  return (
    <div className="glass-panel p-4 holographic-glow relative overflow-hidden">
      {/* Prism reflection effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-purple-500/10 pointer-events-none" />
      
      <div className="relative flex items-center gap-3">
        <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20">
          <Trophy size={20} className="text-cyan-400" />
        </div>
        
        <div>
          <div className="label-text mb-1">RANK</div>
          <div className="data-text text-lg font-bold gradient-text">
            {rank}
          </div>
        </div>
        
        <div className="ml-auto">
          <div className="data-text text-2xl font-bold text-cyan-400">
            {score}
          </div>
          <div className="label-text text-[8px]">AGENCY SCORE</div>
        </div>
      </div>
    </div>
  );
}
