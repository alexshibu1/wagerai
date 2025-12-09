'use client';

import { Info } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover';

/**
 * AssetClassInfo - Educational popover explaining the 3 asset class types (time horizons)
 * 
 * Displays an info icon that opens a rich popover explaining:
 * - $TDAY: Intraday markets (daily tasks with high volatility)
 * - $SHIP: Futures contracts (medium-term projects with binary outcomes)
 * - $YEAR: Treasury bonds (habits/long-term goals with compound interest)
 */
export default function AssetClassInfo() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="inline-flex items-center justify-center w-5 h-5 rounded-full border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all"
          aria-label="Learn about asset classes"
        >
          <Info size={12} className="text-zinc-400" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[380px] p-0 bg-[#0a0a12] border border-white/10 shadow-2xl"
        side="bottom"
        align="start"
      >
        <div className="p-4 border-b border-white/10">
          <h3 className="text-sm font-bold text-white tracking-wide">Asset Classes (Time Horizons)</h3>
          <p className="text-xs text-zinc-500 mt-1">Each class has unique mechanics based on time commitment</p>
        </div>

        <div className="divide-y divide-white/5">
          {/* $TDAY */}
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-mono font-bold text-emerald-400">$TDAY</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 uppercase tracking-wider">
                Intraday Markets
              </span>
            </div>
            <p className="text-xs text-zinc-400 mb-2">
              <span className="text-zinc-300 font-medium">What:</span> Daily tasks (e.g., "Write 500 words")
            </p>
            <p className="text-xs text-zinc-400 mb-2">
              <span className="text-zinc-300 font-medium">Mechanic:</span> High volatility. You open the position at 9 AM. 
              The "price" (value) fluctuates based on time remaining.
            </p>
            <p className="text-xs text-zinc-400">
              <span className="text-zinc-300 font-medium">Expiry:</span>{' '}
              <span className="text-amber-400">16 Hours.</span> If not closed (completed) before the timer ends, 
              the position is <span className="text-rose-400">Liquidated (-100% loss)</span>.
            </p>
          </div>

          {/* $SHIP */}
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-mono font-bold text-blue-400">$SHIP</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 uppercase tracking-wider">
                Futures Contracts
              </span>
            </div>
            <p className="text-xs text-zinc-400 mb-2">
              <span className="text-zinc-300 font-medium">What:</span> Medium-term projects (e.g., "Launch MVP")
            </p>
            <p className="text-xs text-zinc-400 mb-2">
              <span className="text-zinc-300 font-medium">Mechanic:</span> Binary Options. You bet a large sum (e.g., $5,000). 
              Outcome is either <span className="text-emerald-400">100% payout</span> or{' '}
              <span className="text-rose-400">Total Loss</span> on the deadline.
            </p>
            <p className="text-xs text-zinc-400">
              <span className="text-zinc-300 font-medium">Health Bar:</span> Requires "maintenance" (linking daily tasks) 
              to prevent the position's health from bleeding out.
            </p>
          </div>

          {/* $YEAR */}
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-mono font-bold text-amber-400">$YEAR</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 uppercase tracking-wider">
                Treasury Bonds
              </span>
            </div>
            <p className="text-xs text-zinc-400 mb-2">
              <span className="text-zinc-300 font-medium">What:</span> Habits & Long-term goals (e.g., "Marathon Training")
            </p>
            <p className="text-xs text-zinc-400 mb-2">
              <span className="text-zinc-300 font-medium">Mechanic:</span> Low volatility, high yield. 
              It pays "dividends" (small cash payouts) every time you log a streak day.
            </p>
            <p className="text-xs text-zinc-400">
              <span className="text-zinc-300 font-medium">Visualization:</span>{' '}
              <span className="text-amber-400">Exponential "Compound Interest" curve</span> — 
              the longer you maintain it, the more valuable it becomes.
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
