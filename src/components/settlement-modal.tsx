'use client';

import { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Check, X } from 'lucide-react';
import { Button } from './ui/button';
import VolatilityChart from './volatility-chart';
import { formatCurrency } from '@/lib/wager-utils';
import confetti from 'canvas-confetti';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  multiplier?: number;
}

interface VolatilityDataPoint {
  time: string;
  value: number;
}

interface SettlementModalProps {
  open: boolean;
  onClose: () => void;
  tasks: Task[];
  baseWager: number;
  volatilityData: VolatilityDataPoint[];
  deepWorkBonus: number;
}

export default function SettlementModal({
  open,
  onClose,
  tasks,
  baseWager,
  volatilityData,
  deepWorkBonus
}: SettlementModalProps) {
  const completedTasks = tasks.filter(t => t.completed);
  const completionRate = (completedTasks.length / tasks.length) * 100;
  
  // Calculate P&L
  const baseEarnings = (baseWager * completionRate) / 100;
  const multiplierBonus = completedTasks.reduce((sum, task) => {
    return sum + (task.multiplier ? (baseWager / tasks.length) * (task.multiplier - 1) : 0);
  }, 0);
  
  const totalEarnings = baseEarnings + multiplierBonus + deepWorkBonus;
  const netPL = totalEarnings - baseWager;
  const isProfit = netPL > 0;

  // Trigger confetti celebration when modal opens (if profit)
  useEffect(() => {
    if (open && isProfit) {
      // Massive confetti celebration
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval: NodeJS.Timeout = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        // Soft mint confetti from multiple origins
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ['#4ade80', '#34d399', '#10b981'],
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ['#4ade80', '#34d399', '#10b981'],
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [open, isProfit]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass-panel border-white/20 max-w-4xl">
        <DialogHeader className="border-b border-white/[0.08] pb-4">
          <DialogTitle className="label-text text-lg">
            MARKET CLOSED
          </DialogTitle>
          <div className="label-text text-xs mt-1 opacity-60">
            {isProfit ? '🎉 PROFITABLE SESSION' : '📉 SESSION COMPLETE'}
          </div>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 mt-6">
          {/* Left: Volatility Graph */}
          <div>
            <div className="label-text mb-3">INTRADAY VOLATILITY</div>
            <div className="glass-panel p-4 h-[300px]">
              <VolatilityChart data={volatilityData} />
            </div>

            {/* P&L Summary */}
            <div className="glass-panel p-6 mt-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="label-text">BASE WAGER</span>
                  <span className="data-text text-sm">{formatCurrency(baseWager)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="label-text">COMPLETION RATE</span>
                  <span className="data-text text-sm">{completionRate.toFixed(0)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="label-text">BASE EARNINGS</span>
                  <span className="data-text text-sm electric-teal">+{formatCurrency(baseEarnings)}</span>
                </div>
                {multiplierBonus > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="label-text">DEEP WORK BONUS</span>
                    <span className="data-text text-sm neon-mint">+{formatCurrency(multiplierBonus)}</span>
                  </div>
                )}
                {deepWorkBonus > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="label-text">SESSION BONUS</span>
                    <span className="data-text text-sm neon-mint">+{formatCurrency(deepWorkBonus)}</span>
                  </div>
                )}
                <div className="h-px bg-white/10 my-2"></div>
                <div className="flex justify-between items-center">
                  <span className="label-text text-base">NET P&L</span>
                    <span className={`data-text text-2xl font-bold ${isProfit ? 'electric-teal' : 'text-soft-rose'}`}>
                    {isProfit ? '+' : ''}{formatCurrency(netPL)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Task List */}
          <div>
            <div className="label-text mb-3">TASK SETTLEMENT</div>
            <div className="glass-panel p-4 space-y-2 max-h-[500px] overflow-y-auto">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 rounded-lg border transition-all ${
                    task.completed
                      ? 'border-neon-mint bg-neon-mint/10'
                      : 'border-red-500/50 bg-red-500/5'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Status Icon */}
                    <div className={`mt-0.5 ${task.completed ? 'text-neon-mint' : 'text-red-500'}`}>
                      {task.completed ? <Check size={20} /> : <X size={20} />}
                    </div>

                    {/* Task Info */}
                    <div className="flex-1">
                      <div className={`text-sm font-medium mb-1 ${
                        task.completed ? 'text-white' : 'text-red-500 line-through'
                      }`}>
                        {task.title}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="label-text text-[9px]">
                          {task.completed ? 'CASHED OUT' : 'LIQUIDATED'}
                        </span>
                        {task.multiplier && task.multiplier > 1 && (
                          <span className="label-text text-[9px] neon-mint">
                            {task.multiplier}x LEVERAGE
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Value */}
                    <div className={`data-text text-sm font-bold ${
                      task.completed ? 'neon-mint' : 'text-red-500'
                    }`}>
                      {task.completed ? '+' : '-'}{formatCurrency(baseWager / tasks.length)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 flex justify-center">
          <Button
            onClick={onClose}
            className="w-full max-w-md bg-neon-mint hover:bg-neon-mint/90 text-black font-bold uppercase tracking-[0.2em] text-sm h-12"
          >
            CASH OUT & CLOSE
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
