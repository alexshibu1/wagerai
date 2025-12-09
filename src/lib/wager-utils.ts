import { AssetClass, Wager, ChartDataPoint, HeatmapDay } from '@/types/wager';
import { addDays, format, startOfDay, eachDayOfInterval, subDays } from 'date-fns';

export const ASSET_CLASS_CONFIG = {
  TDAY: {
    name: 'Intraday',
    symbol: '$TDAY',
    description: 'Daily tasks',
    duration: 1,
    color: '#00C805',
  },
  SHIP: {
    name: 'Futures',
    symbol: '$SHIP',
    description: '1-3 month projects',
    duration: 30,
    color: '#00C805',
  },
  YEAR: {
    name: 'Bonds',
    symbol: '$YEAR',
    description: '1-year goals',
    duration: 365,
    color: '#00C805',
  },
};

export function getDeadlineForAssetClass(assetClass: AssetClass): Date {
  const now = new Date();
  const config = ASSET_CLASS_CONFIG[assetClass];
  return addDays(now, config.duration);
}

export function calculateTimeRemaining(deadline: string): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
} {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diff = deadlineDate.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, isExpired: false };
}

export function generateChartData(wagers: Wager[], initialScore: number = 10000): ChartDataPoint[] {
  const sortedWagers = [...wagers]
    .filter(w => w.status !== 'OPEN')
    .sort((a, b) => new Date(a.completed_at || a.created_at).getTime() - new Date(b.completed_at || b.created_at).getTime());

  const data: ChartDataPoint[] = [
    { date: format(subDays(new Date(), 30), 'MMM dd'), value: initialScore }
  ];

  let currentScore = initialScore;

  sortedWagers.forEach(wager => {
    const pnl = wager.status === 'WON' 
      ? wager.stake_amount * ((wager.pnl_percentage || 20) / 100)
      : -wager.stake_amount;
    
    currentScore += pnl;
    
    data.push({
      date: format(new Date(wager.completed_at || wager.created_at), 'MMM dd'),
      value: currentScore
    });
  });

  return data;
}

export function generateHeatmapData(wagers: Wager[], days: number = 90): HeatmapDay[] {
  const endDate = new Date();
  const startDate = subDays(endDate, days);
  const dateRange = eachDayOfInterval({ start: startDate, end: endDate });

  return dateRange.map(date => {
    const dateStr = format(startOfDay(date), 'yyyy-MM-dd');
    const dayWagers = wagers.filter(w => {
      const wagerDate = format(startOfDay(new Date(w.completed_at || w.created_at)), 'yyyy-MM-dd');
      return wagerDate === dateStr && w.status !== 'OPEN';
    });

    let outcome: 'win' | 'loss' | 'none' = 'none';
    if (dayWagers.length > 0) {
      const wins = dayWagers.filter(w => w.status === 'WON').length;
      const losses = dayWagers.filter(w => w.status === 'LOST').length;
      outcome = wins > losses ? 'win' : losses > 0 ? 'loss' : 'none';
    }

    return {
      date: dateStr,
      outcome,
      wagers: dayWagers
    };
  });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculatePnL(wager: Wager): number {
  if (wager.status === 'WON') {
    return wager.stake_amount * ((wager.pnl_percentage || 20) / 100);
  } else if (wager.status === 'LOST') {
    return -wager.stake_amount;
  }
  return 0;
}
