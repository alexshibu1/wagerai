'use client';

import { HeatmapDay } from '@/types/wager';
import { format, startOfWeek, addDays } from 'date-fns';
import { useState, useMemo } from 'react';

interface ContributionHeatmapProps {
  data: HeatmapDay[];
  onDayClick?: (day: HeatmapDay) => void;
}

// =============================================================================
// PROOF OF WORK HEATMAP
// =============================================================================
// WHY: GitHub-style 365-day grid showing profit/loss history at a glance
// Visual proof of consistency - green = shipped/won, rose = missed/lost
// The glow effect creates a "lit up" feeling that rewards visual consistency

export default function ContributionHeatmap({ data, onDayClick }: ContributionHeatmapProps) {
  const [hoveredDay, setHoveredDay] = useState<HeatmapDay | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // WHY: Color system matches our design language
  // Emerald (#10b981) = profit/win with glow for celebration
  // Rose (#fb7185) = loss with glow for visibility
  // Zinc = no activity (neutral, recedes visually)
  const getCellColor = (outcome: 'win' | 'loss' | 'none') => {
    switch (outcome) {
      case 'win':
        return 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)] hover:shadow-[0_0_10px_rgba(16,185,129,0.8)]';
      case 'loss':
        return 'bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.6)] hover:shadow-[0_0_10px_rgba(244,63,94,0.8)]';
      default:
        return 'bg-zinc-800/40 hover:bg-zinc-700/60';
    }
  };

  // WHY: GitHub-style layout needs weeks as columns, days as rows
  // We organize by week starting from Sunday (day 0)
  const { weeks, monthLabels } = useMemo(() => {
    const weeksArr: (HeatmapDay | null)[][] = [];
    const months: { label: string; weekIndex: number }[] = [];
    
    if (data.length === 0) return { weeks: [], monthLabels: [] };
    
    // Create a map for quick lookup
    const dataMap = new Map(data.map(d => [d.date, d]));
    
    // Find the start date (oldest) and calculate where to start the grid
    const startDate = new Date(data[0].date);
    const endDate = new Date(data[data.length - 1].date);
    
    // Align to start of week (Sunday)
    const gridStart = startOfWeek(startDate, { weekStartsOn: 0 });
    
    // Calculate total weeks needed
    const totalDays = Math.ceil((endDate.getTime() - gridStart.getTime()) / (1000 * 60 * 60 * 24)) + 7;
    const totalWeeks = Math.ceil(totalDays / 7);
    
    let lastMonth = -1;
    
    for (let weekIdx = 0; weekIdx < totalWeeks; weekIdx++) {
      const week: (HeatmapDay | null)[] = [];
      
      for (let dayIdx = 0; dayIdx < 7; dayIdx++) {
        const currentDate = addDays(gridStart, weekIdx * 7 + dayIdx);
        const dateStr = format(currentDate, 'yyyy-MM-dd');
        
        // Check for month label (first occurrence of each month)
        const currentMonth = currentDate.getMonth();
        if (currentMonth !== lastMonth && dayIdx === 0) {
          months.push({
            label: format(currentDate, 'MMM'),
            weekIndex: weekIdx
          });
          lastMonth = currentMonth;
        }
        
        // Only include days within our data range
        if (currentDate >= startDate && currentDate <= endDate) {
          week.push(dataMap.get(dateStr) || {
            date: dateStr,
            outcome: 'none' as const,
            wagers: []
          });
        } else {
          week.push(null); // Empty cell for padding
        }
      }
      
      weeksArr.push(week);
    }
    
    return { weeks: weeksArr, monthLabels: months };
  }, [data]);

  // Day labels for the Y-axis (Mon, Wed, Fri)
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const visibleDayLabels = [1, 3, 5]; // Mon, Wed, Fri indices

  const handleMouseEnter = (day: HeatmapDay, e: React.MouseEvent) => {
    setHoveredDay(day);
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top - 8 });
  };

  return (
    <div className="w-full">
      {/* Month labels row */}
      <div className="flex mb-2 ml-8">
        <div className="flex" style={{ gap: '3px' }}>
          {weeks.map((_, weekIdx) => {
            const monthLabel = monthLabels.find(m => m.weekIndex === weekIdx);
            return (
              <div key={weekIdx} className="w-[11px] text-[10px] text-zinc-500">
                {monthLabel?.label || ''}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Main grid with day labels */}
      <div className="flex">
        {/* Day labels column */}
        <div className="flex flex-col mr-2" style={{ gap: '3px' }}>
          {dayLabels.map((label, idx) => (
            <div 
              key={label} 
              className="h-[11px] text-[10px] text-zinc-500 leading-[11px]"
            >
              {visibleDayLabels.includes(idx) ? label.slice(0, 3) : ''}
            </div>
          ))}
        </div>
        
        {/* Heatmap grid */}
        <div className="flex overflow-x-auto" style={{ gap: '3px' }}>
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col" style={{ gap: '3px' }}>
              {week.map((day, dayIndex) => (
                day ? (
                  <div
                    key={day.date}
                    onClick={() => onDayClick?.(day)}
                    onMouseEnter={(e) => handleMouseEnter(day, e)}
                    onMouseLeave={() => setHoveredDay(null)}
                    className={`w-[11px] h-[11px] rounded-[2px] cursor-pointer transition-all duration-150 hover:scale-125 ${getCellColor(day.outcome)}`}
                  />
                ) : (
                  <div 
                    key={`empty-${weekIndex}-${dayIndex}`}
                    className="w-[11px] h-[11px]"
                  />
                )
              ))}
            </div>
          ))}
        </div>
      </div>
      
      {/* Tooltip */}
      {hoveredDay && (
        <div 
          className="fixed z-50 px-3 py-2 rounded-lg bg-zinc-900/95 border border-white/10 shadow-xl pointer-events-none transform -translate-x-1/2 -translate-y-full"
          style={{ left: tooltipPos.x, top: tooltipPos.y }}
        >
          <div className="text-xs text-white font-medium">
            {format(new Date(hoveredDay.date), 'MMM dd, yyyy')}
          </div>
          <div className={`text-xs font-mono mt-0.5 ${
            hoveredDay.outcome === 'win' ? 'text-emerald-400' : 
            hoveredDay.outcome === 'loss' ? 'text-rose-400' : 'text-zinc-500'
          }`}>
            {hoveredDay.outcome === 'win' ? '✓ Profit' : 
             hoveredDay.outcome === 'loss' ? '✗ Loss' : 'No activity'}
          </div>
          {hoveredDay.wagers.length > 0 && (
            <div className="text-[10px] text-zinc-500 mt-1">
              {hoveredDay.wagers.length} wager{hoveredDay.wagers.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
