'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Zap } from 'lucide-react';
import VinylPlayer from '@/components/vinyl-player';
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

  return (
    <>
      <HabitTicker />
      <main className="w-full min-h-screen flex flex-col relative p-6 pt-20">
        {/* Back Button */}
        <button
          onClick={() => router.push('/dashboard')}
          className="fixed top-20 left-6 text-zinc-500 hover:text-chalk transition-colors z-50"
        >
          <ArrowLeft size={24} />
        </button>

        <div className="container mx-auto max-w-7xl">
          {/* Top Section: Timer & Stats */}
          <div className="glass-panel p-6 mb-6">
            <div className="flex items-center justify-between">
              {/* Left: Timer with Gradient */}
              <div>
                <div className="label-text mb-2">MARKET CLOSES IN</div>
                <div className="data-text text-6xl font-bold gradient-text">
                  {String(timeRemaining.hours).padStart(2, '0')}:
                  {String(timeRemaining.minutes).padStart(2, '0')}:
                  {String(timeRemaining.seconds).padStart(2, '0')}
                </div>
              </div>

              {/* Right: Stats */}
              <div className="flex gap-8 items-center">
                <div className="text-right">
                  <div className="label-text mb-1">STAKE</div>
                  <div className="data-text text-2xl font-bold soft-mint">
                    {formatCurrency(baseWager)}
                  </div>
                </div>
                <div className="h-12 w-px bg-white/10"></div>
                <div className="text-right">
                  <div className="label-text mb-1">FOCUS VALUE</div>
                  <div className="data-text text-2xl font-bold">
                    {currentFocusValue.toFixed(0)}
                  </div>
                </div>
                <div className="h-12 w-px bg-white/10"></div>
                <Button
                  onClick={handleCloseMarket}
                  className="bg-soft-mint hover:bg-soft-mint/90 text-black font-bold uppercase tracking-wider px-6"
                >
                  CLOSE MARKET
                </Button>
              </div>
            </div>
          </div>

          {/* Main Grid: Tasks & Chart */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Left: Task List & Deep Work Blocks */}
            <div className="space-y-4">
              {/* Timeboxed Tasks */}
              <div>
                <div className="label-text mb-3">TIMEBOXED TASKS</div>
                <TimeboxedTaskList tasks={tasks} onTaskToggle={handleTaskToggle} />
              </div>

              {/* Deep Work Blocks */}
              <div>
                <div className="label-text mb-3">DEEP WORK LEVERAGE (90m BLOCKS)</div>
                <div className="space-y-2">
                  {deepWorkBlocks.map((block) => (
                    <div key={block.id} className="glass-panel p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Zap 
                            size={20} 
                            className={block.active ? 'text-soft-mint' : 'text-zinc-500'} 
                          />
                          <div>
                            <div className="data-text text-sm font-bold">
                              Block {block.id}
                            </div>
                            {block.active && (
                              <div className="label-text text-[10px] mt-1">
                                1.5x MULTIPLIER ACTIVE
                              </div>
                            )}
                          </div>
                        </div>

                        {block.active ? (
                          <div className="flex items-center gap-3">
                            <div className="data-text text-lg soft-mint">
                              {formatDeepWorkTime(block.remainingSeconds)}
                            </div>
                            <Button
                              onClick={() => handleCancelDeepWork(block.id)}
                              variant="ghost"
                              size="sm"
                              className="text-coral-rose hover:text-soft-rose/80"
                            >
                              CANCEL
                            </Button>
                          </div>
                        ) : (
                          <Button
                            onClick={() => handleStartDeepWork(block.id)}
                            size="sm"
                            className="bg-white/5 hover:bg-white/10 text-chalk"
                            disabled={block.remainingSeconds > 0}
                          >
                            {block.remainingSeconds > 0 ? 'USED' : 'START 90m'}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Volatility Chart */}
            <div>
              <div className="label-text mb-3">INTRADAY VOLATILITY</div>
              <div className="glass-panel p-4 h-[500px]">
                <VolatilityChart data={volatilityData} />
              </div>
            </div>
          </div>

          {/* Bottom: Vinyl Player & Forfeit */}
          <div className="flex items-end justify-between">
            <VinylPlayer />

            <Button
              onClick={handleForfeit}
              className="glass-panel border-2 border-soft-rose/50 text-soft-rose hover:bg-soft-rose/10 font-bold uppercase tracking-wider px-8 py-6 h-auto"
            >
              <div>
                <div className="text-xs mb-1">FORFEIT WAGER</div>
                <div className="data-text text-lg">${baseWager} LOSS</div>
              </div>
            </Button>
          </div>
        </div>
      </main>

      {/* Settlement Modal */}
      <SettlementModal
        open={showSettlement}
        onClose={() => router.push('/dashboard')}
        tasks={tasks}
        baseWager={baseWager}
        volatilityData={volatilityData}
        deepWorkBonus={deepWorkBonus}
      />
    </>
  );
}
