'use client';

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import CurvedHeroText from "@/components/curved-hero-text";
import { ArrowRight, Lock, Activity } from "lucide-react";

export default function LandingHero() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Background Gradient Spotlights - optional enhancement on top of global theme */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center">
        
        {/* Hero Text Wrapper */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-full z-10"
        >
          <CurvedHeroText />
        </motion.div>

        {/* Floating Centerpiece Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-12 z-20"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="glass-card p-6 min-w-[320px] rounded-2xl shadow-[0_0_40px_-10px_rgba(124,58,237,0.3)]"
          >
            {/* Card Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono text-zinc-400 tracking-widest uppercase">Live Protocol</span>
              </div>
              <div className="px-2 py-1 rounded bg-white/5 border border-white/5 text-[10px] text-zinc-400 font-mono">
                #8X92
              </div>
            </div>

            {/* Main Content */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm text-zinc-400 font-medium mb-1">Contract Type</h3>
                <div className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
                  <Lock className="w-4 h-4 text-primary" />
                  Deep Work Protocol
                </div>
              </div>
              
              <div>
                <h3 className="text-sm text-zinc-400 font-medium mb-1">Total Value Locked</h3>
                <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-bright font-mono">
                  $500.00 USDC
                </div>
              </div>
            </div>

            {/* Footer Stats */}
            <div className="mt-6 pt-4 border-t border-white/5 grid grid-cols-2 gap-4">
              <div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Status</div>
                <div className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                  <Activity className="w-3 h-3" />
                  Active
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Yield</div>
                <div className="text-xs text-white font-mono">+12% APY</div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-64 z-30"
        >
          <Link href="/sign-in">
            <Button 
              size="lg"
              className="bg-transparent hover:bg-white/5 text-white border border-primary/50 hover:border-primary shadow-[0_0_20px_-5px_rgba(124,58,237,0.5)] hover:shadow-[0_0_30px_-5px_rgba(124,58,237,0.6)] transition-all duration-300 rounded-full px-8 py-6 text-lg tracking-wide group"
            >
              Enter Protocol
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>

      </div>
    </div>
  );
}

