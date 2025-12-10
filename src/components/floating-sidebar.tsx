'use client'

import Link from 'next/link'
import { createClient } from '../../supabase/client'
import {
  LayoutDashboard,
  User as UserIcon,
  LogOut,
  LogIn,
  TrendingUp,
  Zap,
  Plus,
  ChevronRight,
  Sparkles
} from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import WagerModal from '@/components/wager-modal'
import Logo from '@/components/logo'

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
  const [userName, setUserName] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  
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

  useEffect(() => {
    // Check authentication and fetch lightweight profile info
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setIsAuthenticated(!!user)
      
      if (user) {
        const metadata = user.user_metadata ?? {}
        setUserName(
          metadata.full_name ||
            metadata.name ||
            user.email?.split('@')[0] ||
            null
        )
        setUserEmail(user.email ?? null)
        setAvatarUrl(metadata.avatar_url || metadata.picture || null)
      } else {
        setUserName(null)
        setUserEmail(null)
        setAvatarUrl(null)
      }
    }
    
    checkAuth()
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkAuth()
    })
    
    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  const userInitials = useMemo(() => {
    if (userName) {
      return userName
        .split(' ')
        .map((part: string) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    }
    if (userEmail) return userEmail.slice(0, 2).toUpperCase()
    return 'WG'
  }, [userEmail, userName])

  const navItems: NavItem[] = useMemo(() => {
    const items: NavItem[] = [
      { href: '/markets', icon: <LayoutDashboard size={20} />, label: 'Markets' },
      { href: '/profile', icon: <UserIcon size={20} />, label: isAuthenticated ? "Alex's Profile" : 'Profile' },
    ];
    return items;
  }, [isAuthenticated])

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
        {/* Logo / Brand */}
        <Link
          href="/markets"
          className={`
            flex items-center h-12 mb-3 pb-3 border-b border-white/[0.06]
            group transition-all duration-300
            ${isExpanded ? 'px-2 gap-3' : 'justify-center'}
          `}
        >
          <Logo showWordmark={isExpanded} />
        </Link>

        {/* New Position Button - Enhanced Glassy with Amber Theme */}
        {isAuthenticated && (
          <button
            aria-label="Open new position"
            onClick={() => setIsWagerModalOpen(true)}
          className={`
            relative flex items-center h-11 rounded-full mb-2 overflow-hidden
            transition-all group
            ${isExpanded ? 'px-3 gap-3' : 'justify-center'}
          `}
          style={{
            background: 'linear-gradient(165deg, rgba(251, 191, 36, 0.12) 0%, rgba(251, 191, 36, 0.04) 40%, rgba(15, 23, 42, 0.5) 100%)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(251, 191, 36, 0.2)',
            boxShadow: `
              0 8px 24px rgba(0, 0, 0, 0.3),
              0 0 0 1px rgba(255, 255, 255, 0.05) inset,
              0 0 40px rgba(251, 191, 36, 0.25),
              0 0 60px rgba(234, 179, 8, 0.15)
            `
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = `
              0 12px 32px rgba(0, 0, 0, 0.4),
              0 0 0 1px rgba(255, 255, 255, 0.08) inset,
              0 0 60px rgba(251, 191, 36, 0.35),
              0 0 80px rgba(234, 179, 8, 0.2)
            `;
            e.currentTarget.style.borderColor = 'rgba(251, 191, 36, 0.4)';
            e.currentTarget.style.transform = 'scale(1.02)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = `
              0 8px 24px rgba(0, 0, 0, 0.3),
              0 0 0 1px rgba(255, 255, 255, 0.05) inset,
              0 0 40px rgba(251, 191, 36, 0.25),
              0 0 60px rgba(234, 179, 8, 0.15)
            `;
            e.currentTarget.style.borderColor = 'rgba(251, 191, 36, 0.2)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          {/* Inner glow overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Animated glow orb */}
          <span className="absolute right-2 top-1 h-6 w-6 rounded-full bg-amber-400/20 blur-xl group-hover:bg-amber-400/30 transition-all duration-300" />

          <Plus
            size={18}
            className="relative text-amber-300 group-hover:text-amber-200 group-hover:rotate-90 transition-all duration-300 flex-shrink-0"
            style={{
              filter: 'drop-shadow(0 0 12px rgba(251, 191, 36, 0.6))'
            }}
          />
          {isExpanded && (
            <div className="relative flex flex-col items-start leading-tight">
              <span className="text-amber-50 text-sm font-semibold whitespace-nowrap">
                New Position
              </span>
              <span className="text-amber-200/70 text-[11px] font-medium">
                Open & fund instantly
              </span>
            </div>
          )}
          </button>
        )}

        {/* Active Position Pill */}
        {isAuthenticated && hasActiveSession && activeSessionId && (
          <Link
            href={`/session/${activeSessionId}`}
            className={`
              flex items-center h-10 rounded-full mb-3
              bg-emerald-500/15 border border-emerald-400/30
              hover:bg-emerald-500/25 transition-all
              ${isExpanded ? 'px-3 gap-3' : 'justify-center'}
            `}
          >
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 rounded-full bg-emerald-400/40 blur-sm animate-ping" />
              <Zap size={16} className="relative text-emerald-200" />
            </div>
            {isExpanded && (
              <span className="text-emerald-100 text-sm font-semibold whitespace-nowrap">
                Live Position
              </span>
            )}
          </Link>
        )}

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link 
                key={item.href} 
                href={item.href}
                onClick={async (e) => {
                  // Check auth for profile link
                  if (item.href === '/profile' && !isAuthenticated) {
                    e.preventDefault();
                    router.push('/sign-in');
                    return;
                  }
                }}
              >
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
            flex items-center h-11 rounded-full
            text-zinc-400 hover:text-rose-300 hover:bg-rose-500/10
            border border-white/10
            transition-all duration-200 shadow-sm shadow-rose-500/10
            ${isExpanded ? 'px-3 gap-3' : 'justify-center'}
          `}
        >
          <LogOut size={18} className="flex-shrink-0" />
          {isExpanded && (
            <span className="text-sm font-semibold whitespace-nowrap">
              Sign Out
            </span>
          )}
        </button>
      </aside>
      
      {/* Wager Modal - Only show if authenticated */}
      {isAuthenticated && (
        <WagerModal isOpen={isWagerModalOpen} onClose={() => setIsWagerModalOpen(false)} />
      )}
    </>
  )
}
