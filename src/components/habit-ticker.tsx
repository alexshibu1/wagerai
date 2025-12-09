'use client';

import { TrendingUp, TrendingDown, Award } from 'lucide-react';

interface Habit {
  name: string;
  ticker: string;
  change: number;
  rating?: string;
}

export default function HabitTicker() {
  const habits: Habit[] = [
    { name: 'GYM', ticker: 'GYM', change: 2.5, rating: 'AAA' },
    { name: 'READING', ticker: 'READ', change: -1.2 },
    { name: 'DEEP WORK', ticker: 'WORK', change: 4.8, rating: 'AAA' },
    { name: 'MEDITATION', ticker: 'MEDI', change: 1.7, rating: 'AA' },
    { name: 'CODING', ticker: 'CODE', change: 3.2, rating: 'AAA' },
    { name: 'NETWORKING', ticker: 'NETW', change: -0.5 },
    { name: 'WRITING', ticker: 'WRIT', change: 2.1, rating: 'AA' },
    { name: 'LEARNING', ticker: 'LERN', change: 1.9, rating: 'AAA' },
  ];

  // Double the array for seamless loop
  const displayHabits = [...habits, ...habits];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 glass-panel border-t border-white/[0.05] h-10 overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap">
        {displayHabits.map((habit, idx) => (
          <div
            key={idx}
            className="inline-flex items-center gap-2 px-6 py-2 font-mono text-[10px]"
          >
            <span className="text-zinc-400 font-bold">{habit.ticker}:</span>
            {habit.change > 0 ? (
              <>
                <TrendingUp size={12} className="soft-mint" />
                <span className="soft-mint font-bold">+{habit.change.toFixed(1)}%</span>
              </>
            ) : (
              <>
                <TrendingDown size={12} className="coral-rose" />
                <span className="coral-rose font-bold">{habit.change.toFixed(1)}%</span>
              </>
            )}
            {habit.rating && (
              <>
                <span className="text-zinc-700 mx-1">|</span>
                <Award size={10} className="text-zinc-500" />
                <span className="text-zinc-500 font-bold">{habit.rating}</span>
              </>
            )}
            <span className="mx-2 text-zinc-800">•</span>
          </div>
        ))}
      </div>
    </div>
  );
}

