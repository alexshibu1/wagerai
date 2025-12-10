'use client';

import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Slider } from './ui/slider';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { AssetClass, Wager } from '@/types/wager';
import { ASSET_CLASS_CONFIG } from '@/lib/wager-utils';
import AssetClassInfo from './asset-class-info';

interface ExchangeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExecute: (title: string, assetClass: AssetClass, stake: number, linkedYearWagerId?: string) => void;
  yearWagers?: Wager[];
}

export default function ExchangeModal({ open, onOpenChange, onExecute, yearWagers = [] }: ExchangeModalProps) {
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

  // Auto-focus input when modal opens
  useEffect(() => {
    if (open) {
      // Reset to defaults
      setTitle(getDefaultTitle());
      setAssetClass('TDAY');
      setStake([500]);
      setLinkedYearWagerId('none');
      
      // Auto-focus with slight delay for animation
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 100);
    }
  }, [open]);

  const handleExecute = () => {
    if (!title.trim()) return;
    const linkedId = linkedYearWagerId === 'none' ? undefined : linkedYearWagerId;
    onExecute(title, assetClass, stake[0], linkedId);
    setTitle('');
    setStake([500]);
    setAssetClass('TDAY');
    setLinkedYearWagerId('none');
    onOpenChange(false);
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
            <Input
              ref={inputRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your commitment..."
              className="bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 h-12 text-white text-lg font-medium focus-visible:ring-1 focus-visible:ring-lavender focus-visible:border-lavender transition-all"
            />
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
                        ? 'bg-arc-blue text-midnight'
                        : 'bg-transparent text-white hover:bg-white/[0.05]'
                    }`}
                  >
                    <div className={`font-mono text-sm font-bold mb-1 ${
                      assetClass === key ? 'text-black' : 'text-white'
                    }`}>
                      {config.symbol}
                    </div>
                    <div className={`text-[10px] uppercase tracking-wider font-bold ${
                      assetClass === key ? 'text-black/70' : 'text-zinc-500'
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
              <div className="data-text text-4xl font-bold electric-teal">
                ${stake[0].toLocaleString()}
              </div>
            </div>
            
            <Slider
              value={stake}
              onValueChange={setStake}
              min={100}
              max={5000}
              step={100}
              className="w-full [&_[role=slider]]:bg-signal-green [&_[role=slider]]:border-signal-green [&_[role=slider]]:shadow-[0_0_12px_rgba(0,200,5,0.6)] [&_[role=slider]]:w-5 [&_[role=slider]]:h-5"
            />
            <div className="flex justify-between mt-3 label-text opacity-60">
              <span>$100</span>
              <span>$5,000</span>
            </div>
          </div>

          {/* Execute Button - Polymarket Signal Green */}
          <Button
            onClick={handleExecute}
            disabled={!title.trim()}
            className="w-full bg-signal-green hover:bg-signal-green/90 text-midnight font-bold uppercase tracking-[0.25em] text-sm h-14 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(0,200,5,0.4)] transition-all"
          >
            EXECUTE ORDER
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
