'use client';

import { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { format, subDays } from 'date-fns';

type Timeframe = '1W' | '1M';

interface TdayIndexChartProps {
  baseValue?: number;
}

// Generate realistic intraday-style data
function generateChartData(timeframe: Timeframe, baseValue: number = 100) {
  const points = timeframe === '1W' ? 50 : 120;
  const data = [];
  let value = baseValue;
  let high = baseValue;
  let low = baseValue;
  const open = baseValue;
  
  for (let i = 0; i < points; i++) {
    // Create smooth volatility with occasional spikes
    const trend = 0.001;
    const volatility = Math.sin(i * 0.15) * 0.02 + (Math.random() - 0.48) * 0.015;
    value = value * (1 + trend + volatility);
    value = Math.max(value, baseValue * 0.85); // Floor at 85% of base
    
    high = Math.max(high, value);
    low = Math.min(low, value);
    
    data.push({
      index: i,
      value: Math.round(value * 100) / 100,
    });
  }
  
  return {
    data,
    stats: {
      open: Math.round(open),
      high: Math.round(high),
      low: Math.round(low),
      current: Math.round(value),
    },
    prevDay: {
      high: Math.round(baseValue * 1.67),
      low: Math.round(baseValue * 0.92),
      close: Math.round(baseValue * 1.67),
    }
  };
}

// Minimal custom tooltip
const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload || !payload.length) return null;
  
  return (
    <div className="bg-slate-950/95 border border-emerald-500/30 rounded px-2 py-1">
      <span className="text-emerald-400 font-mono text-sm font-bold">
        {payload[0]?.value?.toFixed(0)}
      </span>
    </div>
  );
};

export default function TdayIndexChart({ baseValue = 100 }: TdayIndexChartProps) {
  const [timeframe, setTimeframe] = useState<Timeframe>('1W');
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  
  const { data, stats, prevDay } = useMemo(
    () => generateChartData(timeframe, baseValue),
    [timeframe, baseValue]
  );
  
  const displayValue = hoverValue ?? stats.current;
  
  return (
    <div className="relative rounded-2xl border border-white/[0.08] bg-slate-950/80 overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-4 pb-3 flex items-center justify-between">
        {/* Left: Ticker & Value */}
        <div className="flex items-center gap-3">
          <span className="text-zinc-400 font-medium text-sm">$TDAY Index</span>
          <span className="text-emerald-400 font-mono text-lg font-bold">
            {displayValue}
          </span>
          
          {/* Timeframe Toggle - Tiny Pills */}
          <div className="flex items-center gap-0.5 bg-white/[0.04] rounded p-0.5 ml-2">
            {(['1W', '1M'] as Timeframe[]).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
                  timeframe === tf
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'text-zinc-600 hover:text-zinc-400'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
        
        {/* Right: OHLC Stats */}
        <div className="flex items-center gap-1 text-xs font-mono">
          <span className="text-zinc-500">Open:</span>
          <span className="text-zinc-300">{stats.open}</span>
          
          <span className="text-zinc-500 ml-2">H:</span>
          <span className="text-zinc-300">{stats.high}</span>
          
          <span className="text-zinc-500 ml-2">L:</span>
          <span className="text-zinc-300">{stats.low}</span>
          
          <span className="text-zinc-600 mx-3">|</span>
          
          <span className="text-zinc-500">Prev Day</span>
          <span className="text-zinc-500 ml-2">H:</span>
          <span className="text-zinc-300">{prevDay.high}</span>
          
          <span className="text-zinc-500 ml-2">L:</span>
          <span className="text-zinc-300">{prevDay.low}</span>
          
          <span className="text-zinc-500 ml-2">C:</span>
          <span className="text-zinc-300">{prevDay.close}</span>
        </div>
      </div>
      
      {/* Chart */}
      <div className="h-[180px] px-2" style={{ minWidth: 200 }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={200}>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
            onMouseMove={(e: any) => {
              if (e.activePayload && e.activePayload[0]) {
                setHoverValue(Math.round(e.activePayload[0].value));
              }
            }}
            onMouseLeave={() => setHoverValue(null)}
          >
            <defs>
              <linearGradient id="tdayGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="50%" stopColor="#10b981" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            
            <XAxis dataKey="index" hide />
            <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
            
            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: '#10b981',
                strokeWidth: 1,
                strokeOpacity: 0.3,
              }}
            />
            
            <Area
              type="monotone"
              dataKey="value"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#tdayGradient)"
              animationDuration={800}
              dot={false}
              activeDot={{
                r: 4,
                fill: '#10b981',
                stroke: '#0f172a',
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

