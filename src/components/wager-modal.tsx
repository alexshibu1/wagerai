'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { USER_STATS } from '@/lib/mock-data';
import { WagerTrigger } from './wager-trigger';
import { useWager } from '@/hooks/use-wager';

interface WagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WagerModal({ isOpen, onClose }: WagerModalProps) {
  const router = useRouter();
  const { placeWager } = useWager();
  
  // Form state
  const [contractName, setContractName] = useState('');
  const [selectedDuration, setSelectedDuration] = useState<25 | 50 | 90>(50);
  const [stakeAmount, setStakeAmount] = useState([35]);
  
  const handleLockIn = async () => {
    if (!contractName.trim()) return;
    
    // Use the hook to place the wager
    await placeWager(contractName, stakeAmount[0], selectedDuration);
    
    // Close modal (navigation is handled by hook, but we can close modal here)
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Modal Card - "Receipt" Style */}
      <div className="relative w-full max-w-lg mx-4 animate-in slide-in-from-bottom-4 duration-300">
        {/* Glass Card with Receipt Look */}
        <div className="bg-slate-950/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all"
          >
            <X size={16} className="text-zinc-400" />
          </button>
          
          {/* Content */}
          <div className="p-8">
            {/* Header - Receipt Style */}
            <div className="mb-8 pb-6 border-b border-dashed border-white/10">
              <h2 className="text-2xl font-bold text-white mb-3">Open New Position</h2>
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500 uppercase tracking-widest">Liquidity:</span>
                <span className="text-xl font-bold font-mono text-emerald-400">
                  ${USER_STATS.availableBalance.toFixed(2)}
                </span>
              </div>
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
                {[25, 50, 90].map((duration) => (
                  <button
                    key={duration}
                    onClick={() => setSelectedDuration(duration as 25 | 50 | 90)}
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
            
            {/* Wager Trigger Component */}
            <WagerTrigger 
              amount={stakeAmount[0]}
              onConfirm={handleLockIn}
              disabled={!contractName.trim()}
            />
            
            <p className="text-xs text-zinc-600 text-center mt-4">
              Secured by biometric authentication
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
