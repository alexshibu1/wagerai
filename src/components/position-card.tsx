'use client';

import { Wager } from '@/types/wager';
import { ASSET_CLASS_CONFIG, calculateTimeRemaining, formatCurrency } from '@/lib/wager-utils';
import { Clock, Check, X, Play } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import Link from 'next/link';

interface PositionCardProps {
  wager: Wager;
  onComplete?: (wagerId: string) => void;
  onFail?: (wagerId: string) => void;
  showLocked?: boolean;
}

export default function PositionCard({ wager, onComplete, onFail, showLocked }: PositionCardProps) {
  const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining(wager.deadline));
  const config = ASSET_CLASS_CONFIG[wager.asset_class];

  useEffect(() => {
    if (wager.status !== 'OPEN') return;

    const interval = setInterval(() => {
      const remaining = calculateTimeRemaining(wager.deadline);
      setTimeRemaining(remaining);

      if (remaining.isExpired && onFail) {
        onFail(wager.id);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [wager.deadline, wager.status, wager.id, onFail]);

  const isOpen = wager.status === 'OPEN';
  const health = wager.health_percentage || 100;
  const isYearWager = wager.asset_class === 'YEAR';
  const isBleeding = isYearWager && health < 50;

  // Year wagers should navigate to detail page, not focus session
  const getActionLink = () => {
    if (isYearWager) {
      return `/project/${wager.id}`;
    }
    return `/session/${wager.id}`;
  };

  return (
    <div className="grid grid-cols-[100px_1fr_140px_120px_100px] gap-4 px-4 h-14 items-center border-b border-white/[0.05] hover:bg-white/[0.02] transition-colors">
      {/* Ticker Badge */}
      <div>
        <span className="inline-block bg-zinc-800 text-white data-text text-xs px-2 py-0.5 rounded">
          {config.symbol}
        </span>
      </div>

      {/* Task Name */}
      <div className="min-w-0">
        <div className="text-white text-sm font-medium truncate">{wager.title}</div>
        {isYearWager && isOpen && (
          <div className="health-bar mt-1">
            <div 
              className="health-bar-fill" 
              style={{
                width: `${health}%`,
                backgroundColor: isBleeding ? '#fda4af' : '#2dd4bf'
              }}
            />
          </div>
        )}
      </div>

      {/* Countdown Timer */}
      <div className="data-text text-sm text-zinc-400">
        {isOpen && !showLocked ? (
          <>
            {timeRemaining.days > 0 && `${timeRemaining.days}d `}
            {String(timeRemaining.hours).padStart(2, '0')}:
            {String(timeRemaining.minutes).padStart(2, '0')}:
            {String(timeRemaining.seconds).padStart(2, '0')}
          </>
        ) : (
          <span className="text-zinc-600">—</span>
        )}
      </div>

      {/* Stake Amount */}
      <div className="data-text text-sm text-white">
        {formatCurrency(wager.stake_amount)}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2">
        {isOpen && !showLocked && (
          <>
            {/* View/Focus Button - Routes to project detail for YEAR, focus session for others */}
            <Link href={getActionLink()}>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-white/5 hover:text-electric-teal transition-colors group"
                title={isYearWager ? "View Project Details" : "Start Focus Session"}
              >
                <Play size={14} className="text-zinc-500 group-hover:text-electric-teal" />
              </Button>
            </Link>
            
            {/* Complete Button - Only show for non-YEAR wagers */}
            {onComplete && !isYearWager && (
              <Button
                onClick={() => onComplete(wager.id)}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-white/5 hover:text-electric-teal transition-colors group"
              >
                <Check size={16} className="text-zinc-500 group-hover:text-electric-teal" />
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
