'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Zap } from 'lucide-react';
import TimeboxedTaskList from '@/components/timeboxed-task-list';
import VolatilityChart from '@/components/volatility-chart';
import SettlementModal from '@/components/settlement-modal';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { formatCurrency, calculateTimeRemaining } from '@/lib/wager-utils';
import { useWager } from '@/hooks/use-wager';
import { createClient } from '../../../../supabase/client';
import { Wager } from '@/types/wager';
import VinylPlayer from '@/components/vinyl-player';
import { saveDeepWorkBlock, saveSessionVolatility, completeWager, failWager } from '@/app/actions/wager-actions';
import confetti from 'canvas-confetti';

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
  completed: boolean;
  remainingSeconds: number;
  taskId?: string;
}

export default function FocusSessionPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const supabase = createClient();
  const { settleWager } = useWager();
  
  const [wager, setWager] = useState<Wager | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [userName, setUserName] = useState<string>('Alex');
  const [vibeMode, setVibeMode] = useState<'market' | 'cozy'>('market');
  const [isEntering, setIsEntering] = useState(true);
  useEffect(() => {
    const fetchWager = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/sign-in');
          return;
        }

        // Get user's name from metadata
        const metadata = user.user_metadata ?? {};
        const rawName = metadata.full_name || 
                        metadata.name || 
                        user.email?.split('@')[0] || 
                        'Alex';
        // Capitalize first letter (handle both single word and multi-word names)
        const name = rawName.split(' ').map((word: string) => {
          if (!word) return word;
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }).join(' ');
        setUserName(name);

        const { data, error } = await supabase
          .from('wagers')
          .select('*')
          .eq('id', params.id)
          .eq('user_id', user.id)
          .single();

        if (error || !data) {
          router.push('/markets');
          return;
        }

        if (data.status === 'OPEN' && data.asset_class === 'TDAY') {
          setWager(data as Wager);
          setHasAccess(true);
        } else {
          router.push('/markets');
          return;
        }
      } catch (error) {
        console.error('Error fetching wager:', error);
        router.push('/markets');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWager();
  }, [params.id, router, supabase]);

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
  
  const [tasks, setTasks] = useState<Task[]>([]);
  useEffect(() => {
    if (wager?.id) {
      const storedTasks = localStorage.getItem(`session_${wager.id}_tasks`);
      if (storedTasks) {
        try {
          const parsedTasks = JSON.parse(storedTasks);
          setTasks(parsedTasks);
        } catch (err) {
          console.error('Failed to parse stored tasks:', err);
          // Fallback to default tasks
          setTasks([
            { id: '1', title: 'Research competitor strategies', completed: false, timebox: 'morning' },
            { id: '2', title: 'Draft outline for Q1 plan', completed: false, timebox: 'deep' },
            { id: '3', title: 'Review and revise budget', completed: false, timebox: 'closing' },
          ]);
        }
      } else {
        setTasks([
          { id: '1', title: 'Research competitor strategies', completed: false, timebox: 'morning' },
          { id: '2', title: 'Draft outline for Q1 plan', completed: false, timebox: 'deep' },
          { id: '3', title: 'Review and revise budget', completed: false, timebox: 'closing' },
        ]);
      }
    }
  }, [wager?.id]);

  // Current time in 12-hour format
  const [currentTime, setCurrentTime] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
    period: 'AM' as 'AM' | 'PM',
  });

  const [activeSessions, setActiveSessions] = useState<Array<{
    id: string;
    title: string;
    timeRemaining: { hours: number; minutes: number; seconds: number };
  }>>([]);
  
  // Market Timer (still needed for deadline calculations)
  const [timeRemaining, setTimeRemaining] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });
  
  const [marketOpen, setMarketOpen] = useState(true);

  const [deepWorkBlocks, setDeepWorkBlocks] = useState<DeepWorkBlock[]>(() => {
    if (typeof window !== 'undefined' && params.id) {
      const stored = localStorage.getItem(`session_${params.id}_deepWorkBlocks`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          // Adjust remaining seconds based on when it was saved
          const now = Date.now();
          return parsed.map((block: DeepWorkBlock & { savedAt?: number }) => {
            if (block.active && block.savedAt) {
              const elapsed = Math.floor((now - block.savedAt) / 1000);
              const newRemaining = Math.max(0, block.remainingSeconds - elapsed);
              if (newRemaining === 0) {
                return { ...block, active: false, completed: true, remainingSeconds: 0 };
              }
              return { ...block, remainingSeconds: newRemaining };
            }
            return block;
          });
        } catch (err) {
          console.error('Failed to parse stored deep work blocks:', err);
        }
      }
    }
    return [
      { id: 1, active: false, completed: false, remainingSeconds: 0 },
      { id: 2, active: false, completed: false, remainingSeconds: 0 },
      { id: 3, active: false, completed: false, remainingSeconds: 0 },
    ];
  });

  // Volatility Tracking - Real-time updates - Load from localStorage
  const [volatilityData, setVolatilityData] = useState<VolatilityDataPoint[]>(() => {
    if (typeof window !== 'undefined' && params.id) {
      const stored = localStorage.getItem(`session_${params.id}_volatilityData`);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (err) {
          console.error('Failed to parse stored volatility data:', err);
        }
      }
    }
    return [{ time: '0s', value: 100 }];
  });
  
  const [currentFocusValue, setCurrentFocusValue] = useState(() => {
    if (typeof window !== 'undefined' && params.id) {
      const stored = localStorage.getItem(`session_${params.id}_currentFocusValue`);
      if (stored) {
        try {
          return parseFloat(stored);
        } catch (err) {
          console.error('Failed to parse stored focus value:', err);
        }
      }
    }
    return 100;
  });
  
  const getStoredStartTime = () => {
    if (typeof window !== 'undefined' && params.id) {
      const stored = localStorage.getItem(`session_${params.id}_startTime`);
      if (stored) {
        try {
          return parseInt(stored, 10);
        } catch (err) {
          console.error('Failed to parse stored start time:', err);
        }
      }
    }
    return Date.now();
  };
  
  const getStoredLastTaskCompletionTime = () => {
    if (typeof window !== 'undefined' && params.id) {
      const stored = localStorage.getItem(`session_${params.id}_lastTaskCompletionTime`);
      if (stored && stored !== 'null') {
        try {
          return parseInt(stored, 10);
        } catch (err) {
          console.error('Failed to parse stored last task completion time:', err);
        }
      }
    }
    return null;
  };
  
  const sessionStartTime = useRef<number>(getStoredStartTime());
  const updateCounter = useRef(0);
  const lastTaskCompletionTime = useRef<number | null>(getStoredLastTaskCompletionTime());
  const taskCompletionCount = useRef(0);
  const [momentumWarning, setMomentumWarning] = useState<{ seconds: number; type: 'none' | 'warning' | 'critical' } | null>(null);
  const lastDataPointTime = useRef<number>(Date.now());
  // Initialize visible decay timer: use last task completion time if available, otherwise session start time
  const storedLastTaskTime = getStoredLastTaskCompletionTime();
  const lastVisibleDecayTime = useRef<number>(storedLastTaskTime || sessionStartTime.current);
  
  // Page visibility tracking
  const [isPageVisible, setIsPageVisible] = useState(true);
  const [hasMultipleScreens, setHasMultipleScreens] = useState(false);

  // Settlement Modal
  const [showSettlement, setShowSettlement] = useState(false);
  
  // All Tasks Completed Celebration
  const [allTasksCompleted, setAllTasksCompleted] = useState(false);
  const [showCompletionCelebration, setShowCompletionCelebration] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [completionError, setCompletionError] = useState<string | null>(null);
  
  // Persist session state to localStorage
  useEffect(() => {
    if (!wager?.id) return;
    
    const storageKey = `session_${wager.id}`;
    
    // Save deep work blocks
    const blocksToSave = deepWorkBlocks.map(block => ({
      ...block,
      savedAt: block.active ? Date.now() : undefined,
    }));
    localStorage.setItem(`${storageKey}_deepWorkBlocks`, JSON.stringify(blocksToSave));
    
    // Save volatility data (keep last 100 points)
    localStorage.setItem(`${storageKey}_volatilityData`, JSON.stringify(volatilityData.slice(-100)));
    
    // Save current focus value
    localStorage.setItem(`${storageKey}_currentFocusValue`, currentFocusValue.toString());
    
    // Save session start time
    localStorage.setItem(`${storageKey}_startTime`, sessionStartTime.current.toString());
    
    // Save last task completion time
    if (lastTaskCompletionTime.current) {
      localStorage.setItem(`${storageKey}_lastTaskCompletionTime`, lastTaskCompletionTime.current.toString());
    } else {
      localStorage.removeItem(`${storageKey}_lastTaskCompletionTime`);
    }
  }, [wager?.id, deepWorkBlocks, volatilityData, currentFocusValue]);
  
  // Check for multiple screens on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check if user has multiple screens (limited browser support)
      try {
        // @ts-ignore - window.screen is available but screen.isExtended is not standard
        const isExtended = window.screen?.isExtended || false;
        // Also check screen count (not standard but some browsers support it)
        const screenCount = (window as any).screen?.length || 1;
        setHasMultipleScreens(isExtended || screenCount > 1);
      } catch (err) {
        // If we can't detect, assume single screen (safer assumption)
        setHasMultipleScreens(false);
      }
    }
  }, []);
  
  // Page visibility detection
  useEffect(() => {
    if (typeof document === 'undefined') return;
    
    const handleVisibilityChange = () => {
      const isVisible = !document.hidden;
      setIsPageVisible(isVisible);
      
      // If page becomes visible again, update timers
      if (isVisible) {
        // Recalculate deep work block timers
        setDeepWorkBlocks(prev => prev.map(block => {
          if (block.active && block.remainingSeconds > 0) {
            // Timer will be updated by the interval, but we ensure it's accurate
            return block;
          }
          return block;
        }));
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);
  
  // Navigation warning
  useEffect(() => {
    if (!wager?.id || showSettlement) return;
    
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Check if there's an active deep work block
      const hasActiveBlock = deepWorkBlocks.some(b => b.active);
      
      if (hasActiveBlock || currentFocusValue > 100) {
        e.preventDefault();
        e.returnValue = 'You have an active deep work session. Your focus value will slowly drain if you leave. Are you sure you want to leave?';
        return e.returnValue;
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [wager?.id, deepWorkBlocks, currentFocusValue, showSettlement]);

  // Update current time in 12-hour format
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      const period = hours >= 12 ? 'PM' : 'AM';
      
      // Convert to 12-hour format
      hours = hours % 12 || 12;
      
      setCurrentTime({ hours, minutes, seconds, period });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch active sessions for switching
  useEffect(() => {
    const fetchActiveSessions = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

        const { data: activeWagers } = await supabase
          .from('wagers')
          .select('id, title, deadline')
          .eq('user_id', user.id)
          .eq('asset_class', 'TDAY')
          .eq('status', 'OPEN')
          .gte('created_at', startOfDay.toISOString())
          .lte('created_at', endOfDay.toISOString());

        if (activeWagers) {
          const sessionsWithTime = activeWagers.map(wager => {
            const deadlineInfo = calculateTimeRemaining(wager.deadline);
            return {
              id: wager.id,
              title: wager.title,
              timeRemaining: {
                hours: deadlineInfo.hours,
                minutes: deadlineInfo.minutes,
                seconds: deadlineInfo.seconds,
              },
            };
          });
          setActiveSessions(sessionsWithTime);
        }
      } catch (error) {
        console.error('Error fetching active sessions:', error);
      }
    };

    fetchActiveSessions();
    // Update every second to refresh time remaining
    const interval = setInterval(fetchActiveSessions, 1000);
    return () => clearInterval(interval);
  }, [supabase]);

  // Timer Logic synced with wager deadline (still needed for internal calculations)
  useEffect(() => {
    if (!marketOpen || !wager) return;

    const calculateTime = () => {
      const deadlineInfo = calculateTimeRemaining(wager.deadline);
      return {
        hours: deadlineInfo.hours,
        minutes: deadlineInfo.minutes,
        seconds: deadlineInfo.seconds,
        isExpired: deadlineInfo.isExpired
      };
    };

    // Initial calculation
    setTimeRemaining(calculateTime());

    const interval = setInterval(() => {
      const remaining = calculateTime();
      setTimeRemaining(remaining);
      
      if (remaining.isExpired) {
        clearInterval(interval);
        handleCloseMarket();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [marketOpen, wager]);

  // Volatility Engine - Decay by 100 points over 7 hours when no activity, spike to 200 on task completion
  useEffect(() => {
    if (!marketOpen) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsedSeconds = Math.floor((now - sessionStartTime.current) / 1000);
      const BASELINE_VALUE = 100; // Starting baseline value
      const MIN_VALUE = 0; // Minimum value (decay target)
      const MAX_VALUE = 200; // Maximum value
      const DECAY_DURATION = 7 * 60 * 60; // 7 hours in seconds (25200 seconds) - time to decay 100 points
      const DECAY_AMOUNT = 100; // Always decay by 100 points over DECAY_DURATION
      
      // If page is not visible and user only has one screen, apply visibility drain
      // If user has multiple screens, they might be working on another screen, so no penalty
      const visibilityDrainMultiplier = (!isPageVisible && !hasMultipleScreens) ? 1.5 : 1.0;

      // Calculate change rate based on current value and activity
      const activeBlocks = deepWorkBlocks.filter(b => b.active);
      const hasActiveDeepWork = activeBlocks.length > 0;
      
      // Deep work gradual increase: 75 points over 90 minutes (5400 seconds)
      // 75 / 5400 = ~0.014 per second per active block
      const DEEP_WORK_INCREASE_RATE = 0.014; // Points per second per active block
      const deepWorkIncrease = hasActiveDeepWork ? activeBlocks.length * DEEP_WORK_INCREASE_RATE : 0;
      
      let changeRate = 0;

      // Check time since last task completion
      const secondsSinceLastTask = lastTaskCompletionTime.current 
        ? Math.floor((now - lastTaskCompletionTime.current) / 1000)
        : null;

      // Calculate change rate based on activity
      if (secondsSinceLastTask !== null && secondsSinceLastTask < 300) {
        // Recent activity (within 5 minutes) - slow decay or slight growth
        if (hasActiveDeepWork) {
          changeRate = 0.15 + deepWorkIncrease; // Slight growth with deep work + gradual increase
        } else {
          changeRate = -0.08; // Very slow decay when no deep work
        }
      } else {
        // No recent tasks (or no tasks ever)
        if (hasActiveDeepWork) {
          // During deep work but no recent tasks - still gradually increase
          setCurrentFocusValue(prev => {
            const newValue = Math.min(MAX_VALUE, prev + deepWorkIncrease);
            
            // Update graph data
            const timeLabel = elapsedSeconds < 60 
              ? `${elapsedSeconds}s` 
              : `${Math.floor(elapsedSeconds / 60)}m`;
            
            setVolatilityData(prevData => {
              const lastPoint = prevData[prevData.length - 1];
              const shouldAddPoint = !lastPoint || 
                Math.abs(newValue - lastPoint.value) >= 0.3 || 
                updateCounter.current % 2 === 0;
              
              if (shouldAddPoint) {
                const newData = [...prevData, { time: timeLabel, value: newValue, event: 'deepwork' }];
                return newData.slice(-100);
              }
              return prevData;
            });
            
            updateCounter.current++;
            return newValue;
          });
          // Skip the main update below since we already handled it
          return;
        } else {
          // No deep work and no recent tasks - visible decay: 1 point every 15 minutes
          setCurrentFocusValue(prev => {
            if (prev > MIN_VALUE) {
              // Visible decay: drop 1 point every 15 minutes (900 seconds) when inactive
              const VISIBLE_DECAY_INTERVAL = 15 * 60; // 15 minutes in seconds
              const timeSinceLastDecay = Math.floor((now - lastVisibleDecayTime.current) / 1000);
              
              let newValue = prev;
              
              // Check if 15 minutes have passed since last visible decay
              let decayHappened = false;
              if (timeSinceLastDecay >= VISIBLE_DECAY_INTERVAL) {
                // Calculate how many 15-minute intervals have passed
                const intervalsPassed = Math.floor(timeSinceLastDecay / VISIBLE_DECAY_INTERVAL);
                // Drop 1 point per interval, but never below the decay target
                const decayTarget = Math.max(MIN_VALUE, prev - DECAY_AMOUNT); // Target is 100 points below current, but never below 0
                const pointsToDrop = Math.min(intervalsPassed, prev - decayTarget); // Don't drop below target
                newValue = Math.max(decayTarget, prev - pointsToDrop);
                decayHappened = pointsToDrop > 0;
                
                // Update last decay time
                lastVisibleDecayTime.current = now - (timeSinceLastDecay % VISIBLE_DECAY_INTERVAL) * 1000;
              }
              
              // Update graph data - always add point when visible decay happens
              const timeLabel = elapsedSeconds < 60 
                ? `${elapsedSeconds}s` 
                : `${Math.floor(elapsedSeconds / 60)}m`;
              
              setVolatilityData(prevData => {
                const lastPoint = prevData[prevData.length - 1];
                const shouldAddPoint = decayHappened || // Always add point when decay happens
                  !lastPoint || 
                  Math.abs(newValue - lastPoint.value) >= 0.3 || 
                  updateCounter.current % 2 === 0;
                
                if (shouldAddPoint) {
                  const newData = [...prevData, { time: timeLabel, value: newValue }];
                  return newData.slice(-100);
                }
                return prevData;
              });
              
              updateCounter.current++;
              return newValue;
            }
            return prev; // Already at or below baseline, stay there
          });
          // Skip the main update below since we already handled it
          return;
        }
      }

      // Update momentum warning
      if (secondsSinceLastTask !== null) {
        if (secondsSinceLastTask > 300) {
          setMomentumWarning({
            seconds: secondsSinceLastTask,
            type: secondsSinceLastTask > 600 ? 'critical' : 'warning'
          });
        } else {
          setMomentumWarning(null);
        }
      } else if (elapsedSeconds > 300) {
        setMomentumWarning({ seconds: elapsedSeconds, type: 'critical' });
      } else {
        setMomentumWarning(null);
      }

      // Apply change rate and update graph in real-time
      setCurrentFocusValue(prev => {
        let newValue = prev;
        
        // Only apply changeRate if there's recent activity (within 5 min)
        if (secondsSinceLastTask !== null && secondsSinceLastTask < 300) {
          // Add deep work gradual increase on top of the change rate
          const totalChange = changeRate + deepWorkIncrease;
          newValue = Math.max(MIN_VALUE, Math.min(MAX_VALUE, prev + totalChange));
        } else {
          // Decay was already handled above, keep current value
          newValue = prev;
        }
        
        // Add data point every second for real-time graph updates
        const timeLabel = elapsedSeconds < 60 
          ? `${elapsedSeconds}s` 
          : `${Math.floor(elapsedSeconds / 60)}m`;
        
        setVolatilityData(prevData => {
          // Only add if value changed significantly (0.3 threshold) or it's been 2+ seconds
          const lastPoint = prevData[prevData.length - 1];
          const shouldAddPoint = !lastPoint || 
            Math.abs(newValue - lastPoint.value) >= 0.3 || 
            updateCounter.current % 2 === 0; // Every 2 seconds minimum
          
          if (shouldAddPoint) {
            const newData = [...prevData, { 
              time: timeLabel, 
              value: newValue,
              event: hasActiveDeepWork ? 'deepwork' : undefined
            }];
            // Keep last 100 points for smoother real-time visualization
            return newData.slice(-100);
          }
          return prevData;
        });
        
        updateCounter.current++;
        return newValue;
      });
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [marketOpen, deepWorkBlocks, isPageVisible, hasMultipleScreens]);

  // Deep Work Block Timers
  useEffect(() => {
    const interval = setInterval(() => {
      setDeepWorkBlocks(prev =>
        prev.map(block => {
          if (block.active && block.remainingSeconds > 0) {
            return { ...block, remainingSeconds: block.remainingSeconds - 1 };
          } else if (block.active && block.remainingSeconds === 0) {
            // Block completed - apply multiplier and mark as completed
            if (block.taskId) {
              setTasks(prevTasks =>
                prevTasks.map(task =>
                  task.id === block.taskId ? { ...task, multiplier: 1.5 } : task
                )
              );
            }
            
            // Save deep work block completion to database
            if (wager?.id) {
              const task = tasks.find(t => t.id === block.taskId);
              saveDeepWorkBlock(
                wager.id,
                block.id,
                task?.title,
                5400 - block.remainingSeconds // Actual duration completed
              ).catch(err => console.error('Failed to save deep work block:', err));
            }
            
            return { ...block, active: false, completed: true };
          }
          return block;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [wager?.id, tasks]);

  // Check if all tasks are completed
  useEffect(() => {
    if (tasks.length === 0) return;
    
    const allCompleted = tasks.every(task => task.completed);
    
    if (allCompleted && tasks.length === 3 && !allTasksCompleted) {
      setAllTasksCompleted(true);
      setShowCompletionCelebration(true);
      
      // Analytics: Track all tasks completed
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'all_tasks_completed', {
          wager_id: wager?.id,
          completion_time: new Date().toISOString(),
        });
      }
      
      // Big confetti celebration
      const duration = 5000;
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

        const particleCount = 100 * (timeLeft / duration);

        // Massive confetti from multiple origins
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ['#4ade80', '#34d399', '#10b981', '#fbbf24', '#f59e0b'],
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ['#4ade80', '#34d399', '#10b981', '#fbbf24', '#f59e0b'],
        });
        confetti({
          ...defaults,
          particleCount: particleCount * 0.5,
          origin: { x: 0.5, y: Math.random() - 0.2 },
          colors: ['#4ade80', '#34d399', '#10b981', '#fbbf24', '#f59e0b'],
        });
      }, 200);

      return () => clearInterval(interval);
    }
  }, [tasks, allTasksCompleted]);

  // Handle Task Toggle with Confetti and Deep Work Bonuses
  const handleTaskToggle = (taskId: string) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id === taskId) {
          const newCompleted = !task.completed;
          
          // DRAMATIC spike on completion + Confetti + Deep Work Bonus
          if (newCompleted) {
            const now = Date.now();
            lastTaskCompletionTime.current = now;
            lastVisibleDecayTime.current = now; // Reset visible decay timer on task completion
            taskCompletionCount.current += 1;
            
            // Check if task was completed during an active deep work block
            const activeBlockForTask = deepWorkBlocks.find(
              block => block.active && block.taskId === taskId
            );
            const isDuringDeepWork = !!activeBlockForTask;
            
            // If task is completed and has an active deep work block, end and mark as completed
            if (isDuringDeepWork && activeBlockForTask) {
              setDeepWorkBlocks(prev =>
                prev.map(block =>
                  block.id === activeBlockForTask.id
                    ? { ...block, active: false, completed: true, remainingSeconds: 0 }
                    : block
                )
              );
            }
            
            // Calculate spike to reach 200 (or close to it) when task is completed
            // If completing 1 task in first hour, spike to 200
            const elapsedHours = Math.floor((now - sessionStartTime.current) / (1000 * 60 * 60));
            const isFirstHour = elapsedHours < 1;
            
            let baseSpike = 0;
            let bonusSpike = 0;
            let bonusMultiplier = 1.0;
            
            if (isDuringDeepWork) {
              // MASSIVE bonus for completing task during deep work block!
              baseSpike = isFirstHour ? 100 : 60; // Bigger spike in first hour
              bonusSpike = 40; // Extra bonus
              bonusMultiplier = 2.0; // 2x money multiplier
              
              // Mark task with deep work bonus
              task.multiplier = bonusMultiplier;
            } else {
              // Check if any deep work block is active (even if not for this specific task)
              const anyActiveBlock = deepWorkBlocks.some(b => b.active);
              if (anyActiveBlock) {
                baseSpike = isFirstHour ? 80 : 50;
                bonusSpike = 20; // Smaller bonus if deep work is active but not for this task
                bonusMultiplier = 1.5;
                task.multiplier = bonusMultiplier;
              } else {
                // Normal completion - spike to 200 in first hour, otherwise add 80
                baseSpike = isFirstHour ? 100 : 80;
                bonusMultiplier = 1.0;
                task.multiplier = bonusMultiplier;
              }
            }
            
            const totalSpike = baseSpike + bonusSpike;
            
            // Trigger confetti animation (more intense if during deep work)
            if (typeof window !== 'undefined') {
              import('canvas-confetti').then((confetti) => {
                const count = isDuringDeepWork ? 300 : 200; // More confetti for deep work
                const defaults = {
                  origin: { y: 0.7 }
                };

                function fire(particleRatio: number, opts: any) {
                  confetti.default({
                    ...defaults,
                    ...opts,
                    particleCount: Math.floor(count * particleRatio)
                  });
                }

                fire(0.25, {
                  spread: 26,
                  startVelocity: 55,
                });
                fire(0.2, {
                  spread: 60,
                });
                fire(0.35, {
                  spread: 100,
                  decay: 0.91,
                  scalar: 0.8
                });
                fire(0.1, {
                  spread: 120,
                  startVelocity: 25,
                  decay: 0.92,
                  scalar: 1.2
                });
                fire(0.1, {
                  spread: 120,
                  startVelocity: 45,
                });
                
                // Extra celebration for deep work completion
                if (isDuringDeepWork) {
                  setTimeout(() => {
                    fire(0.5, {
                      spread: 80,
                      startVelocity: 70,
                      colors: ['#2dd4bf', '#10b981', '#34d399'],
                    });
                  }, 200);
                }
              });
            }
            
            setCurrentFocusValue(prevValue => {
              // Spike to 200 (or as close as possible) when task is completed
              // In first hour, completing 1 task should reach 200
              const targetValue = 200;
              const spike = Math.min(targetValue, prevValue + totalSpike);
              
              const elapsedSeconds = Math.floor((now - sessionStartTime.current) / 1000);
              const timeLabel = elapsedSeconds < 60 
                ? `${elapsedSeconds}s` 
                : `${Math.floor(elapsedSeconds / 60)}m`;
              
              // Immediately add data point on task completion for instant visual feedback
              setVolatilityData(prevData => {
                const newData = [...prevData, { 
                  time: timeLabel, 
                  value: spike,
                  event: isDuringDeepWork ? 'deepwork' : 'task'
                }];
                // Keep last 100 points for real-time visualization
                return newData.slice(-100);
              });
              return spike;
            });
          } else {
            // Task uncompleted - reset last completion time if this was the only completed task
            const remainingCompleted = prev.filter(t => t.completed && t.id !== taskId);
            if (remainingCompleted.length === 0) {
              lastTaskCompletionTime.current = null;
            }
          }
          
          return { ...task, completed: newCompleted };
        }
        return task;
      })
    );
  };

  // Start Deep Work Block
  const handleStartDeepWork = (blockId: number) => {
    const availableBlock = deepWorkBlocks.find(b => b.id === blockId && !b.active && !b.completed);
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
      
      // Immediately add data point for real-time visual feedback
      setVolatilityData(prevData => {
        const newData = [...prevData, { time: timeLabel, value: boost }];
        return newData.slice(-100);
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
      
      // Immediately add data point for real-time visual feedback
      setVolatilityData(prevData => {
        const newData = [...prevData, { time: timeLabel, value: drop, event: 'cancel' }];
        return newData.slice(-100);
      });
      return drop;
    });
  };

  // Close Market (Manual or Timer Expiry)
  const handleCloseMarket = () => {
    setMarketOpen(false);
    setShowSettlement(true);
  };

  const handleCompleteDay = async () => {
    if (!wager?.id || isCompleting) return;
    
    setIsCompleting(true);
    
    try {
      console.log('Starting day completion...', { wagerId: wager.id });
      
      // Save volatility data before completing (non-blocking - don't fail if this errors)
      const finalVolatility = currentFocusValue;
      try {
        console.log('Saving volatility data...', { finalVolatility, dataPoints: volatilityData.length });
        // Limit volatility data to last 100 points to avoid payload issues
        const limitedVolatilityData = volatilityData.slice(-100);
        await saveSessionVolatility(wager.id, limitedVolatilityData, finalVolatility);
        console.log('Volatility data saved successfully');
      } catch (volatilityErr) {
        console.warn('Failed to save volatility data (non-critical):', volatilityErr);
        // Continue anyway - volatility data is nice to have but not required
      }
      
      // Complete the wager (mark as WON) - this is the critical operation
      console.log('Completing wager...');
      const completedWager = await completeWager(wager.id);
      console.log('Wager completed successfully:', completedWager);
      
      // Analytics: Track completion
      if (typeof window !== 'undefined' && (window as any).gtag) {
        try {
          (window as any).gtag('event', 'day_completed', {
            wager_id: wager.id,
            final_volatility: finalVolatility,
            tasks_completed: tasks.filter(t => t.completed).length,
            deep_work_blocks: deepWorkBlocks.filter(b => b.completed).length,
            stake_amount: wager.stake_amount,
          });
        } catch (analyticsErr) {
          console.warn('Analytics tracking failed (non-critical):', analyticsErr);
        }
      }
      
      // Close celebration modal
      setShowCompletionCelebration(false);
      
      // Small delay to ensure state updates
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Show settlement modal to display earnings
      setShowSettlement(true);
    } catch (err: any) {
      console.error('Failed to complete day:', err);
      
      // Show detailed error message
      const errorMessage = err?.message || err?.toString() || 'Unknown error occurred';
      alert(`Failed to complete day: ${errorMessage}\n\nPlease check the console for more details.`);
      
      setIsCompleting(false);
    }
  };

  const handleForfeit = () => {
    if (confirm('Are you sure you want to forfeit this wager? You will lose $' + (wager?.stake_amount || 50))) {
      router.push('/markets');
    }
  };

  const activeDeepWorkCount = deepWorkBlocks.filter(b => b.active).length;
  const deepWorkBonus = activeDeepWorkCount * 20; // $20 bonus per completed block

  // Dark background only (no color)
  const bgClass = 'bg-slate-950';

  if (isLoading || !hasAccess || !wager) {
    return (
      <div className="w-full min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-zinc-400">Loading session...</div>
      </div>
    );
  }

  return (
    <main className={`w-full min-h-screen ${bgClass} relative transition-all duration-1000 ${isEntering ? 'opacity-0' : 'opacity-100'}`}>
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"></div>
        
      {/* Back Button (subtle) */}
      <button
        onClick={() => router.push('/markets')}
        className="absolute top-6 left-6 text-zinc-600 hover:text-zinc-400 transition-colors z-50"
      >
        <ArrowLeft size={20} />
      </button>

      <div className="relative z-10 px-8 py-8">
        {/* TOP SECTION: Welcome Message + Big Timer - Centered */}
        <div className="mb-8 max-w-7xl mx-auto">
          <div className="mb-6">
            {/* Time Display - Centered */}
            <div className="text-center mb-4">
              <h1 className="text-2xl font-medium text-zinc-300 mb-1 tracking-wide" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>Welcome {userName}</h1>
              <p className="text-sm text-cyan-400/70 mb-6 uppercase tracking-[0.3em] font-medium">Deep Work Terminal</p>
              <div className="relative inline-block">
                <div 
                  className="mb-4 tabular-nums relative"
                  style={{
                    fontFamily: '"JetBrains Mono", "SF Mono", "Fira Code", monospace',
                    letterSpacing: '-0.02em',
                    fontWeight: 200,
                    fontSize: '9rem',
                    background: 'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.7) 50%, rgba(6,182,212,0.5) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 0 80px rgba(6,182,212,0.3)',
                  }}
                >
                  {String(currentTime.hours).padStart(2, '0')}:
                  {String(currentTime.minutes).padStart(2, '0')}:
                  {String(currentTime.seconds).padStart(2, '0')}
                  <span 
                    className="ml-4"
                    style={{
                      fontSize: '3rem',
                      fontWeight: 300,
                      background: 'linear-gradient(180deg, rgba(161,161,170,1) 0%, rgba(6,182,212,0.6) 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >{currentTime.period}</span>
                </div>
              </div>
            </div>
            
            {/* Combined Deep Work Block + Active Sessions - Stacked Together */}
            {(deepWorkBlocks.some(b => b.active) || activeSessions.length > 0) && (
              <div className="flex items-center justify-center gap-4 flex-wrap">
                {/* Deep Work Block Widget - Violet theme (matching profile page) */}
                {deepWorkBlocks.some(b => b.active) && (
                  <>
                    {deepWorkBlocks
                      .filter(block => block.active)
                      .map((block) => {
                        const hours = Math.floor(block.remainingSeconds / 3600);
                        const minutes = Math.floor((block.remainingSeconds % 3600) / 60);
                        const seconds = block.remainingSeconds % 60;
                        const task = tasks.find(t => t.id === block.taskId);
                        
                        return (
                          <div
                            key={block.id}
                            className="w-[260px] h-[85px] px-5 py-3 rounded-xl border border-cyan-500/30 backdrop-blur-md flex items-center overflow-hidden"
                            style={{
                              background: 'linear-gradient(165deg, rgba(6, 182, 212, 0.12) 0%, rgba(10, 10, 15, 0.95) 100%)',
                              boxShadow: '0 0 30px rgba(6, 182, 212, 0.15)',
                            }}
                          >
                            <div className="flex items-center gap-4 w-full min-w-0">
                              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center flex-shrink-0 border border-cyan-500/20">
                                <Zap size={18} className="text-cyan-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-[10px] uppercase tracking-[0.2em] text-cyan-400/80 mb-1 leading-tight font-mono">
                                  Deep Work Block
                                </div>
                                <div className="text-lg font-mono font-medium text-white leading-tight mb-0.5" style={{ letterSpacing: '-0.02em' }}>
                                  {String(hours).padStart(2, '0')}:
                                  {String(minutes).padStart(2, '0')}:
                                  {String(seconds).padStart(2, '0')}
                                </div>
                                {task && (
                                  <div className="text-[10px] text-zinc-500 truncate leading-tight">
                                    {task.title}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </>
                )}
                
                {/* Active Sessions - Beside Deep Work Block */}
                {activeSessions.map((session, index) => {
                  // Use different colors for variety (cyan, amber, emerald) - matching profile page style
                  const colorSchemes = [
                    { 
                      bg: 'rgba(6, 182, 212, 0.12)', 
                      border: 'rgba(6, 182, 212, 0.3)', 
                      text: 'text-cyan-400', 
                      iconBg: 'rgba(6, 182, 212, 0.2)', 
                      dot: 'rgba(6, 182, 212, 1)',
                      borderActive: 'rgba(6, 182, 212, 0.5)'
                    },
                    { 
                      bg: 'rgba(251, 191, 36, 0.12)', 
                      border: 'rgba(251, 191, 36, 0.3)', 
                      text: 'text-amber-400', 
                      iconBg: 'rgba(251, 191, 36, 0.2)', 
                      dot: 'rgba(251, 191, 36, 1)',
                      borderActive: 'rgba(251, 191, 36, 0.5)'
                    },
                    { 
                      bg: 'rgba(16, 185, 129, 0.12)', 
                      border: 'rgba(16, 185, 129, 0.3)', 
                      text: 'text-emerald-400', 
                      iconBg: 'rgba(16, 185, 129, 0.2)', 
                      dot: 'rgba(16, 185, 129, 1)',
                      borderActive: 'rgba(16, 185, 129, 0.5)'
                    },
                  ];
                  const colors = colorSchemes[index % colorSchemes.length];
                  const isActive = session.id === params.id;
                  
                  return (
                    <button
                      key={session.id}
                      onClick={() => router.push(`/session/${session.id}`)}
                      className={`group relative w-[240px] h-[80px] px-4 py-3 rounded-xl border transition-all backdrop-blur-sm flex items-center overflow-hidden ${
                        isActive ? 'shadow-lg' : 'hover:border-white/20'
                      }`}
                      style={{
                        background: isActive 
                          ? `linear-gradient(165deg, ${colors.bg} 0%, rgba(10, 10, 15, 0.95) 100%)`
                          : 'linear-gradient(165deg, rgba(10, 10, 15, 0.6) 0%, rgba(10, 10, 15, 0.95) 100%)',
                        borderColor: isActive ? colors.borderActive : 'rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <div className="flex items-center gap-3 w-full min-w-0">
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: colors.iconBg }}
                        >
                          <div 
                            className={`w-2 h-2 rounded-full ${isActive ? 'animate-pulse' : ''}`}
                            style={{ backgroundColor: colors.dot }}
                          ></div>
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <div className={`text-sm font-semibold truncate mb-0.5 leading-tight ${isActive ? colors.text : 'text-white'}`}>
                            {session.title.startsWith('Daily Session:') ? 'Daily Session' : session.title}
                          </div>
                          <div className="flex items-center gap-2 text-xs font-mono leading-tight">
                            <span className={isActive ? 'text-zinc-400' : 'text-zinc-500'}>
                              {String(session.timeRemaining.hours).padStart(2, '0')}:
                              {String(session.timeRemaining.minutes).padStart(2, '0')}:
                              {String(session.timeRemaining.seconds).padStart(2, '0')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM SECTION: 2-Column Layout - Tasks Left, Chart Right */}
        <div className="grid grid-cols-[1fr_1fr] gap-8 max-w-7xl mx-auto">
          
          {/* LEFT COLUMN: Most Important Tasks (3 tasks only) */}
          <div className="flex flex-col">
            <div className="label-text mb-4">MOST IMPORTANT TASKS (MITS)</div>
            <div className="space-y-3">
              {tasks.slice(0, 3).map((task) => (
                <div
                  key={task.id}
                  className={`px-4 py-3 rounded-lg border flex items-center justify-between transition-all ${
                    task.completed
                      ? 'bg-slate-900/30 border-white/5 opacity-50 cursor-default'
                      : 'bg-slate-900/50 border-white/10 cursor-pointer hover:bg-slate-900/70'
                  }`}
                  onClick={() => !task.completed && handleTaskToggle(task.id)}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                      task.completed 
                        ? 'border-zinc-600 bg-zinc-700' 
                        : 'border-white/30'
                    }`}>
                      {task.completed && (
                        <svg className="w-3 h-3 text-zinc-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className={`flex-1 ${task.completed ? 'line-through text-zinc-500' : 'text-white'}`}>
                      {task.title}
                    </span>
                  </div>
                  {task.completed && (
                    <span className="text-xs text-zinc-500 font-mono ml-2">COMPLETED</span>
                  )}
                </div>
              ))}
            </div>

            {/* Deep Work Blocks Section */}
            <div className="mt-8">
              <div className="label-text mb-4">DEEP WORK LEVERAGE (90M BLOCKS)</div>
              <div className="space-y-3">
                {deepWorkBlocks.map((block) => (
                  <div
                    key={block.id}
                    className={`px-5 py-4 rounded-xl border flex items-center justify-between transition-all ${
                      block.completed
                        ? 'bg-zinc-900/30 border-zinc-700/30 opacity-60'
                        : block.active
                          ? 'bg-gradient-to-r from-emerald-950/40 to-teal-950/30 border-emerald-500/30 shadow-lg shadow-emerald-500/10'
                          : 'bg-zinc-900/40 border-zinc-700/40 hover:border-emerald-500/30 hover:bg-zinc-900/60'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                        block.completed 
                          ? 'bg-zinc-800/50' 
                          : block.active 
                            ? 'bg-emerald-500/20' 
                            : 'bg-zinc-800/80'
                      }`}>
                        <Zap 
                          size={18} 
                          className={block.completed ? 'text-zinc-600' : block.active ? 'text-emerald-400' : 'text-zinc-400'} 
                        />
                      </div>
                      <div>
                        <span className={`font-medium block ${
                          block.completed ? 'text-zinc-500 line-through' : 'text-white'
                        }`}>
                          Deep Work Block
                        </span>
                        {block.active && (
                          <span className="text-[10px] text-emerald-400 font-mono uppercase tracking-wider">1.5X MULTIPLIER ACTIVE</span>
                        )}
                        {block.completed && (
                          <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">COMPLETED</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {block.active ? (
                        <>
                          <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                            <span className="text-emerald-400 font-mono text-lg font-medium tracking-tight">
                              {Math.floor(block.remainingSeconds / 60)}:
                              {String(block.remainingSeconds % 60).padStart(2, '0')}
                            </span>
                          </div>
                          <Button
                            onClick={() => handleCancelDeepWork(block.id)}
                            className="bg-red-600/80 hover:bg-red-600 text-white text-xs px-4 py-1.5 font-mono uppercase tracking-wider"
                          >
                            CANCEL
                          </Button>
                        </>
                      ) : block.completed ? (
                        <span className="text-xs text-zinc-500 font-mono uppercase tracking-wider">COMPLETED</span>
                      ) : (
                        <Button
                          onClick={() => handleStartDeepWork(block.id)}
                          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs px-5 py-2 font-mono uppercase tracking-wider shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all"
                        >
                          START 90m
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Close Wager Button - Below Deep Work, bottom left, not too wide */}
            <div className="mt-8">
              <Button
                onClick={handleCloseMarket}
                className="w-auto text-white font-bold uppercase tracking-wider py-3 px-6 text-sm transition-all"
                style={{
                  background: 'linear-gradient(to right, #b91c1c, #991b1b)',
                  boxShadow: '0 0 30px rgba(185, 28, 28, 0.3), 0 0 50px rgba(185, 28, 28, 0.2)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 40px rgba(185, 28, 28, 0.5), 0 0 70px rgba(185, 28, 28, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 30px rgba(185, 28, 28, 0.3), 0 0 50px rgba(185, 28, 28, 0.2)';
                }}
              >
                CLOSE WAGER
              </Button>
            </div>
          </div>

          {/* RIGHT COLUMN: Vinyl Player + Volatility Chart */}
          <div className="flex flex-col">
            {/* Vinyl Player - On top, left-aligned */}
            <div className="mb-[10px] flex justify-start">
              <VinylPlayer />
            </div>
            
            {/* Volatility Chart - Underneath vinyl player */}
            <div 
              className="relative rounded-2xl overflow-hidden border border-white/[0.08] hover:border-emerald-500/20 transition-all"
              style={{ background: 'rgba(10, 10, 15, 0.8)' }}
            >
              <div className="p-4 pb-2">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-zinc-400">INTRADAY VOLATILITY</span>
                    <span className={`text-lg font-mono font-bold ${currentFocusValue >= 100 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {currentFocusValue.toFixed(0)}
                    </span>
                  </div>
                  <div className="flex items-center gap-6 text-xs font-mono">
                    <div className="flex items-center gap-3 text-zinc-500">
                      <span>Current: <span className="text-zinc-300">{currentFocusValue.toFixed(0)}</span></span>
                      <span>High: <span className="text-zinc-300">{Math.max(...volatilityData.map(d => d.value)).toFixed(0)}</span></span>
                      <span>Low: <span className="text-zinc-300">{Math.min(...volatilityData.map(d => d.value)).toFixed(0)}</span></span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-[250px] px-4 pb-4">
                <VolatilityChart data={volatilityData} currentValue={currentFocusValue} />
              </div>
            </div>
            
            {/* Momentum Warning - Shows when tasks aren't being completed */}
            {momentumWarning && (
              <div className={`mt-4 px-4 py-3 rounded-lg border ${
                momentumWarning.type === 'critical'
                  ? 'bg-red-500/10 border-red-500/30' 
                  : 'bg-amber-500/10 border-amber-500/30'
              }`}>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold ${
                    momentumWarning.type === 'critical'
                      ? 'text-red-400' 
                      : 'text-amber-400'
                  }`}>
                    ⚠️ {lastTaskCompletionTime.current ? 'MOMENTUM LOSS' : 'NO TASKS COMPLETED'}
                  </span>
                  <span className="text-xs text-zinc-400">
                    {Math.floor(momentumWarning.seconds / 60)}m {momentumWarning.seconds % 60}s
                    {lastTaskCompletionTime.current ? ' since last task' : ' elapsed'}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 mt-1">
                  {lastTaskCompletionTime.current 
                    ? 'Complete tasks to stop the graph from dropping!'
                    : 'Complete your first task to start building momentum!'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* All Tasks Completed Celebration Modal */}
      {showCompletionCelebration && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={(e) => e.stopPropagation()}
          />
          <div className="relative z-10">
            <div className="glass-panel border-2 border-emerald-500/50 rounded-3xl p-8 max-w-md mx-4 shadow-[0_0_60px_rgba(16,185,129,0.5)]">
              <div className="text-center">
                <div className="text-6xl mb-4 animate-bounce">🎉</div>
                <h2 className="text-3xl font-bold text-white mb-2" style={{
                  textShadow: '0 0 20px rgba(16,185,129,0.8)'
                }}>
                  CONGRATULATIONS!
                </h2>
                <p className="text-emerald-400 text-lg mb-4 font-medium">
                  All 3 tasks completed!
                </p>
                
                {/* Analytics Summary */}
                <div className="mb-6 p-4 rounded-xl bg-white/5 border border-emerald-500/20">
                  <div className="grid grid-cols-2 gap-3 text-left">
                    <div>
                      <div className="text-xs text-zinc-500 mb-1">Final Volatility</div>
                      <div className="text-lg font-mono font-bold text-emerald-400">
                        {currentFocusValue.toFixed(0)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-zinc-500 mb-1">Deep Work Blocks</div>
                      <div className="text-lg font-mono font-bold text-emerald-400">
                        {deepWorkBlocks.filter(b => b.completed).length}/3
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-zinc-500 mb-1">Stake Amount</div>
                      <div className="text-lg font-mono font-bold text-emerald-400">
                        ${wager?.stake_amount?.toLocaleString() || '0'}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-zinc-500 mb-1">Session Duration</div>
                      <div className="text-lg font-mono font-bold text-emerald-400">
                        {Math.floor((Date.now() - sessionStartTime.current) / (1000 * 60))}m
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="text-zinc-400 text-sm mb-6">
                  Lock in your earnings and claim your day&apos;s profit
                </p>
                
                {/* Error Message */}
                {completionError && (
                  <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                    <p className="text-red-400 text-sm font-medium mb-1">Error completing day</p>
                    <p className="text-red-300/80 text-xs">{completionError}</p>
                    <button
                      onClick={() => setCompletionError(null)}
                      className="mt-2 text-xs text-red-400 hover:text-red-300 underline"
                    >
                      Dismiss
                    </button>
                  </div>
                )}
                
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleCompleteDay();
                  }}
                  disabled={isCompleting}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold uppercase tracking-[0.2em] text-sm h-12 shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:shadow-[0_0_40px_rgba(16,185,129,0.7)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCompleting ? 'PROCESSING...' : 'COMPLETE DAY'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settlement Modal */}
      <SettlementModal
        open={showSettlement}
        onClose={() => router.push('/markets')}
        onSettle={async (success: boolean) => {
          // Save volatility data before settling (only if not already saved)
          if (wager?.id && !allTasksCompleted) {
            const finalVolatility = currentFocusValue;
            try {
              await saveSessionVolatility(wager.id, volatilityData, finalVolatility);
            } catch (err) {
              console.error('Failed to save volatility data:', err);
            }
            
            // Settle the wager
            try {
              if (success) {
                await completeWager(wager.id);
              } else {
                await failWager(wager.id);
              }
            } catch (err) {
              console.error('Failed to settle wager:', err);
            }
          }
          
          // Call the original settleWager for local state
          settleWager(success);
          router.refresh(); // Refresh server data
          router.push('/markets');
        }}
        tasks={tasks}
        baseWager={wager?.stake_amount || 50}
        volatilityData={volatilityData}
        deepWorkBonus={deepWorkBonus}
      />
    </main>
  );
}
