'use client'
import { useState, useEffect } from 'react'
import { UserCircle } from 'lucide-react'
import { Button } from './ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { createClient } from '../../supabase/client'
import { useRouter } from 'next/navigation'
import { getUserProfile } from '@/app/actions/wager-actions'

export default function UserProfile() {
    const supabase = createClient()
    const router = useRouter()
    const [userName, setUserName] = useState<string | null>(null)
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

    useEffect(() => {
        const loadProfile = async () => {
            const profile = await getUserProfile()
            if (profile) {
                setUserName(profile.name)
                setAvatarUrl(profile.avatar_url)
            }
        }
        loadProfile()
    }, [])

    const displayName = userName || 'Profile'
    const initials = userName 
        ? userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
        : 'U'

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
                          src={avatarUrl || undefined}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-gradient-to-br from-violet-600 to-cyan-500 text-white/80">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <span className="relative text-sm font-semibold text-white">{displayName}&apos;s Profile</span>
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