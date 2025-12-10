'use client'
import { UserCircle } from 'lucide-react'
import { Button } from './ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { createClient } from '../../supabase/client'
import { useRouter } from 'next/navigation'

export default function UserProfile() {
    const supabase = createClient()
    const router = useRouter()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-11 rounded-full px-3 gap-2 bg-white/5 border border-white/10 shadow-[0_0_22px_rgba(139,92,246,0.2)] hover:bg-white/10 transition flex items-center"
                >
                    <span className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500/25 via-cyan-400/20 to-emerald-400/18 blur-md" />
                    <span className="absolute inset-[2px] rounded-full bg-[#0b0f1a]" />
                    <Avatar className="relative h-8 w-8 ring-1 ring-white/10">
                        <AvatarImage
                          src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=facearea&w=200&h=200&q=80"
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-gradient-to-br from-violet-600 to-cyan-500 text-white/80">
                          <UserCircle className="h-5 w-5" />
                        </AvatarFallback>
                    </Avatar>
                    <span className="relative text-sm font-semibold text-white">Alex&apos;s Profile</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="min-w-[160px] bg-[#0b0f1a]/90 backdrop-blur-xl border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.35)]"
            >
                <DropdownMenuItem onClick={async () => {
                    await supabase.auth.signOut()
                    router.refresh()
                }}>
                    Sign out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

    )
}