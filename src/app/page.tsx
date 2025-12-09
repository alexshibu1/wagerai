import { redirect } from "next/navigation";
import { createClient } from "../../supabase/server";
import Link from "next/link";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/markets");
  }

    return (
      <main className="relative min-h-screen w-full bg-[#030014] overflow-hidden">
        {/* Try these alternative backgrounds (uncomment one):
            bg-[#02040a]  - Deep Midnight (original)
            bg-[#0a0a0f]  - Indigo Black (current)
            bg-[#0d0d12]  - Slate Charcoal
            bg-[#0c0a14]  - Purple Void
            bg-[#050a0e]  - Teal Shadow
            bg-[#0a0c0d]  - Steel Night
        */}
        
        {/* LOUD Grainy Notebook Texture */}
        <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-40 mix-blend-soft-light pointer-events-none z-50" />
        <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none z-49" />
        <div className="fixed inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/30 pointer-events-none z-40" />

      {/* 
        PRINCIPLE: Atmospheric Lighting (Massive Blurred Blobs)
        WHY: Creates depth and guides the eye without being distracting
        HOW: Position large, heavily blurred radial gradients behind content layers
      */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Indigo blob behind hero */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-indigo-600/20 rounded-full blur-[150px]" />
        {/* Teal blob behind features */}
        <div className="absolute bottom-1/4 right-1/4 w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[120px]" />
      </div>

      {/* ==================== TICKER STRIP (LIVE GOALS MARKET) ==================== */}
      {/* 
        PRINCIPLE: Infinite Marquee (Dynamic Content)
        WHY: Shows real use cases - people betting on actual life goals
        HOW: Duplicate content + CSS animation translateX(-100%)
        NOTE: Each ticker represents a real goal someone is tracking
      */}
      <section className="relative z-20 w-full bg-white/5 border-y border-white/5 backdrop-blur-xl py-4 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {/* First set of items */}
          <div className="flex items-center gap-12 px-6 font-mono text-sm text-zinc-400 uppercase tracking-wider">
            {/* Daily Task: Talking to Users (Small Win) */}
            <span className="flex items-center gap-2">
              <span className="text-emerald-400">▲</span> 
              <span className="text-white">TALK_5_USERS</span> 
              <span className="text-emerald-400">+2.3%</span>
            </span>

            {/* Project Goal: Shipping MVP (Building Momentum) */}
            <span className="flex items-center gap-2">
              <span className="text-emerald-400">▲</span> 
              <span className="text-white">SHIP_MVP_V1</span> 
              <span className="text-emerald-400">+8.7%</span>
            </span>

            {/* Life Goal: Marathon Training (Hit Mon-Fri Runs) */}
            <span className="flex items-center gap-2">
              <span className="text-emerald-400">▲</span> 
              <span className="text-white">MARATHON_2025</span> 
              <span className="text-emerald-400">+1.4%</span>
            </span>

            {/* Bad Bet: Distraction (Being Crushed) */}
            <span className="flex items-center gap-2">
              <span className="text-rose-400">▼</span> 
              <span className="text-white">SCROLLING_TWITTER</span> 
              <span className="text-rose-400">-5.2%</span>
            </span>

            {/* Daily Habit: Gym (Tiny Consistent Gains) */}
            <span className="flex items-center gap-2">
              <span className="text-emerald-400">▲</span> 
              <span className="text-white">GYM_STREAK</span> 
              <span className="text-emerald-400">+0.8%</span>
            </span>

            {/* Skill Goal: Learning Rust (Good Week) */}
            <span className="flex items-center gap-2">
              <span className="text-teal-400">▲</span> 
              <span className="text-white">LEARN_RUST</span> 
              <span className="text-teal-400">+3.1%</span>
            </span>

            {/* Losing Bet: Missed Deadline (Small Slip) */}
            <span className="flex items-center gap-2">
              <span className="text-rose-400">▼</span> 
              <span className="text-white">LAUNCH_WEEK</span> 
              <span className="text-rose-400">-1.9%</span>
            </span>
          </div>

          {/* Duplicate for seamless loop */}
          <div className="flex items-center gap-12 px-6 font-mono text-sm text-zinc-400 uppercase tracking-wider">
            {/* Daily Task: Talking to Users (Small Win) */}
            <span className="flex items-center gap-2">
              <span className="text-emerald-400">▲</span> 
              <span className="text-white">TALK_5_USERS</span> 
              <span className="text-emerald-400">+2.3%</span>
            </span>

            {/* Project Goal: Shipping MVP (Building Momentum) */}
            <span className="flex items-center gap-2">
              <span className="text-emerald-400">▲</span> 
              <span className="text-white">SHIP_MVP_V1</span> 
              <span className="text-emerald-400">+8.7%</span>
            </span>

            {/* Life Goal: Marathon Training (Hit Mon-Fri Runs) */}
            <span className="flex items-center gap-2">
              <span className="text-emerald-400">▲</span> 
              <span className="text-white">MARATHON_2025</span> 
              <span className="text-emerald-400">+1.4%</span>
            </span>

            {/* Bad Bet: Distraction (Being Crushed) */}
            <span className="flex items-center gap-2">
              <span className="text-rose-400">▼</span> 
              <span className="text-white">SCROLLING_TWITTER</span> 
              <span className="text-rose-400">-5.2%</span>
            </span>

            {/* Daily Habit: Gym (Tiny Consistent Gains) */}
            <span className="flex items-center gap-2">
              <span className="text-emerald-400">▲</span> 
              <span className="text-white">GYM_STREAK</span> 
              <span className="text-emerald-400">+0.8%</span>
            </span>

            {/* Skill Goal: Learning Rust (Good Week) */}
            <span className="flex items-center gap-2">
              <span className="text-teal-400">▲</span> 
              <span className="text-white">LEARN_RUST</span> 
              <span className="text-teal-400">+3.1%</span>
            </span>

            {/* Losing Bet: Missed Deadline (Small Slip) */}
            <span className="flex items-center gap-2">
              <span className="text-rose-400">▼</span> 
              <span className="text-white">LAUNCH_WEEK</span> 
              <span className="text-rose-400">-1.9%</span>
            </span>
          </div>
        </div>
      </section>

      {/* ==================== HERO SECTION ==================== */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-20">
        {/* 
          PRINCIPLE: Brutalist Typography (Massive Scale)
          WHY: Creates immediate visual hierarchy and "stopping power"
          HOW: Use text-7xl/9xl with tracking-tighter (reduces letter spacing for density)
        */}
        <div className="text-center space-y-8 max-w-5xl mx-auto">
          {/* Live Action Pill */}
          <div className="animate-float inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md hover:bg-white/10 transition-colors cursor-default">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </div>
            <span className="text-xs font-mono text-zinc-400">
              <span className="text-white font-bold">@alex_s</span> just wagered <span className="text-emerald-400">$50</span> on <span className="text-zinc-300">Ship MVP</span>
            </span>
          </div>

          <h1 className="text-7xl md:text-9xl font-bold tracking-tighter leading-none">
            SHORT DISTRACTION.
            <br />
            {/* 
              PRINCIPLE: Gradient Text (Visual Hierarchy)
              WHY: Draws attention to key phrase, creates depth through color transition
              HOW: Use bg-gradient-to + bg-clip-text + text-transparent + drop-shadow for depth
            */}
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_8px_16px_rgba(139,92,246,0.5)]">
              LONG FOCUS.
            </span>
          </h1>

          {/* 
            PRINCIPLE: Button Hierarchy (Primary vs Secondary)
            WHY: Clear visual priority guides user action
            HOW: High-contrast solid (primary) vs glass border (secondary)
          */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
            {/* Primary CTA: Maximum contrast */}
            <Link href="/sign-in" className="px-8 py-4 bg-white text-black font-bold text-sm uppercase tracking-wider rounded-lg hover:bg-zinc-100 transition-colors">
              INITIALIZE TERMINAL<span className="animate-pulse">_</span>
            </Link>
            {/* Secondary CTA: Glass aesthetic */}
            <Link href="/markets" className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold text-sm uppercase tracking-wider rounded-lg hover:bg-white/10 transition-colors backdrop-blur-xl">
              VIEW GLOBAL ORDER BOOK
            </Link>
          </div>
        </div>

        {/* 
          PRINCIPLE: 3D Transform ("The Money Shot")
          WHY: Creates illusion of depth, makes UI feel tangible and premium
          HOW: perspective-1000 on parent, then rotateX/Y on child element
          NOTE: Perspective creates vanishing point; rotation tilts the element into 3D space
        */}
        <div className="mt-20 w-full max-w-4xl mx-auto" style={{ perspective: "1000px" }}>
          <div 
            className="relative bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl"
            style={{ 
              transform: "rotateX(12deg) rotateY(-4deg)",
              transformStyle: "preserve-3d"
            }}
          >
            {/* Glow effect underneath the card */}
            <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-3/4 h-40 bg-emerald-500/20 blur-3xl -z-10" />

            {/* 
              PRINCIPLE: Dashboard Mockup (Visual Proof)
              WHY: Shows the product in action without actual implementation
              HOW: Use simple divs to simulate dashboard UI elements
            */}
            
            {/* Market Status Indicator - Top Right */}
            <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-md border border-emerald-500/30 rounded-lg">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">MARKET OPEN</span>
            </div>

            {/* Header Stats Row */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="space-y-1">
                <div className="text-xs text-zinc-500 font-mono uppercase tracking-wider">Portfolio</div>
                <div className="text-5xl font-bold text-emerald-400 font-mono">$24,891</div>
                <div className="text-xs text-emerald-400 font-mono">+12.4%</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-zinc-500 font-mono uppercase tracking-wider">Focus Yield</div>
                <div className="text-2xl font-bold text-white font-mono">14.2%</div>
                <div className="text-xs text-teal-400 font-mono">+2.1%</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-zinc-500 font-mono uppercase tracking-wider">Win Rate</div>
                <div className="text-2xl font-bold text-white font-mono">73%</div>
                <div className="text-xs text-zinc-400 font-mono">Last 30d</div>
              </div>
            </div>

            {/* Fake Graph Line */}
            <div className="relative h-32 bg-white/[0.01] rounded-xl border border-white/5 mb-6 overflow-hidden">
              {/* Simplified line chart visual */}
              <svg viewBox="0 0 400 100" className="w-full h-full">
                <polyline
                  points="0,80 50,65 100,70 150,45 200,50 250,30 300,35 350,20 400,25"
                  fill="none"
                  stroke="url(#lineGradient)"
                  strokeWidth="2"
                  className="drop-shadow-lg"
                />
                <defs>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#14b8a6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Ticker Rows (Simulated) */}
            <div className="space-y-3">
              {[
                { symbol: "$TDAY", name: "Today", price: "24.50", change: "+4.2%", positive: true },
                { symbol: "$SHIP", name: "This Week", price: "142.80", change: "+8.1%", positive: true },
                { symbol: "$YEAR", name: "Annual Goals", price: "1,840.00", change: "-2.3%", positive: false },
              ].map((ticker) => (
                <div key={ticker.symbol} className="flex items-center justify-between py-2 border-t border-white/5">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-white">{ticker.symbol}</span>
                    <span className="text-sm text-zinc-500">{ticker.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-sm text-white">${ticker.price}</span>
                    <span className={`font-mono text-sm ${ticker.positive ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {ticker.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== THE PROTOCOL LOOP ==================== */}
      <section className="relative z-10 w-full py-32">
        {/* Background Effects - FROM FIRST SECTION */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal-500/10 rounded-full blur-[150px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          {/* Section Header - FROM FIRST SECTION */}
          <div className="text-center mb-20 space-y-6">
            <div className="inline-block px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-xl mb-4">
              <span className="text-xs uppercase tracking-widest text-zinc-400 font-medium">How It Works</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-white">
              The Protocol Loop
            </h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Three steps from attention deficit to attention surplus.
            </p>
          </div>

          {/* Horizontal Steps with Connecting Lines - FROM SECOND SECTION */}
          <div className="relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-20 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500/20 via-cyan-500/40 to-emerald-500/20" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
              
              {/* Step 1: Inject Liquidity */}
              <div className="relative">
                {/* Massive Watermark Number */}
                <div className="absolute -top-8 -left-4 text-[200px] font-bold text-white/[0.03] leading-none pointer-events-none select-none">
                  01
                </div>
                
                <div className="relative bg-white/[0.02] backdrop-blur-xl border border-violet-500/20 rounded-3xl p-8 hover:bg-white/[0.04] transition-all duration-300">
                  {/* Step Indicator */}
                  <div className="w-12 h-12 rounded-full bg-violet-500/20 border-2 border-violet-500/50 flex items-center justify-center mb-6 relative z-10">
                    <span className="text-violet-400 font-bold font-mono text-lg">01</span>
                  </div>

                  <h3 className="text-3xl font-bold tracking-tighter text-white mb-4">
                    Inject Liquidity
                  </h3>
                  
                  <p className="text-zinc-400 leading-relaxed mb-4">
                    Set your stakes. Define the hours.
                  </p>

                  {/* Visual: Input mockup */}
                  <div className="bg-black/40 border border-violet-500/30 rounded-xl p-4 font-mono">
                    <div className="text-xs text-zinc-500 mb-2">STAKE AMOUNT</div>
                    <div className="text-2xl font-bold text-white">$100.00</div>
                    <div className="text-xs text-violet-400 mt-2">4 HOURS • HIGH RISK</div>
                  </div>
                </div>
              </div>

              {/* Step 2: Open Position */}
              <div className="relative">
                {/* Massive Watermark Number */}
                <div className="absolute -top-8 -left-4 text-[200px] font-bold text-white/[0.03] leading-none pointer-events-none select-none">
                  02
                </div>
                
                <div className="relative bg-white/[0.02] backdrop-blur-xl border border-cyan-500/20 rounded-3xl p-8 hover:bg-white/[0.04] transition-all duration-300">
                  {/* Step Indicator */}
                  <div className="w-12 h-12 rounded-full bg-cyan-500/20 border-2 border-cyan-500/50 flex items-center justify-center mb-6 relative z-10">
                    <span className="text-cyan-400 font-bold font-mono text-lg">02</span>
                  </div>

                  <h3 className="text-3xl font-bold tracking-tighter text-white mb-4">
                    Open Position
                  </h3>
                  
                  <p className="text-zinc-400 leading-relaxed mb-4">
                    Lock in tasks. The market opens.
                  </p>

                  {/* Visual: Task lock */}
                  <div className="bg-black/40 border border-cyan-500/30 rounded-xl p-4 font-mono">
                    <div className="text-xs text-zinc-500 mb-2">ACTIVE CONTRACT</div>
                    <div className="text-sm text-white mb-2">Ship Landing Page V2</div>
                    <div className="flex items-center gap-2">
                      <div className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
                      </div>
                      <div className="text-xs text-cyan-400">POSITION OPEN</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: Settlement */}
              <div className="relative">
                {/* Massive Watermark Number */}
                <div className="absolute -top-8 -left-4 text-[200px] font-bold text-white/[0.03] leading-none pointer-events-none select-none">
                  03
                </div>
                
                <div className="relative bg-white/[0.02] backdrop-blur-xl border border-emerald-500/20 rounded-3xl p-8 hover:bg-white/[0.04] transition-all duration-300">
                  {/* Step Indicator */}
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 border-2 border-emerald-500/50 flex items-center justify-center mb-6 relative z-10">
                    <span className="text-emerald-400 font-bold font-mono text-lg">03</span>
                  </div>

                  <h3 className="text-3xl font-bold tracking-tighter text-white mb-4">
                    Settlement
                  </h3>
                  
                  <p className="text-zinc-400 leading-relaxed mb-4">
                    Execute or Liquidate. P&L is realized.
                  </p>

                  {/* Visual: P&L Display */}
                  <div className="bg-black/40 border border-emerald-500/30 rounded-xl p-4 font-mono">
                    <div className="text-xs text-zinc-500 mb-2">PROFIT & LOSS</div>
                    <div className="text-2xl font-bold text-emerald-400">+$120.00</div>
                    <div className="text-xs text-emerald-400 mt-2">+20% ROI • EXECUTED</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ==================== NEW SECTION 2: MARKET ANALYSIS (COMPARISON TABLE) ==================== */}
      <section className="relative z-10 w-full py-32">
        {/* Premium Background Effects - Multiple Layers */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute bottom-0 right-1/4 w-[1000px] h-[1000px] bg-indigo-500/20 rounded-full blur-[200px]" />
          <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-purple-500/10 rounded-full blur-[180px]" />
          <div className="absolute bottom-1/3 left-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[160px]" />
        </div>

        <div className="max-w-6xl mx-auto px-4 relative z-10">
          {/* Section Header - Enhanced */}
          <div className="text-center mb-20 space-y-6">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-full backdrop-blur-2xl shadow-lg">
              <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-rose-400 to-purple-400 animate-pulse" />
              <span className="text-xs uppercase tracking-[0.2em] text-white/90 font-bold">Market Analysis</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter">
              <span className="bg-gradient-to-br from-white via-white to-zinc-400 bg-clip-text text-transparent">
                Why Traditional Tools
              </span>
              <br />
              <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                Are Inflationary
              </span>
            </h2>
          </div>

          {/* Premium Glass Comparison Table - Multi-layer Depth */}
          <div className="relative group">
            {/* Outer glow layer */}
            <div className="absolute -inset-[2px] bg-gradient-to-r from-rose-500/30 via-purple-500/30 to-emerald-500/30 rounded-[28px] opacity-0 group-hover:opacity-100 blur-2xl transition-all duration-700" />
            
            {/* Main glass container - multiple backdrop layers */}
            <div className="relative">
              {/* Inner shadow for depth */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-transparent rounded-[26px] pointer-events-none" />
              
              <div className="relative bg-black/40 backdrop-blur-2xl border border-white/20 rounded-[26px] p-10 md:p-14 shadow-2xl font-mono overflow-hidden">
                {/* Subtle animated gradient overlay */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                
                {/* Content */}
                <div className="relative z-10">
                
                {/* Premium Table Header */}
                <div className="grid grid-cols-3 gap-8 mb-12 pb-8 border-b border-white/10">
                  <div className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-bold">Metric</div>
                  
                  {/* Standard Column Header */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="px-4 py-2 bg-gradient-to-br from-rose-500/20 to-rose-600/10 border border-rose-500/40 rounded-xl backdrop-blur-sm">
                      <span className="text-xs uppercase tracking-[0.15em] text-rose-300 font-bold">Legacy</span>
                    </div>
                    <span className="text-xs text-zinc-500">Standard To-Do</span>
                  </div>
                  
                  {/* Wager Column Header */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="px-4 py-2 bg-gradient-to-br from-emerald-500/20 to-teal-600/10 border border-emerald-500/40 rounded-xl backdrop-blur-sm">
                      <span className="text-xs uppercase tracking-[0.15em] text-emerald-300 font-bold">Protocol</span>
                    </div>
                    <span className="text-xs text-zinc-500">WAGER System</span>
                  </div>
                </div>

                {/* Premium Table Rows */}
                <div className="space-y-1">
                  
                  {/* Row 1: Accountability */}
                  <div className="grid grid-cols-3 gap-8 items-center py-6 px-4 rounded-2xl hover:bg-white/[0.03] transition-all duration-300 group/row">
                    <div className="text-white font-bold text-base tracking-tight">Accountability</div>
                    <div className="flex justify-center">
                      <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-sm font-medium backdrop-blur-sm shadow-lg shadow-rose-500/5">
                        None
                      </span>
                    </div>
                    <div className="flex justify-center">
                      <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-sm font-medium backdrop-blur-sm shadow-lg shadow-emerald-500/10">
                        Skin in the Game
                      </span>
                    </div>
                  </div>

                  {/* Subtle divider */}
                  <div className="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

                  {/* Row 2: Asset Value */}
                  <div className="grid grid-cols-3 gap-8 items-center py-6 px-4 rounded-2xl hover:bg-white/[0.03] transition-all duration-300 group/row">
                    <div className="text-white font-bold text-base tracking-tight">Asset Value</div>
                    <div className="flex justify-center">
                      <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-sm font-medium backdrop-blur-sm shadow-lg shadow-rose-500/5">
                        Depreciating
                      </span>
                    </div>
                    <div className="flex justify-center">
                      <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-sm font-medium backdrop-blur-sm shadow-lg shadow-emerald-500/10">
                        Compound Growth
                      </span>
                    </div>
                  </div>

                  {/* Subtle divider */}
                  <div className="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

                  {/* Row 3: Risk Profile */}
                  <div className="grid grid-cols-3 gap-8 items-center py-6 px-4 rounded-2xl hover:bg-white/[0.03] transition-all duration-300 group/row">
                    <div className="text-white font-bold text-base tracking-tight">Risk Profile</div>
                    <div className="flex justify-center">
                      <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-sm font-medium backdrop-blur-sm shadow-lg shadow-rose-500/5">
                        Risk-Free (Boring)
                      </span>
                    </div>
                    <div className="flex justify-center">
                      <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-sm font-medium backdrop-blur-sm shadow-lg shadow-emerald-500/10">
                        High Stakes (Focus)
                      </span>
                    </div>
                  </div>

                  {/* Subtle divider */}
                  <div className="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

                  {/* Row 4: Outcome */}
                  <div className="grid grid-cols-3 gap-8 items-center py-6 px-4 rounded-2xl hover:bg-white/[0.03] transition-all duration-300 group/row">
                    <div className="text-white font-bold text-base tracking-tight">Outcome</div>
                    <div className="flex justify-center">
                      <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-sm font-medium backdrop-blur-sm shadow-lg shadow-rose-500/5">
                        Procrastination
                      </span>
                    </div>
                    <div className="flex justify-center">
                      <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-sm font-medium backdrop-blur-sm shadow-lg shadow-emerald-500/10">
                        Proof of Work
                      </span>
                    </div>
                  </div>

                </div>

                {/* Premium Terminal Footer */}
                <div className="mt-12 pt-8 border-t border-gradient-to-r from-transparent via-white/10 to-transparent">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm">
                        <span className="text-[10px] uppercase tracking-[0.15em] text-zinc-400 font-bold">Terminal</span>
                      </div>
                      <span className="text-xs text-zinc-500 font-mono">v1.0.0</span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-lg shadow-emerald-400/50"></span>
                        </span>
                        <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Live</span>
                      </div>
                      <div className="h-3 w-px bg-white/10" />
                      <span className="text-xs text-zinc-500">Real-time data</span>
                    </div>
                  </div>
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== NEW SECTION 3: THE MANIFESTO (TYPOGRAPHY) ==================== */}
      <section className="relative z-10 w-full py-12 bg-gradient-to-br from-indigo-50 via-purple-50 to-violet-100 overflow-hidden">
        {/* Premium atmospheric gradient matching our color palette */}
        
        {/* Atmospheric Blobs - Light versions */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-indigo-200/30 rounded-full blur-[150px]" />
          <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-purple-200/20 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 right-1/3 w-[400px] h-[400px] bg-violet-200/25 rounded-full blur-[100px]" />
        </div>
        
        {/* Subtle paper texture overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-multiply" />
        
        {/* Enhanced vignette for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/[0.03] via-transparent to-black/[0.08]" />
        
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          
          {/* Massive Editorial Typography */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-black/10 to-black/5 border border-black/20 rounded-full mb-4 backdrop-blur-sm shadow-lg">
              <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 animate-pulse" />
              <span className="text-xs uppercase tracking-[0.2em] text-black/70 font-bold">The Manifesto</span>
            </div>

            {/* Main Quote - Parallax effect on scroll */}
            <blockquote className="space-y-6">
              <p className="text-5xl md:text-6xl lg:text-7xl font-bold text-black leading-tight tracking-tight">
                Time is the only asset you cannot hedge.
              </p>
              
              <p className="text-5xl md:text-6xl lg:text-7xl font-bold text-black leading-tight tracking-tight">
                You are <span className="italic">technically short</span> on time from the moment you are born.
              </p>
              
              <p className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
                <span className="bg-black text-zinc-50 px-4 py-2">
                  Wager
                </span>{" "}
                <span className="text-black">
                  gives you the tools to manage that risk.
                </span>
              </p>
            </blockquote>

            {/* Attribution */}
            <div className="pt-8">
              <div className="h-px bg-gradient-to-r from-transparent via-black/20 to-transparent mb-8" />
              <p className="text-lg text-black/70 font-mono">
                — Alex
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== NEW SECTION 4: RISK DISCLOSURE (FAQ) ==================== */}
      <section className="relative z-10 w-full py-32 bg-[#030014]">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 right-1/4 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-4xl mx-auto px-4 relative z-10">
          {/* Section Header */}
          <div className="mb-16 space-y-4">
            <div className="inline-block px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-xl mb-4">
              <span className="text-xs uppercase tracking-widest text-zinc-400 font-medium">Legal Disclosure</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-white">
              Risk Disclosure
            </h2>
            <p className="text-xl text-zinc-400 leading-relaxed">
              Read carefully. This is not a game. (Actually, it is.)
            </p>
          </div>

          {/* FAQ Items - Legal Document Style */}
          <div className="space-y-6">
            
            {/* Question 1 */}
            <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/[0.04] transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-violet-500/20 border border-violet-500/40 flex items-center justify-center">
                  <span className="text-violet-400 font-bold text-sm">?</span>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-white">
                    Is this real money?
                  </h3>
                  <p className="text-zinc-400 leading-relaxed">
                    No. It's a simulated economy of attention. Your "stake" is tracked in a virtual wallet. The only thing at risk is your ego and your reputation score.
                  </p>
                </div>
              </div>
            </div>

            {/* Question 2 */}
            <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/[0.04] transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center">
                  <span className="text-rose-400 font-bold text-sm">?</span>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-white">
                    What happens if I lose?
                  </h3>
                  <p className="text-zinc-400 leading-relaxed">
                    Your "Reliability Score" drops. Your friends see it. Your past self judges you. You feel the sting of public accountability. Then you learn, adapt, and come back stronger.
                  </p>
                </div>
              </div>
            </div>

            {/* Question 3 */}
            <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/[0.04] transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
                  <span className="text-cyan-400 font-bold text-sm">?</span>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-white">
                    Can I cheat?
                  </h3>
                  <p className="text-zinc-400 leading-relaxed">
                    You can cheat the market, but you cannot cheat the mirror. The system is designed to make self-deception expensive and honesty profitable.
                  </p>
                </div>
              </div>
            </div>

            {/* Legal Footer */}
            <div className="mt-12 pt-8 border-t border-white/5">
              <p className="text-xs text-zinc-500 font-mono leading-relaxed">
                DISCLAIMER: WAGER is a productivity tool, not a financial instrument. No actual currency is exchanged. 
                Past performance does not guarantee future results. Your mileage may vary. Side effects may include 
                increased focus, reduced procrastination, and an uncomfortable awareness of how you spend your time. 
                Consult your therapist before starting any new accountability protocol.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== GLOBAL LEDGER TICKER (BOTTOM CTA) ==================== */}
      <section className="relative z-10 w-full bg-white/5 border-t border-white/5 backdrop-blur-xl py-12 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4">
          {/* Headline */}
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-white mb-2">
              Don't trust. Verify.
            </h2>
            <p className="text-zinc-400 text-sm">
              Every settlement is public. See who's winning (and who's lying).
            </p>
          </div>

          {/* Live Settlements Ticker */}
          <div className="relative overflow-hidden bg-black/40 border border-white/10 rounded-2xl py-6 mb-8">
            <div className="flex animate-marquee whitespace-nowrap">
              {/* First set */}
              <div className="flex items-center gap-8 px-4 font-mono text-sm">
                <span className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span className="text-zinc-400">Sarah just cashed out</span>
                  <span className="text-emerald-400 font-bold">+$500</span>
                  <span className="text-zinc-500">on MVP launch</span>
                </span>
                <span className="text-white/20">•</span>
                <span className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span className="text-zinc-400">Mike executed</span>
                  <span className="text-emerald-400 font-bold">+$200</span>
                  <span className="text-zinc-500">on gym streak</span>
                </span>
                <span className="text-white/20">•</span>
                <span className="flex items-center gap-2">
                  <span className="text-rose-400">✗</span>
                  <span className="text-zinc-400">Alex liquidated</span>
                  <span className="text-rose-400 font-bold">-$150</span>
                  <span className="text-zinc-500">on deadline miss</span>
                </span>
                <span className="text-white/20">•</span>
                <span className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span className="text-zinc-400">Jamie won</span>
                  <span className="text-emerald-400 font-bold">+$320</span>
                  <span className="text-zinc-500">on code review</span>
                </span>
                <span className="text-white/20">•</span>
              </div>

              {/* Duplicate for seamless loop */}
              <div className="flex items-center gap-8 px-4 font-mono text-sm">
                <span className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span className="text-zinc-400">Sarah just cashed out</span>
                  <span className="text-emerald-400 font-bold">+$500</span>
                  <span className="text-zinc-500">on MVP launch</span>
                </span>
                <span className="text-white/20">•</span>
                <span className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span className="text-zinc-400">Mike executed</span>
                  <span className="text-emerald-400 font-bold">+$200</span>
                  <span className="text-zinc-500">on gym streak</span>
                </span>
                <span className="text-white/20">•</span>
                <span className="flex items-center gap-2">
                  <span className="text-rose-400">✗</span>
                  <span className="text-zinc-400">Alex liquidated</span>
                  <span className="text-rose-400 font-bold">-$150</span>
                  <span className="text-zinc-500">on deadline miss</span>
                </span>
                <span className="text-white/20">•</span>
                <span className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span className="text-zinc-400">Jamie won</span>
                  <span className="text-emerald-400 font-bold">+$320</span>
                  <span className="text-zinc-500">on code review</span>
                </span>
                <span className="text-white/20">•</span>
              </div>
            </div>
          </div>

          {/* CTA Link */}
          <div className="text-center">
            <Link 
              href="/markets" 
              className="inline-flex items-center gap-2 text-white hover:text-emerald-400 transition-colors font-mono text-sm font-bold uppercase tracking-wider group"
            >
              <span>Audit the Public Ledger</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom Spacing */}
      <div className="h-20" />
    </main>
  );
}
