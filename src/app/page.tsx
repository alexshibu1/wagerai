import { redirect } from "next/navigation";
import { createClient } from "../../supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import CurvedHeroText from "@/components/curved-hero-text";
import { TrendingUp, Zap, Target } from "lucide-react";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // If user is logged in, redirect to dashboard
  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      {/* Hero Section with Midnight Grain */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20">
        
        {/* Subtle pill badge */}
        <div className="mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-slate-300 font-medium tracking-wide">
              Next-generation accountability platform
            </span>
          </div>
        </div>

        {/* Curved Hero Text */}
        <div className="relative w-full max-w-7xl mb-16">
          <CurvedHeroText />
          
          {/* Floating Glass Card - positioned in the center of the curve */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <GlassCard className="p-6 min-w-[280px] animate-float">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">LIVE WAGER</p>
                    <p className="text-sm text-white font-semibold">Deep Work Session</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span className="text-xl font-bold text-emerald-400">+$50</span>
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="mt-4 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full animate-pulse"
                  style={{ width: '67%' }}
                />
              </div>
              <p className="text-xs text-slate-400 mt-2 text-center">40 min remaining</p>
            </GlassCard>
          </div>
        </div>

        {/* Subheading */}
        <p className="text-slate-300 text-lg md:text-xl max-w-2xl text-center mb-12 leading-relaxed">
          A productivity platform that gamifies personal execution through financial metaphors.
          <span className="text-cyan-400 font-semibold"> Wager on your commitments.</span>
          <span className="text-emerald-400 font-semibold"> Build undeniable proof of reliability.</span>
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link href="/sign-up">
            <Button size="lg" className="text-base px-8 py-6">
              Get Started Free
            </Button>
          </Link>
          <Link href="/sign-in">
            <Button 
              size="lg" 
              variant="outline" 
              className="text-base px-8 py-6 bg-white/5 border-white/20 hover:bg-white/10 text-white"
            >
              Watch Demo
            </Button>
          </Link>
        </div>

        {/* Stats Row */}
        <div className="mt-20 grid grid-cols-3 gap-8 md:gap-16">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-white mb-2">10K+</div>
            <div className="text-sm text-slate-400">Active Wagers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-emerald-400 mb-2">94.2%</div>
            <div className="text-sm text-slate-400">Win Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-cyan-400 mb-2">$2M+</div>
            <div className="text-sm text-slate-400">Total Staked</div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-4">
            Your Execution, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Immortalized</span>
          </h2>
          <p className="text-slate-400 text-center mb-16 max-w-2xl mx-auto">
            Three asset classes. One immutable ledger. Zero excuses.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* $TDAY Card */}
            <GlassCard className="p-8 hover:border-cyan-500/50 transition-all duration-300 group">
              <div className="text-cyan-400 text-4xl font-bold mb-4">$TDAY</div>
              <h3 className="text-2xl font-bold text-white mb-3">Intraday Execution</h3>
              <p className="text-slate-400 mb-6">
                Daily tasks with immediate accountability. Win or lose before sunset.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  24-hour settlement
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  High-frequency wins
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  Momentum building
                </div>
              </div>
            </GlassCard>

            {/* $SHIP Card */}
            <GlassCard className="p-8 hover:border-blue-500/50 transition-all duration-300 group">
              <div className="text-blue-400 text-4xl font-bold mb-4">$SHIP</div>
              <h3 className="text-2xl font-bold text-white mb-3">Monthly Futures</h3>
              <p className="text-slate-400 mb-6">
                30-day projects with compounding stakes. Ship or burn the position.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  Monthly milestones
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  Project tracking
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  Higher stakes
                </div>
              </div>
            </GlassCard>

            {/* $YEAR Card */}
            <GlassCard className="p-8 hover:border-purple-500/50 transition-all duration-300 group">
              <div className="text-purple-400 text-4xl font-bold mb-4">$YEAR</div>
              <h3 className="text-2xl font-bold text-white mb-3">Long-Term Bonds</h3>
              <p className="text-slate-400 mb-6">
                Annual goals with legacy stakes. Build generational proof of execution.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  Yearly commitments
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  Maximum stakes
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  Legacy building
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <GlassCard className="p-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to prove yourself?
            </h2>
            <p className="text-slate-300 text-lg mb-8">
              Join the high-agency individuals building an immutable ledger of execution.
            </p>
            <Link href="/sign-up">
              <Button size="lg" className="text-lg px-12 py-6">
                Start Trading Your Time
              </Button>
            </Link>
          </GlassCard>
        </div>
      </section>
    </main>
  );
}
