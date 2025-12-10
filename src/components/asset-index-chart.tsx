'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { format, subDays, addDays } from 'date-fns';

type Timeframe = '1W' | '1M';

interface AssetIndexChartProps {
  ticker: string;
  label: string;
  color: 'emerald' | 'blue' | 'amber' | 'purple';
  openCount: number;
  winsCount: number;
  onClick?: () => void;
}

// Generate realistic mock data for the mini chart
function generateMiniChartData(timeframe: Timeframe, seed: number = 1) {
  const days = timeframe === '1W' ? 7 : 30;
  const points = timeframe === '1W' ? 14 : 30; // More granular for week
  const data = [];
  let value = 100 + (seed * 10); // Starting value varies by ticker
  
  for (let i = 0; i < points; i++) {
    const date = subDays(new Date(), days - Math.floor((i / points) * days));
    
    // Create realistic volatility
    const volatility = timeframe === '1W' ? 0.03 : 0.05;
    const trend = 0.002; // Slight upward bias
    const noise = (Math.sin(i * seed) + Math.random() - 0.5) * volatility;
    value = value * (1 + trend + noise);
    
    data.push({
      date: format(date, timeframe === '1W' ? 'EEE' : 'MMM d'),
      fullDate: format(date, 'MMM d, yyyy'),
      value: Math.round(value * 100) / 100,
      index: i,
    });
  }
  
  return data;
}

// Custom tooltip that appears on hover
const CustomTooltip = ({ active, payload, label, color }: any) => {
  if (!active || !payload || !payload.length) return null;
  
  const colorClasses: Record<string, string> = {
    emerald: 'text-emerald-400 border-emerald-500/30',
    blue: 'text-blue-400 border-blue-500/30',
    amber: 'text-amber-400 border-amber-500/30',
    purple: 'text-purple-400 border-purple-500/30',
  };
  
  return (
    <div className={`bg-slate-950/95 backdrop-blur-sm border ${colorClasses[color]} rounded-lg px-3 py-2 shadow-xl`}>
      <p className="text-[10px] text-zinc-500 mb-1">{payload[0]?.payload?.fullDate}</p>
      <p className={`text-sm font-mono font-bold ${colorClasses[color].split(' ')[0]}`}>
        ${payload[0]?.value?.toFixed(2)}
      </p>
    </div>
  );
};

// Custom dot that appears on hover
const CustomActiveDot = ({ cx, cy, color }: any) => {
  const colorMap: Record<string, string> = {
    emerald: '#10b981',
    blue: '#3b82f6',
    amber: '#f59e0b',
    purple: '#a855f7',
  };
  
  return (
    <g>
      {/* Outer glow */}
      <circle cx={cx} cy={cy} r={8} fill={colorMap[color]} opacity={0.2} />
      {/* Inner dot */}
      <circle cx={cx} cy={cy} r={4} fill={colorMap[color]} stroke="#0f172a" strokeWidth={2} />
    </g>
  );
};

