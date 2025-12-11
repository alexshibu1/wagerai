'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sparkles, Timer, Wallet2, Users, Lock, X, Edit } from 'lucide-react';
import ExchangeModal from './exchange-modal';
import { Button } from './ui/button';
import { Wager, AssetClass } from '@/types/wager';
import { getUserWagers, createWager, completeWager, failWager } from '@/app/actions/wager-actions';
import { ASSET_CLASS_CONFIG, calculateTimeRemaining, formatCurrency } from '@/lib/wager-utils';
import { createClient } from '../../supabase/client';
import { seedDemoData } from '@/lib/seed-demo-data';

type ViewMode = 'global' | 'personal';

type MarketCardData = {
  id: string;
  title: string;
  category: string;
  volume: string;
  user: string;
  yesProb: number;
  timeLeft: string;
  badge?: string;
  tone?: 'emerald' | 'blue' | 'amber';
  participants?: number;
  wager?: Wager; // Full wager object for personal portfolio cards
};

const GLOBAL_MARKETS: MarketCardData[] = [
  {
    id: '5am-club-challenge',
    title: '5 AM Club Challenge: Wake up at 5 AM and earn rewards',
    category: 'Habits',
    volume: '$89k Vol.',
    user: '@community',
    yesProb: 68,
    timeLeft: 'Daily',
    badge: 'Challenge',
    tone: 'emerald',
    participants: 247,
  },
  {
    id: 'design-review-liz',
    title: 'Liz ships the dashboard redesign with zero blockers',
    category: 'Sprint',
    volume: '$42k Vol.',
    user: '@liz_designs',
    yesProb: 71,
    timeLeft: '14h left',
    badge: 'UI',
    tone: 'blue',
  },
  {
    id: 'fundraise-brief-ken',
    title: 'Ken completes the fundraise brief before the partner call',
    category: 'Closing Tasks',
    volume: '$35k Vol.',
    user: '@ken_ops',
    yesProb: 54,
    timeLeft: '3h left',
    badge: 'Priority',
    tone: 'amber',
  },
  {
    id: 'qa-regression-ami',
    title: 'Ami clears regression tests before release freeze',
    category: 'Quality',
    volume: '$28k Vol.',
    user: '@ami_qA',
    yesProb: 47,
    timeLeft: '9h left',
    badge: 'Risk',
    tone: 'blue',
  },
  {
    id: 'focus-block-sara',
    title: 'Sara defends a 90-min distraction-free focus block',
    category: 'Habits',
    volume: '$19k Vol.',
    user: '@sara_focus',
    yesProb: 83,
    timeLeft: '52m left',
    badge: 'Streak',
    tone: 'emerald',
  },
  {
    id: 'deck-polish-jo',
    title: 'Jo ships the investor deck polish pass tonight',
    category: 'Narrative',
    volume: '$22k Vol.',
    user: '@jo_story',
    yesProb: 58,
    timeLeft: '6h left',
    badge: 'Deck',
    tone: 'amber',
  },
  {
    id: 'api-latency-raj',
    title: 'Raj cuts API p99 latency under 120ms',
    category: 'Reliability',
    volume: '$31k Vol.',
    user: '@raj_scale',
    yesProb: 69,
    timeLeft: '18h left',
    badge: 'SLO',
    tone: 'blue',
  },
  {
    id: 'customer-story-lee',
    title: 'Lee records 3 customer stories this week',
    category: 'Growth',
    volume: '$24k Vol.',
    user: '@lee_voice',
    yesProb: 57,
    timeLeft: '3d left',
    badge: 'CX',
    tone: 'emerald',
  },
  {
    id: 'ml-model-nina',
    title: 'Nina ships the churn model AUC above 0.82',
    category: 'Data',
    volume: '$48k Vol.',
    user: '@nina_ml',
    yesProb: 63,
    timeLeft: '1d left',
    badge: 'Model',
    tone: 'amber',
  },
  {
    id: 'security-review-dan',
    title: 'Dan passes the security review with zero majors',
    category: 'Trust',
    volume: '$26k Vol.',
    user: '@dan_sec',
    yesProb: 74,
    timeLeft: '2d left',
    badge: 'Audit',
    tone: 'blue',
  },
  {
    id: 'billing-migration-mia',
    title: 'Mia migrates 100% of billing to Stripe',
    category: 'Revenue',
    volume: '$39k Vol.',
    user: '@mia_fin',
    yesProb: 52,
    timeLeft: '11h left',
    badge: 'Launch',
    tone: 'emerald',
  },
  {
    id: 'oncall-uptime-zoe',
    title: 'Zoe holds oncall with no Sev1 incidents',
    category: 'Ops',
    volume: '$18k Vol.',
    user: '@zoe_oncall',
    yesProb: 81,
    timeLeft: '9h left',
    badge: 'Calm',
    tone: 'amber',
  },
  {
    id: 'community-posts-ari',
    title: 'Ari lands 5 quality community posts',
    category: 'Community',
    volume: '$14k Vol.',
    user: '@ari_mod',
    yesProb: 61,
    timeLeft: '2d left',
    badge: 'Engage',
    tone: 'emerald',
  },
  {
    id: 'mobile-beta-tom',
    title: 'Tom ships mobile beta to 500 users',
    category: 'Mobile',
    volume: '$33k Vol.',
    user: '@tom_ios',
    yesProb: 55,
    timeLeft: '16h left',
    badge: 'Beta',
    tone: 'blue',
  },
  {
    id: 'retention-bump-ivy',
    title: 'Ivy bumps D30 retention by 4 points',
    category: 'Retention',
    volume: '$27k Vol.',
    user: '@ivy_pm',
    yesProb: 59,
    timeLeft: '4d left',
    badge: 'Cohort',
    tone: 'amber',
  },
  {
    id: 'meditation-streak-maya',
    title: 'Maya completes 30-day meditation streak',
    category: 'Wellness',
    volume: '$15k Vol.',
    user: '@maya_zen',
    yesProb: 72,
    timeLeft: '12d left',
    badge: 'Mindful',
    tone: 'emerald',
    participants: 89,
  },
  {
    id: 'book-writing-james',
    title: 'James writes 10,000 words for novel chapter',
    category: 'Creative',
    volume: '$18k Vol.',
    user: '@james_writes',
    yesProb: 65,
    timeLeft: '5d left',
    badge: 'Author',
    tone: 'blue',
  },
  {
    id: 'fitness-transformation-priya',
    title: 'Priya hits 3x weekly gym target this month',
    category: 'Health',
    volume: '$21k Vol.',
    user: '@priya_fit',
    yesProb: 78,
    timeLeft: '8d left',
    badge: 'Strength',
    tone: 'emerald',
    participants: 156,
  },
  {
    id: 'language-learning-carlos',
    title: 'Carlos completes Spanish Duolingo unit',
    category: 'Learning',
    volume: '$12k Vol.',
    user: '@carlos_lingo',
    yesProb: 81,
    timeLeft: '2d left',
    badge: 'Polyglot',
    tone: 'blue',
  },
  {
    id: 'cooking-challenge-ella',
    title: 'Ella tries 5 new recipes this week',
    category: 'Lifestyle',
    volume: '$9k Vol.',
    user: '@ella_chef',
    yesProb: 68,
    timeLeft: '4d left',
    badge: 'Chef',
    tone: 'amber',
  },
  {
    id: 'code-contribution-max',
    title: 'Max makes 20 GitHub contributions this week',
    category: 'Development',
    volume: '$16k Vol.',
    user: '@max_dev',
    yesProb: 73,
    timeLeft: '3d left',
    badge: 'OSS',
    tone: 'blue',
  },
  {
    id: 'reading-goal-sophia',
    title: 'Sophia reads 50 pages of non-fiction today',
    category: 'Learning',
    volume: '$11k Vol.',
    user: '@sophia_reads',
    yesProb: 76,
    timeLeft: '8h left',
    badge: 'Bookworm',
    tone: 'emerald',
  },
  {
    id: 'music-practice-ryan',
    title: 'Ryan practices guitar for 1 hour daily',
    category: 'Creative',
    volume: '$13k Vol.',
    user: '@ryan_strings',
    yesProb: 70,
    timeLeft: 'Daily',
    badge: 'Musician',
    tone: 'blue',
    participants: 92,
  },
  {
    id: 'no-phone-morning-luna',
    title: 'Luna avoids phone for first 2 hours of day',
    category: 'Habits',
    volume: '$17k Vol.',
    user: '@luna_digital',
    yesProb: 64,
    timeLeft: 'Daily',
    badge: 'Focus',
    tone: 'emerald',
    participants: 203,
  },
  {
    id: 'blog-post-weekly-tyler',
    title: 'Tyler publishes weekly blog post on schedule',
    category: 'Content',
    volume: '$14k Vol.',
    user: '@tyler_writes',
    yesProb: 67,
    timeLeft: '2d left',
    badge: 'Writer',
    tone: 'amber',
  },
  {
    id: 'yoga-practice-zen',
    title: 'Zen completes morning yoga routine',
    category: 'Wellness',
    volume: '$10k Vol.',
    user: '@zen_yoga',
    yesProb: 79,
    timeLeft: 'Daily',
    badge: 'Balance',
    tone: 'emerald',
    participants: 134,
  },
  {
    id: 'podcast-episode-alex',
    title: 'Alex records and publishes weekly podcast episode',
    category: 'Content',
    volume: '$19k Vol.',
    user: '@alex_podcast',
    yesProb: 66,
    timeLeft: '3d left',
    badge: 'Creator',
    tone: 'blue',
  },
  {
    id: 'photography-project-mia',
    title: 'Mia completes 30-day street photography challenge',
    category: 'Creative',
    volume: '$16k Vol.',
    user: '@mia_lens',
    yesProb: 74,
    timeLeft: '15d left',
    badge: 'Artist',
    tone: 'amber',
    participants: 67,
  },
  {
    id: 'coding-bootcamp-jordan',
    title: 'Jordan finishes React course module this week',
    category: 'Learning',
    volume: '$13k Vol.',
    user: '@jordan_code',
    yesProb: 82,
    timeLeft: '4d left',
    badge: 'Student',
    tone: 'blue',
  },
  {
    id: 'journaling-habit-kai',
    title: 'Kai writes in journal every morning for 30 days',
    category: 'Habits',
    volume: '$11k Vol.',
    user: '@kai_reflect',
    yesProb: 77,
    timeLeft: '18d left',
    badge: 'Mindful',
    tone: 'emerald',
    participants: 145,
  },
  {
    id: 'side-project-ship-riley',
    title: 'Riley ships MVP of side project to beta users',
    category: 'Development',
    volume: '$25k Vol.',
    user: '@riley_builds',
    yesProb: 61,
    timeLeft: '21d left',
    badge: 'Launch',
    tone: 'blue',
  },
  {
    id: 'networking-event-sam',
    title: 'Sam attends 3 networking events this month',
    category: 'Career',
    volume: '$14k Vol.',
    user: '@sam_network',
    yesProb: 69,
    timeLeft: '12d left',
    badge: 'Connect',
    tone: 'amber',
  },
  {
    id: 'financial-goal-casey',
    title: 'Casey saves $500 this month for emergency fund',
    category: 'Finance',
    volume: '$20k Vol.',
    user: '@casey_money',
    yesProb: 75,
    timeLeft: '10d left',
    badge: 'Savings',
    tone: 'emerald',
  },
  {
    id: 'volunteer-work-taylor',
    title: 'Taylor volunteers 10 hours at local shelter',
    category: 'Community',
    volume: '$8k Vol.',
    user: '@taylor_gives',
    yesProb: 88,
    timeLeft: '7d left',
    badge: 'Impact',
    tone: 'emerald',
    participants: 98,
  },
  {
    id: 'dance-class-ava',
    title: 'Ava attends all weekly dance classes this month',
    category: 'Fitness',
    volume: '$12k Vol.',
    user: '@ava_dance',
    yesProb: 71,
    timeLeft: '14d left',
    badge: 'Movement',
    tone: 'blue',
  },
  {
    id: 'writing-consistency-lex',
    title: 'Lex writes 500 words daily for novel project',
    category: 'Creative',
    volume: '$17k Vol.',
    user: '@lex_writes',
    yesProb: 68,
    timeLeft: 'Daily',
    badge: 'Author',
    tone: 'amber',
    participants: 112,
  },
  {
    id: 'no-alcohol-challenge-morgan',
    title: 'Morgan completes 30-day no alcohol challenge',
    category: 'Health',
    volume: '$22k Vol.',
    user: '@morgan_clean',
    yesProb: 63,
    timeLeft: '22d left',
    badge: 'Wellness',
    tone: 'emerald',
    participants: 234,
  },
  {
    id: 'mentorship-program-quinn',
    title: 'Quinn completes mentorship program application',
    category: 'Career',
    volume: '$15k Vol.',
    user: '@quinn_grow',
    yesProb: 80,
    timeLeft: '5d left',
    badge: 'Growth',
    tone: 'blue',
  },
];

