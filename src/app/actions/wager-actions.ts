'use server';

import { createClient } from '../../../supabase/server';
import { AssetClass, Wager, UserStats } from '@/types/wager';
import { getDeadlineForAssetClass } from '@/lib/wager-utils';
import { revalidatePath } from 'next/cache';

export async function createWager(title: string, assetClass: AssetClass, stakeAmount: number, linkedYearWagerId?: string) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Check if user already has an OPEN $TDAY session today
  if (assetClass === 'TDAY') {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

    const { data: existingTdayWagers, error: checkError } = await supabase
      .from('wagers')
      .select('id, title, created_at')
      .eq('user_id', user.id)
      .eq('asset_class', 'TDAY')
      .eq('status', 'OPEN')
      .gte('created_at', startOfDay.toISOString())
      .lte('created_at', endOfDay.toISOString());

    if (checkError) throw checkError;

    if (existingTdayWagers && existingTdayWagers.length > 0) {
      throw new Error('You already have an active $TDAY session today. Complete it before starting a new one.');
    }
  }

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
  revalidatePath('/markets');
  
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
  revalidatePath('/markets');
  
  return data;
}

export async function getUserWagers() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    // Return empty array instead of throwing - allows components to handle unauthenticated state gracefully
    return [];
  }

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
  if (!user) {
    // Return null instead of throwing - allows components to handle unauthenticated state gracefully
    return null;
  }

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

export async function saveDeepWorkBlock(
  wagerId: string,
  blockNumber: number,
  taskTitle?: string,
  durationSeconds: number = 5400
) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('deep_work_blocks')
    .insert({
      wager_id: wagerId,
      user_id: user.id,
      block_number: blockNumber,
      task_title: taskTitle,
      duration_seconds: durationSeconds,
    })
    .select()
    .single();

  if (error) throw error;

  const { data: currentWager } = await supabase
    .from('wagers')
    .select('deep_work_blocks_completed')
    .eq('id', wagerId)
    .single();
  
  const { error: updateError } = await supabase
    .from('wagers')
    .update({ 
      deep_work_blocks_completed: (currentWager?.deep_work_blocks_completed || 0) + 1
    })
    .eq('id', wagerId);

  if (updateError) {
    console.error('Failed to update deep work blocks count:', updateError);
  }

  revalidatePath('/profile');
  
  return data;
}

export async function saveSessionVolatility(
  wagerId: string,
  volatilityData: Array<{ time: string; value: number; event?: string }>,
  finalVolatility: number
) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Insert all volatility data points
  const volatilityInserts = volatilityData.map(point => ({
    wager_id: wagerId,
    user_id: user.id,
    time_label: point.time,
    value: point.value,
    event_type: point.event || null,
  }));

  const { error: volatilityError } = await supabase
    .from('session_volatility')
    .insert(volatilityInserts);

  if (volatilityError) throw volatilityError;

  const { error: wagerError } = await supabase
    .from('wagers')
    .update({
      volatility_data: volatilityData as any,
      final_volatility: finalVolatility,
    })
    .eq('id', wagerId)
    .eq('user_id', user.id);

  if (wagerError) throw wagerError;

  revalidatePath('/profile');
  
  return { success: true };
}

// Get deep work statistics for profile
export async function getDeepWorkStats() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: blocks, error: blocksError } = await supabase
    .from('deep_work_blocks')
    .select('duration_seconds, completed_at')
    .eq('user_id', user.id)
    .order('completed_at', { ascending: false });

  if (blocksError) throw blocksError;

  // Calculate stats
  const totalHours = blocks
    ? blocks.reduce((sum, block) => sum + (block.duration_seconds || 5400) / 3600, 0)
    : 0;

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const thisWeekBlocks = blocks?.filter(
    block => new Date(block.completed_at) >= weekAgo
  ) || [];
  const thisWeekHours = thisWeekBlocks.reduce(
    (sum, block) => sum + (block.duration_seconds || 5400) / 3600,
    0
  );

  // Calculate average per day (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentBlocks = blocks?.filter(
    block => new Date(block.completed_at) >= thirtyDaysAgo
  ) || [];
  const avgHoursPerDay = recentBlocks.length > 0
    ? (recentBlocks.reduce((sum, block) => sum + (block.duration_seconds || 5400) / 3600, 0) / 30)
    : 0;

  const blocksByDay = new Map<string, number>();
  blocks?.forEach(block => {
    const day = new Date(block.completed_at).toISOString().split('T')[0];
    const hours = (block.duration_seconds || 5400) / 3600;
    blocksByDay.set(day, (blocksByDay.get(day) || 0) + hours);
  });
  const bestDayHours = Math.max(...Array.from(blocksByDay.values()), 0);

  return {
    totalHours,
    thisWeekHours,
    avgHoursPerDay,
    bestDayHours,
    totalBlocks: blocks?.length || 0,
  };
}

export async function getRecentSessionVolatility(days: number = 7) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  // Get completed TDAY wagers with volatility data
  const { data: wagers, error: wagersError } = await supabase
    .from('wagers')
    .select('id, title, completed_at, final_volatility, volatility_data, created_at')
    .eq('user_id', user.id)
    .eq('asset_class', 'TDAY')
    .in('status', ['WON', 'LOST'])
    .gte('completed_at', cutoffDate.toISOString())
    .order('completed_at', { ascending: false });

  if (wagersError) throw wagersError;

  const { data: activeWager } = await supabase
    .from('wagers')
    .select('id, title, created_at')
    .eq('user_id', user.id)
    .eq('asset_class', 'TDAY')
    .eq('status', 'OPEN')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  return {
    sessions: wagers || [],
    activeSession: activeWager || null,
  };
}
