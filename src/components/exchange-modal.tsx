'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Slider } from './ui/slider';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { AssetClass, Wager } from '@/types/wager';
import { ASSET_CLASS_CONFIG } from '@/lib/wager-utils';
import AssetClassInfo from './asset-class-info';
import { createClient } from '../../supabase/client';

interface ExchangeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExecute: (title: string, assetClass: AssetClass, stake: number, linkedYearWagerId?: string) => void;
  yearWagers?: Wager[];
}

export default function ExchangeModal({ open, onOpenChange, onExecute, yearWagers = [] }: ExchangeModalProps) {
  const router = useRouter();
  const supabase = createClient();
  
  // Generate default title: "Daily Session: [Current Date]"
  const getDefaultTitle = () => {
    const today = new Date();
    return `Daily Session: ${today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  const [title, setTitle] = useState(getDefaultTitle());
  const [assetClass, setAssetClass] = useState<AssetClass>('TDAY');
  const [stake, setStake] = useState([500]);
  const [linkedYearWagerId, setLinkedYearWagerId] = useState<string>('none');
  const inputRef = useRef<HTMLInputElement>(null);
  const prevAssetClassRef = useRef<AssetClass>('TDAY');

  // Auto-focus input when modal opens
  useEffect(() => {
    if (open) {
      // Reset to defaults
      setTitle(getDefaultTitle());
      setAssetClass('TDAY');
      prevAssetClassRef.current = 'TDAY';
      setStake([500]);
      setLinkedYearWagerId('none');
      
      // Auto-focus with slight delay for animation
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 100);
    }
  }, [open]);

  // Auto-fill position name when switching TO $TDAY (not when already on it)
  useEffect(() => {
    if (assetClass === 'TDAY' && prevAssetClassRef.current !== 'TDAY') {
      setTitle(getDefaultTitle());
    }
    prevAssetClassRef.current = assetClass;
  }, [assetClass]);

  const [error, setError] = useState<string | null>(null);

  const handleExecute = async () => {
    if (!title.trim()) return;
    
    setError(null);
    
    // Check authentication before executing
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      onOpenChange(false);
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
    
    try {
      const linkedId = linkedYearWagerId === 'none' ? undefined : linkedYearWagerId;
      await onExecute(title, assetClass, stake[0], linkedId);
      setTitle('');
      setStake([500]);
      setAssetClass('TDAY');
      setLinkedYearWagerId('none');
      onOpenChange(false);
    } catch (err: any) {
      setError(err.message || 'Failed to create wager. Please try again.');
    }
  };

  const showLinkOption = (assetClass === 'TDAY' || assetClass === 'SHIP') && yearWagers.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-panel border-white/20 max-w-lg">
        {/* Header */}
        <DialogHeader className="border-b border-white/[0.08] pb-4">
          <DialogTitle className="label-text text-lg">
            NEW POSITION
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Task Name Input - Large & Clean */}
          <div>
            <label className="label-text mb-3 block">
              POSITION NAME
            </label>
            <div className="relative group">
              {/* Glowing edge effect when focused */}
              <div 
                className="absolute -inset-[2px] rounded-lg opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.8), rgba(168, 85, 247, 0.7), rgba(139, 92, 246, 0.8))',
                  filter: 'blur(6px)',
                  zIndex: 0
                }}
              />
              <Input
                ref={inputRef}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your commitment..."
                className="relative z-10 bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 h-12 text-white text-lg font-medium transition-all focus-visible:border-violet-500/60 focus-visible:bg-white/[0.05] focus-visible:shadow-[0_0_0_2px_rgba(139,92,246,0.4),0_0_20px_rgba(139,92,246,0.2)]"
              />
            </div>
          </div>

          {/* Asset Class Tabs - Sleek Segmented Glass Tabs */}
          <div>
            <label className="label-text mb-3 flex items-center gap-2">
              ASSET CLASS
              <AssetClassInfo />
            </label>
            <div className="glass-panel p-1 grid grid-cols-3 gap-1">
              {(Object.keys(ASSET_CLASS_CONFIG) as AssetClass[]).map((key) => {
                const config = ASSET_CLASS_CONFIG[key];
                return (
                  <button
                    key={key}
                    onClick={() => setAssetClass(key)}
                    className={`p-4 rounded-lg transition-all ${
                      assetClass === key
                        ? 'bg-gradient-to-br from-amber-500 to-yellow-500 text-slate-950 shadow-[0_0_20px_rgba(251,191,36,0.4)]'
                        : 'bg-transparent text-white hover:bg-white/[0.05]'
                    }`}
                  >
                    <div className={`font-mono text-sm font-bold mb-1 ${
                      assetClass === key ? 'text-slate-950' : 'text-white'
                    }`}>
                      {config.symbol}
                    </div>
                    <div className={`text-[10px] uppercase tracking-wider font-bold ${
                      assetClass === key ? 'text-slate-950/70' : 'text-zinc-500'
                    }`}>
                      {config.duration} DAYS
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Link to Year Wager - Seamless Glass Dropdown */}
          {showLinkOption && (
            <div>
              <label className="label-text mb-3 block">
                LINK TO $YEAR POSITION
              </label>
              <Select value={linkedYearWagerId} onValueChange={setLinkedYearWagerId}>
                <SelectTrigger className="glass-panel h-12 text-white border-white/[0.08] focus:ring-1 focus:ring-lavender">
                  <SelectValue placeholder="Select a long-term bet..." />
                </SelectTrigger>
                <SelectContent className="glass-panel border-white/20">
                  <SelectItem value="none" className="text-white">None</SelectItem>
                  {yearWagers.map(wager => (
                    <SelectItem key={wager.id} value={wager.id} className="text-white">
                      {wager.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-[10px] text-zinc-500 mt-2 uppercase tracking-wider">
                ↑ Completing this will restore health to the linked position
              </p>
            </div>
          )}

          {/* Wager Slider - Thin Track with Glowing Green Orb */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="label-text">
                STAKE AMOUNT
              </label>
              <div 
                className="data-text text-4xl font-bold text-amber-400"
                style={{
                  textShadow: '0 0 80px rgba(251, 191, 36, 0.6), 0 0 120px rgba(251, 191, 36, 0.3)'
                }}
              >
                ${stake[0].toLocaleString()}
              </div>
            </div>
            
            <Slider
              value={stake}
              onValueChange={setStake}
              min={100}
              max={5000}
              step={100}
              className="w-full [&>div>div]:bg-amber-500 [&>div>div]:shadow-[0_0_12px_rgba(251,191,36,0.4)] [&_[role=slider]]:bg-amber-500 [&_[role=slider]]:border-amber-500 [&_[role=slider]]:shadow-[0_0_12px_rgba(251,191,36,0.6)] [&_[role=slider]]:w-5 [&_[role=slider]]:h-5"
            />
            <div className="flex justify-between mt-3 label-text opacity-60">
              <span>$100</span>
              <span>$5,000</span>
            </div>
          </div>

          {/* Execute Button - Amber Gradient */}
          <Button
            onClick={handleExecute}
            disabled={!title.trim()}
            className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold uppercase tracking-[0.25em] text-sm h-14 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(251,191,36,0.4),0_0_40px_rgba(234,179,8,0.3)] hover:shadow-[0_0_30px_rgba(251,191,36,0.6),0_0_60px_rgba(234,179,8,0.4)] transition-all"
          >
            EXECUTE ORDER
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
