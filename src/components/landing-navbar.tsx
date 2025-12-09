import Link from "next/link";

export function LandingNavbar() {
  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl h-14 rounded-full border border-white/10 bg-slate-950/50 backdrop-blur-xl flex items-center justify-between px-6 z-50 shadow-2xl">
      {/* Logo */}
      <Link href="/" className="text-white font-bold tracking-widest text-sm">
        WAGER
      </Link>

      {/* Center Nav Links - Hidden on mobile */}
      <div className="hidden md:flex items-center gap-6">
        <Link
          href="#protocol"
          className="text-zinc-400 hover:text-white text-xs font-medium transition-colors"
        >
          Protocol
        </Link>
        <Link
          href="#markets"
          className="text-zinc-400 hover:text-white text-xs font-medium transition-colors"
        >
          Markets
        </Link>
        <Link
          href="#manifesto"
          className="text-zinc-400 hover:text-white text-xs font-medium transition-colors"
        >
          Manifesto
        </Link>
      </div>

      {/* CTA Button */}
      <Link
        href="/sign-in"
        className="bg-white/10 hover:bg-white/20 text-white px-4 py-1.5 rounded-full text-xs font-medium transition-all"
      >
        Initialize
      </Link>
    </nav>
  );
}

