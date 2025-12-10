'use client'

import Link from 'next/link'
import { createClient } from '../../supabase/client'
import { 
  LayoutDashboard, 
  User as UserIcon, 
  LogOut, 
  TrendingUp, 
  Zap, 
  Plus,
  ChevronRight
} from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import WagerModal from '@/components/wager-modal'

interface NavItem {
  href: string
  icon: React.ReactNode
  label: string
}

export default function FloatingSidebar() {
  const supabase = createClient()
  const router = useRouter()
  const pathname = usePathname()
  const [hasActiveSession, setHasActiveSession] = useState(false)
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  const [isWagerModalOpen, setIsWagerModalOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  
  useEffect(() => {
    const checkActiveSession = () => {
      const sessionId = localStorage.getItem('activeSessionId')
      setActiveSessionId(sessionId)
      setHasActiveSession(!!sessionId && !pathname.startsWith('/session'))
    }
    
    checkActiveSession()
    window.addEventListener('storage', checkActiveSession)
    return () => window.removeEventListener('storage', checkActiveSession)
  }, [pathname])

  const navItems: NavItem[] = [
    { href: '/markets', icon: <LayoutDashboard size={20} />, label: 'Markets' },
    { href: '/profile', icon: <UserIcon size={20} />, label: 'Profile' },
  ]

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <>
      {/* Floating Glass Sidebar */}
      <aside 
        className={`
          fixed left-4 top-1/2 -translate-y-1/2 z-50
          floating-glass-sidebar
          flex flex-col p-2
          transition-all duration-300 ease-out
          ${isExpanded ? 'w-48' : 'w-14'}
        `}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Logo / Brand - Premium SaaS Style */}
        <Link 
          href="/markets" 
          className={`
            flex items-center h-12 mb-3 pb-3 border-b border-white/[0.06]
            group transition-all duration-300
            ${isExpanded ? 'px-2 gap-3' : 'justify-center'}
          `}
        >
          {/* Logo Icon with Glow */}
          <div className="relative flex-shrink-0">
            {/* Glow effect behind logo - subtle breathing animation */}
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 animate-logo-glow group-hover:opacity-75 transition-opacity" />
            {/* Logo container */}
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/25 group-hover:shadow-violet-500/40 transition-all group-hover:scale-105">
              <TrendingUp size={18} className="text-white drop-shadow-sm" strokeWidth={2.5} />
            </div>
          </div>
          {isExpanded && (
            <div className="flex flex-col">
              <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-zinc-400 tracking-tight text-base">
                WAGER
              </span>
              <span className="text-[10px] text-zinc-500 font-medium tracking-widest uppercase -mt-0.5">
                Protocol
              </span>
            </div>
          )}
        </Link>

        {/* Active Session Indicator */}
        {hasActiveSession && activeSessionId && (
          <Link 
            href={`/session/${activeSessionId}`}
            className={`
              flex items-center h-10 rounded-xl mb-1
              bg-emerald-500/20 border border-emerald-500/30
              hover:bg-emerald-500/30 transition-all
              ${isExpanded ? 'px-2 gap-3' : 'justify-center'}
            `}
          >
            <Zap size={18} className="text-emerald-400 animate-pulse flex-shrink-0" />
            {isExpanded && (
              <span className="text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider whitespace-nowrap">
                Live
              </span>
            )}
          </Link>
        )}

        {/* New Position Button */}
        <button
          onClick={() => setIsWagerModalOpen(true)}
          className={`
            flex items-center h-10 rounded-xl mb-2
            bg-gradient-to-r from-emerald-500/20 to-teal-500/20
            border border-emerald-500/30
            hover:from-emerald-500/30 hover:to-teal-500/30
            transition-all group
            ${isExpanded ? 'px-2 gap-3' : 'justify-center'}
          `}
        >
          <Plus size={18} className="text-emerald-400 group-hover:rotate-90 transition-transform flex-shrink-0" />
          {isExpanded && (
            <span className="text-emerald-400 text-sm font-medium whitespace-nowrap">
              New Position
            </span>
          )}
        </button>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <div className={`
                  flex items-center h-10 rounded-xl
                  transition-all duration-200
                  ${isActive 
                    ? 'nav-item-active text-white' 
                    : 'text-zinc-500 hover:text-white hover:bg-white/5'
                  }
                  ${isExpanded ? 'px-2 gap-3' : 'justify-center'}
                `}>
                  <span className="flex-shrink-0">{item.icon}</span>
                  {isExpanded && (
                    <>
                      <span className="text-sm font-medium whitespace-nowrap">
                        {item.label}
                      </span>
                      {isActive && (
                        <ChevronRight size={14} className="ml-auto text-violet-400" />
                      )}
                    </>
                  )}
                </div>
              </Link>
            )
          })}
        </nav>

        {/* Spacer */}
        <div className="flex-1 min-h-4" />

        {/* Sign Out */}
        <button
          onClick={handleSignOut}
          className={`
            flex items-center h-10 rounded-xl
            text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10
            transition-all duration-200
            ${isExpanded ? 'px-2 gap-3' : 'justify-center'}
          `}
        >
          <LogOut size={18} className="flex-shrink-0" />
          {isExpanded && (
            <span className="text-sm font-medium whitespace-nowrap">
              Sign Out
            </span>
          )}
        </button>
      </aside>
      
      {/* Wager Modal */}
      <WagerModal isOpen={isWagerModalOpen} onClose={() => setIsWagerModalOpen(false)} />
    </>
  )
}
