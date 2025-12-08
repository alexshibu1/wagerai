'use client';

import { HeatmapDay } from '@/types/wager';
import { format } from 'date-fns';
import { useState } from 'react';

interface ContributionHeatmapProps {
  data: HeatmapDay[];
  onDayClick?: (day: HeatmapDay) => void;
}

export default function ContributionHeatmap({ data, onDayClick }: ContributionHeatmapProps) {
  const [hoveredDay, setHoveredDay] = useState<string | null>(null);

  const getCellColor = (outcome: 'win' | 'loss' | 'none') => {
    switch (outcome) {
      case 'win':
        return 'bg-[#00C805] shadow-[0_0_8px_rgba(0,200,5,0.6)] hover:shadow-[0_0_12px_rgba(0,200,5,0.8)]';
      case 'loss':
        return 'bg-[#FF4500] shadow-[0_0_8px_rgba(255,69,0,0.6)] hover:shadow-[0_0_12px_rgba(255,69,0,0.8)]';
      default:
        return 'bg-zinc-800/50 hover:bg-zinc-700/50';
    }
  };

  const weeks: HeatmapDay[][] = [];
  let currentWeek: HeatmapDay[] = [];

  data.forEach((day, index) => {
    currentWeek.push(day);
    if (currentWeek.length === 7 || index === data.length - 1) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
  });

  return (
    <div className="w-full overflow-x-auto">
      <div className="inline-flex gap-1">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1">
            {week.map((day) => (
              <div
                key={day.date}
                onClick={() => onDayClick?.(day)}
                onMouseEnter={() => setHoveredDay(day.date)}
                onMouseLeave={() => setHoveredDay(null)}
                className={`w-3 h-3 rounded-sm cursor-pointer transition-all ${getCellColor(day.outcome)} ${
                  hoveredDay === day.date ? 'scale-125' : ''
                }`}
                title={`${format(new Date(day.date), 'MMM dd, yyyy')} - ${day.wagers.length} wagers`}
              />
            ))}
          </div>
        ))}
      </div>
      
      <div className="flex items-center gap-4 mt-4 label-text">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 bg-zinc-800/50 rounded-sm" />
          <div className="w-3 h-3 bg-[#00C805] rounded-sm shadow-[0_0_8px_rgba(0,200,5,0.6)]" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
