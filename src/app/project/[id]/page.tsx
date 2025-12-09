'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, TrendingUp, Calendar, DollarSign, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Wager } from '@/types/wager';
import { calculateTimeRemaining, formatCurrency, ASSET_CLASS_CONFIG } from '@/lib/wager-utils';
import { getUserWagers } from '@/app/actions/wager-actions';
import confetti from 'canvas-confetti';

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [wager, setWager] = useState<Wager | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadWager();
  }, [params.id]);

  const loadWager = async () => {
    try {
      const wagers = await getUserWagers();
      const foundWager = wagers.find(w => w.id === params.id);
      setWager(foundWager || null);
    } catch (error) {
      console.error('Error loading wager:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogProgress = () => {
    if (!wager) return;

    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#2dd4bf', '#6ee7b7', '#c084fc'],
    });

    // In a real app, this would call an API to log progress
    // For now, just show feedback
    alert('Progress logged! Health restored +10%');
  };

  if (isLoading) {
    return (
      <main className="w-full min-h-screen flex items-center justify-center">
        <div className="text-center text-zinc-500 data-text text-sm">Loading...</div>
      </main>
    );
  }

  if (!wager) {
    return (
      <main className="w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-zinc-500 data-text text-sm mb-4">Project not found</div>
          <Button onClick={() => router.push('/dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </main>
    );
  }

  const timeRemaining = calculateTimeRemaining(wager.deadline);
  const config = ASSET_CLASS_CONFIG[wager.asset_class];
  const health = wager.health_percentage || 100;
  const isBleeding = health < 50;

  return (
    <main className="w-full min-h-screen">
      <div className="container mx-auto px-6 py-6 max-w-5xl">
        {/* Back Button */}
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          <span className="label-text">Back to Dashboard</span>
        </button>

        {/* Project Header */}
        <div className="glass-panel p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="inline-block bg-zinc-800 text-white data-text text-sm px-3 py-1 rounded">
                  {config.symbol}
                </span>
                <span className="label-text text-xs">
                  {config.duration} DAY PROJECT
                </span>
              </div>
              <h1 className="data-text text-4xl font-bold text-white mb-2">
                {wager.title}
              </h1>
              <div className="label-text text-sm">
                Created {new Date(wager.created_at).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </div>
            </div>

            <div className="text-right">
              <div className="label-text mb-1">STAKE</div>
              <div className="data-text text-3xl font-bold electric-teal">
                {formatCurrency(wager.stake_amount)}
              </div>
            </div>
          </div>

          {/* Health Bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="label-text">PROJECT HEALTH</div>
              <div className={`data-text text-sm font-bold ${isBleeding ? 'text-soft-rose' : 'electric-teal'}`}>
                {health.toFixed(0)}%
              </div>
            </div>
            <div className="health-bar h-4">
              <div 
                className="health-bar-fill h-full rounded-full transition-all duration-500" 
                style={{
                  width: `${health}%`,
                  backgroundColor: isBleeding ? '#fda4af' : '#2dd4bf'
                }}
              />
            </div>
            {isBleeding && (
              <div className="label-text text-xs text-red-500 mt-2">
                ⚠️ Health critical - complete daily tasks to restore
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="glass-panel p-6">
            <div className="flex items-center gap-3 mb-3">
              <Calendar size={20} className="text-zinc-500" />
              <div className="label-text">TIME REMAINING</div>
            </div>
            <div className="data-text text-2xl font-bold">
              {timeRemaining.days} days
            </div>
            <div className="label-text text-xs mt-1">
              {String(timeRemaining.hours).padStart(2, '0')}:
              {String(timeRemaining.minutes).padStart(2, '0')} remaining today
            </div>
          </div>

          <div className="glass-panel p-6">
            <div className="flex items-center gap-3 mb-3">
              <Activity size={20} className="text-zinc-500" />
              <div className="label-text">STATUS</div>
            </div>
            <div className="data-text text-2xl font-bold">
              {wager.status}
            </div>
            <div className="label-text text-xs mt-1">
              {wager.status === 'OPEN' ? 'In Progress' : 'Completed'}
            </div>
          </div>

          <div className="glass-panel p-6">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp size={20} className="text-zinc-500" />
              <div className="label-text">POTENTIAL RETURN</div>
            </div>
            <div className="data-text text-2xl font-bold neon-mint">
              {formatCurrency(wager.stake_amount * 2)}
            </div>
            <div className="label-text text-xs mt-1">
              If completed successfully
            </div>
          </div>
        </div>

        {/* Daily Progress Section */}
        <div className="glass-panel p-8">
          <div className="mb-6">
            <h2 className="label-text text-lg mb-2">DAILY PROGRESS</h2>
            <p className="text-zinc-400 text-sm">
              Complete your daily tasks to maintain this project's health. Each day you log progress restores +10% health and provides a dividend payout.
            </p>
          </div>

          {/* Log Progress Button */}
          {wager.status === 'OPEN' && (
            <div className="flex items-center justify-between glass-panel p-6 border border-white/[0.08]">
              <div>
                <div className="data-text text-lg font-bold mb-1">
                  Today's Training
                </div>
                <div className="label-text text-xs">
                  Mark today's work complete to restore health
                </div>
              </div>
              <Button
                onClick={handleLogProgress}
                className="bg-electric-teal hover:bg-electric-teal/90 text-midnight font-bold uppercase tracking-wider px-8 h-12"
              >
                <DollarSign size={16} className="mr-2" />
                LOG PROGRESS
              </Button>
            </div>
          )}

          {/* Progress History (Mock) */}
          <div className="mt-6">
            <div className="label-text mb-3">RECENT ACTIVITY</div>
            <div className="space-y-2">
              {[
                { date: 'Today', status: 'pending' },
                { date: 'Yesterday', status: 'completed' },
                { date: '2 days ago', status: 'completed' },
                { date: '3 days ago', status: 'missed' },
              ].map((activity, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    activity.status === 'completed'
                      ? 'border-electric-teal/30 bg-electric-teal/5'
                      : activity.status === 'missed'
                      ? 'border-soft-rose/30 bg-soft-rose/5'
                      : 'border-white/[0.08]'
                  }`}
                >
                  <div className="data-text text-sm">{activity.date}</div>
                  <div className={`label-text text-xs uppercase ${
                    activity.status === 'completed'
                      ? 'text-electric-teal'
                      : activity.status === 'missed'
                      ? 'text-soft-rose'
                      : 'text-zinc-500'
                  }`}>
                    {activity.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
