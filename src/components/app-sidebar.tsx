'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '../../supabase/client';
import { 
  Terminal, 
  Globe, 
  BookOpen,
  TrendingUp,
  LogOut,
  Zap,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface NavItem {
  href: string;
  icon: React.ReactNode;
  label: string;
  sublabel: string;
  accentColor: string;
}

/**
 * AppSidebar - Premium glassmorphism sidebar with atmospheric depth
 * 
 * WHY this design:
 * - Deep atmospheric gradients create immersive depth (matches profile page)
 * - Glowing active states provide instant "you are here" feedback
 * - Subtle hover animations add life without distraction
 * - Premium color palette: violet, cyan, emerald, amber
 */
export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const navItems: NavItem[] = [
    { 
      href: '/session/new', 
      icon: <Terminal size={18} />, 
      label: 'Terminal',
      sublabel: 'Lock In',
      accentColor: 'violet'
    },
    { 
      href: '/markets', 
      icon: <Globe size={18} />, 
      label: 'Markets',
      sublabel: 'Global',
      accentColor: 'cyan'
    },
    { 
      href: '/profile', 
      icon: <BookOpen size={18} />, 
      label: 'Profile',
      sublabel: 'Ledger',
      accentColor: 'emerald'
    },
  ];

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <aside 
      className="fixed left-0 top-0 h-screen w-64 z-50 flex flex-col overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, rgba(5, 3, 15, 0.98) 0%, rgba(10, 5, 25, 0.98) 50%, rgba(5, 3, 15, 0.98) 100%)',
        borderRight: '1px solid rgba(255, 255, 255, 0.06)',
      }}
    >
      {/* ============================================== */}
      {/* ATMOSPHERIC BACKGROUND GRADIENTS */}
      {/* ============================================== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top violet glow */}
        <div 
          className="absolute -top-20 -left-20 w-64 h-64 rounded-full opacity-40"
          style={{ 
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.5) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        {/* Bottom cyan glow */}
        <div 
          className="absolute -bottom-32 -left-16 w-56 h-56 rounded-full opacity-30"
          style={{ 
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.5) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        {/* Subtle center accent */}
        <div 
          className="absolute top-1/2 -left-8 w-40 h-40 rounded-full opacity-20"
          style={{ 
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, transparent 70%)',
            filter: 'blur(30px)',
          }}
        />
        {/* Vertical gradient line accent */}
        <div 
          className="absolute top-0 right-0 w-[1px] h-full"
          style={{
            background: 'linear-gradient(180deg, rgba(139, 92, 246, 0.3) 0%, rgba(6, 182, 212, 0.2) 50%, rgba(139, 92, 246, 0.1) 100%)',
          }}
        />
      </div>

      {/* ============================================== */}
      {/* LOGO SECTION - Premium Branding */}
      {/* ============================================== */}
      <Link 
        href="/markets" 
        className="relative flex items-center gap-3 px-5 h-20 border-b border-white/[0.06] group"
      >
        {/* Logo Container with Glow */}
        <div className="relative flex-shrink-0">
          {/* Outer glow ring */}
          <div 
            className="absolute -inset-2 rounded-2xl opacity-60 group-hover:opacity-100 transition-all duration-500"
            style={{
              background: 'conic-gradient(from 180deg at 50% 50%, rgba(139, 92, 246, 0.5) 0deg, rgba(6, 182, 212, 0.5) 120deg, rgba(168, 85, 247, 0.5) 240deg, rgba(139, 92, 246, 0.5) 360deg)',
              filter: 'blur(12px)',
            }}
          />
          {/* Logo Icon */}
          <div 
            className="relative w-11 h-11 rounded-xl flex items-center justify-center group-hover:scale-105 transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.9) 0%, rgba(6, 182, 212, 0.8) 100%)',
              boxShadow: '0 4px 20px -4px rgba(139, 92, 246, 0.5), inset 0 1px 0 rgba(255,255,255,0.2)',
            }}
          >
            <TrendingUp size={20} className="text-white drop-shadow-lg" strokeWidth={2.5} />
          </div>
        </div>
        
        {/* Brand Text */}
        <div className="flex flex-col">
          <span 
            className="font-black text-lg tracking-tight"
            style={{
              background: 'linear-gradient(135deg, #fff 0%, #a78bfa 50%, #22d3ee 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            WAGER
          </span>
          <span className="text-[9px] text-zinc-500 font-medium tracking-[0.25em] uppercase -mt-0.5">
            Protocol
          </span>
        </div>
        
        {/* Sparkle accent */}
        <Sparkles size={12} className="absolute right-5 top-1/2 -translate-y-1/2 text-violet-400/50 group-hover:text-violet-400 transition-colors" />
      </Link>

      {/* ============================================== */}
      {/* LIVE SESSION INDICATOR */}
      {/* ============================================== */}
      <div className="relative px-4 py-4">
        <div 
          className="relative flex items-center gap-3 px-4 py-3 rounded-xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            boxShadow: '0 4px 20px -8px rgba(16, 185, 129, 0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
          }}
        >
          {/* Animated glow pulse */}
          <div 
            className="absolute inset-0 opacity-50"
            style={{
              background: 'radial-gradient(ellipse at 0% 50%, rgba(16, 185, 129, 0.3) 0%, transparent 70%)',
            }}
          />
          
          {/* Zap icon with glow */}
          <div className="relative">
            <div 
              className="absolute inset-0 animate-ping"
              style={{ 
                background: 'rgba(16, 185, 129, 0.4)',
                borderRadius: '50%',
                filter: 'blur(4px)',
              }}
            />
            <Zap 
              size={16} 
              className="relative text-emerald-400" 
              fill="currentColor"
              style={{ filter: 'drop-shadow(0 0 6px rgba(16, 185, 129, 0.8))' }}
            />
          </div>
          
          <div className="relative flex flex-col">
            <span 
              className="text-xs font-bold tracking-wide"
              style={{ 
                color: '#34d399',
                textShadow: '0 0 10px rgba(16, 185, 129, 0.5)',
              }}
            >
              Session Active
            </span>
            <span className="text-[10px] text-emerald-400/60 font-mono">02:34:18 elapsed</span>
          </div>
        </div>
      </div>

      {/* ============================================== */}
      {/* NAVIGATION - Premium Nav Items */}
      {/* ============================================== */}
      <nav className="relative flex-1 px-3 py-2">
        {/* Section Label */}
        <div className="flex items-center gap-2 px-3 mb-4">
          <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
          <span className="text-[9px] text-zinc-600 uppercase tracking-[0.25em] font-semibold">
            Navigate
          </span>
          <div className="h-px flex-1 bg-gradient-to-l from-white/10 to-transparent" />
        </div>
        
        <div className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            
            // Dynamic accent colors
            const accentColors = {
              violet: { glow: 'rgba(139, 92, 246, 0.5)', text: '#a78bfa', bg: 'rgba(139, 92, 246, 0.15)' },
              cyan: { glow: 'rgba(6, 182, 212, 0.5)', text: '#22d3ee', bg: 'rgba(6, 182, 212, 0.15)' },
              emerald: { glow: 'rgba(16, 185, 129, 0.5)', text: '#34d399', bg: 'rgba(16, 185, 129, 0.15)' },
            };
            const accent = accentColors[item.accentColor as keyof typeof accentColors];
            
            return (
              <Link key={item.href} href={item.href}>
                <div 
                  className={`
                    relative flex items-center gap-3 px-4 py-3.5 rounded-xl
                    transition-all duration-300 group
                    ${isActive 
                      ? '' 
                      : 'hover:bg-white/[0.03]'
                    }
                  `}
                  style={isActive ? {
                    background: `linear-gradient(135deg, ${accent.bg} 0%, rgba(255,255,255,0.02) 100%)`,
                    border: `1px solid ${accent.glow.replace('0.5', '0.3')}`,
                    boxShadow: `0 4px 20px -8px ${accent.glow}, inset 0 1px 0 rgba(255,255,255,0.05)`,
                  } : {
                    border: '1px solid transparent',
                  }}
                >
                  {/* Active indicator glow */}
                  {isActive && (
                    <div 
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-full"
                      style={{
                        background: accent.text,
                        boxShadow: `0 0 12px ${accent.glow}, 0 0 24px ${accent.glow}`,
                      }}
                    />
                  )}
                  
                  {/* Icon */}
                  <span 
                    className={`flex-shrink-0 transition-all duration-300 ${
                      isActive ? '' : 'text-zinc-500 group-hover:text-zinc-300'
                    }`}
                    style={isActive ? { 
                      color: accent.text,
                      filter: `drop-shadow(0 0 8px ${accent.glow})`,
                    } : {}}
                  >
                    {item.icon}
                  </span>
                  
                  {/* Label + Sublabel */}
                  <div className="flex flex-col flex-1">
                    <span 
                      className={`text-sm font-semibold transition-colors ${
                        isActive ? 'text-white' : 'text-zinc-400 group-hover:text-white'
                      }`}
                    >
                      {item.label}
                    </span>
                    <span 
                      className={`text-[10px] transition-colors ${
                        isActive ? 'text-zinc-400' : 'text-zinc-600 group-hover:text-zinc-500'
                      }`}
                    >
                      {item.sublabel}
                    </span>
                  </div>
                  
                  {/* Chevron */}
                  <ChevronRight 
                    size={14} 
                    className={`transition-all duration-300 ${
                      isActive 
                        ? 'text-zinc-400 translate-x-0 opacity-100' 
                        : 'text-zinc-600 -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
                    }`}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ============================================== */}
      {/* BOTTOM SECTION - Status + Sign Out */}
      {/* ============================================== */}
      <div className="relative px-3 py-4 border-t border-white/[0.06]">
        {/* Status Indicator */}
        <div 
          className="flex items-center gap-3 px-4 py-3 mb-3 rounded-xl"
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.04)',
          }}
        >
          {/* Pulsing dot */}
          <div className="relative">
            <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-emerald-400/50 animate-ping" />
            <div 
              className="relative w-2.5 h-2.5 rounded-full bg-emerald-400"
              style={{ boxShadow: '0 0 8px rgba(16, 185, 129, 0.8)' }}
            />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-zinc-400 font-medium">All systems</span>
            <span 
              className="text-[10px] font-semibold"
              style={{ 
                color: '#34d399',
                textShadow: '0 0 8px rgba(16, 185, 129, 0.4)',
              }}
            >
              Operational
            </span>
          </div>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group"
          style={{
            background: 'transparent',
            border: '1px solid rgba(244, 63, 94, 0.1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(244, 63, 94, 0.1)';
            e.currentTarget.style.borderColor = 'rgba(244, 63, 94, 0.3)';
            e.currentTarget.style.boxShadow = '0 4px 20px -8px rgba(244, 63, 94, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.borderColor = 'rgba(244, 63, 94, 0.1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <LogOut size={16} className="text-zinc-500 group-hover:text-rose-400 transition-colors" />
          <span className="text-sm font-medium text-zinc-500 group-hover:text-rose-400 transition-colors">
            Sign Out
          </span>
        </button>
      </div>
    </aside>
  );
}
