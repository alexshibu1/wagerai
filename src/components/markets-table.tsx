'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown, Clock, Target } from 'lucide-react';
import { Wager } from '@/types/wager';
import { formatCurrency } from '@/lib/wager-utils';

interface MarketsTableProps {
  wagers: Wager[];
  onComplete: (wagerId: string) => void;
  onFail: (wagerId: string) => void;
}

export default function MarketsTable({ wagers, onComplete, onFail }: MarketsTableProps) {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry.getTime() - now.getTime();
    
    if (diff <= 0) return { text: 'EXPIRED', color: 'text-red-400', blink: true };
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return { text: `${days}d ${hours % 24}h`, color: 'text-zinc-400', blink: false };
    }
    if (hours > 1) {
      return { text: `${hours}h ${minutes}m`, color: 'text-zinc-300', blink: false };
    }
    if (hours === 1 || minutes > 30) {
      return { text: `${hours}h ${minutes}m`, color: 'text-yellow-400', blink: false };
    }
    return { text: `${minutes}m`, color: 'text-orange-400', blink: true };
  };

  const getTickerColor = (assetClass: string) => {
    switch (assetClass) {
      case 'TDAY':
        return 'text-cyan-400';
      case 'SHIP':
        return 'text-blue-400';
      case 'YEAR':
        return 'text-purple-400';
      default:
        return 'text-zinc-400';
    }
  };

  // Filter out expired wagers - only show OPEN wagers that haven't expired
  const openWagers = wagers.filter(w => {
    if (w.status !== 'OPEN') return false;
    const deadline = new Date(w.deadline);
    const now = new Date();
    return deadline.getTime() > now.getTime(); // Only show if deadline is in the future
  });

  return (
    <div className="glass-panel overflow-hidden">
      {/* Bloomberg Terminal Style Header */}
      <div className="bg-slate-950/80 border-b border-white/5 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
          <span className="label-text text-emerald-400">LIVE MARKETS</span>
        </div>
        <div className="label-text text-zinc-600">{openWagers.length} OPEN POSITIONS</div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-[100px_1fr_180px_120px_120px_100px] gap-4 px-6 py-3 bg-slate-950/40 border-b border-white/[0.03]">
        <div className="label-text text-[10px]">TICKER</div>
        <div className="label-text text-[10px]">MARKET</div>
        <div className="label-text text-[10px]">EXPIRY</div>
        <div className="label-text text-[10px]">VOLUME</div>
        <div className="label-text text-[10px]">P&L</div>
        <div className="label-text text-[10px] text-right">STATUS</div>
      </div>

      {/* Table Rows */}
      <div className="divide-y divide-white/[0.02]">
        {openWagers.length > 0 ? (
          openWagers.map(wager => {
            const timeInfo = getTimeRemaining(wager.deadline);
            const pl = 0; // Calculate P&L based on your logic
            
            return (
              <div
                key={wager.id}
                className={`grid grid-cols-[100px_1fr_180px_120px_120px_100px] gap-4 px-6 py-4 transition-all cursor-pointer ${
                  hoveredRow === wager.id 
                    ? 'bg-white/[0.03]' 
                    : 'hover:bg-white/[0.02]'
                }`}
                onMouseEnter={() => setHoveredRow(wager.id)}
                onMouseLeave={() => setHoveredRow(null)}
                onClick={() => window.location.href = `/session/${wager.id}`}
              >
                {/* Ticker */}
                <div className={`data-text text-sm font-bold ${getTickerColor(wager.asset_class)}`}>
                  ${wager.asset_class}
                </div>

                {/* Market (Task Title) */}
                <div className="text-zinc-200 text-sm font-medium truncate">
                  {wager.title}
                </div>

                {/* Expiry */}
                <div className="flex items-center gap-2">
                  <Clock size={14} className={timeInfo.color} />
                  <span className={`data-text text-sm font-bold ${timeInfo.color} ${timeInfo.blink ? 'animate-pulse' : ''}`}>
                    {timeInfo.text}
                  </span>
                </div>

                {/* Volume (Stake) */}
                <div className="data-text text-sm font-bold text-zinc-300">
                  {formatCurrency(wager.stake_amount)}
                </div>

                {/* P&L */}
                <div className="flex items-center gap-1">
                  {pl >= 0 ? (
                    <>
                      <TrendingUp size={14} className="text-emerald-400" />
                      <span className="data-text text-sm font-bold text-emerald-400">
                        +{formatCurrency(Math.abs(pl))}
                      </span>
                    </>
                  ) : (
                    <>
                      <TrendingDown size={14} className="text-red-400" />
                      <span className="data-text text-sm font-bold text-red-400">
                        -{formatCurrency(Math.abs(pl))}
                      </span>
                    </>
                  )}
                </div>

                {/* Status */}
                <div className="flex justify-end">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/20">
                    <Target size={10} className="text-emerald-400" />
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                      OPEN
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-20 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-950/50 border border-white/10 flex items-center justify-center">
              <Target size={32} className="text-zinc-600" />
            </div>
            <p className="text-zinc-400 font-medium text-base mb-2">No Active Markets</p>
            <p className="text-zinc-600 text-xs max-w-sm mx-auto">
              Create your first wager to see it appear in the live markets feed
            </p>
          </div>
        )}
      </div>

      {/* Bottom Status Bar */}
      {openWagers.length > 0 && (
        <div className="bg-slate-950/60 border-t border-white/5 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
              <span className="text-xs text-zinc-500">
                {openWagers.filter(w => w.asset_class === 'TDAY').length} $TDAY
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-400"></div>
              <span className="text-xs text-zinc-500">
                {openWagers.filter(w => w.asset_class === 'SHIP').length} $SHIP
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-400"></div>
              <span className="text-xs text-zinc-500">
                {openWagers.filter(w => w.asset_class === 'YEAR').length} $YEAR
              </span>
            </div>
          </div>
          <div className="text-xs text-zinc-600 font-mono">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      )}
    </div>
  );
}
