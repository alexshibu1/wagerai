'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, User, Target, TrendingUp } from 'lucide-react';
import { useState } from 'react';

export default function TerminalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [netWorth, setNetWorth] = useState(12450); // Mock data - should be fetched from user stats

  const navItems = [
    { name: 'MARKETS', href: '/markets', icon: Home },
    { name: 'PROFILE', href: '/profile', icon: User },
  ];

  return (
    <div className="flex min-h-screen bg-[#050608]">
      {/* THE SIDEBAR (Fixed Left) */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-black/20 backdrop-blur-xl border-r border-white/5 flex flex-col">
        {/* Logo / Brand */}
        <div className="p-6 border-b border-white/5">
          <Link href="/markets" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-mono text-lg font-bold text-white">WAGER</div>
              <div className="text-xs text-zinc-500 font-mono">Terminal</div>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                  font-mono text-sm font-medium tracking-wider
                  ${isActive 
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}

          {/* TERMINAL (Focus Mode) - Special Button */}
          <button
            className="
              w-full flex items-center gap-3 px-4 py-3 rounded-xl
              bg-gradient-to-r from-cyan-600 to-blue-600
              text-white font-mono text-sm font-bold tracking-wider
              shadow-lg shadow-cyan-500/20
              hover:shadow-cyan-500/40 hover:scale-[1.02]
              transition-all duration-200
              mt-6
            "
          >
            <Target className="w-5 h-5" />
            TERMINAL
          </button>
        </nav>

        {/* User Footer - Net Worth Display */}
        <div className="p-4 border-t border-white/5">
          <div className="px-4 py-3 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="text-xs text-zinc-500 font-mono uppercase tracking-widest mb-1">
              Net Worth
            </div>
            <div className="text-2xl font-bold font-mono text-cyan-400">
              ${netWorth.toLocaleString()}
            </div>
            <div className="text-xs text-emerald-400 font-mono mt-1">
              +18.7% This Month
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA (Shifted Right) */}
      <main className="ml-64 flex-1">
        {children}
      </main>
    </div>
  );
}
