'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, ArrowRight, Activity, BarChart3, CheckCircle2, Target, Flame, GitCommit, Sparkles, Trophy, Wallet, Clock, Zap } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import AssetClassInfo from './asset-class-info';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import ContributionHeatmap from './contribution-heatmap';
import { HeatmapDay } from '@/types/wager';
import { getDeepWorkStats, getRecentSessionVolatility } from '@/app/actions/wager-actions';

// =============================================================================
// WAGER MOCK DATA
// =============================================================================

const EXECUTION_VOLATILITY_DATA = [
  { time: '9:00 AM', value: 100 },
  { time: '9:30 AM', value: 94 },
  { time: '10:00 AM', value: 118 },
  { time: '10:30 AM', value: 105 },
  { time: '11:00 AM', value: 132 },
  { time: '11:30 AM', value: 125 },
  { time: '12:00 PM', value: 115 },
  { time: '12:30 PM', value: 108 },
  { time: '1:00 PM', value: 122 },
  { time: '1:30 PM', value: 138 },
  { time: '2:00 PM', value: 128 },
  { time: '2:30 PM', value: 145 },
  { time: '3:00 PM', value: 152 },
  { time: '3:30 PM', value: 138 },
  { time: '4:00 PM', value: 162 },
  { time: '4:30 PM', value: 148 },
  { time: '5:00 PM', value: 172 },
  { time: '5:30 PM', value: 158 },
  { time: '6:00 PM', value: 175 },
  { time: '6:30 PM', value: 165 },
  { time: '7:00 PM', value: 178 },
  { time: '7:30 PM', value: 168 },
  { time: '8:00 PM', value: 182 },
];

// Last day's $TDAY data - for comparing today vs previous work session
const LAST_DAY_TDAY_DATA = [
  { time: '06:00', value: 92 },
  { time: '06:30', value: 85 },
  { time: '07:00', value: 98 },
  { time: '07:30', value: 88 },
  { time: '08:00', value: 115 },
  { time: '08:30', value: 102 },
  { time: '09:00', value: 108 },
  { time: '09:30', value: 128 },
  { time: '10:00', value: 124 },
  { time: '10:30', value: 138 },
  { time: '11:00', value: 145 },
  { time: '11:30', value: 125 },
  { time: '12:00', value: 132 },
  { time: '12:30', value: 118 },
  { time: '13:00', value: 128 },
  { time: '13:30', value: 145 },
  { time: '14:00', value: 152 },
  { time: '14:30', value: 138 },
  { time: '15:00', value: 161 },
  { time: '15:30', value: 148 },
  { time: '16:00', value: 158 },
  { time: '16:30', value: 172 },
  { time: '17:00', value: 167 },
];

// Weekly $TDAY data - more volatile daily swings
const WEEKLY_TDAY_DATA = [
  { time: 'Mon', value: 145 },
  { time: 'Mon PM', value: 128 },
  { time: 'Tue', value: 162 },
  { time: 'Tue PM', value: 141 },
  { time: 'Wed', value: 138 },
  { time: 'Wed PM', value: 158 },
  { time: 'Thu', value: 171 },
  { time: 'Thu PM', value: 149 },
  { time: 'Fri', value: 155 },
  { time: 'Fri PM', value: 178 },
  { time: 'Sat', value: 89 },
  { time: 'Sat PM', value: 112 },
  { time: 'Sun', value: 168 },
  { time: 'Sun PM', value: 182 },
];

// Monthly $TDAY data - volatile weekly swings
const MONTHLY_TDAY_DATA = [
  { time: 'W1', value: 132 },
  { time: 'W1+', value: 118 },
  { time: 'W2', value: 148 },
  { time: 'W2+', value: 128 },
  { time: 'W3', value: 156 },
  { time: 'W3+', value: 138 },
  { time: 'W4', value: 165 },
  { time: 'W4+', value: 175 },
];

// Yearly $TDAY data - volatile monthly swings
const YEARLY_TDAY_DATA = [
  { time: 'Jan', value: 95 },
  { time: 'Feb', value: 72 },
  { time: 'Mar', value: 115 },
  { time: 'Apr', value: 88 },
  { time: 'May', value: 128 },
  { time: 'Jun', value: 105 },
  { time: 'Jul', value: 142 },
  { time: 'Aug', value: 118 },
  { time: 'Sep', value: 151 },
  { time: 'Oct', value: 135 },
  { time: 'Nov', value: 172 },
  { time: 'Dec', value: 182 },
];

// Time range configuration for chart switcher
type TimeRange = '1D' | '1W' | '1M' | '1Y';

const TIME_RANGE_DATA: Record<TimeRange, { data: { time: string; value: number }[]; label: string }> = {
  '1D': { data: EXECUTION_VOLATILITY_DATA, label: 'Today' },
  '1W': { data: WEEKLY_TDAY_DATA, label: 'Past Week' },
  '1M': { data: MONTHLY_TDAY_DATA, label: 'Past Month' },
  '1Y': { data: YEARLY_TDAY_DATA, label: 'Past Year' },
};

// Focus areas time range
type FocusTimeRange = 'W' | 'M' | 'Y';

const ASSET_ALLOCATION_DATA = [
  { week: 'W1', tday: 2400, ship: 1800, year: 800 },
  { week: 'W2', tday: 2800, ship: 2100, year: 950 },
  { week: 'W3', tday: 2200, ship: 2400, year: 1100 },
  { week: 'W4', tday: 3100, ship: 2200, year: 1250 },
  { week: 'W5', tday: 2900, ship: 2800, year: 1400 },
  { week: 'W6', tday: 3400, ship: 3100, year: 1600 },
  { week: 'W7', tday: 3200, ship: 3500, year: 1850 },
  { week: 'W8', tday: 3800, ship: 3200, year: 2100 },
];

// =============================================================================
// FOCUS AREAS DATA - Radar Chart (similar to "Audience Interests")
// =============================================================================

const FOCUS_AREAS_WEEK = [
  { area: 'Daily Tasks', value: 28, fullMark: 40 },
  { area: 'Shipping', value: 18, fullMark: 40 },
  { area: 'Learning', value: 14, fullMark: 40 },
  { area: 'Coding', value: 22, fullMark: 40 },
  { area: 'Fitness', value: 10, fullMark: 40 },
  { area: 'Projects', value: 12, fullMark: 40 },
];

