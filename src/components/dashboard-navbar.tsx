'use client'

import Link from 'next/link'
import { createClient } from '../../supabase/client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Button } from './ui/button'
import { UserCircle, LayoutDashboard, User as UserIcon, LogOut, TrendingUp, Zap } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function DashboardNavbar() {
  const supabase = createClient()
  const router = useRouter()
  const pathname = usePathname()
  const [hasActiveSession, setHasActiveSession] = useState(false)
  
  useEffect(() => {
    const checkActiveSession = () => {
      const activeSessionId = localStorage.getItem('activeSessionId')
      setHasActiveSession(!!activeSessionId && !pathname.startsWith('/session'))
    }
    
    checkActiveSession()
    
    // Listen for storage changes
    window.addEventListener('storage', checkActiveSession)
    return () => window.removeEventListener('storage', checkActiveSession)
  }, [pathname])

  return (
    <>
      {/* Top Bar - Minimal */}
      <nav className="w-full border-b border-white/[0.05] glass-panel backdrop-blur-2xl py-3 fixed top-0 z-50">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" prefetch className="data-text text-xl font-bold soft-mint flex items-center gap-2">
              <TrendingUp size={20} />
              WAGER
            </Link>
            
            {/* Active Session Pill */}
            {hasActiveSession && (
              <Link 
                href={`/session/${localStorage.getItem('activeSessionId')}`}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 transition-all animate-pulse-glow"
              >
                <Zap size={12} className="animate-pulse" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider">LIVE: FOCUS MODE</span>
              </Link>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-white">
                <UserCircle className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-panel border-white/20">
              <DropdownMenuItem onClick={async () => {
                await supabase.auth.signOut()
                router.refresh()
              }} className="text-coral-rose hover:text-coral-rose/80">
                <LogOut size={14} className="mr-2" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

      {/* Floating Dock - Left Side */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-40">
        <div className="glass-panel p-3 flex flex-col gap-3 shadow-2xl">
          <Link href="/dashboard">
            <Button 
              variant="ghost" 
              size="icon"
              className={`w-12 h-12 rounded-xl transition-all ${
                pathname === '/dashboard' 
                  ? 'bg-soft-mint/10 text-soft-mint border border-soft-mint/20' 
                  : 'text-zinc-500 hover:text-white hover:bg-white/5'
              }`}
              title="Portfolio"
            >
              <LayoutDashboard size={20} />
            </Button>
          </Link>
          <Link href="/profile">
            <Button 
              variant="ghost" 
              size="icon"
              className={`w-12 h-12 rounded-xl transition-all ${
                pathname === '/profile' 
                  ? 'bg-soft-mint/10 text-soft-mint border border-soft-mint/20' 
                  : 'text-zinc-500 hover:text-white hover:bg-white/5'
              }`}
              title="Ledger"
            >
              <UserIcon size={20} />
            </Button>
          </Link>
        </div>
      </div>
    </>
  )
}

