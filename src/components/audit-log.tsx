'use client';

import { Wager } from '@/types/wager';
import { ASSET_CLASS_CONFIG, calculatePnL, formatCurrency } from '@/lib/wager-utils';
import { format } from 'date-fns';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface AuditLogProps {
  wagers: Wager[];
}

export default function AuditLog({ wagers }: AuditLogProps) {
  const closedWagers = wagers
    .filter(w => w.status !== 'OPEN')
    .sort((a, b) => new Date(b.completed_at || b.created_at).getTime() - new Date(a.completed_at || a.created_at).getTime());

  return (
    <div className="space-y-1">
      {closedWagers.map((wager) => {
        const pnl = calculatePnL(wager);
        const isWin = wager.status === 'WON';
        const config = ASSET_CLASS_CONFIG[wager.asset_class];

        return (
          <div
            key={wager.id}
            className="glass-row rounded-lg px-4 py-3 flex items-center justify-between gap-4"
          >
            {/* Left: Asset + Name */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <span className="data-text text-xs font-bold shrink-0">
                {config.symbol}
              </span>
              <div className="h-3 w-px bg-white/10"></div>
              <span className="text-sm text-white truncate">
                {wager.title}
              </span>
            </div>

            {/* Center: Date/Time (very small) */}
            <div className="label-text text-[10px] shrink-0">
              {format(new Date(wager.completed_at || wager.created_at), 'MMM dd • HH:mm')}
            </div>

            {/* Right: P&L (HERO) */}
            <div className="text-right shrink-0">
              <div className={`data-text text-2xl font-bold flex items-center gap-2 ${isWin ? 'text-electric-teal' : 'text-soft-rose'}`}>
                {isWin ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                {isWin ? '+' : ''}{formatCurrency(pnl)}
              </div>
              {wager.pnl_percentage && (
                <div className="label-text text-right text-[10px]">
                  Stake: {formatCurrency(wager.stake_amount)}
                </div>
              )}
            </div>
          </div>
        );
      })}

      {closedWagers.length === 0 && (
        <div className="text-center py-12 text-zinc-500">
          <p className="data-text text-sm">No closed positions yet</p>
          <p className="label-text mt-2">Complete your first wager to see it here</p>
        </div>
      )}
    </div>
  );
}
