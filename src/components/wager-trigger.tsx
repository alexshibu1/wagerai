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
    
    // Simulate NFC scan/payment processing with satisfying feedback
    setTimeout(() => {
      setStatus('success');
      // Add haptic-like visual feedback
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([50, 30, 50]);
      }
      // Delay before actual action to show the success state
      setTimeout(() => {
        onConfirm();
      }, 1000); 
    }, 1500);
  };

  return (
    <div className="w-full">
      {/* Bottom Sheet / Drawer Handle Look */}
      <div className="mx-auto w-12 h-1.5 bg-white/10 rounded-full mb-4" />

      <motion.div 
        className="relative rounded-xl p-3 overflow-hidden"
        style={{
          background: 'linear-gradient(165deg, rgba(251, 191, 36, 0.08) 0%, rgba(251, 191, 36, 0.02) 40%, rgba(15, 23, 42, 0.4) 100%)',
          backdropFilter: 'blur(16px) saturate(180%)',
          WebkitBackdropFilter: 'blur(16px) saturate(180%)',
          border: '1px solid rgba(251, 191, 36, 0.2)',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05) inset'
        }}
        animate={status === 'success' ? {
          scale: [1, 1.02, 1],
          boxShadow: [
            '0 4px 24px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05) inset',
            '0 8px 32px rgba(16, 185, 129, 0.4), 0 0 0 1px rgba(16, 185, 129, 0.3) inset',
            '0 4px 24px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05) inset'
          ]
        } : {}}
        transition={{ duration: 0.3 }}
      >
        {/* Subtle inner glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-yellow-500/5 pointer-events-none" />
        
        {/* Success glow overlay */}
        {status === 'success' && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-green-500/10 to-transparent pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
        
        <div className="relative flex justify-between items-center mb-4 px-2">
          <div className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <Smartphone className="w-4 h-4 text-zinc-300" />
            </div>
            <div>
              <div className="text-xs text-zinc-300 font-medium">Apple Pay</div>
              <div className="text-[10px] text-zinc-500">Citibank •••• 4029</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Total</div>
            <div className="text-sm font-bold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">${amount.toFixed(2)}</div>
          </div>
        </div>

        <button
          onClick={handleClick}
          disabled={disabled || status !== 'idle'}
          className={cn(
            "relative w-full h-12 rounded-xl font-bold text-base transition-all duration-300 overflow-hidden",
            "flex items-center justify-center gap-2",
            status === 'idle' 
              ? "bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-[0_0_20px_rgba(251,191,36,0.4),0_0_40px_rgba(234,179,8,0.3)] hover:shadow-[0_0_30px_rgba(251,191,36,0.6),0_0_60px_rgba(234,179,8,0.4)]" 
              : status === 'success'
              ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-[0_0_30px_rgba(16,185,129,0.6),0_0_60px_rgba(16,185,129,0.4)]"
              : "bg-slate-800/50 text-slate-400 backdrop-blur-sm"
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
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  rotate: [0, 360]
                }}
                transition={{
                  rotate: { duration: 1, repeat: Infinity, ease: "linear" }
                }}
                exit={{ opacity: 0, scale: 0.5 }}
              >
                <Loader2 className="w-5 h-5 animate-spin text-amber-300" />
              </motion.div>
            )}

            {status === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  y: 0
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20
                }}
                className="flex items-center gap-2"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 15,
                    delay: 0.1
                  }}
              >
                  <Check className="w-5 h-5" />
                </motion.div>
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Confirmed!
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        <p className="relative text-center text-[10px] text-zinc-500 mt-3 flex items-center justify-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500/30 border border-amber-500/60 shadow-[0_0_8px_rgba(251,191,36,0.4)]"></span>
          Secure 256-bit Connection
        </p>
      </motion.div>
    </div>
  );
}

