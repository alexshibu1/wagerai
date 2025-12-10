import Link from 'next/link'
import { createClient } from '../../supabase/server'
import { Button } from './ui/button'
import { User, UserCircle } from 'lucide-react'
import UserProfile from './user-profile'

export default async function Navbar() {
  const supabase = createClient()

  const { data: { user } } = await (await supabase).auth.getUser()


  return (
    <nav className="fixed top-0 w-full z-50 bg-transparent backdrop-blur-md border-b border-white/10 py-4">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link href="/" prefetch className="text-2xl font-bold text-white tracking-tight">
          WAGER
        </Link>
        <div className="flex gap-6 items-center">
          {user ? (
            <>
              <Link
                href="/markets"
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Markets
              </Link>
              <UserProfile  />
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link href="/sign-up">
                <Button size="sm" className="px-6">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
