'use server';

import { createClient } from '../../../supabase/server';
import { AssetClass, Wager, UserStats } from '@/types/wager';
import { getDeadlineForAssetClass } from '@/lib/wager-utils';
import { revalidatePath } from 'next/cache';

export async function createWager(title: string, assetClass: AssetClass, stakeAmount: number, linkedYearWagerId?: string) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const deadline = getDeadlineForAssetClass(assetClass);

  const insertData: any = {
    user_id: user.id,
    title,
    asset_class: assetClass,
    stake_amount: stakeAmount,
    deadline: deadline.toISOString(),
    status: 'OPEN',
  };

  if (linkedYearWagerId) {
    insertData.linked_year_wager_id = linkedYearWagerId;
  }

  const { data, error } = await supabase
    .from('wagers')
    .insert(insertData)
    .select()
    .single();

  if (error) throw error;

  await updateUserStats(user.id);
  revalidatePath('/dashboard');
  
  return data;
}

export async function completeWager(wagerId: string) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const pnlPercentage = Math.floor(Math.random() * 30) + 10;

  const { data, error } = await supabase
    .from('wagers')
    .update({
      status: 'WON',
      completed_at: new Date().toISOString(),
      pnl_percentage: pnlPercentage,
    })
    .eq('id', wagerId)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) throw error;

  await updateUserStats(user.id);
  revalidatePath('/dashboard');
  revalidatePath('/profile');
  
  return data;
}

export async function failWager(wagerId: string) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('wagers')
    .update({
      status: 'LOST',
      completed_at: new Date().toISOString(),
      pnl_percentage: -100,
    })
    .eq('id', wagerId)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) throw error;

  await updateUserStats(user.id);
  revalidatePath('/dashboard');
  revalidatePath('/profile');
  
  return data;
}

export async function getUserWagers() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('wagers')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  return data as Wager[];
}

export async function getUserStats() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      const { data: newStats } = await supabase
        .from('user_stats')
        .insert({ user_id: user.id })
        .select()
        .single();
      return newStats as UserStats;
    }
    throw error;
  }
  
  return data as UserStats;
}

async function updateUserStats(userId: string) {
  const supabase = await createClient();

  const { data: wagers } = await supabase
    .from('wagers')
    .select('*')
    .eq('user_id', userId);

  if (!wagers) return;

  const totalWagers = wagers.length;
  const wins = wagers.filter(w => w.status === 'WON');
  const losses = wagers.filter(w => w.status === 'LOST');
  const totalWins = wins.length;
  const totalLosses = losses.length;

  let agencyScore = 10000;
  wagers
    .filter(w => w.status !== 'OPEN')
    .sort((a, b) => new Date(a.completed_at || a.created_at).getTime() - new Date(b.completed_at || b.created_at).getTime())
    .forEach(wager => {
      if (wager.status === 'WON') {
        agencyScore += wager.stake_amount * ((wager.pnl_percentage || 20) / 100);
      } else {
        agencyScore -= wager.stake_amount;
      }
    });

  const winRate = totalWagers > 0 ? (totalWins / totalWagers) * 100 : 0;

  let currentStreak = 0;
  const sortedWagers = [...wagers]
    .filter(w => w.status !== 'OPEN')
    .sort((a, b) => new Date(b.completed_at || b.created_at).getTime() - new Date(a.completed_at || a.created_at).getTime());

  for (const wager of sortedWagers) {
    if (wager.status === 'WON') {
      currentStreak++;
    } else {
      break;
    }
  }

  const { data: currentStats } = await supabase
    .from('user_stats')
    .select('longest_streak')
    .eq('user_id', userId)
    .single();

  const longestStreak = Math.max(currentStreak, currentStats?.longest_streak || 0);

  await supabase
    .from('user_stats')
    .upsert({
      user_id: userId,
      agency_score: Math.round(agencyScore),
      win_rate: parseFloat(winRate.toFixed(2)),
      total_wagers: totalWagers,
      total_wins: totalWins,
      total_losses: totalLosses,
      current_streak: currentStreak,
      longest_streak: longestStreak,
      updated_at: new Date().toISOString(),
    });
}
