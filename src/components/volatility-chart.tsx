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
  
  const strokeColor = isUptrend ? '#2dd4bf' : '#fda4af';
  const gradientId = isUptrend ? 'upGradient' : 'downGradient';

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          {/* Green gradient for uptrend */}
          <linearGradient id="upGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00FF94" stopOpacity={0.4}/>
            <stop offset="95%" stopColor="#00FF94" stopOpacity={0}/>
          </linearGradient>
          {/* Rose gradient for downtrend */}
          <linearGradient id="downGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#fda4af" stopOpacity={0.4}/>
            <stop offset="95%" stopColor="#fda4af" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <XAxis 
          dataKey="time" 
          stroke="rgba(255, 255, 255, 0.2)"
          style={{ fontSize: '10px', fontFamily: 'JetBrains Mono' }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis 
          stroke="rgba(255, 255, 255, 0.2)"
          style={{ fontSize: '10px', fontFamily: 'JetBrains Mono' }}
          tickLine={false}
          axisLine={false}
          domain={[0, 200]}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'rgba(5, 5, 5, 0.95)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '8px',
            fontFamily: 'JetBrains Mono',
            fontSize: '12px',
          }}
          labelStyle={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '10px' }}
          itemStyle={{ color: strokeColor }}
          formatter={(value: number) => [`${value.toFixed(0)}`, 'Focus Value']}
        />
        <Area 
          type="monotone" 
          dataKey="value" 
          stroke={strokeColor}
          strokeWidth={2}
          fill={`url(#${gradientId})`}
          animationDuration={300}
          isAnimationActive={true}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
