'use client';

import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import MarketsTable from './markets-table';
import ExchangeModal from './exchange-modal';
import { Button } from './ui/button';
import { Wager, AssetClass } from '@/types/wager';
import { getUserWagers, createWager, completeWager, failWager } from '@/app/actions/wager-actions';

export default function MarketsView() {
  const [wagers, setWagers] = useState<Wager[]>([]);
  const [isExchangeOpen, setIsExchangeOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const wagersData = await getUserWagers();
      setWagers(wagersData || []);
    } catch (error) {
      setWagers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateWager = async (title: string, assetClass: AssetClass, stake: number, linkedYearWagerId?: string) => {
    try {
      await createWager(title, assetClass, stake, linkedYearWagerId);
      await loadData();
    } catch (error) {
      console.error('Error creating wager:', error);
    }
  };

  const handleCompleteWager = async (wagerId: string) => {
    try {
      await completeWager(wagerId);
      await loadData();
    } catch (error) {
      console.error('Error completing wager:', error);
    }
  };

  const handleFailWager = async (wagerId: string) => {
    try {
      await failWager(wagerId);
      await loadData();
    } catch (error) {
      console.error('Error failing wager:', error);
    }
  };

  const yearWagers = wagers.filter(w => w.asset_class === 'YEAR' && w.status === 'OPEN');

  if (isLoading) {
    return (
      <div className="w-full min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-zinc-500 data-text text-sm">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full min-h-screen">
        <div className="container mx-auto px-6 py-6 max-w-7xl">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></div>
              <h1 className="text-3xl font-bold text-white">Live Markets</h1>
            </div>
            <p className="text-zinc-400 text-sm">
              Bloomberg-style trading desk for your active wagers. High-frequency execution tracking.
            </p>
          </div>

          {/* Markets Table - Bloomberg Terminal Style */}
          <MarketsTable
            wagers={wagers}
            onComplete={handleCompleteWager}
            onFail={handleFailWager}
          />
        </div>

        {/* Floating Action Button - Create New Wager */}
        <Button
          onClick={() => setIsExchangeOpen(true)}
          className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-[0_0_24px_rgba(16,185,129,0.5)] z-50 transition-all hover:scale-105"
        >
          <Plus size={28} />
        </Button>
      </div>

      <ExchangeModal
        open={isExchangeOpen}
        onOpenChange={setIsExchangeOpen}
        onExecute={handleCreateWager}
        yearWagers={yearWagers}
      />
    </>
  );
}
