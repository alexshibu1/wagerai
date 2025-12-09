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
import { UserCircle, LayoutDashboard, User as UserIcon } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'

export default function DashboardNavbar() {
  const supabase = createClient()
  const router = useRouter()
  const pathname = usePathname()

  return (
    <nav className="w-full border-b border-white/[0.05] glass-panel backdrop-blur-2xl py-3 sticky top-0 z-50">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" prefetch className="data-text text-xl font-bold electric-teal">
            WAGER
          </Link>
          <div className="flex gap-1">
            <Link href="/dashboard">
              <Button 
                variant="ghost" 
                size="sm"
                className={`font-medium text-xs uppercase tracking-wider ${pathname === '/dashboard' ? 'text-white bg-white/5' : 'text-zinc-500 hover:text-white'}`}
              >
                <LayoutDashboard size={14} className="mr-2" />
                PORTFOLIO
              </Button>
            </Link>
            <Link href="/profile">
              <Button 
                variant="ghost" 
                size="sm"
                className={`font-medium text-xs uppercase tracking-wider ${pathname === '/profile' ? 'text-white bg-white/5' : 'text-zinc-500 hover:text-white'}`}
              >
                <UserIcon size={14} className="mr-2" />
                LEDGER
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex gap-4 items-center">
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
              }}>
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}
