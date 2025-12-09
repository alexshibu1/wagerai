export type AssetClass = 'TDAY' | 'SHIP' | 'YEAR';
export type WagerStatus = 'OPEN' | 'WON' | 'LOST';

export interface Wager {
  id: string;
  user_id: string;
  title: string;
  asset_class: AssetClass;
  stake_amount: number;
  status: WagerStatus;
  deadline: string;
  created_at: string;
  completed_at?: string;
  pnl_percentage?: number;
  linked_year_wager_id?: string;
  health_percentage?: number;
  last_activity_at?: string;
}

export interface UserStats {
  user_id: string;
  agency_score: number;
  win_rate: number;
  total_wagers: number;
  total_wins: number;
  total_losses: number;
  current_streak: number;
  longest_streak: number;
  updated_at: string;
}

export interface ChartDataPoint {
  date: string;
  value: number;
}

export interface HeatmapDay {
  date: string;
  outcome: 'win' | 'loss' | 'none';
  wagers: Wager[];
}
