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

  // Temporarily disable the ticker bar without breaking imports
  return null;
}