const FOCUS_AREAS_MONTH = [
  { area: 'Daily Tasks', value: 120, fullMark: 150 },
  { area: 'Shipping', value: 95, fullMark: 150 },
  { area: 'Learning', value: 85, fullMark: 150 },
  { area: 'Coding', value: 110, fullMark: 150 },
  { area: 'Fitness', value: 45, fullMark: 150 },
  { area: 'Projects', value: 72, fullMark: 150 },
];

const FOCUS_AREAS_YEAR = [
  { area: 'Daily Tasks', value: 520, fullMark: 600 },
  { area: 'Shipping', value: 410, fullMark: 600 },
  { area: 'Learning', value: 320, fullMark: 600 },
  { area: 'Coding', value: 480, fullMark: 600 },
  { area: 'Fitness', value: 195, fullMark: 600 },
  { area: 'Projects', value: 280, fullMark: 600 },
];

const FOCUS_RANGE_CONFIG: Record<FocusTimeRange, { data: typeof FOCUS_AREAS_WEEK; maxValue: number }> = {
  'W': { data: FOCUS_AREAS_WEEK, maxValue: 40 },
  'M': { data: FOCUS_AREAS_MONTH, maxValue: 150 },
  'Y': { data: FOCUS_AREAS_YEAR, maxValue: 600 },
};

// =============================================================================
// HEATMAP DATA GENERATION
// =============================================================================

const generateHeatmapData = (): HeatmapDay[] => {
  const data: HeatmapDay[] = [];
  const today = new Date();
  
  for (let i = 364; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const recencyBonus = (365 - i) / 365;
    
    let outcome: 'win' | 'loss' | 'none';
    const rand = Math.random();
    
    if (isWeekend && rand < 0.4) {
      outcome = 'none';
    } else if (rand < 0.06 + (1 - recencyBonus) * 0.12) {
      outcome = 'loss';
    } else if (rand < 0.22) {
      outcome = 'none';
    } else {
      outcome = 'win';
    }
    
    data.push({ date: dateStr, outcome, wagers: [] });
  }
  
  return data;
};

const HEATMAP_DATA = generateHeatmapData();

const heatmapStats = {
  totalDays: HEATMAP_DATA.length,
  activeDays: HEATMAP_DATA.filter(d => d.outcome !== 'none').length,
  winDays: HEATMAP_DATA.filter(d => d.outcome === 'win').length,
  lossDays: HEATMAP_DATA.filter(d => d.outcome === 'loss').length,
  currentStreak: (() => {
    let streak = 0;
    for (let i = HEATMAP_DATA.length - 1; i >= 0; i--) {
      if (HEATMAP_DATA[i].outcome === 'win') streak++;
      else break;
    }
    return streak;
  })(),
  longestStreak: 127,
};

// =============================================================================
// POSITIONS DATA
// =============================================================================

// Active positions - open wagers that haven't settled yet
const ACTIVE_POSITIONS = [
  { id: 'POS-4825', asset: '$TDAY', desc: 'Review 2 PRs before EOD', stake: 75, deadline: '18:00', progress: 50 },
  { id: 'POS-4824', asset: '$SHIP', desc: 'Deploy auth microservice', stake: 200, deadline: '3d', progress: 80 },
  { id: 'POS-4823', asset: '$TDAY', desc: 'Write unit tests for utils', stake: 100, deadline: '17:30', progress: 25 },
  { id: 'POS-4822', asset: '$YEAR', desc: 'Morning run (Day 48)', stake: 15, deadline: '09:00', progress: 13, streakDays: 48, totalDays: 365 },
];

// Past positions - settled wagers with their results
const PAST_POSITIONS = [
  { id: 'TXN-4821', asset: '$TDAY', desc: 'Ship landing page v2', pnl: '+125', outcome: 'WON', time: '16:42' },
  { id: 'TXN-4820', asset: '$TDAY', desc: 'Complete 3 code reviews', pnl: '+50', outcome: 'WON', time: '14:15' },
  { id: 'TXN-4819', asset: '$TDAY', desc: 'Finish API documentation', pnl: '-150', outcome: 'LOST', time: '12:00' },
  { id: 'TXN-4818', asset: '$YEAR', desc: 'Morning meditation (Day 47)', pnl: '+12', outcome: 'COMPOUND', time: '07:30' },
];

// =============================================================================
// PROFILE VIEW COMPONENT
// =============================================================================

