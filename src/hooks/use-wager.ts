import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../../supabase/client';

export type ActiveWager = {
  id: string;
  title: string;
  amount: number;
  duration: number; // in minutes
  startTime: number;
};

type WagerState = {
  isLockedIn: boolean;
  balance: number;
  activeWager: ActiveWager | null;
};

const STORAGE_KEY = 'wager_session_state';
const DEFAULT_BALANCE = 1000;

export function useWager() {
  const router = useRouter();
  const [state, setState] = useState<WagerState>({
    isLockedIn: false,
    balance: DEFAULT_BALANCE,
    activeWager: null,
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setState(parsed);
      } catch (e) {
        console.error('Failed to parse wager state', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Sync to LocalStorage whenever state changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isLoaded]);

  const placeWager = useCallback(async (title: string, amount: number, duration: number) => {
    // 1. Deduct balance and update local state
    const newWager: ActiveWager = {
      id: crypto.randomUUID(),
      title,
      amount,
      duration,
      startTime: Date.now(),
    };

    const newState = {
      isLockedIn: true,
      balance: state.balance - amount,
      activeWager: newWager,
    };

    setState(newState);

    // 2. Persist to Supabase (fire and forget / optimistic)
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        await supabase.from('wagers').insert({
          id: newWager.id,
          user_id: user.id,
          title: newWager.title,
          stake_amount: newWager.amount,
          duration_minutes: newWager.duration, // Assuming this column exists or mapping to it
          status: 'OPEN',
          created_at: new Date().toISOString(),
          // asset_class: 'TDAY' // Defaulting to TDAY for now based on context
        });
      }
    } catch (error) {
      console.warn('Supabase sync failed, falling back to local state only', error);
    }

    // 3. Redirect
    router.push(`/session/${newWager.id}`);
  }, [state.balance, router]);

  const settleWager = useCallback(async (success: boolean) => {
    if (!state.activeWager) return;

    const amount = state.activeWager.amount;
    const payout = success ? amount * 2 : 0;
    const newBalance = state.balance + payout;

    const newState = {
      isLockedIn: false, // Unlock after settlement
      balance: newBalance,
      activeWager: null,
    };

    setState(newState);

    // Sync to Supabase
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('wagers')
        .update({
          status: success ? 'WON' : 'LOST',
          completed_at: new Date().toISOString(),
          // pnl: success ? amount : -amount
        })
        .eq('id', state.activeWager.id);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to settle wager in Supabase', error);
    }
  }, [state.activeWager, state.balance]);

  return {
    ...state,
    isLoaded,
    placeWager,
    settleWager,
  };
}