export default function MarketsView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const [wagers, setWagers] = useState<Wager[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('global');
  const [isExchangeOpen, setIsExchangeOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for view query parameter on mount and when it changes
  useEffect(() => {
    const viewParam = searchParams.get('view');
    if (viewParam === 'personal') {
      setViewMode('personal');
    }
  }, [searchParams]);

  useEffect(() => {
    // Only load data if user is authenticated
    const checkAndLoad = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        loadData();
      }
    };
    checkAndLoad();
  }, []);

  // Refresh data when page becomes visible again (e.g., after returning from session page)
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible') {
        // Check if user is authenticated before loading data
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          loadData();
        }
      }
    };

    const handleFocus = async () => {
      // Check if user is authenticated before loading data
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        loadData();
      }
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
      const wagersData = await getUserWagers();
      
      // If user has no wagers, seed demo data
      if (!wagersData || wagersData.length === 0) {
        await seedDemoData();
        // Reload wagers after seeding
        const refreshedWagers = await getUserWagers();
        setWagers(refreshedWagers || []);
      } else {
        setWagers(wagersData || []);
      }
    } catch (error) {
      setWagers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateWager = async (title: string, assetClass: AssetClass, stake: number, linkedYearWagerId?: string) => {
    try {
      const newWager = await createWager(title, assetClass, stake, linkedYearWagerId);
      await loadData();
      
      // For TDAY wagers, redirect will be handled by the modal
      // For other asset classes, switch to personal view
      if (assetClass !== 'TDAY') {
        setViewMode('personal');
      }
      
      // Return the wager so the modal can handle redirect
      return newWager;
    } catch (error) {
      console.error('Error creating wager:', error);
      throw error; // Re-throw so modal can show error
    }
  };

  const personalCards: MarketCardData[] = useMemo(() => {
    return wagers
      .filter(w => {
        // Only show OPEN wagers that are not expired
        if (w.status !== 'OPEN') return false;
        const deadlineInfo = calculateTimeRemaining(w.deadline);
        return !deadlineInfo.isExpired;
      })
      .map(w => {
        const deadlineInfo = calculateTimeRemaining(w.deadline);
        const yesProbability = Math.min(90, Math.max(15, 50 + (w.pnl_percentage ?? 5)));
        const asset = ASSET_CLASS_CONFIG[w.asset_class];

        return {
          id: w.id,
          title: w.title,
          category: asset?.name || 'Position',
          volume: `${formatCurrency(w.stake_amount)} staked`,
          user: '@you',
          yesProb: yesProbability,
          timeLeft: w.asset_class === 'TDAY' 
            ? `${deadlineInfo.hours}h ${deadlineInfo.minutes}m`
            : `${deadlineInfo.days}d ${deadlineInfo.hours}h`,
          badge: w.asset_class,
          tone: w.asset_class === 'TDAY' ? 'emerald' : w.asset_class === 'SHIP' ? 'blue' : 'amber',
          wager: w, // Pass full wager object for TDAY actions
        };
      });
  }, [wagers]);

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

  const cardsToShow = viewMode === 'global' ? GLOBAL_MARKETS : personalCards;
  const yearWagers = wagers.filter(w => w.asset_class === 'YEAR' && w.status === 'OPEN');

  if (isLoading) {
    return (
      <div className="w-full min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-zinc-500 data-text text-sm">Loading markets...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full min-h-screen">
        <div className="container mx-auto px-6 max-sm:px-4 py-6 max-sm:py-4 max-w-7xl">
          {/* Header + Toggle */}
          <div className="mb-8 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></div>
              <div>
                <h1 className="text-3xl font-bold text-white">Markets</h1>
                <p className="text-zinc-400 text-sm">
                  Switch between the global board and your portfolio like Polymarket.
                </p>
              </div>
            </div>

            <div className="inline-flex items-center bg-white/5 rounded-full p-1 border border-white/10 w-fit max-sm:w-full">
              <button
                onClick={() => setViewMode('global')}
                className={`px-5 max-sm:flex-1 max-sm:px-4 py-2 text-sm max-sm:text-xs font-semibold rounded-full transition-all ${
                  viewMode === 'global'
                    ? 'bg-white text-slate-900 shadow-lg'
                    : 'text-zinc-300 hover:text-white'
                }`}
              >
                Markets
              </button>
              <button
                onClick={() => setViewMode('personal')}
                className={`px-5 max-sm:flex-1 max-sm:px-4 py-2 text-sm max-sm:text-xs font-semibold rounded-full transition-all ${
                  viewMode === 'personal'
                    ? 'bg-white text-slate-900 shadow-lg'
                    : 'text-zinc-300 hover:text-white'
                }`}
              >
                Portfolio
              </button>
            </div>
          </div>

          {/* Grid */}
          {cardsToShow.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
              <Sparkles className="mx-auto mb-3 text-emerald-400" />
              <p className="text-white font-semibold mb-2">No positions yet</p>
              <p className="text-zinc-400 text-sm mb-4">
                Open a wager to see it in your portfolio. You can always browse the global board.
              </p>
              <Button 
                onClick={async () => {
                  const { data: { user } } = await supabase.auth.getUser();
                  if (!user) {
                    router.push('/sign-in');
                    return;
                  }
                  setIsExchangeOpen(true);
                }} 
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-900"
              >
                New Wager
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
              {cardsToShow.map(card => (
                <MarketCard 
                  key={card.id} 
                  data={card} 
                  onClick={() => router.push(`/markets/${card.id}`)}
                  onComplete={viewMode === 'personal' && card.wager ? handleCompleteWager : undefined}
                  onClose={viewMode === 'personal' && card.wager ? handleFailWager : undefined}
                  isPersonal={viewMode === 'personal'}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <ExchangeModal
        open={isExchangeOpen}
        onOpenChange={setIsExchangeOpen}
        onExecute={handleCreateWager}
        yearWagers={yearWagers}
      />
    </>
  );
}

function MarketCard({ 
  data, 
  onClick,
  onComplete,
  onClose,
  isPersonal = false
}: { 
  data: MarketCardData; 
  onClick: () => void;
  onComplete?: (wagerId: string) => void;
  onClose?: (wagerId: string) => void;
  isPersonal?: boolean;
}) {
  const router = useRouter();
  const [timeRemaining, setTimeRemaining] = useState(data.timeLeft);
  const isTdayWager = data.wager?.asset_class === 'TDAY' && data.wager?.status === 'OPEN';
  const isNonTdayWager = isPersonal && data.wager && data.wager.asset_class !== 'TDAY' && data.wager.status === 'OPEN';
  
  // Countdown timer for all wagers in portfolio
  useEffect(() => {
    if (!data.wager) {
      // For global markets, use static timeLeft
      setTimeRemaining(data.timeLeft);
      return;
    }
    
    const updateTimer = () => {
      const deadlineInfo = calculateTimeRemaining(data.wager!.deadline);
      if (deadlineInfo.isExpired) {
        setTimeRemaining('Expired');
        return;
      }
      
      // Format based on asset class
      if (data.wager!.asset_class === 'TDAY') {
        // For TDAY, show hours:minutes:seconds (16 hour timer)
        setTimeRemaining(`${deadlineInfo.hours}h ${deadlineInfo.minutes}m ${deadlineInfo.seconds}s`);
      } else if (data.wager!.asset_class === 'SHIP') {
        // For SHIP, show days and hours
        setTimeRemaining(`${deadlineInfo.days}d ${deadlineInfo.hours}h ${deadlineInfo.minutes}m`);
      } else {
        // For YEAR, show days
        setTimeRemaining(`${deadlineInfo.days}d ${deadlineInfo.hours}h`);
      }
    };
    
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    
    return () => clearInterval(interval);
  }, [data.wager, data.timeLeft]);
  
  const handleLockIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Navigate to the active session instead of completing the wager
    if (data.wager && isTdayWager) {
      router.push(`/session/${data.wager.id}`);
    }
  };
  
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClose && data.wager) {
      // Confirm before closing (money lost)
      if (confirm('Are you sure? Closing before the timer ends will result in a loss of your stake.')) {
        onClose(data.wager.id);
      }
    }
  };

  const handleUpdate = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick(); // Navigate to market detail page for updates
  };
  const toneStyles =
    data.tone === 'blue'
      ? {
          bg: 'from-cyan-500/15 to-blue-500/5',
          yes: 'bg-cyan-500/20 text-cyan-100 border-cyan-500/30',
          no: 'bg-slate-900/30 text-slate-100 border-white/10',
        }
      : data.tone === 'amber'
        ? {
            bg: 'from-amber-500/20 to-amber-500/5',
            yes: 'bg-amber-500/25 text-amber-100 border-amber-500/40',
            no: 'bg-slate-900/30 text-slate-100 border-white/10',
          }
        : {
            bg: 'from-emerald-500/15 to-emerald-500/5',
            yes: 'bg-emerald-500/25 text-emerald-100 border-emerald-500/40',
            no: 'bg-slate-900/30 text-slate-100 border-white/10',
          };

  const noProb = Math.max(0, 100 - data.yesProb);

  // Check if it's a bigger goal (longer timeframe or strategic category)
  const isBiggerGoal = data.category === 'Growth' || data.category === 'Revenue' || data.category === 'Retention' || data.category === 'Data' || data.timeLeft.includes('d') || data.timeLeft.includes('day');

  return (
    <div
      onClick={onClick}
      className="group/card relative cursor-pointer flex flex-col gap-4 from-slate-900 via-slate-800 to-slate-900 bg-gradient-to-br rounded-2xl px-6 py-6 shadow-2xl transition-all duration-250 overflow-hidden min-h-[220px]"
      style={{
        backgroundImage: `radial-gradient(at 88% 40%, rgb(15 23 42) 0px, transparent 85%), radial-gradient(at 49% 30%, rgb(30 41 59) 0px, transparent 85%), radial-gradient(at 14% 26%, rgb(51 65 85) 0px, transparent 85%), radial-gradient(at 0% 64%, rgb(59 130 246) 0px, transparent 85%), radial-gradient(at 41% 94%, rgb(139 92 246) 0px, transparent 85%), radial-gradient(at 100% 99%, rgb(249 115 22) 0px, transparent 85%)`,
        boxShadow: '0px -16px 24px 0px rgba(255, 255, 255, 0.1) inset, 0 0 20px rgba(255, 255, 255, 0.15), 0 0 40px rgba(255, 255, 255, 0.08)',
      }}
    >
      {/* Animated Border - removed animated-border class to prevent spinning */}
      <div
        className="overflow-hidden pointer-events-none absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-b from-white via-gray-400 to-gray-600 rounded-2xl opacity-20"
        style={{ width: 'calc(100% + 2px)', height: 'calc(100% + 2px)' }}
      ></div>

      {/* Title Section */}
      <div className="flex flex-col relative z-10">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[15px] font-semibold text-white leading-tight">{data.title}</span>
          {data.badge && (
            <span className="text-[10px] font-medium bg-white/10 text-gray-300 px-2 py-0.5 rounded-full border border-gray-700/50 shrink-0 ml-2">
              {data.badge}
            </span>
          )}
        </div>
        <p className="text-[13px] text-gray-400 mt-1">
          by {data.user}
        </p>
      </div>

      {/* Action Buttons - Pushed toward bottom */}
      <div className="relative z-10 flex flex-col gap-2 mt-auto mb-2">
        {/* Yes/No Buttons - For global market cards (not in portfolio) */}
        {!isPersonal || !data.wager ? (
          <div className="flex items-center gap-2">
            <button
              className="flex-1 flex items-center justify-between px-3 py-2 rounded-lg text-[13px] font-semibold text-white transition-all duration-200 hover:scale-105 hover:brightness-110 active:scale-[0.98] bg-gradient-to-r from-emerald-500 to-green-500"
              style={{
                boxShadow: '0 0 20px rgba(16, 185, 129, 0.6), 0 0 40px rgba(16, 185, 129, 0.3), inset 0 -2px 15px -4px rgba(255, 255, 255, 0.3)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 0 30px rgba(16, 185, 129, 0.8), 0 0 60px rgba(16, 185, 129, 0.5), inset 0 -2px 15px -4px rgba(255, 255, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 0 20px rgba(16, 185, 129, 0.6), 0 0 40px rgba(16, 185, 129, 0.3), inset 0 -2px 15px -4px rgba(255, 255, 255, 0.3)';
              }}
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
            >
              <span>Yes</span>
              <span>{data.yesProb}%</span>
            </button>
            <button
              className="flex-1 flex items-center justify-between px-3 py-2 rounded-lg text-[13px] font-semibold text-white transition-all duration-200 hover:scale-105 hover:brightness-110 active:scale-[0.98] bg-gradient-to-r from-red-500 to-rose-500"
              style={{
                boxShadow: '0 0 20px rgba(239, 68, 68, 0.6), 0 0 40px rgba(239, 68, 68, 0.3), inset 0 -2px 15px -4px rgba(255, 255, 255, 0.3)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 0 30px rgba(239, 68, 68, 0.8), 0 0 60px rgba(239, 68, 68, 0.5), inset 0 -2px 15px -4px rgba(255, 255, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 0 20px rgba(239, 68, 68, 0.6), 0 0 40px rgba(239, 68, 68, 0.3), inset 0 -2px 15px -4px rgba(255, 255, 255, 0.3)';
              }}
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
            >
              <span>No</span>
              <span>{noProb}%</span>
            </button>
          </div>
        ) : (
          <>
            {/* Lock In/Close Buttons - Only for TDAY wagers in portfolio */}
            {isTdayWager && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleLockIn}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-[13px] font-semibold text-white transition-all duration-200 hover:scale-105 hover:brightness-110 active:scale-[0.98] bg-gradient-to-r from-emerald-500 to-green-500"
                  style={{
                    boxShadow: '0 0 20px rgba(16, 185, 129, 0.6), 0 0 40px rgba(16, 185, 129, 0.3), inset 0 -2px 15px -4px rgba(255, 255, 255, 0.3)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 30px rgba(16, 185, 129, 0.8), 0 0 60px rgba(16, 185, 129, 0.5), inset 0 -2px 15px -4px rgba(255, 255, 255, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(16, 185, 129, 0.6), 0 0 40px rgba(16, 185, 129, 0.3), inset 0 -2px 15px -4px rgba(255, 255, 255, 0.3)';
                  }}
                >
                  <Lock size={14} />
                  <span>Lock In</span>
                </button>
                <button
                  onClick={handleClose}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-[13px] font-semibold text-white transition-all duration-200 hover:scale-105 hover:brightness-110 active:scale-[0.98] bg-gradient-to-r from-red-500 to-rose-500"
                  style={{
                    boxShadow: '0 0 20px rgba(239, 68, 68, 0.6), 0 0 40px rgba(239, 68, 68, 0.3), inset 0 -2px 15px -4px rgba(255, 255, 255, 0.3)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 30px rgba(239, 68, 68, 0.8), 0 0 60px rgba(239, 68, 68, 0.5), inset 0 -2px 15px -4px rgba(255, 255, 255, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(239, 68, 68, 0.6), 0 0 40px rgba(239, 68, 68, 0.3), inset 0 -2px 15px -4px rgba(255, 255, 255, 0.3)';
                  }}
                >
                  <X size={14} />
                  <span>Close</span>
                </button>
              </div>
            )}
            
            {/* Update/Close Buttons - For non-TDAY wagers (SHIP, YEAR) in portfolio */}
            {isNonTdayWager && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleUpdate}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-[13px] font-semibold text-white transition-all duration-200 hover:scale-105 hover:brightness-110 active:scale-[0.98] bg-gradient-to-r from-blue-500 to-cyan-500"
                  style={{
                    boxShadow: '0 0 20px rgba(59, 130, 246, 0.6), 0 0 40px rgba(59, 130, 246, 0.3), inset 0 -2px 15px -4px rgba(255, 255, 255, 0.3)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 30px rgba(59, 130, 246, 0.8), 0 0 60px rgba(59, 130, 246, 0.5), inset 0 -2px 15px -4px rgba(255, 255, 255, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.6), 0 0 40px rgba(59, 130, 246, 0.3), inset 0 -2px 15px -4px rgba(255, 255, 255, 0.3)';
                  }}
                >
                  <Edit size={14} />
                  <span>Update</span>
                </button>
                <button
                  onClick={handleClose}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-[13px] font-semibold text-white transition-all duration-200 hover:scale-105 hover:brightness-110 active:scale-[0.98] bg-gradient-to-r from-red-500 to-rose-500"
                  style={{
                    boxShadow: '0 0 20px rgba(239, 68, 68, 0.6), 0 0 40px rgba(239, 68, 68, 0.3), inset 0 -2px 15px -4px rgba(255, 255, 255, 0.3)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 30px rgba(239, 68, 68, 0.8), 0 0 60px rgba(239, 68, 68, 0.5), inset 0 -2px 15px -4px rgba(255, 255, 255, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(239, 68, 68, 0.6), 0 0 40px rgba(239, 68, 68, 0.3), inset 0 -2px 15px -4px rgba(255, 255, 255, 0.3)';
                  }}
                >
                  <X size={14} />
                  <span>Close</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Footer - Aligned to bottom */}
      <div className="relative z-10 flex items-center justify-between text-[13px] text-gray-400 mt-auto">
        <div className="flex items-center gap-1.5">
          <Wallet2 size={12} />
          <span className="text-[13px]">{data.volume}</span>
        </div>
        {/* Timer - Smaller, aligned to right */}
        {data.wager ? (
          <div className="flex items-center gap-1.5">
            <Timer size={10} className="text-amber-400/70" />
            <span className="text-[11px] font-mono text-amber-400/70">{timeRemaining}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <Timer size={12} />
            <span className="text-[13px]">{data.timeLeft}</span>
          </div>
        )}
      </div>
    </div>
  );
}
