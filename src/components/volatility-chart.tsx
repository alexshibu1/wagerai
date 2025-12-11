'use client';

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface VolatilityDataPoint {
  time: string;
  value: number;
  event?: 'task' | 'deepwork' | 'cancel';
}

interface VolatilityChartProps {
  data: VolatilityDataPoint[];
  currentValue?: number; // Optional: current focus value for real-time display
}

export default function VolatilityChart({ data, currentValue }: VolatilityChartProps) {
  // Determine if the trend is up or down based on last few points
  const recentData = data.slice(-5);
  const isUptrend = recentData.length >= 2 && 
    recentData[recentData.length - 1].value > recentData[0].value;
  
  const isPositive = currentValue !== undefined ? currentValue >= 120 : isUptrend;
  const strokeColor = isPositive ? '#10b981' : '#ef4444';
  const gradientId = 'volatilityGradient';

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
        <defs>
          {/* Gradient matching profile page style */}
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity={0.4}/>
            <stop offset="50%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity={0.15}/>
            <stop offset="100%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <XAxis 
          dataKey="time" 
          stroke="rgba(255, 255, 255, 0.2)"
          tick={{ fill: 'rgba(255, 255, 255, 0.4)', fontSize: 10, fontFamily: 'monospace' }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload || !payload.length) return null;
            const data = payload[0].payload;
            return (
              <div style={{
                background: 'rgba(10, 10, 15, 0.98)',
                border: `1px solid ${isPositive ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
                borderRadius: '8px',
                padding: '8px 12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
              }}>
                <div style={{ color: '#a1a1aa', fontSize: '11px', marginBottom: '4px', fontFamily: 'monospace' }}>
                  {data.time}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                  <span style={{ color: strokeColor, fontFamily: 'monospace', fontSize: '18px', fontWeight: 'bold' }}>
                    {data.value.toFixed(0)}
                  </span>
                  <span style={{ color: '#52525b', fontSize: '10px' }}>focus</span>
                </div>
              </div>
            );
          }}
          cursor={{
            stroke: strokeColor,
            strokeWidth: 1,
            strokeDasharray: '4 4',
          }}
        />
        <Area 
          type="monotone" 
          dataKey="value" 
          stroke={strokeColor}
          strokeWidth={2}
          fill={`url(#${gradientId})`}
          animationDuration={500}
          dot={false}
          activeDot={{
            r: 5,
            fill: strokeColor,
            stroke: '#0f172a',
            strokeWidth: 2,
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
