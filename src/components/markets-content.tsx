'use client';

import { useState } from 'react';
import { Clock, TrendingUp, TrendingDown, Target } from 'lucide-react';

type View = 'positions' | 'orderbook';

// Mock data for "My Positions"
const MOCK_POSITIONS = [
  { id: 1, ticker: '$TDAY', contract: 'MORNING_WORKOUT', stake: 50, pnl: 12.50, expiry: '2h 34m', status: 'active' },
  { id: 2, ticker: '$TDAY', contract: 'NO_SOCIAL_MEDIA', stake: 25, pnl: -5.00, expiry: '4h 12m', status: 'active' },
  { id: 3, ticker: '$SHIP', contract: 'MVP_LAUNCH', stake: 500, pnl: 145.00, expiry: '18d 6h', status: 'active' },
  { id: 4, ticker: '$TDAY', contract: 'DEEP_WORK_SESSION', stake: 100, pnl: 23.50, expiry: '1h 45m', status: 'active' },
  { id: 5, ticker: '$YEAR', contract: 'REVENUE_MILESTONE', stake: 2000, pnl: 320.00, expiry: '234d', status: 'active' },
];

// Mock data for "Global Order Book"
const MOCK_ORDER_BOOK = [
  { id: 1, user: '@sarah_ship', action: 'opened', amount: 500, contract: 'SHIP_MVP', type: 'win', time: '2m ago' },
  { id: 2, user: '@alex_builds', action: 'liquidated', amount: 50, contract: 'SCROLLING_TWITTER', type: 'loss', time: '5m ago' },
  { id: 3, user: '@crypto_mike', action: 'opened', amount: 1000, contract: 'YEAR_FITNESS', type: 'active', time: '12m ago' },
  { id: 4, user: '@jane_doe', action: 'settled', amount: 250, contract: 'TDAY_READING', type: 'win', time: '18m ago' },
  { id: 5, user: '@john_smith', action: 'opened', amount: 75, contract: 'NO_CAFFEINE', type: 'active', time: '22m ago' },
  { id: 6, user: '@dev_hannah', action: 'liquidated', amount: 100, contract: 'GITHUB_COMMITS', type: 'loss', time: '35m ago' },
  { id: 7, user: '@trader_tom', action: 'settled', amount: 500, contract: 'SHIP_PROTOTYPE', type: 'win', time: '41m ago' },
  { id: 8, user: '@fitness_sam', action: 'opened', amount: 150, contract: 'MORNING_RUN', type: 'active', time: '48m ago' },
  { id: 9, user: '@code_ninja', action: 'settled', amount: 200, contract: 'CODE_REVIEW', type: 'win', time: '1h ago' },
  { id: 10, user: '@zen_master', action: 'opened', amount: 50, contract: 'MEDITATION', type: 'active', time: '1h 15m ago' },
];

export default function MarketsContent() {
  const [activeView, setActiveView] = useState<View>('positions');

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white font-mono mb-2">MARKETS</h1>
        <p className="text-zinc-500 text-sm font-mono">Live trading floor • Real-time positions</p>
      </div>

      {/* Segmented Control (iOS Style) */}
      <div className="mb-8 inline-flex items-center bg-white/[0.03] backdrop-blur-xl rounded-2xl p-1.5 border border-white/5">
        <button
          onClick={() => setActiveView('positions')}
          className={`
            px-6 py-2.5 rounded-xl font-mono text-sm font-medium tracking-wider transition-all
            ${activeView === 'positions'
              ? 'bg-white text-black shadow-lg'
              : 'text-zinc-400 hover:text-white'
            }
          `}
        >
          MY POSITIONS
        </button>
        <button
          onClick={() => setActiveView('orderbook')}
          className={`
            px-6 py-2.5 rounded-xl font-mono text-sm font-medium tracking-wider transition-all
            ${activeView === 'orderbook'
              ? 'bg-white text-black shadow-lg'
              : 'text-zinc-400 hover:text-white'
            }
          `}
        >
          GLOBAL ORDER BOOK
        </button>
      </div>

      {/* Content Area */}
      {activeView === 'positions' ? <MyPositionsView /> : <GlobalOrderBookView />}
    </div>
  );
}

