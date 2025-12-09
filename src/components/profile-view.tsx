'use client';

import { useEffect, useState } from 'react';
import { Flame, TrendingUp, Target } from 'lucide-react';
import ContributionHeatmap from './contribution-heatmap';
import AuditLog from './audit-log';
import { Wager, UserStats } from '@/types/wager';
import { getUserWagers, getUserStats } from '@/app/actions/wager-actions';
import { generateHeatmapData, formatCurrency } from '@/lib/wager-utils';

export default function ProfileView() {
  const [wagers, setWagers] = useState<Wager[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [wagersData, statsData] = await Promise.all([
        getUserWagers(),
        getUserStats(),
      ]);
      setWagers(wagersData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const heatmapData = generateHeatmapData(wagers, 90);

  if (isLoading) {
    return (
      <main className="w-full min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-zinc-500 data-text">Loading...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full min-h-screen">
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Agency Score Header */}
        <div className="mb-12 text-center">
          <div className="label-text mb-4">Agency Score</div>
          <h1 className="data-text text-8xl md:text-9xl font-bold mb-8">
            {formatCurrency(stats?.agency_score || 10000)}
          </h1>
        </div>

        {/* Tight Stats Bar with Dividers */}
        <div className="glass-panel rounded-2xl px-8 py-5 mb-8">
          <div className="flex items-center justify-around">
            <div className="text-center">
              <div className="label-text mb-2">Win Rate</div>
              <div className="data-text text-3xl font-bold text-electric-teal flex items-center gap-2">
                <TrendingUp size={24} />
                {stats?.win_rate.toFixed(1) || '0.0'}%
              </div>
            </div>
            
            <div className="h-12 w-px bg-white/10"></div>
            
            <div className="text-center">
              <div className="label-text mb-2">Total Wagers</div>
              <div className="data-text text-3xl font-bold">
                {stats?.total_wagers || 0}
              </div>
            </div>
            
            <div className="h-12 w-px bg-white/10"></div>
            
            <div className="text-center">
              <div className="label-text mb-2">Current Streak</div>
              <div className="data-text text-3xl font-bold flex items-center gap-2">
                <Flame size={24} className="text-orange-500" />
                {stats?.current_streak || 0}
              </div>
            </div>
            
            <div className="h-12 w-px bg-white/10"></div>
            
            <div className="text-center">
              <div className="label-text mb-2">Longest Streak</div>
              <div className="data-text text-3xl font-bold">
                {stats?.longest_streak || 0}
              </div>
            </div>
          </div>
        </div>

        {/* Contribution Heatmap in Glass Panel */}
        <div className="glass-panel rounded-2xl p-6 mb-8">
          <div className="label-text mb-6">Activity Graph</div>
          <ContributionHeatmap data={heatmapData} />
        </div>

        {/* Audit Log */}
        <div className="glass-panel rounded-2xl p-6">
          <div className="label-text mb-6">Transaction History</div>
          <AuditLog wagers={wagers} />
        </div>
      </div>
    </main>
  );
}
