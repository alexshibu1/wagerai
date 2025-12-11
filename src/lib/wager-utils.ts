import { AssetClass, Wager, ChartDataPoint, HeatmapDay } from '@/types/wager';
import { addDays, format, startOfDay, eachDayOfInterval, subDays } from 'date-fns';

export const ASSET_CLASS_CONFIG = {
  TDAY: {
    name: 'Intraday',
    symbol: '$TDAY',
    description: 'Daily tasks',
    duration: 16, // 16 hours instead of 1 day
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
} as const;

export function getDeadlineForAssetClass(assetClass: AssetClass): Date {
  const now = new Date();
  const config = ASSET_CLASS_CONFIG[assetClass];
  if (assetClass === 'TDAY') {
    // For TDAY, add 16 hours instead of days
    return new Date(now.getTime() + config.duration * 60 * 60 * 1000);
  }
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

  // Generate 50 volatile data points spanning the last 30 days
  const data: ChartDataPoint[] = [];
  let currentScore = initialScore;
  const daysToGenerate = 50;
  const startDate = subDays(new Date(), 30);
  
  // Create baseline points with random volatility
  for (let i = 0; i < daysToGenerate; i++) {
    const date = addDays(startDate, (i / daysToGenerate) * 30);
    
    // Add random volatility: ±5% swings with occasional spikes
    const volatilityFactor = Math.random() < 0.15 
      ? (Math.random() - 0.5) * 0.15  // 15% occasional spike
      : (Math.random() - 0.5) * 0.05; // 5% normal variation
    
    currentScore = currentScore * (1 + volatilityFactor);
    
    data.push({
      date: format(date, 'MMM dd'),
      value: Math.round(currentScore)
    });
  }

  // Overlay actual wager outcomes on top of the volatile baseline
  sortedWagers.forEach(wager => {
    const pnl = wager.status === 'WON' 
      ? wager.stake_amount * ((wager.pnl_percentage || 20) / 100)
      : -wager.stake_amount;
    
    // Find closest data point and adjust it
    const wagerDate = new Date(wager.completed_at || wager.created_at);
    const closestPointIndex = data.findIndex(point => {
      const pointDate = new Date(point.date + ', ' + new Date().getFullYear());
      return Math.abs(pointDate.getTime() - wagerDate.getTime()) < 1000 * 60 * 60 * 24 * 2;
    });
    
    if (closestPointIndex !== -1 && closestPointIndex < data.length) {
      // Apply PnL to this point and propagate forward
      for (let i = closestPointIndex; i < data.length; i++) {
        data[i].value += pnl;
      }
    }
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
