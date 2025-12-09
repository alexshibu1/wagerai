"use client";

import React, { useState } from 'react';
import { Loader2, Check, Smartphone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface WagerTriggerProps {
  amount: number;
  onConfirm: () => void;
  disabled?: boolean;
}

export function WagerTrigger({ amount, onConfirm, disabled }: WagerTriggerProps) {
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');

  const handleClick = () => {
    if (status !== 'idle' || disabled) return;
    setStatus('processing');
    
    // Simulate NFC scan/payment processing
    setTimeout(() => {
      setStatus('success');
      // Delay before actual action to show the success state
      setTimeout(() => {
        onConfirm();
      }, 800); 
    }, 1500);
  };

  return (
    <div className="w-full">
      {/* Bottom Sheet / Drawer Handle Look */}
      <div className="mx-auto w-12 h-1.5 bg-slate-800 rounded-full mb-6" />

      <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-800">
        <div className="flex justify-between items-center mb-6 px-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-slate-400" />
            </div>
            <div>
              <div className="text-sm text-slate-400 font-medium">Apple Pay</div>
              <div className="text-xs text-slate-500">Citibank •••• 4029</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-500 uppercase tracking-wider">Total</div>
            <div className="text-lg font-bold text-slate-100">${amount.toFixed(2)}</div>
          </div>
        </div>

        <button
          onClick={handleClick}
          disabled={disabled || status !== 'idle'}
          className={cn(
            "relative w-full h-14 rounded-xl font-bold text-lg transition-all duration-300 overflow-hidden",
            "flex items-center justify-center gap-2",
            status === 'idle' 
              ? "bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)]" 
              : "bg-slate-800 text-slate-400"
          )}
        >
          <AnimatePresence mode="wait">
            {status === 'idle' && (
              <motion.span
                key="idle"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2"
              >
                Hold to Lock In
              </motion.span>
            )}

            {status === 'processing' && (
              <motion.div
                key="processing"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
              >
                <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
              </motion.div>
            )}

            {status === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 text-emerald-400"
              >
                <Check className="w-6 h-6" />
                <span>Confirmed</span>
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        <p className="text-center text-xs text-slate-600 mt-4 flex items-center justify-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500/20 border border-emerald-500/50"></span>
          Secure 256-bit Connection
        </p>
      </div>
    </div>
  );
}

