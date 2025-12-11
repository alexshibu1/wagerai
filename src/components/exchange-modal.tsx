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
import TaskInputDialog from './task-input-dialog';

interface ExchangeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExecute: (title: string, assetClass: AssetClass, stake: number, linkedYearWagerId?: string) => Promise<Wager | null>;
  yearWagers?: Wager[];
}

export default function ExchangeModal({ open, onOpenChange, onExecute, yearWagers = [] }: ExchangeModalProps) {
  const router = useRouter();
  const supabase = createClient();
  
  const getDefaultTitle = () => {
    const today = new Date();
    const month = today.toLocaleDateString('en-US', { month: 'short' });
    const day = today.getDate();
    const suffix = day === 1 || day === 21 || day === 31 ? 'st' :
                  day === 2 || day === 22 ? 'nd' :
                  day === 3 || day === 23 ? 'rd' : 'th';
    return `Daily Session: ${month} ${day}${suffix}`;
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
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [pendingWagerData, setPendingWagerData] = useState<{ title: string; assetClass: AssetClass; stake: number; linkedYearWagerId?: string } | null>(null);

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
    
    // For TDAY, show task dialog first
    if (assetClass === 'TDAY') {
      const linkedId = linkedYearWagerId === 'none' ? undefined : linkedYearWagerId;
      setPendingWagerData({ title, assetClass, stake: stake[0], linkedYearWagerId: linkedId });
      setShowTaskDialog(true);
      return;
    }
    
    // For other asset classes, proceed directly
    try {
      const linkedId = linkedYearWagerId === 'none' ? undefined : linkedYearWagerId;
      const newWager = await onExecute(title, assetClass, stake[0], linkedId);
      
      // Reset form
      setTitle('');
      setStake([500]);
      setAssetClass('TDAY');
      setLinkedYearWagerId('none');
      
      // Close modal and stay on markets page
      onOpenChange(false);
      // Refresh router to ensure data is updated
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to create wager. Please try again.');
    }
  };

  const handleTasksConfirmed = async (tasks: string[]) => {
    if (!pendingWagerData) return;
    
    try {
      const newWager = await onExecute(
        pendingWagerData.title,
        pendingWagerData.assetClass,
        pendingWagerData.stake,
        pendingWagerData.linkedYearWagerId
      );
      
      // Store tasks in localStorage with session ID
      if (newWager?.id) {
        const tasksData = tasks.map((title, index) => ({
          id: `task-${index + 1}`,
          title,
          completed: false,
          timebox: index === 0 ? 'morning' as const : index === 1 ? 'deep' as const : 'closing' as const,
        }));
        localStorage.setItem(`session_${newWager.id}_tasks`, JSON.stringify(tasksData));
      }
      
      // Reset form
      setTitle('');
      setStake([500]);
      setAssetClass('TDAY');
      setLinkedYearWagerId('none');
      
      // Close modal
      onOpenChange(false);
      setShowTaskDialog(false);
      setPendingWagerData(null);
      
      // Redirect to session page
      if (newWager?.id) {
        window.location.href = `/session/${newWager.id}`;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create wager. Please try again.');
      setShowTaskDialog(false);
      setPendingWagerData(null);
    }
  };

  const showLinkOption = (assetClass === 'TDAY' || assetClass === 'SHIP') && yearWagers.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-panel border-white/20 max-w-md">
        {/* Header */}
        <DialogHeader className="border-b border-white/[0.08] pb-3">
          <DialogTitle className="label-text text-base">
            NEW POSITION
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 mt-5">
          {/* Task Name Input - Large & Clean */}
          <div>
            <label className="label-text mb-2 block text-sm">
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
                className="relative z-10 bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 h-10 text-white text-base font-medium transition-all focus-visible:border-violet-500/60 focus-visible:bg-white/[0.05] focus-visible:shadow-[0_0_0_2px_rgba(139,92,246,0.4),0_0_20px_rgba(139,92,246,0.2)]"
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
                      {key === 'TDAY' ? `${config.duration} HOURS` : `${config.duration} DAYS`}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Link to Year Wager - Seamless Glass Dropdown */}
          {showLinkOption && (
            <div>
              <label className="label-text mb-2 block text-sm">
                LINK TO $YEAR POSITION
              </label>
              <Select value={linkedYearWagerId} onValueChange={setLinkedYearWagerId}>
                <SelectTrigger className="glass-panel h-10 text-white border-white/[0.08] focus:ring-1 focus:ring-lavender text-sm">
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
              <p className="text-[9px] text-zinc-500 mt-1.5 uppercase tracking-wider">
                ↑ Completing this will restore health to the linked position
              </p>
            </div>
          )}

          {/* Wager Slider - Thin Track with Glowing Green Orb */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="label-text text-sm">
                STAKE AMOUNT
              </label>
              <div 
                className="data-text text-3xl font-bold text-amber-400"
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
              className="w-full [&>div>div]:bg-amber-500 [&>div>div]:shadow-[0_0_12px_rgba(251,191,36,0.4)] [&_[role=slider]]:bg-amber-500 [&_[role=slider]]:border-amber-500 [&_[role=slider]]:shadow-[0_0_12px_rgba(251,191,36,0.6)] [&_[role=slider]]:w-4 [&_[role=slider]]:h-4"
            />
            <div className="flex justify-between mt-2 label-text opacity-60 text-xs">
              <span>$100</span>
              <span>$5,000</span>
            </div>
          </div>

          {/* Execute Button - Amber Gradient */}
          <Button
            onClick={handleExecute}
            disabled={!title.trim()}
            className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold uppercase tracking-[0.25em] text-xs h-11 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(251,191,36,0.4),0_0_40px_rgba(234,179,8,0.3)] hover:shadow-[0_0_30px_rgba(251,191,36,0.6),0_0_60px_rgba(234,179,8,0.4)] transition-all"
          >
            EXECUTE ORDER
          </Button>
        </div>
      </DialogContent>
      
      {/* Task Input Dialog */}
      <TaskInputDialog
        open={showTaskDialog}
        onClose={() => {
          setShowTaskDialog(false);
          setPendingWagerData(null);
        }}
        onConfirm={handleTasksConfirmed}
      />
    </Dialog>
  );
}
