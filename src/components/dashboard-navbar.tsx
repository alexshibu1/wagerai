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
import { UserCircle, LayoutDashboard, User as UserIcon, LogOut, TrendingUp, Zap, Plus } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import WagerModal from '@/components/wager-modal'

export default function DashboardNavbar() {
  const supabase = createClient()
  const router = useRouter()
  const pathname = usePathname()
  const [hasActiveSession, setHasActiveSession] = useState(false)
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  const [isWagerModalOpen, setIsWagerModalOpen] = useState(false)
  
  // Check for active TDAY session from database
  useEffect(() => {
    const checkActiveSession = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setActiveSessionId(null)
          setHasActiveSession(false)
          return
        }

        const today = new Date()
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999)

        const { data: activeWagers } = await supabase
          .from('wagers')
          .select('id')
          .eq('user_id', user.id)
          .eq('asset_class', 'TDAY')
          .eq('status', 'OPEN')
          .gte('created_at', startOfDay.toISOString())
          .lte('created_at', endOfDay.toISOString())
          .limit(1)
          .single()

        if (activeWagers) {
          setActiveSessionId(activeWagers.id)
          setHasActiveSession(!pathname.startsWith('/session'))
        } else {
          setActiveSessionId(null)
          setHasActiveSession(false)
        }
      } catch (error) {
        setActiveSessionId(null)
        setHasActiveSession(false)
      }
    }
    
    checkActiveSession()
    // Check every 5 seconds for active sessions
    const interval = setInterval(checkActiveSession, 5000)
    return () => clearInterval(interval)
  }, [pathname, supabase])

  return (
    <>
      {/* Top Bar - Minimal */}
      <nav className="w-full border-b border-white/[0.05] glass-panel backdrop-blur-2xl py-3 fixed top-0 z-50">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/markets" prefetch className="data-text text-xl font-bold soft-mint flex items-center gap-2">
              <TrendingUp size={20} />
              WAGER
            </Link>
            
            {/* Active Session Pill */}
            {hasActiveSession && activeSessionId && (
              <Link 
                href={`/session/${activeSessionId}`}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 transition-all animate-pulse-glow"
              >
                <Zap size={12} className="animate-pulse" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider">LIVE: FOCUS MODE</span>
              </Link>
            )}
          </div>
          
          {/* New Position Button (Apple Style) */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsWagerModalOpen(true)}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-medium text-sm flex items-center gap-2 shadow-lg hover:shadow-emerald-500/50 transition-all"
            >
              <Plus size={16} />
              New Position
            </button>
            
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
        </div>
      </nav>

      {/* Floating Dock - Left Side */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-40">
        <div className="glass-panel p-3 flex flex-col gap-3 shadow-2xl">
          <Link href="/markets">
            <Button 
              variant="ghost" 
              size="icon"
              className={`w-12 h-12 rounded-xl transition-all ${
                pathname === '/markets' 
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
      
      {/* Wager Modal */}
      <WagerModal isOpen={isWagerModalOpen} onClose={() => setIsWagerModalOpen(false)} />
    </>
  )
}

