'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';

interface LogoProps {
  showWordmark?: boolean;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

/**
 * WHY this shape: a rotated square reads as a diamond without extra assets.
 * We layer a matte border and a metallic core to get depth, and add a
 * pulsing status dot to signal "live". Hover rotation is handled via motion
 * for smoothness and easing.
 */
export default function Logo({ showWordmark = true, className = '', onClick }: LogoProps) {
  const content = (
    <>
      <div className="relative flex items-center justify-center w-11 h-11">
        <motion.div
          className="relative w-full h-full"
          style={{ rotate: 45 }}
          whileHover={{ rotate: 90 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          <div className="absolute inset-0 rounded-lg border-2 border-white/20 shadow-[0_10px_25px_rgba(0,0,0,0.25)]" />
          <div className="absolute inset-[6px] rounded-md bg-gradient-to-b from-white to-zinc-400 shadow-inner" />
          {/* Emerald ring hugging the core */}
          <div className="absolute inset-[6px] rounded-md border border-emerald-400/60 shadow-[0_0_10px_rgba(16,185,129,0.45)]" />
          {/* Inner etching to give the core a premium cut */}
          <div className="absolute inset-[12px] rounded-sm border border-white/35 shadow-[inset_0_1px_4px_rgba(0,0,0,0.12)] opacity-70" />
        </motion.div>
      </div>

      <AnimatePresence>
        {showWordmark && (
          <motion.div
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -6 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="flex flex-col leading-tight"
            style={{ fontFamily: 'Inter Tight, var(--font-inter-tight, Inter), sans-serif' }}
          >
            <span className="font-black text-lg tracking-widest text-white">
              WAGER
            </span>
            <span className="text-[10px] uppercase tracking-[0.28em] text-zinc-300">
              Terminal
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

  if (onClick) {
    return (
      <div
        onClick={onClick}
        aria-label="Go to markets or active session"
        className={`group relative inline-flex items-center cursor-pointer ${showWordmark ? 'gap-3' : ''} ${className}`}
      >
        {content}
      </div>
    );
  }

  return (
    <Link
      href="/markets"
      aria-label="Go to markets"
      className={`group relative inline-flex items-center ${showWordmark ? 'gap-3' : ''} ${className}`}
    >
      {content}
    </Link>
  );
}