function MyPositionsView() {
  return (
    <div className="bg-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/5 overflow-hidden">
      {/* Table Header */}
      <div className="grid grid-cols-6 gap-4 px-6 py-4 border-b border-white/5 bg-white/[0.01]">
        <div className="text-xs text-zinc-500 font-mono uppercase tracking-widest">Ticker</div>
        <div className="text-xs text-zinc-500 font-mono uppercase tracking-widest col-span-2">Contract Name</div>
        <div className="text-xs text-zinc-500 font-mono uppercase tracking-widest text-right">Stake</div>
        <div className="text-xs text-zinc-500 font-mono uppercase tracking-widest text-right">Unrealized P&L</div>
        <div className="text-xs text-zinc-500 font-mono uppercase tracking-widest text-right">Expiry</div>
      </div>

      {/* Table Rows */}
      <div className="divide-y divide-white/5">
        {MOCK_POSITIONS.map((position) => (
          <button
            key={position.id}
            className="grid grid-cols-6 gap-4 px-6 py-5 hover:bg-white/[0.02] transition-colors w-full text-left group"
          >
            <div className="font-mono text-sm text-cyan-400 font-bold">{position.ticker}</div>
            <div className="col-span-2 font-mono text-sm text-white group-hover:text-cyan-400 transition-colors">
              {position.contract}
            </div>
            <div className="text-right font-mono text-sm text-white">${position.stake}</div>
            <div className={`text-right font-mono text-sm font-bold ${position.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {position.pnl >= 0 ? '+' : ''}{position.pnl.toFixed(2)}
            </div>
            <div className="text-right font-mono text-sm text-zinc-400 flex items-center justify-end gap-2">
              <Clock className="w-4 h-4" />
              {position.expiry}
            </div>
          </button>
        ))}
      </div>

      {/* Empty State */}
      {MOCK_POSITIONS.length === 0 && (
        <div className="px-6 py-16 text-center">
          <Target className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
          <p className="text-zinc-500 font-mono text-sm">No active positions</p>
          <p className="text-zinc-600 font-mono text-xs mt-2">Click TERMINAL to open a new wager</p>
        </div>
      )}
    </div>
  );
}

function GlobalOrderBookView() {
  return (
    <div className="space-y-3">
      {MOCK_ORDER_BOOK.map((order) => (
        <div
          key={order.id}
          className="bg-white/[0.02] backdrop-blur-sm rounded-xl border border-white/5 p-5 hover:bg-white/[0.03] transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* User Avatar */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-mono text-sm font-bold">
                {order.user.charAt(1).toUpperCase()}
              </div>

              {/* Activity Description */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-sm text-cyan-400 font-bold">{order.user}</span>
                  <span className="font-mono text-sm text-zinc-500">{order.action}</span>
                  <span className="font-mono text-sm text-white font-bold">${order.amount}</span>
                  <span className="font-mono text-sm text-zinc-500">on</span>
                  <span className="font-mono text-sm text-white">{order.contract}</span>
                </div>
                <div className="font-mono text-xs text-zinc-600">{order.time}</div>
              </div>
            </div>

            {/* Status Icon */}
            <div className="flex items-center gap-2">
              {order.type === 'win' && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span className="font-mono text-xs text-emerald-400 font-bold">WIN</span>
                </div>
              )}
              {order.type === 'loss' && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20">
                  <TrendingDown className="w-4 h-4 text-red-400" />
                  <span className="font-mono text-xs text-red-400 font-bold">LOSS</span>
                </div>
              )}
              {order.type === 'active' && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                  <Target className="w-4 h-4 text-cyan-400" />
                  <span className="font-mono text-xs text-cyan-400 font-bold">ACTIVE</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
