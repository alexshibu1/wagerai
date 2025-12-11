'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, TrendingUp, Flame } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import PositionCard from './position-card';
import ExchangeModal from './exchange-modal';
import RankBadge from './rank-badge';
import ReliabilityScoreHero from './reliability-score-hero';
import { Wager, UserStats, AssetClass } from '@/types/wager';
import AssetClassInfo from './asset-class-info';
import { getUserWagers, getUserStats, createWager, completeWager, failWager } from '@/app/actions/wager-actions';
import { formatCurrency } from '@/lib/wager-utils';
import AssetIndexChart from './asset-index-chart';
import TdayIndexChart from './tday-index-chart';
import { Button } from './ui/button';
import { createClient } from '../../supabase/client';

export default function PortfolioView() {
  const router = useRouter();
  const supabase = createClient();
  const [wagers, setWagers] = useState<Wager[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isExchangeOpen, setIsExchangeOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<AssetClass | 'ALL'>('ALL');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  // Refresh data when page becomes visible again (e.g., after returning from session page)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadData();
      }
    };

    const handleFocus = () => {
      loadData();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const loadData = async () => {
    try {
      const [wagersData, statsData] = await Promise.all([
        getUserWagers(),
        getUserStats(),
      ]);
      setWagers(wagersData || []);
      setStats(statsData || null);
    } catch (error) {
      setWagers([]);
      setStats({
        user_id: 'mock-user',
        agency_score: 10000,
        win_rate: 85,
        current_streak: 7,
        longest_streak: 10,
        total_wagers: 0,
        total_wins: 0,
        total_losses: 0,
        updated_at: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateWager = async (title: string, assetClass: AssetClass, stake: number, linkedYearWagerId?: string) => {
    try {
      const newWager = await createWager(title, assetClass, stake, linkedYearWagerId);
      await loadData();
      return newWager;
    } catch (error) {
      console.error('Error creating wager:', error);
      return null;
    }
  };

  const handleCompleteWager = async (wagerId: string) => {
    try {
      await completeWager(wagerId);
      await loadData();
    } catch (error) {
      console.error('Error completing wager:', error);
    }
  };

  const handleFailWager = async (wagerId: string) => {
    try {
      await failWager(wagerId);
      await loadData();
    } catch (error) {
      console.error('Error failing wager:', error);
    }
  };

  const filteredWagers = activeTab === 'ALL' 
    ? wagers 
    : wagers.filter(w => w.asset_class === activeTab);

  // Filter out expired wagers - only show OPEN wagers that haven't expired
  const openWagers = filteredWagers.filter(w => {
    if (w.status !== 'OPEN') return false;
    const deadline = new Date(w.deadline);
    const now = new Date();
    return deadline.getTime() > now.getTime(); // Only show if deadline is in the future
  });
  
  const yearWagers = wagers.filter(w => w.asset_class === 'YEAR' && w.status === 'OPEN');
  
  if (isLoading) {
    return (
      <main className="w-full min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-zinc-500 data-text text-sm">Loading...</div>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="w-full min-h-screen pt-16 pl-28">
        <div className="container mx-auto px-6 py-6 max-w-7xl">
          <div className="grid grid-cols-[1fr_300px] gap-6">
            <div>
              <div className="mb-6">
                <ReliabilityScoreHero 
                  rating="AAA"
                  percentage={stats?.win_rate || 92}
                  trend={stats && stats.win_rate > 80 ? 'up' : 'neutral'}
                />
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950 h-[180px]">
                  <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-t from-orange-500/40 via-orange-600/20 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-amber-400/30 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 h-[60%] bg-gradient-to-t from-orange-500/50 via-orange-600/30 to-transparent blur-sm" />
                    <div className="absolute bottom-0 left-1/4 right-1/4 h-[40%] bg-gradient-to-t from-yellow-500/40 to-transparent blur-md" />
                  </div>
                  
                  <div className="relative z-10 p-5 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                          <TrendingUp size={12} className="text-white/70" />
                        </div>
                        <span className="text-sm text-white/80 font-medium">Today&apos;s P&amp;L</span>
                      </div>
                      <span className="text-sm font-semibold text-emerald-400">↑ {stats?.win_rate || 82}.0%</span>
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="text-4xl font-bold text-white mb-1">
                        +${Math.round((stats?.agency_score || 10000) * 0.082).toLocaleString()}
                      </div>
                      <div className="text-xs text-white/60">
                        {wagers.filter(w => w.status === 'WON').length} positions settled
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/70 underline underline-offset-2">View Details</span>
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                        <span className="text-white/70">→</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950 h-[180px]">
                  <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-600/30 via-indigo-600/10 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 via-transparent to-purple-600/20" />
                    <div className="absolute bottom-0 left-0 right-0 h-[70%] bg-gradient-to-t from-blue-500/40 via-cyan-500/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 w-1/2 h-[50%] bg-gradient-to-tr from-fuchsia-500/30 via-purple-500/20 to-transparent blur-sm" />
                    <div className="absolute bottom-0 right-0 w-1/2 h-[50%] bg-gradient-to-tl from-cyan-400/30 via-blue-500/20 to-transparent blur-sm" />
                  </div>
                  
                  <div className="relative z-10 p-5 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                          <span className="text-xs text-white/70">◎</span>
                        </div>
                        <span className="text-sm text-white/80 font-medium">Net Worth</span>
                      </div>
                      <span className="text-sm font-semibold text-emerald-400">+18.7%</span>
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="text-4xl font-bold text-white mb-1">
                        {formatCurrency(stats?.agency_score || 10000)}
                      </div>
                      <div className="text-xs text-white/60">
                        +18.7% all time
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/70 underline underline-offset-2">View Details</span>
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                        <span className="text-white/70">→</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950 h-[180px]">
                  <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-950/30 via-transparent to-slate-950" />
                    <div className="absolute inset-0 bg-gradient-to-t from-rose-900/20 via-transparent to-transparent" />
                  </div>
                  
                  <div className="relative z-10 p-5 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                          <span className="text-xs text-white/70">⚡</span>
                        </div>
                        <span className="text-sm text-white/80 font-medium">Open Positions</span>
                      </div>
                      <span className="text-sm font-semibold text-rose-400">-12.4%</span>
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="text-4xl font-bold text-white mb-1">
                        {openWagers.length}
                      </div>
                      <div className="text-xs text-white/60">
                        {wagers.filter(w => w.status === 'OPEN' && new Date(w.deadline) < new Date(Date.now() + 24 * 60 * 60 * 1000)).length} expiring soon
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/70 underline underline-offset-2">View Details</span>
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                        <span className="text-white/70">→</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6 flex justify-end">
              <RankBadge rank="DIAMOND" score={stats?.agency_score || 10000} />
            </div>

          <div className="mb-6">
            <TdayIndexChart baseValue={stats?.agency_score ? Math.round(stats.agency_score / 100) : 100} />
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <AssetIndexChart
              ticker="$TDAY"
              label="Daily Focus"
              color="emerald"
              openCount={wagers.filter(w => w.asset_class === 'TDAY' && w.status === 'OPEN').length || 3}
              winsCount={wagers.filter(w => w.asset_class === 'TDAY' && w.status === 'WON').length || 12}
              onClick={() => setActiveTab('TDAY')}
            />
            <AssetIndexChart
              ticker="$SHIP"
              label="Weekly Ship"
              color="blue"
              openCount={wagers.filter(w => w.asset_class === 'SHIP' && w.status === 'OPEN').length || 2}
              winsCount={wagers.filter(w => w.asset_class === 'SHIP' && w.status === 'WON').length || 8}
              onClick={() => setActiveTab('SHIP')}
            />
            <AssetIndexChart
              ticker="$YEAR"
              label="Year Goals"
              color="amber"
              openCount={wagers.filter(w => w.asset_class === 'YEAR' && w.status === 'OPEN').length || 1}
              winsCount={wagers.filter(w => w.asset_class === 'YEAR' && w.status === 'WON').length || 4}
              onClick={() => setActiveTab('YEAR')}
            />
          </div>

          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-white font-bold text-lg mb-1" style={{ textShadow: '0 0 20px rgba(139,92,246,0.2)' }}>Active Positions</h2>
              <p className="text-violet-300/50 text-xs">Open wagers across all asset classes</p>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as AssetClass | 'ALL')} className="flex-1">
              <TabsList className="bg-slate-950/60 border border-violet-500/15 rounded-xl h-10 p-1 backdrop-blur-xl">
              <TabsTrigger 
                value="ALL" 
                className="data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-200 data-[state=active]:shadow-[0_0_10px_rgba(139,92,246,0.2)] text-zinc-500 font-medium text-xs uppercase tracking-wider rounded-lg transition-all"
              >
                ALL
              </TabsTrigger>
              <TabsTrigger 
                value="TDAY" 
                className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-300 data-[state=active]:shadow-[0_0_10px_rgba(16,185,129,0.2)] text-zinc-500 font-medium text-xs uppercase tracking-wider rounded-lg transition-all"
              >
                $TDAY
              </TabsTrigger>
              <TabsTrigger 
                value="SHIP" 
                className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300 data-[state=active]:shadow-[0_0_10px_rgba(6,182,212,0.2)] text-zinc-500 font-medium text-xs uppercase tracking-wider rounded-lg transition-all"
              >
                $SHIP
              </TabsTrigger>
              <TabsTrigger 
                value="YEAR" 
                className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-300 data-[state=active]:shadow-[0_0_10px_rgba(251,191,36,0.2)] text-zinc-500 font-medium text-xs uppercase tracking-wider rounded-lg transition-all"
              >
                $YEAR
              </TabsTrigger>
            </TabsList>
          </Tabs>
            <AssetClassInfo />
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-violet-500/15 mb-24 bg-gradient-to-b from-violet-950/20 to-slate-950/40 backdrop-blur-xl shadow-[0_0_60px_-15px_rgba(139,92,246,0.15)]">
            {openWagers.length > 0 ? (
              <div>
                <div className="grid grid-cols-[100px_1fr_140px_120px_100px] gap-4 px-4 py-3 bg-violet-950/30 border-b border-violet-500/10">
                  <div className="text-[10px] uppercase tracking-[0.15em] font-bold text-violet-300/60">TICKER</div>
                  <div className="text-[10px] uppercase tracking-[0.15em] font-bold text-violet-300/60">CONTRACT</div>
                  <div className="text-[10px] uppercase tracking-[0.15em] font-bold text-violet-300/60">TIME REMAINING</div>
                  <div className="text-[10px] uppercase tracking-[0.15em] font-bold text-violet-300/60">STAKE</div>
                  <div className="text-[10px] uppercase tracking-[0.15em] font-bold text-violet-300/60 text-right">STATUS</div>
                </div>
                
                {openWagers.map(wager => (
                  <PositionCard
                    key={wager.id}
                    wager={wager}
                    onComplete={handleCompleteWager}
                    onFail={handleFailWager}
                  />
                ))}
              </div>
            ) : (
              <div className="p-16 text-center relative">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-64 h-64 rounded-full bg-gradient-to-br from-violet-500/20 to-cyan-500/10 blur-[80px]"></div>
                </div>
                
                <div className="relative z-10">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-violet-500/20 to-cyan-500/10 border border-violet-500/20 flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.2)]">
                    <Plus size={32} className="text-violet-400" />
                  </div>
                  <p className="text-white font-medium text-base mb-2">No Open Positions</p>
                  <p className="text-violet-300/50 text-xs max-w-sm mx-auto">
                    Start your first focus session by tapping the floating action button
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="relative overflow-hidden rounded-2xl border border-violet-500/15 p-6 sticky top-20 bg-gradient-to-b from-violet-950/30 to-slate-950/50 backdrop-blur-xl shadow-[0_0_60px_-15px_rgba(139,92,246,0.2)]">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-violet-500/20 rounded-full blur-[60px] pointer-events-none" />
            
            <div className="relative">
              <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-violet-300/70 mb-6 flex items-center gap-2">
                <TrendingUp size={16} className="text-emerald-400" />
                TOP TRADERS
              </div>
              
              <div className="space-y-3">
                {[
                  { rank: 1, name: 'ALEX_K', score: 45200, medal: '🥇' },
                  { rank: 2, name: 'SARAH_M', score: 38900, medal: '🥈' },
                  { rank: 3, name: 'MIKE_L', score: 32100, medal: '🥉' },
                  { rank: 4, name: 'YOU', score: stats?.agency_score || 10000, isCurrentUser: true },
                  { rank: 5, name: 'EMMA_R', score: 24800 },
                ].map((trader) => (
                  <div
                    key={trader.rank}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-300 ${
                      trader.isCurrentUser
                        ? 'bg-gradient-to-r from-emerald-500/15 to-teal-500/10 border-emerald-500/30 shadow-[0_0_25px_rgba(16,185,129,0.2)]'
                        : trader.rank <= 3
                        ? 'bg-gradient-to-r from-amber-500/10 to-transparent border-amber-500/20 hover:border-amber-400/30'
                        : 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.04] hover:border-violet-500/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold ${
                          trader.rank === 1
                            ? 'bg-gradient-to-br from-amber-400/30 to-yellow-500/20 text-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.3)]'
                            : trader.rank === 2
                            ? 'bg-gradient-to-br from-slate-300/20 to-zinc-400/20 text-zinc-300'
                            : trader.rank === 3
                            ? 'bg-gradient-to-br from-amber-600/20 to-orange-500/20 text-amber-500'
                            : trader.isCurrentUser
                            ? 'bg-gradient-to-br from-emerald-500/30 to-teal-500/20 text-emerald-300'
                            : 'bg-white/[0.05] text-zinc-500'
                        }`}
                      >
                        {trader.medal || `#${trader.rank}`}
                      </div>
                      <div>
                        <div className={`font-mono text-xs font-bold ${
                          trader.isCurrentUser ? 'text-emerald-400' : trader.rank <= 3 ? 'text-amber-200/90' : 'text-zinc-300'
                        }`}>
                          {trader.name}
                        </div>
                      </div>
                    </div>
                    <div className={`text-sm font-bold font-mono ${
                      trader.isCurrentUser ? 'text-emerald-400' : trader.rank <= 3 ? 'text-amber-300/90' : 'text-zinc-400'
                    }`}>
                      {formatCurrency(trader.score)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-violet-500/10 flex items-center justify-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20">
                  <Flame size={14} className="text-orange-400 animate-pulse" />
                  <span className="text-xs font-mono text-orange-300/80">Live Rankings</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

        <Button
          onClick={async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
              router.push('/sign-in');
              return;
            }
            window.location.href = '/session/new';
          }}
          className="fixed bottom-20 right-8 w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 font-bold shadow-[0_0_30px_rgba(16,185,129,0.5),0_0_60px_rgba(6,182,212,0.3)] z-50 transition-all duration-300 hover:scale-110 hover:shadow-[0_0_40px_rgba(16,185,129,0.6),0_0_80px_rgba(6,182,212,0.4)]"
        >
          <Plus size={28} />
        </Button>
      </main>

      <ExchangeModal
        open={isExchangeOpen}
        onOpenChange={setIsExchangeOpen}
        onExecute={handleCreateWager}
        yearWagers={yearWagers}
      />
    </>
  );
}