export default function ProfileView() {
  // Time range state for volatility chart
  const [selectedRange, setSelectedRange] = useState<TimeRange>('1D');
  // Time range state for focus areas radar chart
  const [focusRange, setFocusRange] = useState<FocusTimeRange>('W');
  
  // Real data state
  const [deepWorkStats, setDeepWorkStats] = useState<{
    totalHours: number;
    thisWeekHours: number;
    avgHoursPerDay: number;
    bestDayHours: number;
    totalBlocks: number;
  } | null>(null);
  const [sessionData, setSessionData] = useState<{
    sessions: Array<{
      id: string;
      title: string;
      completed_at: string;
      final_volatility: number;
      volatility_data: any;
      created_at: string;
    }>;
    activeSession: { id: string; title: string; created_at: string } | null;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch real data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stats, sessions] = await Promise.all([
          getDeepWorkStats(),
          getRecentSessionVolatility(7),
        ]);
        setDeepWorkStats(stats);
        setSessionData(sessions);
      } catch (err) {
        console.error('Failed to fetch profile data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  
  // Get the data for the selected time range
  // Use real session data if available, otherwise use mock data
  const selectedRangeData = (() => {
    if (selectedRange === '1D' && sessionData) {
      // For today, show the most recent session or active session
      const activeOrRecent = sessionData.activeSession 
        ? { 
            time: 'Now', 
            value: 100, // Will be updated with real-time data if needed
            isActive: true 
          }
        : sessionData.sessions[0] 
          ? {
              time: new Date(sessionData.sessions[0].completed_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
              value: sessionData.sessions[0].final_volatility || 100,
            }
          : null;
      
      if (activeOrRecent && sessionData.sessions[0]?.volatility_data) {
        // Use real volatility data from the most recent session
        const volatilityData = sessionData.sessions[0].volatility_data;
        return volatilityData.map((point: any, index: number) => ({
          time: point.time || `${index * 5}m`,
          value: point.value || 100,
        }));
      }
    }
    return TIME_RANGE_DATA[selectedRange].data;
  })();
  
  const startValue = EXECUTION_VOLATILITY_DATA[0].value;
  const currentValue = EXECUTION_VOLATILITY_DATA[EXECUTION_VOLATILITY_DATA.length - 1].value;
  const todayPnl = currentValue - startValue;
  const todayPnlPercent = ((todayPnl / startValue) * 100).toFixed(1);
  const isPositive = todayPnl >= 0;

  // Calculate stats based on selected range
  const rangeStartValue = selectedRangeData[0]?.value ?? 100;
  const rangeEndValue = selectedRangeData[selectedRangeData.length - 1]?.value ?? 100;
  const rangePnl = rangeEndValue - rangeStartValue;
  const isRangePositive = rangePnl >= 0;
  const rangeHigh = selectedRangeData.length > 0 
    ? Math.max(...selectedRangeData.map((d: { time: string; value: number }) => d.value))
    : 100;
  const rangeLow = selectedRangeData.length > 0
    ? Math.min(...selectedRangeData.map((d: { time: string; value: number }) => d.value))
    : 100;

  // Today's high/low - use real data if available
  const todayHigh = sessionData?.sessions[0]?.volatility_data
    ? Math.max(...sessionData.sessions[0].volatility_data.map((d: any) => d.value))
    : Math.max(...EXECUTION_VOLATILITY_DATA.map(d => d.value));
  const todayLow = sessionData?.sessions[0]?.volatility_data
    ? Math.min(...sessionData.sessions[0].volatility_data.map((d: any) => d.value))
    : Math.min(...EXECUTION_VOLATILITY_DATA.map(d => d.value));

  // Last day's stats (previous work session) - use second most recent session
  const lastDayHigh = sessionData?.sessions[1]?.volatility_data
    ? Math.max(...sessionData.sessions[1].volatility_data.map((d: any) => d.value))
    : Math.max(...LAST_DAY_TDAY_DATA.map(d => d.value));
  const lastDayLow = sessionData?.sessions[1]?.volatility_data
    ? Math.min(...sessionData.sessions[1].volatility_data.map((d: any) => d.value))
    : Math.min(...LAST_DAY_TDAY_DATA.map(d => d.value));
  const lastDayClose = sessionData?.sessions[1]?.final_volatility 
    || LAST_DAY_TDAY_DATA[LAST_DAY_TDAY_DATA.length - 1].value;
  
  // Check if there's an active session
  const hasActiveSession = !!sessionData?.activeSession;

  return (
    <div className="w-full min-h-screen bg-[#030014] relative overflow-hidden">
      {/* ============================================== */}
      {/* LAYERED BACKGROUND SYSTEM                      */}
      {/* ============================================== */}
      
      {/* Layer 1: Base Gradient - Deep space feel */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -20%, rgba(124, 58, 237, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 100% 100%, rgba(6, 182, 212, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse 50% 30% at 0% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
            linear-gradient(180deg, #030014 0%, #050018 50%, #030014 100%)
          `,
        }}
      />
      
      {/* Layer 2: Floating Gradient Orbs - Creates depth */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Top-right violet orb */}
        <div 
          className="absolute -top-[300px] -right-[150px] w-[700px] h-[700px] rounded-full animate-float-slow"
          style={{ 
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, rgba(124, 58, 237, 0.1) 40%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        {/* Bottom-left cyan orb */}
        <div 
          className="absolute -bottom-[200px] -left-[150px] w-[500px] h-[500px] rounded-full animate-float"
          style={{ 
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.2) 0%, rgba(6, 182, 212, 0.05) 50%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        {/* Center-left amber accent */}
        <div 
          className="absolute top-[40%] -left-[100px] w-[300px] h-[300px] rounded-full"
          style={{ 
            background: 'radial-gradient(circle, rgba(251, 191, 36, 0.08) 0%, transparent 60%)',
            filter: 'blur(50px)',
          }}
        />
        {/* Bottom-right emerald accent */}
        <div 
          className="absolute bottom-[20%] -right-[100px] w-[400px] h-[400px] rounded-full"
          style={{ 
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.06) 0%, transparent 60%)',
            filter: 'blur(50px)',
          }}
        />
      </div>
      
      {/* Layer 3: Subtle Grid Pattern - Terminal/trading feel */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
      
      {/* Layer 4: Film Grain Texture - Adds organic feel */}
      <div className="grain-overlay grain-animated" />
      
      {/* Layer 5: Vignette - Draws focus to center */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% 50%, transparent 0%, rgba(3, 0, 20, 0.4) 100%)',
        }}
      />

      <div className="relative container mx-auto px-8 py-10 max-w-[1400px]">
        
        {/* ============================================== */}
        {/* HERO SECTION - Profile Overview */}
        {/* ============================================== */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold text-white tracking-tight">Alex's Profile</h1>
                <div className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                  </span>
                  <span className="text-emerald-400 text-xs font-medium tracking-wide">LIVE</span>
                </div>
              </div>
              <p className="text-zinc-500 text-sm">Your accountability metrics and trading performance</p>
            </div>
          </div>

          {/* Main Stats Grid - Reliability Score Left, Stats Right */}
          <div className="flex gap-6">
            {/* Reliability Score - Featured Card (Fixed Width) */}
            <div 
              className="relative w-[280px] flex-shrink-0 rounded-3xl overflow-hidden border border-amber-500/20"
              style={{
                background: `linear-gradient(165deg, 
                  rgba(251, 191, 36, 0.12) 0%, 
                  rgba(251, 191, 36, 0.04) 40%,
                  rgba(10, 10, 15, 0.95) 100%
                )`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent" />
              <div className="relative p-8 h-full flex flex-col items-center text-center">
                {/* Header */}
                <div className="flex items-center gap-2 mb-8">
                  <Trophy size={16} className="text-amber-400" />
                  <span className="text-xs text-zinc-400 uppercase tracking-[0.2em]">Reliability</span>
                </div>
                
                {/* Big Score */}
                <div className="flex items-baseline mb-4">
                  <span 
                    className="text-[100px] font-black tracking-tighter font-mono text-amber-400 leading-none"
                    style={{ 
                      textShadow: '0 0 80px rgba(251, 191, 36, 0.6), 0 0 120px rgba(251, 191, 36, 0.3)' 
                    }}
                  >
                    96
                  </span>
                  <span className="text-4xl font-bold text-amber-400/70 mb-4">%</span>
                </div>
                
                {/* Tagline */}
                <div className="flex items-center gap-2 mb-4">
                  <Flame size={16} className="text-amber-400" />
                  <span className="text-xs font-bold tracking-[0.2em] text-amber-400 uppercase">
                    Gets Shit Done
                  </span>
                  <Flame size={16} className="text-amber-400" />
                </div>
                
                {/* Tier Badge */}
                <div 
                  className="px-5 py-2 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase mb-8"
                  style={{ 
                    background: 'rgba(251, 191, 36, 0.1)',
                    border: '1px solid rgba(251, 191, 36, 0.25)',
                    color: '#fbbf24',
                  }}
                >
                  Ascended Tier
                </div>

                {/* Stats Row */}
                <div className="w-full flex justify-between pt-6 border-t border-white/10 mt-auto">
                  <div className="text-center">
                    <span className="block text-lg font-bold text-white font-mono">127</span>
                    <span className="text-[9px] text-zinc-500 uppercase tracking-wider">Tasks</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-lg font-bold text-emerald-400 font-mono">72%</span>
                    <span className="text-[9px] text-zinc-500 uppercase tracking-wider">Focus</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-lg font-bold text-amber-400 font-mono">47d</span>
                    <span className="text-[9px] text-zinc-500 uppercase tracking-wider">Streak</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Side - Stats Grid */}
            <div className="flex-1 grid grid-cols-3 grid-rows-2 gap-4">

            {/* Today's P&L Card - Orange/Sunset Gradient */}
            <div className="relative rounded-2xl overflow-hidden border border-orange-500/20 h-[140px] transition-all duration-300 hover:scale-[1.02] hover:border-orange-400/40 hover:shadow-[0_0_30px_rgba(249,115,22,0.15)] cursor-pointer group" style={{ background: '#0c0c10' }}>
              <div className="absolute inset-0 overflow-hidden transition-opacity duration-300 group-hover:opacity-110">
                {/* Base warm atmosphere */}
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(251, 146, 60, 0.15) 0%, transparent 60%)' }} />
                {/* Main orange glow - wide and soft */}
                <div className="absolute -bottom-16 -left-16 -right-16 h-40 transition-all duration-300 group-hover:h-44" style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 100%, rgba(249, 115, 22, 0.95) 0%, rgba(234, 88, 12, 0.7) 25%, rgba(194, 65, 12, 0.4) 50%, transparent 75%)', filter: 'blur(30px)' }} />
                {/* Bright yellow/amber core - the "sun" */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-56 h-28 transition-all duration-300 group-hover:h-32" style={{ background: 'radial-gradient(ellipse 80% 70% at 50% 100%, rgba(253, 224, 71, 0.9) 0%, rgba(251, 191, 36, 0.7) 30%, rgba(245, 158, 11, 0.4) 50%, transparent 70%)', filter: 'blur(25px)' }} />
                {/* Deep red/crimson edges */}
                <div className="absolute -bottom-8 -left-8 w-32 h-32" style={{ background: 'radial-gradient(circle at 0% 100%, rgba(220, 38, 38, 0.8) 0%, rgba(153, 27, 27, 0.5) 40%, transparent 70%)', filter: 'blur(25px)' }} />
                <div className="absolute -bottom-8 -right-8 w-32 h-32" style={{ background: 'radial-gradient(circle at 100% 100%, rgba(220, 38, 38, 0.8) 0%, rgba(153, 27, 27, 0.5) 40%, transparent 70%)', filter: 'blur(25px)' }} />
                {/* Extra warmth layer */}
                <div className="absolute bottom-0 left-0 right-0 h-24" style={{ background: 'linear-gradient(to top, rgba(251, 146, 60, 0.3) 0%, transparent 100%)', filter: 'blur(10px)' }} />
              </div>
              <div className="relative z-10 p-5 h-full flex flex-col">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                      {isPositive ? <TrendingUp size={11} className="text-white/80" /> : <TrendingDown size={11} className="text-white/80" />}
                    </div>
                    <span className="text-[13px] text-white/90 font-medium">Today&apos;s P&L</span>
                  </div>
                  <span className={`text-[13px] font-semibold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>{isPositive ? '↑' : '↓'} {todayPnlPercent}%</span>
                </div>
                <div className="flex-1 flex flex-col justify-center mt-1">
                  <div className="text-[32px] font-bold font-mono tracking-tight text-white leading-none">{isPositive ? '+' : ''}${Math.abs(todayPnl * 10).toLocaleString()}</div>
                  <div className="text-[11px] text-white/50 mt-1.5">4 positions settled</div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-white/60 underline underline-offset-2 cursor-pointer hover:text-white/90 transition-colors">View Details</span>
                  <div className="w-7 h-7 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors"><ArrowRight size={12} className="text-white/70" /></div>
                </div>
              </div>
            </div>

            {/* Net Worth Card - Blue/Purple/Cyan Aurora */}
            <div className="relative rounded-2xl overflow-hidden border border-cyan-500/20 h-[140px] transition-all duration-300 hover:scale-[1.02] hover:border-cyan-400/40 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] cursor-pointer group" style={{ background: '#0c0c10' }}>
              <div className="absolute inset-0 overflow-hidden transition-opacity duration-300 group-hover:opacity-110">
                {/* Base cool atmosphere */}
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(59, 130, 246, 0.1) 0%, transparent 60%)' }} />
                {/* Cyan/teal glow - right side dominant */}
                <div className="absolute -bottom-16 -right-16 w-56 h-44 transition-all duration-300 group-hover:h-48" style={{ background: 'radial-gradient(ellipse 80% 70% at 80% 100%, rgba(34, 211, 238, 0.9) 0%, rgba(6, 182, 212, 0.7) 30%, rgba(59, 130, 246, 0.4) 55%, transparent 75%)', filter: 'blur(30px)' }} />
                {/* Purple/magenta glow - left side */}
                <div className="absolute -bottom-16 -left-16 w-52 h-40 transition-all duration-300 group-hover:h-44" style={{ background: 'radial-gradient(ellipse 80% 70% at 20% 100%, rgba(217, 70, 239, 0.85) 0%, rgba(168, 85, 247, 0.6) 35%, rgba(139, 92, 246, 0.3) 55%, transparent 75%)', filter: 'blur(30px)' }} />
                {/* Blue center blend */}
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-40 h-32 transition-all duration-300 group-hover:h-36" style={{ background: 'radial-gradient(ellipse 90% 70% at 50% 100%, rgba(99, 102, 241, 0.7) 0%, rgba(79, 70, 229, 0.4) 40%, transparent 70%)', filter: 'blur(25px)' }} />
                {/* Hot pink accent */}
                <div className="absolute -bottom-8 left-1/3 w-28 h-24" style={{ background: 'radial-gradient(circle at 50% 100%, rgba(236, 72, 153, 0.6) 0%, transparent 60%)', filter: 'blur(20px)' }} />
                {/* Extra depth layer */}
                <div className="absolute bottom-0 left-0 right-0 h-20" style={{ background: 'linear-gradient(to top, rgba(139, 92, 246, 0.2) 0%, transparent 100%)', filter: 'blur(8px)' }} />
              </div>
              <div className="relative z-10 p-5 h-full flex flex-col">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                      <Wallet size={11} className="text-white/80" />
                    </div>
                    <span className="text-[13px] text-white/90 font-medium">Net Worth</span>
                  </div>
                  <span className="text-[13px] font-semibold text-emerald-400">+18.7%</span>
                </div>
                <div className="flex-1 flex flex-col justify-center mt-1">
                  <div className="text-[32px] font-bold font-mono tracking-tight text-white leading-none">$9,100</div>
                  <div className="text-[11px] text-white/50 mt-1.5">+18.7% all time</div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-white/60 underline underline-offset-2 cursor-pointer hover:text-white/90 transition-colors">View Details</span>
                  <div className="w-7 h-7 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors"><ArrowRight size={12} className="text-white/70" /></div>
                </div>
              </div>
            </div>

            {/* Open Positions Card - Bold Red Glow */}
            <div className="relative rounded-2xl overflow-hidden border border-rose-500/20 h-[140px] transition-all duration-300 hover:scale-[1.02] hover:border-rose-400/40 hover:shadow-[0_0_30px_rgba(244,63,94,0.15)] cursor-pointer group" style={{ background: '#0c0c10' }}>
              <div className="absolute inset-0 overflow-hidden transition-opacity duration-300 group-hover:opacity-110">
                {/* Base warm atmosphere */}
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(220, 38, 38, 0.12) 0%, transparent 60%)' }} />
                {/* Main red glow - wide and bold from center */}
                <div className="absolute -bottom-16 -left-16 -right-16 h-40 transition-all duration-300 group-hover:h-44" style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 100%, rgba(239, 68, 68, 0.85) 0%, rgba(220, 38, 38, 0.6) 25%, rgba(185, 28, 28, 0.35) 50%, transparent 75%)', filter: 'blur(30px)' }} />
                {/* Bright rose/pink core - the central halo */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-56 h-28 transition-all duration-300 group-hover:h-32" style={{ background: 'radial-gradient(ellipse 80% 70% at 50% 100%, rgba(251, 113, 133, 0.8) 0%, rgba(244, 63, 94, 0.6) 30%, rgba(225, 29, 72, 0.35) 50%, transparent 70%)', filter: 'blur(25px)' }} />
                {/* Deep crimson edges */}
                <div className="absolute -bottom-8 -left-8 w-32 h-32" style={{ background: 'radial-gradient(circle at 0% 100%, rgba(153, 27, 27, 0.7) 0%, rgba(127, 29, 29, 0.4) 40%, transparent 70%)', filter: 'blur(25px)' }} />
                <div className="absolute -bottom-8 -right-8 w-32 h-32" style={{ background: 'radial-gradient(circle at 100% 100%, rgba(153, 27, 27, 0.7) 0%, rgba(127, 29, 29, 0.4) 40%, transparent 70%)', filter: 'blur(25px)' }} />
                {/* Extra glow layer */}
                <div className="absolute bottom-0 left-0 right-0 h-24" style={{ background: 'linear-gradient(to top, rgba(244, 63, 94, 0.25) 0%, transparent 100%)', filter: 'blur(10px)' }} />
              </div>
              <div className="relative z-10 p-5 h-full flex flex-col">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                      <Activity size={11} className="text-white/80" />
                    </div>
                    <span className="text-[13px] text-white/90 font-medium">Open Positions</span>
                  </div>
                  <span className="text-[13px] font-semibold text-rose-400">-12.4%</span>
                </div>
                <div className="flex-1 flex flex-col justify-center mt-1">
                  <div className="text-[32px] font-bold font-mono tracking-tight text-white leading-none">12</div>
                  <div className="text-[11px] text-white/50 mt-1.5">3 expiring soon</div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-white/60 underline underline-offset-2 cursor-pointer hover:text-white/90 transition-colors">View Details</span>
                  <div className="w-7 h-7 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors"><ArrowRight size={12} className="text-white/70" /></div>
                </div>
              </div>
            </div>

              {/* $TDAY Index Mini Chart - spans all 3 columns */}
              <div 
                className="relative col-span-3 rounded-2xl overflow-hidden border border-white/[0.08] hover:border-emerald-500/20 transition-all"
                style={{ background: 'rgba(10, 10, 15, 0.8)' }}
              >
                <div className="p-4 pb-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-zinc-400">$TDAY Index</span>
                      <span className={`text-lg font-mono font-bold ${isRangePositive ? 'text-emerald-400' : 'text-red-400'}`}>
                        {typeof rangeEndValue === 'number' ? rangeEndValue.toFixed(0) : rangeEndValue}
                      </span>
                      {hasActiveSession && (
                        <span className="relative flex h-2 w-2" title="Active deep work session">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                        </span>
                      )}
                      {/* Time Range Toggle - Tiny Pills */}
                      <div className="flex items-center gap-0.5 bg-white/[0.04] rounded p-0.5 ml-1">
                        {(['1D', '1W', '1M', '1Y'] as TimeRange[]).map((range) => (
                          <button
                            key={range}
                            onClick={() => setSelectedRange(range)}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
                              selectedRange === range
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'text-zinc-600 hover:text-zinc-400'
                            }`}
                          >
                            {range}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-xs font-mono">
                      {/* Range stats */}
                      <div className="flex items-center gap-3 text-zinc-500">
                        <span>Open: <span className="text-zinc-300">{rangeStartValue}</span></span>
                        <span>H: <span className="text-zinc-300">{rangeHigh}</span></span>
                        <span>L: <span className="text-zinc-300">{rangeLow}</span></span>
                      </div>
                      {/* Divider */}
                      <div className="h-3 w-px bg-zinc-700" />
                      {/* Last day's stats */}
                      <div className="flex items-center gap-3 text-zinc-600">
                        <span className="text-zinc-500">Prev Day</span>
                        <span>H: <span className="text-zinc-400">{lastDayHigh}</span></span>
                        <span>L: <span className="text-zinc-400">{lastDayLow}</span></span>
                        <span>C: <span className="text-zinc-400">{lastDayClose}</span></span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="h-[100px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={selectedRangeData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="miniChartGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={isRangePositive ? '#10b981' : '#ef4444'} stopOpacity={0.4}/>
                          <stop offset="50%" stopColor={isRangePositive ? '#10b981' : '#ef4444'} stopOpacity={0.15}/>
                          <stop offset="100%" stopColor={isRangePositive ? '#10b981' : '#ef4444'} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="time" hide />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (!active || !payload || !payload.length) return null;
                          const data = payload[0].payload;
                          return (
                            <div style={{
                              background: 'rgba(10, 10, 15, 0.98)',
                              border: '1px solid rgba(16, 185, 129, 0.4)',
                              borderRadius: '8px',
                              padding: '8px 12px',
                              boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                            }}>
                              <div style={{ color: '#a1a1aa', fontSize: '11px', marginBottom: '4px', fontFamily: 'monospace' }}>
                                {data.time}
                              </div>
                              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                                <span style={{ color: '#10b981', fontFamily: 'monospace', fontSize: '18px', fontWeight: 'bold' }}>
                                  {data.value}
                                </span>
                                <span style={{ color: '#52525b', fontSize: '10px' }}>index</span>
                              </div>
                            </div>
                          );
                        }}
                        cursor={{
                          stroke: 'rgba(16, 185, 129, 0.4)',
                          strokeWidth: 1,
                          strokeDasharray: '4 4',
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke={isRangePositive ? '#10b981' : '#ef4444'}
                        strokeWidth={2}
                        fill="url(#miniChartGradient)"
                        animationDuration={500}
                        dot={false}
                        activeDot={{
                          r: 5,
                          fill: isRangePositive ? '#10b981' : '#ef4444',
                          stroke: '#0f172a',
                          strokeWidth: 2,
                        }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================== */}
        {/* ASSET CLASSES - 3 Premium Cards */}
        {/* ============================================== */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles size={18} className="text-violet-400" />
            <h2 className="text-xl font-semibold text-white">Asset Classes</h2>
            <AssetClassInfo />
          </div>
          
          <div className="grid grid-cols-3 gap-6">
            {/* $TDAY Card */}
            <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0a0a0f] group hover:border-emerald-500/30 transition-all duration-500">
              <div 
                className="absolute bottom-0 left-0 right-0 h-32 opacity-80 group-hover:opacity-100 transition-opacity"
                style={{ background: 'linear-gradient(to top, rgba(16, 185, 129, 0.4) 0%, transparent 100%)' }}
              />
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                      <TrendingUp size={16} className="text-emerald-400" />
                    </div>
                    <span className="text-sm text-zinc-400">$TDAY</span>
                  </div>
                  <span className="text-sm font-mono text-emerald-400">+82%</span>
                </div>
                <div className="text-4xl font-bold text-white font-mono mb-2">$3,800</div>
                <div className="text-xs text-zinc-500 mb-6">Daily execution index</div>
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <span className="text-xs text-zinc-500">4 tasks today</span>
                  <ArrowRight size={16} className="text-zinc-600 group-hover:text-emerald-400 transition-colors" />
                </div>
              </div>
            </div>

            {/* $SHIP Card */}
            <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0a0a0f] group hover:border-blue-500/30 transition-all duration-500">
              <div 
                className="absolute bottom-0 left-0 right-0 h-32 opacity-80 group-hover:opacity-100 transition-opacity"
                style={{ background: 'linear-gradient(to top, rgba(59, 130, 246, 0.4) 0%, transparent 100%)' }}
              />
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <Target size={16} className="text-blue-400" />
                    </div>
                    <span className="text-sm text-zinc-400">$SHIP</span>
                  </div>
                  <span className="text-sm font-mono text-emerald-400">+80%</span>
                </div>
                <div className="text-4xl font-bold text-white font-mono mb-2">$3,200</div>
                <div className="text-xs text-zinc-500 mb-6">Project futures</div>
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <span className="text-xs text-zinc-500">4 active · 1 expiring <span className="text-amber-400">3d</span></span>
                  <ArrowRight size={16} className="text-zinc-600 group-hover:text-blue-400 transition-colors" />
                </div>
              </div>
            </div>

            {/* $YEAR Card */}
            <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0a0a0f] group hover:border-amber-500/30 transition-all duration-500">
              <div 
                className="absolute bottom-0 left-0 right-0 h-32 opacity-80 group-hover:opacity-100 transition-opacity"
                style={{ background: 'linear-gradient(to top, rgba(251, 191, 36, 0.4) 0%, transparent 100%)' }}
              />
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                      <Flame size={16} className="text-amber-400" />
                    </div>
                    <span className="text-sm text-zinc-400">$YEAR</span>
                  </div>
                  <span className="text-sm font-mono text-amber-400">+2.4% APY</span>
                </div>
                <div className="text-4xl font-bold text-white font-mono mb-2">$2,100</div>
                <div className="text-xs text-zinc-500 mb-6">Habit compound bonds</div>
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <span className="text-xs text-zinc-500">2 habits · <span className="text-amber-400">47d</span> streak</span>
                  <ArrowRight size={16} className="text-zinc-600 group-hover:text-amber-400 transition-colors" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================== */}
        {/* PROOF OF WORK + DEEP WORK + FOCUS AREAS ROW */}
        {/* ============================================== */}
        <div className="mb-12 flex gap-4">
          {/* LEFT: Proof of Work Heatmap Card */}
          <div className="relative rounded-2xl border border-emerald-400/30 bg-gradient-to-br from-[#08120f] via-[#0b0f1a] to-[#06060c] p-5 overflow-hidden shadow-[0_0_55px_-16px_rgba(16,185,129,0.35)]">
            <div className="pointer-events-none absolute inset-0 rounded-[18px]">
              <div className="absolute bottom-[-14px] right-[-6px] h-32 w-48 bg-emerald-500/20 blur-[85px]" />
              <div className="absolute bottom-4 right-6 h-16 w-24 bg-emerald-400/10 blur-[55px]" />
            </div>
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                <GitCommit size={16} className="text-emerald-300" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Proof of Work</h2>
                <span className="text-[10px] text-zinc-500">365 days of execution history</span>
              </div>
            </div>
            
            {/* Heatmap Grid */}
            <div className="overflow-x-auto">
              <ContributionHeatmap data={HEATMAP_DATA} />
            </div>
            
            {/* Compact Legend Footer */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/[0.05]">
              <div className="flex items-center gap-3 text-[10px] text-zinc-500">
                <span>Less</span>
                <div className="flex items-center gap-0.5">
                  <div className="w-2.5 h-2.5 rounded-sm bg-zinc-800/40" />
                  <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500/30" />
                  <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500/60" />
                  <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
                </div>
                <span>More (Profit)</span>
                <div className="w-px h-3 bg-white/10 mx-1" />
                <div className="w-2.5 h-2.5 rounded-sm bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.6)]" />
                <span>Loss</span>
              </div>
              {/* Profit/Loss Day Counts */}
              <div className="flex items-center gap-3 text-[10px]">
                <span className="text-emerald-400 font-mono">{heatmapStats.winDays}</span>
                <span className="text-zinc-600">profit</span>
                <span className="text-rose-400 font-mono">{heatmapStats.lossDays}</span>
                <span className="text-zinc-600">loss</span>
              </div>
            </div>
          </div>
          
          {/* MIDDLE: Deep Work Widget */}
          <div className="w-[200px] flex-shrink-0 rounded-2xl border border-violet-500/20 p-5 flex flex-col"
            style={{
              background: 'linear-gradient(165deg, rgba(139, 92, 246, 0.08) 0%, rgba(10, 10, 15, 0.95) 100%)',
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
                <Clock size={16} className="text-violet-400" />
              </div>
              <span className="text-sm font-semibold text-white">Deep Work</span>
            </div>
            
            <div className="flex-1 flex flex-col justify-center">
              <div className="text-4xl font-bold font-mono text-violet-400 mb-1">1,247</div>
              <div className="text-xs text-zinc-500 mb-4">total hours</div>
              
              <div className="space-y-3 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-zinc-500 uppercase">Avg/Day</span>
                  <span className="text-sm font-mono text-white">4.3 hrs</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-zinc-500 uppercase">This Week</span>
                  <span className="text-sm font-mono text-emerald-400">+28 hrs</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-zinc-500 uppercase">Best Day</span>
                  <span className="text-sm font-mono text-amber-400">8.2 hrs</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* RIGHT: Focus Areas Radar Chart */}
          <div className="relative flex-1 rounded-2xl border border-lime-300/30 bg-gradient-to-br from-[#0f0f08] via-[#0b0f1a] to-[#06060c] p-5 shadow-[0_0_55px_-16px_rgba(190,242,100,0.28)] overflow-hidden">
            <div className="pointer-events-none absolute inset-0 rounded-[18px]">
              <div className="absolute bottom-[-12px] right-[-10px] h-32 w-52 bg-lime-300/22 blur-[85px]" />
              <div className="absolute bottom-5 right-7 h-18 w-28 bg-lime-200/16 blur-[55px]" />
              <div className="absolute bottom-2 right-10 h-10 w-20 bg-emerald-200/12 blur-[45px]" />
            </div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-lime-400/15 flex items-center justify-center">
                  <Target size={16} className="text-lime-200" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-white">Focus Areas</h2>
                  <span className="text-[9px] text-zinc-500 truncate">Time allocation</span>
                </div>
              </div>
              {/* Tiny Time Range Toggle */}
              <div className="flex items-center gap-0.5 p-0.5 rounded bg-white/[0.03] border border-white/[0.06]">
                {(['W', 'M', 'Y'] as FocusTimeRange[]).map((range) => (
                  <button
                    key={range}
                    onClick={() => setFocusRange(range)}
                    className={`px-1.5 py-0.5 text-[9px] font-medium rounded transition-all ${
                      focusRange === range
                        ? 'bg-lime-500/20 text-lime-400'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={FOCUS_RANGE_CONFIG[focusRange].data}>
                  <PolarGrid 
                    stroke="rgba(255,255,255,0.1)" 
                    gridType="polygon"
                  />
                  <PolarAngleAxis 
                    dataKey="area" 
                    tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }}
                    stroke="rgba(255,255,255,0.1)"
                  />
                  <PolarRadiusAxis 
                    angle={30} 
                    domain={[0, FOCUS_RANGE_CONFIG[focusRange].maxValue]} 
                    tick={false}
                    stroke="rgba(255,255,255,0.05)"
                    tickCount={4}
                  />
                  <Radar
                    name="Hours"
                    dataKey="value"
                    stroke="#a3e635"
                    fill="#a3e635"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'rgba(10, 10, 15, 0.95)', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                    formatter={(value: number) => [`${value} hrs`, 'Time Spent']}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ============================================== */}
        {/* BOTTOM GRID - Charts + Activity */}
        {/* ============================================== */}
        <div className="grid grid-cols-3 gap-6">
          {/* Portfolio Growth Chart */}
          <div className="col-span-2 rounded-2xl border border-white/[0.08] bg-[#0a0a0f] p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <BarChart3 size={18} className="text-blue-400" />
                <h3 className="text-lg font-semibold text-white">Portfolio Growth</h3>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-zinc-400">$TDAY</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400" />
                  <span className="text-zinc-400">$SHIP</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="text-zinc-400">$YEAR</span>
                </div>
              </div>
            </div>
            
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ASSET_ALLOCATION_DATA}>
                  <defs>
                    <linearGradient id="tdayGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="shipGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="yearGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#fbbf24" stopOpacity={0.3}/>
                      <stop offset="100%" stopColor="#fbbf24" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="week" stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} />
                  <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'rgba(10, 10, 15, 0.95)', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                    formatter={(value: number, name: string) => {
                      const labels: Record<string, string> = { tday: '$TDAY', ship: '$SHIP', year: '$YEAR' };
                      return [`$${value.toLocaleString()}`, labels[name] || name];
                    }}
                  />
                  <Area type="monotone" dataKey="tday" stackId="1" stroke="#10b981" strokeWidth={2} fill="url(#tdayGrad)" />
                  <Area type="monotone" dataKey="ship" stackId="1" stroke="#3b82f6" strokeWidth={2} fill="url(#shipGrad)" />
                  <Area type="monotone" dataKey="year" stackId="1" stroke="#fbbf24" strokeWidth={2} fill="url(#yearGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Positions - Tabbed View */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#0a0a0f] p-6">
            <Tabs defaultValue="active" className="w-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Positions</h3>
                <span className="text-xs text-zinc-500">
                  {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
              <TabsList className="w-full bg-white/[0.03] border border-white/[0.06] h-9 mb-4 grid grid-cols-2 p-1 rounded-lg">
                <TabsTrigger 
                  value="active" 
                  className="text-xs cursor-pointer rounded-md transition-all data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-400 data-[state=active]:shadow-sm text-zinc-500 hover:text-zinc-300"
                >
                  <Zap size={12} className="mr-1.5" />
                  Active
                </TabsTrigger>
                <TabsTrigger 
                  value="past" 
                  className="text-xs cursor-pointer rounded-md transition-all data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-400 data-[state=active]:shadow-sm text-zinc-500 hover:text-zinc-300"
                >
                  <Clock size={12} className="mr-1.5" />
                  Past
                </TabsTrigger>
              </TabsList>
              
              {/* Active Positions Tab */}
              <TabsContent value="active" className="mt-0 max-h-[280px] overflow-y-auto scrollbar-hide">
                <div className="space-y-1">
                  {ACTIVE_POSITIONS.map((pos) => (
                    <div key={pos.id} className="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-white/[0.02] transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-mono font-bold w-12 flex-shrink-0 ${
                            pos.asset === '$TDAY' ? 'text-emerald-400' :
                            pos.asset === '$SHIP' ? 'text-blue-400' : 'text-amber-400'
                          }`}>
                            {pos.asset}
                          </span>
                          <p className="text-xs text-zinc-300 truncate flex-1">{pos.desc}</p>
                          <span className="text-[10px] text-zinc-500 flex items-center gap-1 flex-shrink-0">
                            <Clock size={9} />
                            {pos.deadline}
                          </span>
                        </div>
                        {/* Progress bar */}
                        <div className="mt-1 flex items-center gap-2">
                          <div className="h-1 bg-white/[0.05] rounded-full overflow-hidden flex-1">
                            <div 
                              className={`h-full rounded-full transition-all ${
                                pos.asset === '$TDAY' ? 'bg-emerald-400' :
                                pos.asset === '$SHIP' ? 'bg-blue-400' : 'bg-amber-400'
                              }`}
                              style={{ width: `${pos.progress}%` }}
                            />
                          </div>
                          {/* Show streak info for $YEAR items */}
                          {'streakDays' in pos && pos.streakDays && (
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <Flame size={9} className="text-amber-400" />
                              <span className="text-[10px] text-amber-400/80 font-mono">
                                {pos.streakDays}/{pos.totalDays}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center ml-3">
                        <span className="text-xs font-mono font-bold text-white">
                          ${pos.stake}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* Past Positions Tab */}
              <TabsContent value="past" className="mt-0 max-h-[280px] overflow-y-auto scrollbar-hide">
                <div className="space-y-0.5">
                  {PAST_POSITIONS.map((txn) => (
                    <div key={txn.id} className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-white/[0.02] transition-colors">
                      {/* Outcome indicator dot */}
                      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                        txn.outcome === 'WON' ? 'bg-emerald-400' :
                        txn.outcome === 'LOST' ? 'bg-rose-400' : 'bg-amber-400'
                      }`} />
                      {/* Asset badge */}
                      <span className={`text-[10px] font-mono font-bold w-12 flex-shrink-0 ${
                        txn.asset === '$TDAY' ? 'text-emerald-400' :
                        txn.asset === '$SHIP' ? 'text-blue-400' : 'text-amber-400'
                      }`}>
                        {txn.asset}
                      </span>
                      {/* Description - truncated */}
                      <span className="text-xs text-zinc-400 truncate flex-1 min-w-0">{txn.desc}</span>
                      {/* Time */}
                      <span className="text-[10px] text-zinc-600 flex-shrink-0">{txn.time}</span>
                      {/* PnL */}
                      <span className={`text-xs font-mono font-bold w-14 text-right flex-shrink-0 ${
                        txn.pnl.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {txn.pnl}
                      </span>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            <button className="w-full mt-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-zinc-400 hover:text-white hover:bg-white/10 transition-all">
              View Full Ledger →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
