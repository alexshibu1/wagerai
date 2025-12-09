'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import VinylPlayer from '@/components/vinyl-player';
import { 
  Flame, 
  Trophy, 
  Wallet, 
  Waves, 
  CheckCircle2, 
  Timer,
  Target,
  Moon,
  Sun,
  X
} from 'lucide-react';

// Mock high-value tasks
const MOCK_TASKS = [
  { id: '1', title: 'Deep Research: Competitor Analysis', duration: 45, wager: 50 },
  { id: '2', title: 'Ship Landing Page Update', duration: 60, wager: 75 },
  { id: '3', title: 'Outreach: 10 Cold DMs', duration: 30, wager: 35 },
];

// Mock user data
const USER_DATA = {
  availableCapital: 1000.00,
  currentStreak: 12,
  reliabilityRating: 'AAA',
};

export default function NewSessionPage() {
  const router = useRouter();
  
  // Page states
  const [mode, setMode] = useState<'setup' | 'scanning' | 'active'>('setup');
  const [selectedTask, setSelectedTask] = useState(MOCK_TASKS[0]);
  const [customTask, setCustomTask] = useState('');
  const [duration, setDuration] = useState(45);
  const [wagerAmount, setWagerAmount] = useState([50]);
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // NFC Scanning Animation
  const handleNFCScan = () => {
    setMode('scanning');
    
    // Simulate 1.5s NFC scan delay (the expensive feeling)
    setTimeout(() => {
      setMode('active');
      
      // Store session in localStorage
      const sessionId = `session-${Date.now()}`;
      localStorage.setItem('activeSessionId', sessionId);
      
      // Navigate to the active session after animation
      setTimeout(() => {
        router.push(`/session/${sessionId}`);
      }, 500);
    }, 1500);
  };
  
  const handleSelectTask = (task: typeof MOCK_TASKS[0]) => {
    setSelectedTask(task);
    setDuration(task.duration);
    setWagerAmount([task.wager]);
  };

  if (mode === 'scanning') {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden">
        {/* Grain Texture */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none z-10 bg-[url('data:image/svg+xml,%3Csvg viewBox=\"0 0 400 400\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noiseFilter\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.9\" numOctaves=\"4\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noiseFilter)\"/%3E%3C/svg%3E')]"></div>
        
        {/* Expanding Green Glow */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-64 h-64 rounded-full bg-emerald-500/30 blur-3xl animate-pulse"></div>
        </div>
        
        {/* NFC Scanning Animation */}
        <div className="relative z-20 flex flex-col items-center gap-6">
          <div className="relative">
            {/* Pulsing Rings */}
            <div className="absolute inset-0 animate-ping">
              <div className="w-32 h-32 rounded-full border-2 border-emerald-400/50"></div>
            </div>
            <div className="absolute inset-0 animate-pulse" style={{ animationDelay: '0.3s' }}>
              <div className="w-32 h-32 rounded-full border-2 border-emerald-400/30"></div>
            </div>
            
            {/* Center Icon */}
            <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-[0_0_60px_rgba(16,185,129,0.6)]">
              <Waves size={48} className="text-white" />
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-400 mb-2 font-mono">
              AUTHENTICATING
            </div>
            <div className="text-sm text-zinc-500 uppercase tracking-wider">
              Hold Near NFC Tag
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'active') {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden">
        {/* Success Checkmark Animation */}
        <div className="relative z-20 flex flex-col items-center gap-6">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-[0_0_60px_rgba(16,185,129,0.6)] animate-in fade-in zoom-in duration-300">
            <CheckCircle2 size={64} className="text-white" />
          </div>
          
          <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-3xl font-bold text-emerald-400 mb-2 font-mono">
              LOCKED IN
            </div>
            <div className="text-sm text-zinc-400">
              Redirecting to focus mode...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-slate-950 relative overflow-hidden py-12 px-4">
      {/* Grain Texture */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none z-10 bg-[url('data:image/svg+xml,%3Csvg viewBox=\"0 0 400 400\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noiseFilter\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.9\" numOctaves=\"4\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noiseFilter)\"/%3E%3C/svg%3E')]"></div>
      
      {/* Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-indigo-500/20 to-teal-500/20 blur-3xl pointer-events-none"></div>
      
      {/* Close Button */}
      <button
        onClick={() => router.push('/dashboard')}
        className="absolute top-6 right-6 z-50 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all"
      >
        <X size={20} className="text-zinc-400" />
      </button>
      
      {/* User Stats Bar */}
      <div className="relative z-20 max-w-2xl mx-auto mb-8">
        <div className="glass-panel p-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div>
              <div className="label-text text-[9px] mb-1">AVAILABLE CAPITAL</div>
              <div className="data-text text-lg font-bold text-emerald-400">
                ${USER_DATA.availableCapital.toFixed(2)}
              </div>
            </div>
            <div className="h-8 w-px bg-white/10"></div>
            <div>
              <div className="label-text text-[9px] mb-1">STREAK</div>
              <div className="data-text text-lg font-bold flex items-center gap-1">
                {USER_DATA.currentStreak}
                <Flame size={14} className="text-orange-500" />
              </div>
            </div>
            <div className="h-8 w-px bg-white/10"></div>
            <div>
              <div className="label-text text-[9px] mb-1">RATING</div>
              <div className="data-text text-lg font-bold text-emerald-400">
                {USER_DATA.reliabilityRating}
              </div>
            </div>
          </div>
          
          <Trophy size={20} className="text-zinc-600" />
        </div>
      </div>
      
      {/* Main Setup Card - Apple Wallet Style */}
      <div className="relative z-20 max-w-2xl mx-auto">
        <div className="glass-panel p-8 bg-gradient-to-b from-slate-950/60 to-slate-950/80 border-2 border-white/10">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <Target size={20} className="text-emerald-400" />
              <h1 className="text-2xl font-bold text-white">New Focus Contract</h1>
            </div>
            <p className="text-zinc-500 text-sm">
              Select a high-value task and lock in your wager
            </p>
          </div>
          
          {/* Quick Select Tasks */}
          <div className="mb-6">
            <div className="label-text mb-3">QUICK SELECT</div>
            <div className="space-y-2">
              {MOCK_TASKS.map((task) => (
                <button
                  key={task.id}
                  onClick={() => handleSelectTask(task)}
                  className={`w-full p-4 rounded-lg border transition-all text-left ${
                    selectedTask.id === task.id
                      ? 'bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                      : 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-medium text-white text-sm">{task.title}</div>
                    <div className="label-text text-[9px]">EST: {task.duration}M</div>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-zinc-500">Suggested Stake:</span>
                    <span className="data-text text-emerald-400 font-bold">${task.wager}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Custom Task Input */}
          <div className="mb-6">
            <div className="label-text mb-2">OR ENTER CUSTOM CONTRACT</div>
            <Input
              placeholder="e.g., Write 1000 words for blog post"
              value={customTask}
              onChange={(e) => setCustomTask(e.target.value)}
              className="bg-slate-950/50 border-white/10 text-white placeholder:text-zinc-600"
            />
          </div>
          
          {/* Duration Input */}
          <div className="mb-6">
            <div className="label-text mb-2 flex items-center gap-2">
              <Timer size={12} />
              ESTIMATED DURATION
            </div>
            <div className="flex items-center gap-4">
              <Input
                type="number"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                className="bg-slate-950/50 border-white/10 text-white w-24"
              />
              <span className="text-zinc-500 text-sm">minutes</span>
            </div>
          </div>
          
          {/* Wager Amount Slider */}
          <div className="mb-8 p-6 rounded-lg bg-slate-950/50 border border-white/5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="label-text text-[10px] mb-1">WAGER AMOUNT</div>
                <div className="text-sm text-zinc-500">
                  Account Balance: <span className="text-emerald-400 font-bold">${USER_DATA.availableCapital.toFixed(2)}</span>
                </div>
              </div>
              <div className="data-text text-3xl font-bold text-white">
                ${wagerAmount[0]}
              </div>
            </div>
            
            <Slider
              value={wagerAmount}
              onValueChange={setWagerAmount}
              max={200}
              min={10}
              step={5}
              className="mb-2"
            />
            
            <div className="flex justify-between text-xs text-zinc-600">
              <span>$10</span>
              <span>$200</span>
            </div>
          </div>
          
          {/* Risk Warning */}
          <div className="mb-6 p-4 rounded-lg bg-orange-500/5 border border-orange-500/20">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-orange-400 text-xs font-bold">!</span>
              </div>
              <div className="text-xs text-zinc-400">
                <span className="text-orange-400 font-bold">Risk Notice:</span> If you fail to complete this contract within the timeframe, your staked capital will be forfeited.
              </div>
            </div>
          </div>
          
          {/* NFC Lock Button - Apple Pay Style */}
          <button
            onClick={handleNFCScan}
            className="w-full relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
            
            <div className="relative bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-6 shadow-[0_0_40px_rgba(16,185,129,0.4)] hover:shadow-[0_0_60px_rgba(16,185,129,0.6)] transition-all">
              <div className="flex items-center justify-center gap-4">
                <Waves size={32} className="text-white" />
                <div className="text-left">
                  <div className="text-white font-bold text-lg">Hold Near NFC Tag to Lock In</div>
                  <div className="text-emerald-100 text-xs">Tap to authenticate contract</div>
                </div>
              </div>
            </div>
          </button>
          
          <div className="mt-4 text-center text-xs text-zinc-600">
            <Wallet size={12} className="inline mr-1" />
            Secured by biometric authentication
          </div>
        </div>
      </div>
    </div>
  );
}
