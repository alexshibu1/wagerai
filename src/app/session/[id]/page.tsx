'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Zap } from 'lucide-react';
import VinylPlayer from '@/components/vinyl-player';
import VibeSwitcher from '@/components/vibe-switcher';
import TimeboxedTaskList from '@/components/timeboxed-task-list';
import VolatilityChart from '@/components/volatility-chart';
import SettlementModal from '@/components/settlement-modal';
import HabitTicker from '@/components/habit-ticker';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/wager-utils';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  multiplier?: number;
  timebox?: 'morning' | 'deep' | 'closing';
}

interface VolatilityDataPoint {
  time: string;
  value: number;
}

interface DeepWorkBlock {
  id: number;
  active: boolean;
  remainingSeconds: number;
  taskId?: string;
}

export default function FocusSessionPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  
  // Vibe mode state
  const [vibeMode, setVibeMode] = useState<'market' | 'cozy'>('market');
  
  // Initial load animation state
  const [isEntering, setIsEntering] = useState(true);
  
  // Store active session ID in localStorage
  useEffect(() => {
    localStorage.setItem('activeSessionId', params.id);
    
    // Fade in animation
    const timer = setTimeout(() => setIsEntering(false), 100);
    
    return () => {
      clearTimeout(timer);
      localStorage.removeItem('activeSessionId');
    };
  }, [params.id]);
  
  // Get stake amount from session (default to 50 if not set)
  const [stakeAmount] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('currentStakeAmount');
      return stored ? parseInt(stored) : 50;
    }
    return 50;
  });
  
  // Core State
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Research competitor strategies', completed: false, timebox: 'morning' },
    { id: '2', title: 'Draft outline for Q1 plan', completed: false, timebox: 'deep' },
    { id: '3', title: 'Review and revise budget', completed: false, timebox: 'closing' },
  ]);

  // 12-Hour Market Timer (starts at 12 hours)
  const [timeRemaining, setTimeRemaining] = useState({
    hours: 12,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });
  
  const baseWager = 100;
  const [marketOpen, setMarketOpen] = useState(true);

  // Deep Work Blocks (3 x 90-minute blocks)
  const [deepWorkBlocks, setDeepWorkBlocks] = useState<DeepWorkBlock[]>([
    { id: 1, active: false, remainingSeconds: 0 },
    { id: 2, active: false, remainingSeconds: 0 },
    { id: 3, active: false, remainingSeconds: 0 },
  ]);

  // Volatility Tracking
  const [volatilityData, setVolatilityData] = useState<VolatilityDataPoint[]>([
    { time: '0s', value: 100 }
  ]);
  const [currentFocusValue, setCurrentFocusValue] = useState(100);
  const sessionStartTime = useRef(Date.now());
  const lastUpdateTime = useRef(Date.now());
  const updateCounter = useRef(0);

  // Settlement Modal
  const [showSettlement, setShowSettlement] = useState(false);

  // 12-Hour Timer Logic
  useEffect(() => {
    if (!marketOpen) return;

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        let { hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else {
          clearInterval(interval);
          handleCloseMarket();
          return { ...prev, isExpired: true };
        }
        
        return { ...prev, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [marketOpen]);

  // Volatility Engine - More Aggressive & Responsive
  useEffect(() => {
    if (!marketOpen) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsedSeconds = Math.floor((now - sessionStartTime.current) / 1000);

      // Calculate decay rate based on deep work activity
      const activeBlocks = deepWorkBlocks.filter(b => b.active).length;
      let changeRate = -0.5; // Base decay per second (more aggressive)

      if (activeBlocks > 0) {
        // Deep work active = strong upward trend
        changeRate = 1.0; // Positive = growth
      }

      // Apply decay/growth every second
      setCurrentFocusValue(prev => {
        const newValue = Math.max(0, Math.min(200, prev + changeRate));
        
        // Add data point every 5 seconds for smoother graph
        updateCounter.current++;
        if (updateCounter.current % 5 === 0) {
          const timeLabel = elapsedSeconds < 60 
            ? `${elapsedSeconds}s` 
            : `${Math.floor(elapsedSeconds / 60)}m`;
          
          setVolatilityData(prevData => {
            const newData = [...prevData, { time: timeLabel, value: newValue }];
            // Keep last 50 points to prevent memory issues
            return newData.slice(-50);
          });
        }
        
        return newValue;
      });
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [marketOpen, deepWorkBlocks]);

  // Deep Work Block Timers
  useEffect(() => {
    const interval = setInterval(() => {
      setDeepWorkBlocks(prev =>
        prev.map(block => {
          if (block.active && block.remainingSeconds > 0) {
            return { ...block, remainingSeconds: block.remainingSeconds - 1 };
          } else if (block.active && block.remainingSeconds === 0) {
            // Block completed - apply multiplier
            if (block.taskId) {
              setTasks(prevTasks =>
                prevTasks.map(task =>
                  task.id === block.taskId ? { ...task, multiplier: 1.5 } : task
                )
              );
            }
            return { ...block, active: false };
          }
          return block;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Handle Task Toggle
  const handleTaskToggle = (taskId: string) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id === taskId) {
          const newCompleted = !task.completed;
          
          // DRAMATIC spike on completion
          if (newCompleted) {
            setCurrentFocusValue(prevValue => {
              const spike = Math.min(200, prevValue + 40); // Bigger spike!
              const elapsedSeconds = Math.floor((Date.now() - sessionStartTime.current) / 1000);
              const timeLabel = elapsedSeconds < 60 
                ? `${elapsedSeconds}s` 
                : `${Math.floor(elapsedSeconds / 60)}m`;
              
              setVolatilityData(prevData => {
                const newData = [...prevData, { time: timeLabel, value: spike }];
                return newData.slice(-50);
              });
              return spike;
            });
          }
          
          return { ...task, completed: newCompleted };
        }
        return task;
      })
    );
  };

  // Start Deep Work Block
  const handleStartDeepWork = (blockId: number) => {
    const availableBlock = deepWorkBlocks.find(b => b.id === blockId && !b.active);
    if (!availableBlock) return;

    // Select task for this block
    const incompleteTasks = tasks.filter(t => !t.completed);
    if (incompleteTasks.length === 0) return;

    const selectedTask = incompleteTasks[0];

    setDeepWorkBlocks(prev =>
      prev.map(block =>
        block.id === blockId
          ? { ...block, active: true, remainingSeconds: 5400, taskId: selectedTask.id } // 90 min = 5400 sec
          : block
      )
    );

    // Give immediate boost when starting deep work
    setCurrentFocusValue(prevValue => {
      const boost = Math.min(200, prevValue + 15);
      const elapsedSeconds = Math.floor((Date.now() - sessionStartTime.current) / 1000);
      const timeLabel = elapsedSeconds < 60 
        ? `${elapsedSeconds}s` 
        : `${Math.floor(elapsedSeconds / 60)}m`;
      
      setVolatilityData(prevData => {
        const newData = [...prevData, { time: timeLabel, value: boost }];
        return newData.slice(-50);
      });
      return boost;
    });
  };

  // Cancel Deep Work Block
  const handleCancelDeepWork = (blockId: number) => {
    if (!confirm('Cancel deep work? This will cause a massive volatility drop!')) return;

    setDeepWorkBlocks(prev =>
      prev.map(block =>
        block.id === blockId ? { ...block, active: false, remainingSeconds: 0, taskId: undefined } : block
      )
    );

    // MASSIVE instant drop on cancel (RED CANDLE)
    setCurrentFocusValue(prevValue => {
      const drop = Math.max(0, prevValue - 50); // Bigger penalty!
      const elapsedSeconds = Math.floor((Date.now() - sessionStartTime.current) / 1000);
      const timeLabel = elapsedSeconds < 60 
        ? `${elapsedSeconds}s` 
        : `${Math.floor(elapsedSeconds / 60)}m`;
      
      setVolatilityData(prevData => {
        const newData = [...prevData, { time: timeLabel, value: drop }];
        return newData.slice(-50);
      });
      return drop;
    });
  };

  // Close Market (Manual or Timer Expiry)
  const handleCloseMarket = () => {
    setMarketOpen(false);
    setShowSettlement(true);
  };

  const handleForfeit = () => {
    if (confirm('Are you sure you want to forfeit this wager? You will lose $' + baseWager)) {
      router.push('/dashboard');
    }
  };

  const formatDeepWorkTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const activeDeepWorkCount = deepWorkBlocks.filter(b => b.active).length;
  const deepWorkBonus = activeDeepWorkCount * 20; // $20 bonus per completed block

  // Dynamic background based on vibe mode
  const bgClass = vibeMode === 'cozy' 
    ? 'bg-gradient-to-br from-orange-900 to-amber-900' 
    : 'bg-slate-950';

  return (
    <main className={`w-full min-h-screen ${bgClass} relative transition-all duration-1000 ${isEntering ? 'opacity-0' : 'opacity-100'}`}>
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"></div>
        
        {/* Back Button (subtle) */}
        <button
          onClick={() => router.push('/dashboard')}
          className="absolute top-6 left-6 text-zinc-600 hover:text-zinc-400 transition-colors z-50"
        >
          <ArrowLeft size={20} />
        </button>

        {/* 3-Column Grid Layout */}
        <div className="relative z-10 h-screen grid grid-cols-3 gap-8 p-8">
          
          {/* LEFT COLUMN: Vinyl Player */}
          <div className="flex flex-col justify-center">
            <VinylPlayer />
          </div>

          {/* CENTER COLUMN: Giant Timer + Vibe Switcher */}
          <div className="flex flex-col items-center justify-center gap-8">
            {/* Active Contract Indicator */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <div className="label-text text-emerald-400">ACTIVE CONTRACT</div>
            </div>

            {/* Giant Countdown Timer */}
            <div className="text-center">
              <div className="font-mono text-8xl font-bold gradient-text mb-6 tabular-nums tracking-tighter">
                {String(timeRemaining.hours).padStart(2, '0')}:
                {String(timeRemaining.minutes).padStart(2, '0')}:
                {String(timeRemaining.seconds).padStart(2, '0')}
              </div>
              
              {/* Contract Value Badge (Enhanced) */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="px-6 py-3 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
                  <span className="text-xs text-zinc-500 uppercase tracking-wider mr-2">Contract Value:</span>
                  <span className="text-xl font-bold font-mono text-emerald-400">${stakeAmount || 50}.00</span>
                </div>
              </div>

              {/* Settle Button */}
              <Button
                onClick={handleCloseMarket}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold uppercase tracking-wider px-10 py-4 text-base shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all hover:shadow-[0_0_50px_rgba(16,185,129,0.5)]"
              >
                SETTLE CONTRACT
              </Button>
            </div>

            {/* Vibe Switcher Below Timer */}
            <VibeSwitcher onVibeChange={(mode) => setVibeMode(mode)} />
          </div>

          {/* RIGHT COLUMN: Timeboxed Task List */}
          <div className="flex flex-col">
            <div className="label-text mb-4">TIMEBOXED TASKS</div>
            <div className="flex-1 overflow-y-auto">
              <TimeboxedTaskList tasks={tasks} onTaskToggle={handleTaskToggle} />
            </div>
          </div>
        </div>

      {/* Settlement Modal */}
      <SettlementModal
        open={showSettlement}
        onClose={() => router.push('/dashboard')}
        tasks={tasks}
        baseWager={baseWager}
        volatilityData={volatilityData}
        deepWorkBonus={deepWorkBonus}
      />
    </main>
  );
}
