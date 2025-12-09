'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';

interface GlobalWager {
  name: string;
  ticker: string;
  change: number;
}

export default function MarketTicker() {
  const globalWagers: GlobalWager[] = [
    { name: 'ALEX', ticker: 'SHIP', change: 12 },
    { name: 'SARAH', ticker: 'GYM', change: -5 },
    { name: 'MIKE', ticker: 'CODE', change: 23 },
    { name: 'EMMA', ticker: 'BLOG', change: 8 },
    { name: 'CHRIS', ticker: 'RUN', change: -12 },
    { name: 'JULIA', ticker: 'DESIGN', change: 15 },
    { name: 'RYAN', ticker: 'STARTUP', change: -8 },
    { name: 'KATE', ticker: 'LEARN', change: 31 },
    { name: 'DAVE', ticker: 'FITNESS', change: 18 },
    { name: 'LISA', ticker: 'PROJECT', change: -3 },
  ];

  // Double the array for seamless loop
  const displayWagers = [...globalWagers, ...globalWagers];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 glass-panel border-t border-white/[0.08] h-10 overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap">
        {displayWagers.map((wager, idx) => (
          <div
            key={idx}
            className="inline-flex items-center gap-2 px-6 py-2 font-mono text-xs"
          >
            <span className="text-zinc-400">{wager.name}_{wager.ticker}</span>
            {wager.change > 0 ? (
              <>
                <TrendingUp size={14} className="signal-green" />
                <span className="signal-green font-bold">+{wager.change}%</span>
              </>
            ) : (
              <>
                <TrendingDown size={14} className="signal-red" />
                <span className="signal-red font-bold">{wager.change}%</span>
              </>
            )}
            <span className="mx-2 text-zinc-700">•</span>
          </div>
        ))}
      </div>
    </div>
  );
}
