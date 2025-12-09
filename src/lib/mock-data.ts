// ===========================
// MOCK DATA: WAGER APP
// Extensive realistic data for demo purposes
// ===========================

export interface MockSession {
  id: string;
  taskName: string;
  duration: number; // minutes
  stake: number; // dollars
  status: 'completed' | 'failed';
  date: Date;
  earnings: number; // positive for completed, negative for failed
}

export interface HeatmapDay {
  date: Date;
  intensity: 0 | 1 | 2 | 3 | 4; // 0 = no activity, 4 = max intensity
  sessionsCompleted: number;
}

export interface UserStats {
  totalEarnings: number;
  winRate: number; // percentage
  avgSessionDuration: number; // minutes
  currentStreak: number; // days
  reliabilityRating: 'AAA' | 'AA' | 'A' | 'BBB' | 'BB';
  availableBalance: number;
  totalSessions: number;
  completedSessions: number;
  failedSessions: number;
}

// ===========================
// USER STATS (High Roller Profile)
// ===========================
export const USER_STATS: UserStats = {
  totalEarnings: 450.0,
  winRate: 94,
  avgSessionDuration: 48,
  currentStreak: 12,
  reliabilityRating: 'AAA',
  availableBalance: 1420.0,
  totalSessions: 34,
  completedSessions: 32,
  failedSessions: 2,
};

// ===========================
// MOCK HISTORY (20 Past Sessions)
// ===========================
export const MOCK_HISTORY: MockSession[] = [
  {
    id: '1',
    taskName: 'Deep Work: Q4 Strategy Doc',
    duration: 60,
    stake: 50,
    status: 'completed',
    date: new Date(2024, 0, 15, 9, 0),
    earnings: 50,
  },
  {
    id: '2',
    taskName: 'Code Sprint: API Refactor',
    duration: 90,
    stake: 45,
    status: 'completed',
    date: new Date(2024, 0, 14, 14, 30),
    earnings: 45,
  },
  {
    id: '3',
    taskName: 'Reading: Atomic Habits Ch 4-6',
    duration: 45,
    stake: 30,
    status: 'completed',
    date: new Date(2024, 0, 14, 8, 0),
    earnings: 30,
  },
  {
    id: '4',
    taskName: 'Deep Work: Product Spec',
    duration: 75,
    stake: 40,
    status: 'completed',
    date: new Date(2024, 0, 13, 10, 0),
    earnings: 40,
  },
  {
    id: '5',
    taskName: 'Code Sprint: Auth System',
    duration: 60,
    stake: 35,
    status: 'failed',
    date: new Date(2024, 0, 12, 15, 0),
    earnings: -35,
  },
  {
    id: '6',
    taskName: 'Deep Work: Marketing Plan',
    duration: 50,
    stake: 25,
    status: 'completed',
    date: new Date(2024, 0, 12, 9, 30),
    earnings: 25,
  },
  {
    id: '7',
    taskName: 'Reading: Design Systems Book',
    duration: 40,
    stake: 20,
    status: 'completed',
    date: new Date(2024, 0, 11, 19, 0),
    earnings: 20,
  },
  {
    id: '8',
    taskName: 'Code Sprint: Database Optimization',
    duration: 90,
    stake: 50,
    status: 'completed',
    date: new Date(2024, 0, 11, 13, 0),
    earnings: 50,
  },
  {
    id: '9',
    taskName: 'Deep Work: Investor Deck',
    duration: 60,
    stake: 35,
    status: 'completed',
    date: new Date(2024, 0, 10, 10, 0),
    earnings: 35,
  },
  {
    id: '10',
    taskName: 'Code Sprint: Feature Implementation',
    duration: 75,
    stake: 40,
    status: 'completed',
    date: new Date(2024, 0, 9, 14, 0),
    earnings: 40,
  },
  {
    id: '11',
    taskName: 'Reading: Deep Work',
    duration: 30,
    stake: 15,
    status: 'completed',
    date: new Date(2024, 0, 9, 8, 0),
    earnings: 15,
  },
  {
    id: '12',
    taskName: 'Deep Work: Financial Model',
    duration: 60,
    stake: 45,
    status: 'completed',
    date: new Date(2024, 0, 8, 11, 0),
    earnings: 45,
  },
  {
    id: '13',
    taskName: 'Code Sprint: Bug Fixes',
    duration: 45,
    stake: 25,
    status: 'completed',
    date: new Date(2024, 0, 7, 16, 0),
    earnings: 25,
  },
  {
    id: '14',
    taskName: 'Deep Work: Content Strategy',
    duration: 50,
    stake: 30,
    status: 'completed',
    date: new Date(2024, 0, 7, 9, 0),
    earnings: 30,
  },
  {
    id: '15',
    taskName: 'Code Sprint: Performance Tuning',
    duration: 90,
    stake: 50,
    status: 'completed',
    date: new Date(2024, 0, 6, 13, 30),
    earnings: 50,
  },
  {
    id: '16',
    taskName: 'Reading: Zero to One',
    duration: 40,
    stake: 20,
    status: 'completed',
    date: new Date(2024, 0, 5, 19, 30),
    earnings: 20,
  },
  {
    id: '17',
    taskName: 'Deep Work: Roadmap Planning',
    duration: 60,
    stake: 35,
    status: 'failed',
    date: new Date(2024, 0, 5, 10, 0),
    earnings: -35,
  },
  {
    id: '18',
    taskName: 'Code Sprint: Testing Suite',
    duration: 75,
    stake: 40,
    status: 'completed',
    date: new Date(2024, 0, 4, 14, 0),
    earnings: 40,
  },
  {
    id: '19',
    taskName: 'Deep Work: Sales Pitch',
    duration: 45,
    stake: 25,
    status: 'completed',
    date: new Date(2024, 0, 3, 11, 30),
    earnings: 25,
  },
  {
    id: '20',
    taskName: 'Code Sprint: UI Components',
    duration: 60,
    stake: 35,
    status: 'completed',
    date: new Date(2024, 0, 2, 15, 0),
    earnings: 35,
  },
];

// ===========================
// MOCK HEATMAP (30 Days)
// ===========================
export const MOCK_HEATMAP: HeatmapDay[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  
  // Create realistic pattern: weekdays have more activity
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
  const baseIntensity = isWeekend ? 1 : 3;
  
  // Add some randomness but keep it realistic
  const intensity = Math.min(4, Math.max(0, baseIntensity + Math.floor(Math.random() * 2 - 0.5)));
  
  return {
    date,
    intensity: intensity as 0 | 1 | 2 | 3 | 4,
    sessionsCompleted: intensity === 0 ? 0 : intensity,
  };
});

// ===========================
// SPARKLINE DATA (30 Days of Cumulative Earnings)
// ===========================
export const SPARKLINE_DATA = Array.from({ length: 30 }, (_, i) => {
  // Simulate cumulative growth with some variance
  const baseValue = 200 + i * 8;
  const variance = Math.random() * 20 - 10;
  return Math.max(0, Math.floor(baseValue + variance));
});
