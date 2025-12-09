'use client';

import { useEffect, useState } from 'react';
import { Plus, TrendingUp, Flame } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import PortfolioChart from './portfolio-chart';
import PositionCard from './position-card';
import ExchangeModal from './exchange-modal';
import RankBadge from './rank-badge';
import { Wager, UserStats, AssetClass } from '@/types/wager';
import { getUserWagers, getUserStats, createWager, completeWager, failWager } from '@/app/actions/wager-actions';
import { generateChartData, formatCurrency } from '@/lib/wager-utils';
import { Button } from './ui/button';

type ChartTimeframe = '1D' | '1W' | '1M' | 'YTD';

export default function PortfolioView() {
  const [wagers, setWagers] = useState<Wager[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isExchangeOpen, setIsExchangeOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<AssetClass | 'ALL'>('ALL');
  const [chartTimeframe, setChartTimeframe] = useState<ChartTimeframe>('1W');
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

  const handleCreateWager = async (title: string, assetClass: AssetClass, stake: number, linkedYearWagerId?: string) => {
    try {
      await createWager(title, assetClass, stake, linkedYearWagerId);
      await loadData();
    } catch (error) {
      console.error('Error creating wager:', error);
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

  const openWagers = filteredWagers.filter(w => w.status === 'OPEN');
  const yearWagers = wagers.filter(w => w.asset_class === 'YEAR' && w.status === 'OPEN');
  
  const chartData = generateChartData(wagers, stats?.agency_score || 10000);

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
      <main className="w-full min-h-screen pt-16">
        <div className="container mx-auto px-6 py-6 max-w-7xl">
          {/* Main Grid Layout: Content + Sidebar */}
          <div className="grid grid-cols-[1fr_300px] gap-6">
            {/* Main Content */}
            <div>
              {/* Header with Score and Rank Badge */}
              <div className="glass-panel px-6 py-4 mb-6">
            <div className="flex items-center justify-between">
              {/* Left: Agency Score with Gradient */}
              <div>
                <div className="label-text mb-2">AGENCY SCORE</div>
                <div className="data-text text-6xl font-bold gradient-text">
                  {formatCurrency(stats?.agency_score || 10000)}
                </div>
              </div>
              
              {/* Center: Compact Stats */}
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="label-text mb-1">WIN RATE</div>
                  <div className="data-text text-xl font-bold soft-mint">
                    {stats?.win_rate.toFixed(1) || '0.0'}%
                  </div>
                </div>
                <div className="h-10 w-px bg-white/10"></div>
                <div className="text-right">
                  <div className="label-text mb-1">STREAK</div>
                  <div className="data-text text-xl font-bold">
                    {stats?.current_streak || 0}
                  </div>
                </div>
                <div className="h-10 w-px bg-white/10"></div>
                <div className="text-right">
                  <div className="label-text mb-1">OPEN BETS</div>
                  <div className="data-text text-xl font-bold">
                    {openWagers.length}
                  </div>
                </div>
              </div>

              {/* Right: Rank Badge */}
              <div>
                <RankBadge rank="DIAMOND" score={stats?.agency_score || 10000} />
              </div>
            </div>
          </div>

          {/* Performance Chart - Minimal Container */}
          <div className="glass-panel mb-6 overflow-hidden">
            <div className="px-6 pt-4 pb-2 flex items-center justify-between">
              <div className="label-text">PERFORMANCE CHART</div>
              
              {/* Timeframe Toggles */}
              <div className="flex items-center gap-1 glass-panel p-1">
                {(['1D', '1W', '1M', 'YTD'] as ChartTimeframe[]).map((timeframe) => (
                  <button
                    key={timeframe}
                    onClick={() => setChartTimeframe(timeframe)}
                    className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all ${
                      chartTimeframe === timeframe
                        ? 'bg-arc-blue text-midnight'
                        : 'text-zinc-500 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {timeframe}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-[280px]">
              <PortfolioChart data={chartData} />
            </div>
          </div>

          {/* Asset Class Filter Tabs */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as AssetClass | 'ALL')} className="mb-4">
            <TabsList className="glass-panel h-10 p-1">
              <TabsTrigger 
                value="ALL" 
                className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-zinc-500 font-medium text-xs uppercase tracking-wider"
              >
                ALL
              </TabsTrigger>
              <TabsTrigger 
                value="TDAY" 
                className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-zinc-500 font-medium text-xs uppercase tracking-wider"
              >
                $TDAY
              </TabsTrigger>
              <TabsTrigger 
                value="SHIP" 
                className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-zinc-500 font-medium text-xs uppercase tracking-wider"
              >
                $SHIP
              </TabsTrigger>
              <TabsTrigger 
                value="YEAR" 
                className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-zinc-500 font-medium text-xs uppercase tracking-wider"
              >
                $YEAR
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* High-Density Positions Table */}
          <div className="glass-panel overflow-hidden mb-24">
            {openWagers.length > 0 ? (
              <div>
                {/* Table Header */}
                <div className="grid grid-cols-[100px_1fr_140px_120px_100px] gap-4 px-4 py-3 border-b border-white/[0.05]">
                  <div className="label-text">TICKER</div>
                  <div className="label-text">NAME</div>
                  <div className="label-text">TIME</div>
                  <div className="label-text">STAKE</div>
                  <div className="label-text text-right">ACTIONS</div>
                </div>
                
                {/* Table Rows */}
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
              <div className="p-12 text-center">
                <p className="text-zinc-500 data-text text-sm mb-2">No open positions</p>
                <p className="text-zinc-600 text-xs">Tap the + button to create your first wager</p>
              </div>
            )}
          </div>
        </div>

        {/* Rivalry Leaderboard Sidebar */}
        <div>
          <div className="glass-panel p-6 sticky top-20">
            <div className="label-text mb-6 flex items-center gap-2">
              <TrendingUp size={16} className="signal-green" />
              TOP TRADERS
            </div>
            
            <div className="space-y-3">
              {[
                { rank: 1, name: 'ALEX_K', score: 45200 },
                { rank: 2, name: 'SARAH_M', score: 38900 },
                { rank: 3, name: 'MIKE_L', score: 32100 },
                { rank: 4, name: 'YOU', score: stats?.agency_score || 10000, isCurrentUser: true },
                { rank: 5, name: 'EMMA_R', score: 24800 },
              ].map((trader) => (
                <div
                  key={trader.rank}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                    trader.isCurrentUser
                      ? 'bg-arc-blue/10 border-arc-blue/30'
                      : 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold ${
                        trader.rank === 1
                          ? 'bg-signal-green/20 text-signal-green'
                          : trader.rank === 2
                          ? 'bg-zinc-400/20 text-zinc-400'
                          : trader.rank === 3
                          ? 'bg-yellow-600/20 text-yellow-600'
                          : trader.isCurrentUser
                          ? 'bg-arc-blue/20 text-arc-blue'
                          : 'bg-white/[0.05] text-zinc-500'
                      }`}
                    >
                      #{trader.rank}
                    </div>
                    <div>
                      <div className={`font-mono text-xs font-bold ${
                        trader.isCurrentUser ? 'text-arc-blue' : 'text-zinc-300'
                      }`}>
                        {trader.name}
                      </div>
                    </div>
                  </div>
                  <div className="data-text text-sm font-bold">
                    {formatCurrency(trader.score)}
                  </div>
                </div>
              ))}
            </div>

            {/* Flame Icon for Competition */}
            <div className="mt-6 pt-6 border-t border-white/[0.05] flex items-center justify-center gap-2 text-zinc-500">
              <Flame size={16} className="text-signal-red" />
              <span className="text-xs font-mono">Live Rankings</span>
            </div>
          </div>
        </div>
      </div>
    </div>

        {/* Floating Action Button */}
        <Button
          onClick={() => setIsExchangeOpen(true)}
          className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-signal-green hover:bg-signal-green/90 text-midnight font-bold shadow-[0_0_24px_rgba(0,200,5,0.5)] z-50"
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
