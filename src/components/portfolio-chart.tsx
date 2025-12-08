'use client';

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { ChartDataPoint } from '@/types/wager';

interface PortfolioChartProps {
  data: ChartDataPoint[];
}

export default function PortfolioChart({ data }: PortfolioChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00FF94" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#00FF94" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <XAxis 
          dataKey="date" 
          stroke="rgba(255, 255, 255, 0.2)"
          style={{ fontSize: '10px', fontFamily: 'JetBrains Mono' }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis 
          stroke="rgba(255, 255, 255, 0.2)"
          style={{ fontSize: '10px', fontFamily: 'JetBrains Mono' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
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
          itemStyle={{ color: '#00FF94' }}
          formatter={(value: number) => [`$${value.toLocaleString()}`, 'Focus Capital']}
        />
        <Area 
          type="monotone" 
          dataKey="value" 
          stroke="#00FF94" 
          strokeWidth={2}
          fill="url(#colorValue)"
          animationDuration={1000}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
