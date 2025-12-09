'use client';

import { Flame, TrendingUp, Calendar, Activity, Award, CheckCircle2, XCircle } from 'lucide-react';
import { USER_STATS, MOCK_HISTORY, MOCK_HEATMAP, SPARKLINE_DATA } from '@/lib/mock-data';

export default function ProfileView() {
  // Format currency
  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  // Get intensity color for heatmap (Slate-800 for 0 -> Emerald-400 for 4)
  const getIntensityColor = (intensity: number) => {
    const colors = [
      'bg-slate-800', // 0 - no activity
      'bg-slate-700', // 1 - minimal
      'bg-emerald-900', // 2 - moderate
      'bg-emerald-600', // 3 - high
      'bg-emerald-400', // 4 - max intensity
    ];
    return colors[intensity] || colors[0];
  };

  return (
    <main className="w-full min-h-screen pl-28 pt-16 bg-[#020617]">
      {/* Arc Night grain texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('data:image/svg+xml,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noiseFilter\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.65\" numOctaves=\"3\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noiseFilter)\"/%3E%3C/svg%3E')]"></div>

      <div className="relative z-10 container mx-auto px-6 py-12 max-w-7xl">
        {/* Hero Section - Net Focus Earnings */}
        <div className="mb-16 text-center">
          <div className="text-xs text-zinc-500 uppercase tracking-widest mb-4">Net Focus Earnings</div>
          <h1 className="text-8xl font-bold font-mono text-emerald-400 mb-3">
            +{formatCurrency(USER_STATS.totalEarnings)}
          </h1>
          <div className="text-xl text-zinc-400 font-medium">
            {USER_STATS.reliabilityRating} Rated Trader
          </div>
        </div>

        {/* Bento Grid - Stats */}
        <div className="grid grid-cols-4 gap-6 mb-12">
          {/* Stat Card 1 - Win Rate */}
          <div className="bg-slate-900/80 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:border-emerald-500/50 transition-all hover:shadow-lg hover:shadow-emerald-500/10">
            <div className="text-xs text-zinc-500 uppercase tracking-widest mb-4">Win Rate</div>
            <div className="text-5xl font-bold font-mono text-emerald-400 mb-3">
              {USER_STATS.winRate}%
            </div>
            <div className="text-xs text-emerald-400 flex items-center gap-1">
              <TrendingUp size={14} />
              <span>Elite Performance</span>
            </div>
          </div>

          {/* Stat Card 2 - Avg Session */}
          <div className="bg-slate-900/80 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:border-emerald-500/50 transition-all hover:shadow-lg hover:shadow-emerald-500/10">
            <div className="text-xs text-zinc-500 uppercase tracking-widest mb-4">Avg Session</div>
            <div className="text-5xl font-bold font-mono text-white mb-3">
              {USER_STATS.avgSessionDuration}m
            </div>
            <div className="text-xs text-zinc-400">
              Deep work focused
            </div>
          </div>

          {/* Stat Card 3 - Current Streak */}
          <div className="bg-slate-900/80 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:border-emerald-500/50 transition-all hover:shadow-lg hover:shadow-emerald-500/10">
            <div className="text-xs text-zinc-500 uppercase tracking-widest mb-4">Current Streak</div>
            <div className="text-5xl font-bold font-mono text-white mb-3 flex items-center gap-3">
              <Flame size={36} className="text-orange-500" />
              {USER_STATS.currentStreak}
            </div>
            <div className="text-xs text-zinc-400">
              Days consecutive
            </div>
          </div>

          {/* Stat Card 4 - Reliability */}
          <div className="bg-slate-900/80 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:border-emerald-500/50 transition-all hover:shadow-lg hover:shadow-emerald-500/10">
            <div className="text-xs text-zinc-500 uppercase tracking-widest mb-4">Reliability</div>
            <div className="text-5xl font-bold font-mono text-white mb-3 flex items-center gap-3">
              <Award size={36} className="text-yellow-500" />
              {USER_STATS.reliabilityRating}
            </div>
            <div className="text-xs text-zinc-400">
              Investment grade
            </div>
          </div>
        </div>

        {/* Heatmap Card - 7x5 Grid */}
        <div className="bg-slate-900/80 backdrop-blur-sm border border-white/10 rounded-3xl p-8 mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Focus Intensity</h2>
              <p className="text-sm text-zinc-500">Last 30 days of activity</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-zinc-500">
              <span>Less</span>
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`w-4 h-4 rounded ${getIntensityColor(level)}`}
                  ></div>
                ))}
              </div>
              <span>More</span>
            </div>
          </div>

          {/* Heatmap Grid - 7 columns (days) x 5 rows (weeks) */}
          <div className="grid grid-cols-7 gap-3">
            {MOCK_HEATMAP.slice(0, 35).map((day, index) => (
              <div
                key={index}
                className={`aspect-square rounded-lg ${getIntensityColor(day.intensity)} hover:ring-2 hover:ring-emerald-400 transition-all cursor-pointer shadow-sm`}
                title={`${formatDate(day.date)}: ${day.sessionsCompleted} session${day.sessionsCompleted !== 1 ? 's' : ''}`}
              ></div>
            ))}
          </div>
        </div>

        {/* Transaction History - Bank Statement Style */}
        <div className="bg-slate-900/80 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Transaction Log</h2>
              <p className="text-sm text-zinc-500">Settled contracts</p>
            </div>
            <div className="text-sm text-zinc-400 font-mono">
              {USER_STATS.completedSessions} completed • {USER_STATS.failedSessions} failed
            </div>
          </div>

          {/* Transaction List - Bank Statement Style */}
          <div className="space-y-2">{MOCK_HISTORY.slice(0, 15).map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between py-5 px-5 rounded-xl hover:bg-white/5 transition-all group border-b border-white/5 last:border-0"
            >
              {/* Left: Date + Task */}
              <div className="flex items-center gap-6 flex-1">
                <div className="text-sm text-zinc-400 font-mono w-20">
                  {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(session.date)}
                </div>
                
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">
                    {session.taskName}
                  </div>
                </div>
              </div>

              {/* Right: Amount */}
              <div className={`text-lg font-mono font-bold ${
                session.earnings > 0 ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {session.earnings > 0 ? '+' : ''}{formatCurrency(session.earnings)}
              </div>
            </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
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
