'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { 
  Loader2,
  CheckCircle2,
  X
} from 'lucide-react';

export default function NewSessionPage() {
  const router = useRouter();
  
  // Form state
  const [contractName, setContractName] = useState('');
  const [selectedDuration, setSelectedDuration] = useState<30 | 60 | 90>(60);
  const [stakeAmount, setStakeAmount] = useState([50]);
  
  // Processing states
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Apple Pay style "Lock In" handler
  const handleLockIn = () => {
    setIsProcessing(true);
    
    // Apple Pay style processing: Spinner (1s) → Checkmark (0.5s) → Navigate
    setTimeout(() => {
      setShowSuccess(true);
      setIsProcessing(false);
      
      // Store session in localStorage
      const sessionId = `session-${Date.now()}`;
      localStorage.setItem('activeSessionId', sessionId);
      
      // Navigate after success animation
      setTimeout(() => {
        router.push(`/session/${sessionId}`);
      }, 800);
    }, 1500);
  };

  // Success checkmark state
  if (showSuccess) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-noise relative overflow-hidden">
        <div className="relative z-20 flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-500">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-[0_0_60px_rgba(16,185,129,0.6)]">
            <CheckCircle2 size={48} className="text-white" />
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-400 font-mono">LOCKED IN</div>
            <div className="text-sm text-zinc-500 mt-1">Entering focus mode...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-noise relative overflow-hidden flex items-center justify-center py-12 px-4">
      {/* Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-indigo-500/15 to-teal-500/15 blur-3xl pointer-events-none"></div>
      
      {/* Close Button */}
      <button
        onClick={() => router.push('/dashboard')}
        className="absolute top-6 right-6 z-50 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all"
      >
        <X size={20} className="text-zinc-400" />
      </button>
      
      {/* Main Wager Slip Card */}
      <div className="relative z-20 w-full max-w-md mx-auto">
        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          
          {/* Header */}
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Deep Work Terminal</h2>
            <p className="text-sm text-zinc-500">Lock in your focus contract</p>
          </div>
          
          {/* Available Liquidity */}
          <div className="mb-8 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
            <div className="label-text text-emerald-400 mb-1">AVAILABLE LIQUIDITY</div>
            <div className="text-3xl font-bold font-mono text-emerald-400">$1,000.00</div>
          </div>
          
          {/* Contract Name Input */}
          <div className="mb-6">
            <label className="label-text mb-2 block">CONTRACT NAME</label>
            <Input
              type="text"
              placeholder="Deep Work: Q3 Strategy"
              value={contractName}
              onChange={(e) => setContractName(e.target.value)}
              className="bg-slate-950/60 border-white/10 text-white h-12 text-base placeholder:text-zinc-600"
            />
          </div>
          
          {/* Duration Chips */}
          <div className="mb-6">
            <label className="label-text mb-3 block">DURATION</label>
            <div className="flex gap-3">
              {[30, 60, 90].map((duration) => (
                <button
                  key={duration}
                  onClick={() => setSelectedDuration(duration as 30 | 60 | 90)}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all ${
                    selectedDuration === duration
                      ? 'bg-emerald-500/20 border-2 border-emerald-500/50 text-emerald-400'
                      : 'bg-white/5 border border-white/10 text-zinc-400 hover:bg-white/10'
                  }`}
                >
                  {duration}m
                </button>
              ))}
            </div>
          </div>
          
          {/* Stake Amount Slider */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <label className="label-text">STAKE AMOUNT</label>
              <div className="text-2xl font-bold font-mono text-white">${stakeAmount[0]}</div>
            </div>
            
            <Slider
              value={stakeAmount}
              onValueChange={setStakeAmount}
              max={100}
              min={10}
              step={5}
              className="mb-2"
            />
            
            <div className="flex justify-between text-xs text-zinc-600">
              <span>$10</span>
              <span>$100</span>
            </div>
          </div>
          
          {/* Apple Pay Style Trigger Button */}
          <button
            onClick={handleLockIn}
            disabled={isProcessing || !contractName.trim()}
            className="w-full relative group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
            
            {/* Button content */}
            <div className="relative bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl py-5 px-6 shadow-[0_0_40px_rgba(16,185,129,0.4)] hover:shadow-[0_0_60px_rgba(16,185,129,0.6)] transition-all">
              <div className="flex items-center justify-center gap-3">
                {isProcessing ? (
                  <>
                    <Loader2 size={24} className="text-white animate-spin" />
                    <span className="text-white font-bold text-lg">Processing...</span>
                  </>
                ) : (
                  <>
                    <span className="text-white font-bold text-lg">Tap to Lock In</span>
                  </>
                )}
              </div>
            </div>
          </button>
          
          <p className="text-xs text-zinc-600 text-center mt-4">
            Secured by biometric authentication
          </p>
        </div>
      </div>
    </div>
  );
}
