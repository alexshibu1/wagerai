'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { X, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { USER_STATS } from '@/lib/mock-data';
import { WagerTrigger } from './wager-trigger';
import { useWager } from '@/hooks/use-wager';
import { AssetClass } from '@/types/wager';
import { ASSET_CLASS_CONFIG } from '@/lib/wager-utils';
import AssetClassInfo from './asset-class-info';
import { createClient } from '../../supabase/client';

interface WagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WagerModal({ isOpen, onClose }: WagerModalProps) {
  const router = useRouter();
  const supabase = createClient();
  const { placeWager } = useWager();
  
  // Generate default title: "Daily Session: [Current Date]"
  const getDefaultTitle = () => {
    const today = new Date();
    return `Daily Session: ${today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };
  
  // Form state
  const [contractName, setContractName] = useState(getDefaultTitle());
  const [assetClass, setAssetClass] = useState<AssetClass>('TDAY');
  const [stakeAmount, setStakeAmount] = useState([35]);
  const inputRef = useRef<HTMLInputElement>(null);
  const prevAssetClassRef = useRef<AssetClass>('TDAY');
  
  // Auto-focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      // Reset to defaults
      setContractName(getDefaultTitle());
      setAssetClass('TDAY');
      prevAssetClassRef.current = 'TDAY';
      setStakeAmount([35]);
      
      // Auto-focus with slight delay for animation
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 100);
    }
  }, [isOpen]);

  // Auto-fill/clear position name based on asset class
  useEffect(() => {
    if (assetClass === 'TDAY' && prevAssetClassRef.current !== 'TDAY') {
      // Auto-fill when switching TO $TDAY
      setContractName(getDefaultTitle());
    } else if ((assetClass === 'SHIP' || assetClass === 'YEAR') && prevAssetClassRef.current !== assetClass) {
      // Auto-clear when switching to $SHIP or $YEAR
      setContractName('');
    }
    prevAssetClassRef.current = assetClass;
  }, [assetClass]);
  
  // Calculate stake based on asset class and base amount
  // TDAY: 15% return, SHIP: ~10%, YEAR: ~5%
  const getStakeMultiplier = () => {
    switch (assetClass) {
      case 'TDAY': return 1.15; // 15% return
      case 'SHIP': return 1.10; // 10% return
      case 'YEAR': return 1.05; // 5% return
      default: return 1.15;
    }
  };
  
  const baseStake = stakeAmount[0];
  const totalPayout = Math.round(baseStake * getStakeMultiplier());
  
  const [error, setError] = useState<string | null>(null);

  const handleLockIn = async () => {
    if (!contractName.trim()) return;
    
    setError(null);
    
    // Check authentication before placing wager
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      onClose();
      router.push('/sign-in');
      return;
    }
    
    // For TDAY, check if there's already an active session today
    if (assetClass === 'TDAY') {
      try {
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

        const { data: existingWagers } = await supabase
          .from('wagers')
          .select('id, title')
          .eq('user_id', user.id)
          .eq('asset_class', 'TDAY')
          .eq('status', 'OPEN')
          .gte('created_at', startOfDay.toISOString())
          .lte('created_at', endOfDay.toISOString());

        if (existingWagers && existingWagers.length > 0) {
          setError('You already have an active $TDAY session today. Complete it before starting a new one.');
          return;
        }
      } catch (err) {
        console.error('Error checking existing sessions:', err);
      }
    }
    
    // Convert asset class duration to minutes for the hook
    // TDAY=1 day = 1440 minutes, SHIP=30 days = 43200 minutes, YEAR=365 days = 525600 minutes
    const duration = ASSET_CLASS_CONFIG[assetClass].duration * 24 * 60;
    
    try {
      // Use the hook to place the wager
      await placeWager(contractName, stakeAmount[0], duration);
      
      // Close modal (navigation is handled by hook, but we can close modal here)
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create wager. Please try again.');
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      {/* Enhanced ambient glow behind modal */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/8 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-400/5 rounded-full blur-[100px]" />
      </div>
      
      {/* Modal Card - Enhanced Glassmorphism */}
      <div className="relative w-full max-w-lg mx-4 animate-in slide-in-from-bottom-4 duration-300">
        {/* Glass Card with Enhanced Glass Effect */}
        <div 
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(165deg, rgba(251, 191, 36, 0.15) 0%, rgba(251, 191, 36, 0.06) 30%, rgba(15, 23, 42, 0.7) 70%, rgba(10, 10, 15, 0.9) 100%)',
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            border: '1px solid rgba(251, 191, 36, 0.25)',
            boxShadow: `
              0 8px 32px rgba(0, 0, 0, 0.6),
              0 0 0 1px rgba(255, 255, 255, 0.08) inset,
              0 0 100px -20px rgba(251, 191, 36, 0.25),
              0 0 150px -30px rgba(234, 179, 8, 0.2),
              0 0 200px -40px rgba(251, 191, 36, 0.1)
            `
          }}
        >
          {/* Enhanced inner glow overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/8 via-amber-400/4 via-transparent to-yellow-500/6 pointer-events-none" />
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none" />
          
          {/* Subtle animated border glow */}
          <div 
            className="absolute -inset-[1px] rounded-2xl opacity-30"
            style={{
              background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.4), rgba(234, 179, 8, 0.3), rgba(251, 191, 36, 0.4))',
              backgroundSize: '200% 200%',
              animation: 'gradient-shift 8s ease infinite',
              filter: 'blur(8px)',
              zIndex: -1
            }}
          />
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-sm flex items-center justify-center transition-all hover:border-white/20"
          >
            <X size={16} className="text-zinc-400" />
          </button>
          
          {/* Content */}
          <div className="relative p-8">
            {/* Header - Receipt Style */}
            <div className="mb-8 pb-6 border-b border-dashed border-white/10">
              <h2 className="text-2xl font-bold text-white mb-3">Open New Position</h2>
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400 uppercase tracking-widest">Liquidity:</span>
                <span 
                  className="text-xl font-bold font-mono text-amber-400"
                  style={{
                    textShadow: '0 0 80px rgba(251, 191, 36, 0.6), 0 0 120px rgba(251, 191, 36, 0.3)'
                  }}
                >
                  ${USER_STATS.availableBalance.toFixed(2)}
                </span>
              </div>
            </div>
            
            {/* Contract Name Input */}
            <div className="mb-6">
              <label className="label-text mb-2 block text-zinc-300">CONTRACT NAME</label>
              <div className="relative group">
                {/* Glowing edge effect when focused - amber/violet mix */}
                <div 
                  className="absolute -inset-[2px] rounded-lg opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity duration-300"
                  style={{
                    background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.6), rgba(139, 92, 246, 0.5), rgba(251, 191, 36, 0.6))',
                    filter: 'blur(6px)',
                    zIndex: 0
                  }}
                />
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder={assetClass === 'TDAY' ? "Daily Session: Dec 10, 2025" : "Enter your commitment..."}
                  value={contractName}
                  onChange={(e) => setContractName(e.target.value)}
                  className="relative z-10 bg-white/5 backdrop-blur-sm border-white/10 text-white h-12 text-base placeholder:text-zinc-500 transition-all focus-visible:border-amber-500/60 focus-visible:bg-white/[0.05] focus-visible:shadow-[0_0_0_2px_rgba(251,191,36,0.4),0_0_20px_rgba(251,191,36,0.2)]"
                />
              </div>
            </div>
            
            {/* Asset Class Tabs - Sleek Segmented Glass Tabs */}
            <div className="mb-6">
              <label className="label-text mb-3 flex items-center gap-2 text-zinc-300">
                ASSET CLASS
                <AssetClassInfo />
              </label>
              <div 
                className="p-1 grid grid-cols-3 gap-1 rounded-lg"
                style={{
                  background: 'rgba(15, 23, 42, 0.4)',
                  backdropFilter: 'blur(16px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                  border: '1px solid rgba(251, 191, 36, 0.15)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.05) inset'
                }}
              >
                {(Object.keys(ASSET_CLASS_CONFIG) as AssetClass[]).map((key) => {
                  const config = ASSET_CLASS_CONFIG[key];
                  return (
                    <button
                      key={key}
                      onClick={() => setAssetClass(key)}
                      className={`p-4 rounded-lg transition-all ${
                        assetClass === key
                          ? 'bg-gradient-to-br from-amber-500 to-yellow-500 text-slate-950 shadow-[0_0_20px_rgba(251,191,36,0.4)]'
                          : 'bg-white/[0.03] text-white hover:bg-white/[0.08] border border-white/5'
                      }`}
                    >
                      <div className={`font-mono text-sm font-bold mb-1 ${
                        assetClass === key ? 'text-slate-950' : 'text-white'
                      }`}>
                        {config.symbol}
                      </div>
                      <div className={`text-[10px] uppercase tracking-wider font-bold ${
                        assetClass === key ? 'text-slate-950/70' : 'text-zinc-400'
                      }`}>
                        {config.duration} DAYS
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* Stake Amount Slider */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <label className="label-text text-zinc-300">STAKE AMOUNT</label>
                <div 
                  className="text-3xl font-bold font-mono text-amber-400"
                  style={{
                    textShadow: '0 0 80px rgba(251, 191, 36, 0.6), 0 0 120px rgba(251, 191, 36, 0.3)'
                  }}
                >
                  ${baseStake.toLocaleString()}
                </div>
              </div>
              
              <div className="relative mb-4">
                {/* Enhanced slider track background */}
                <div 
                  className="absolute inset-0 h-2 rounded-full"
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(4px)',
                  }}
                />
                <Slider
                  value={stakeAmount}
                  onValueChange={setStakeAmount}
                  max={100}
                  min={10}
                  step={5}
                  className="relative [&>div>div]:bg-gradient-to-r [&>div>div]:from-amber-500 [&>div>div]:to-yellow-500 [&>div>div]:shadow-[0_0_12px_rgba(251,191,36,0.5)] [&>div>div]:rounded-full [&_[role=slider]]:bg-gradient-to-br [&_[role=slider]]:from-amber-400 [&_[role=slider]]:to-yellow-400 [&_[role=slider]]:border-2 [&_[role=slider]]:border-amber-300 [&_[role=slider]]:shadow-[0_0_16px_rgba(251,191,36,0.8),0_0_32px_rgba(251,191,36,0.4)] [&_[role=slider]]:w-6 [&_[role=slider]]:h-6 [&_[role=slider]]:hover:scale-125 [&_[role=slider]]:transition-all [&_[role=slider]]:cursor-grab [&_[role=slider]]:active:cursor-grabbing"
                />
              </div>
              
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs text-zinc-500">$10</span>
                <span className="text-xs text-zinc-500">$100</span>
              </div>
              
              {/* Total Payout - Moved underneath slider */}
              <div 
                className="relative rounded-xl p-4"
                style={{
                  background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(234, 179, 8, 0.05) 100%)',
                  border: '1px solid rgba(251, 191, 36, 0.2)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <div className="text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Total Payout</div>
                    <div 
                      className="text-2xl font-bold font-mono text-amber-300"
                      style={{
                        textShadow: '0 0 60px rgba(251, 191, 36, 0.5), 0 0 100px rgba(251, 191, 36, 0.3)'
                      }}
                    >
                      ${totalPayout.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Return</div>
                    <div className="text-lg font-bold font-mono text-amber-400">
                      {Math.round((getStakeMultiplier() - 1) * 100)}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30">
                <p className="text-sm text-rose-300 text-center">{error}</p>
              </div>
            )}

            {/* Wager Trigger Component */}
            <WagerTrigger 
              amount={stakeAmount[0]}
              onConfirm={handleLockIn}
              disabled={!contractName.trim() || !!error}
            />
            
            <p className="text-xs text-zinc-500 text-center mt-4">
              Secured by biometric authentication
            </p>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  );
}