export default function AssetIndexChart({
  ticker,
  label,
  color,
  openCount,
  winsCount,
  onClick,
}: AssetIndexChartProps) {
  const [timeframe, setTimeframe] = useState<Timeframe>('1W');
  const [isHovering, setIsHovering] = useState(false);
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  
  // Generate data based on ticker (different seed for each)
  const seed = ticker === '$TDAY' ? 1 : ticker === '$SHIP' ? 2 : 3;
  const data = useMemo(() => generateMiniChartData(timeframe, seed), [timeframe, seed]);
  
  // Calculate performance metrics
  const startValue = data[0]?.value || 100;
  const endValue = data[data.length - 1]?.value || 100;
  const change = endValue - startValue;
  const changePercent = ((change / startValue) * 100).toFixed(2);
  const isPositive = change >= 0;
  
  // Color configurations
  const colorConfig: Record<string, {
    gradient: string;
    stroke: string;
    text: string;
    bg: string;
    border: string;
    glow: string;
  }> = {
    emerald: {
      gradient: 'colorEmerald',
      stroke: '#10b981',
      text: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      glow: 'shadow-[0_0_20px_rgba(16,185,129,0.2)]',
    },
    blue: {
      gradient: 'colorBlue',
      stroke: '#3b82f6',
      text: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      glow: 'shadow-[0_0_20px_rgba(59,130,246,0.2)]',
    },
    amber: {
      gradient: 'colorAmber',
      stroke: '#f59e0b',
      text: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      glow: 'shadow-[0_0_20px_rgba(245,158,11,0.2)]',
    },
    purple: {
      gradient: 'colorPurple',
      stroke: '#a855f7',
      text: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/30',
      glow: 'shadow-[0_0_20px_rgba(168,85,247,0.2)]',
    },
  };
  
  const config = colorConfig[color];
  const displayValue = hoverValue ?? endValue;
  
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setHoverValue(null);
      }}
      className={`group relative p-4 rounded-xl bg-slate-950/50 border border-white/[0.06] 
        hover:border-white/[0.12] hover:${config.glow} transition-all duration-300 cursor-pointer
        ${isHovering ? config.glow : ''}`}
    >
      {/* Header Row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`font-mono text-sm font-bold ${config.text}`}>
            {ticker}
          </span>
          <span className="text-[10px] text-zinc-500 hidden group-hover:inline transition-opacity">
            {label}
          </span>
        </div>
        
        {/* Timeframe Toggle - Tiny Pills */}
        <div className="flex items-center gap-0.5 bg-white/[0.03] rounded-md p-0.5">
          {(['1W', '1M'] as Timeframe[]).map((tf) => (
            <button
              key={tf}
              onClick={(e) => {
                e.stopPropagation();
                setTimeframe(tf);
              }}
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all duration-200 ${
                timeframe === tf
                  ? `${config.bg} ${config.text}`
                  : 'text-zinc-600 hover:text-zinc-400'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>
      
      {/* Value & Change */}
      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-2xl font-bold text-white font-mono">
          ${displayValue.toFixed(2)}
        </span>
        <div className={`flex items-center gap-0.5 text-xs font-mono ${
          isPositive ? 'text-emerald-400' : 'text-red-400'
        }`}>
          {isPositive ? (
            <TrendingUp size={12} />
          ) : (
            <TrendingDown size={12} />
          )}
          <span>{isPositive ? '+' : ''}{changePercent}%</span>
        </div>
      </div>
      
      {/* Mini Chart */}
      <div className="h-[60px] -mx-2" style={{ minWidth: 100 }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={100}>
          <AreaChart
            data={data}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            onMouseMove={(e: any) => {
              if (e.activePayload && e.activePayload[0]) {
                setHoverValue(e.activePayload[0].value);
              }
            }}
            onMouseLeave={() => setHoverValue(null)}
          >
            <defs>
              <linearGradient id={`${config.gradient}-${ticker}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={config.stroke} stopOpacity={0.3} />
                <stop offset="100%" stopColor={config.stroke} stopOpacity={0} />
              </linearGradient>
            </defs>
            
            <XAxis dataKey="date" hide />
            <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
            
            <Tooltip
              content={<CustomTooltip color={color} />}
              cursor={{
                stroke: config.stroke,
                strokeWidth: 1,
                strokeDasharray: '3 3',
                strokeOpacity: 0.5,
              }}
            />
            
            <Area
              type="monotone"
              dataKey="value"
              stroke={config.stroke}
              strokeWidth={2}
              fill={`url(#${config.gradient}-${ticker})`}
              animationDuration={500}
              activeDot={(props: any) => <CustomActiveDot {...props} color={color} />}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      {/* Footer Stats */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.04]">
        <div className="flex items-center gap-3">
          <div className="text-center">
            <div className="text-lg font-bold text-white">{openCount}</div>
            <div className="text-[9px] text-zinc-500 uppercase tracking-wide">Open</div>
          </div>
          <div className="w-px h-6 bg-white/[0.06]" />
          <div className="text-center">
            <div className="text-lg font-bold text-emerald-400">{winsCount}</div>
            <div className="text-[9px] text-zinc-500 uppercase tracking-wide">Won</div>
          </div>
        </div>
        
        {/* Hover indicator */}
        <div className={`text-[10px] ${config.text} opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1`}>
          <span>View All</span>
          <span>→</span>
        </div>
      </div>
    </div>
  );
}
