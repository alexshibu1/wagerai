import { createClient } from '../../supabase/client';
import { addDays, subDays } from 'date-fns';

export async function seedDemoData() {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  // Check if user already has wagers
  const { data: existingWagers } = await supabase
    .from('wagers')
    .select('id')
    .eq('user_id', user.id)
    .limit(1);

  if (existingWagers && existingWagers.length > 0) {
    console.log('User already has wagers, skipping seed');
    return;
  }

  // Create demo wagers with more historical data
  const demoWagers = [
    // Historical completed wagers (10 closed positions)
    {
      user_id: user.id,
      title: 'Ship MVP Landing Page',
      asset_class: 'TDAY',
      stake_amount: 1000,
      status: 'WON',
      deadline: subDays(new Date(), 10).toISOString(),
      completed_at: subDays(new Date(), 10).toISOString(),
      pnl_percentage: 25,
      created_at: subDays(new Date(), 11).toISOString(),
    },
    {
      user_id: user.id,
      title: 'Complete Python Course Module 3',
      asset_class: 'SHIP',
      stake_amount: 2000,
      status: 'WON',
      deadline: subDays(new Date(), 9).toISOString(),
      completed_at: subDays(new Date(), 9).toISOString(),
      pnl_percentage: 30,
      created_at: subDays(new Date(), 39).toISOString(),
    },
    {
      user_id: user.id,
      title: 'Morning Workout Routine',
      asset_class: 'TDAY',
      stake_amount: 500,
      status: 'WON',
      deadline: subDays(new Date(), 8).toISOString(),
      completed_at: subDays(new Date(), 8).toISOString(),
      pnl_percentage: 20,
      created_at: subDays(new Date(), 9).toISOString(),
    },
    {
      user_id: user.id,
      title: 'Write Technical Blog Post',
      asset_class: 'TDAY',
      stake_amount: 800,
      status: 'WON',
      deadline: subDays(new Date(), 7).toISOString(),
      completed_at: subDays(new Date(), 7).toISOString(),
      pnl_percentage: 22,
      created_at: subDays(new Date(), 8).toISOString(),
    },
    {
      user_id: user.id,
      title: 'Read 50 Pages',
      asset_class: 'TDAY',
      stake_amount: 300,
      status: 'LOST',
      deadline: subDays(new Date(), 6).toISOString(),
      completed_at: subDays(new Date(), 6).toISOString(),
      pnl_percentage: -100,
      created_at: subDays(new Date(), 7).toISOString(),
    },
    {
      user_id: user.id,
      title: 'Build Feature Dashboard',
      asset_class: 'SHIP',
      stake_amount: 1500,
      status: 'WON',
      deadline: subDays(new Date(), 5).toISOString(),
      completed_at: subDays(new Date(), 5).toISOString(),
      pnl_percentage: 35,
      created_at: subDays(new Date(), 35).toISOString(),
    },
    {
      user_id: user.id,
      title: 'Meditation Session',
      asset_class: 'TDAY',
      stake_amount: 200,
      status: 'LOST',
      deadline: subDays(new Date(), 4).toISOString(),
      completed_at: subDays(new Date(), 4).toISOString(),
      pnl_percentage: -100,
      created_at: subDays(new Date(), 5).toISOString(),
    },
    {
      user_id: user.id,
      title: 'Code Review Sprint',
      asset_class: 'TDAY',
      stake_amount: 1200,
      status: 'WON',
      deadline: subDays(new Date(), 3).toISOString(),
      completed_at: subDays(new Date(), 3).toISOString(),
      pnl_percentage: 28,
      created_at: subDays(new Date(), 4).toISOString(),
    },
    {
      user_id: user.id,
      title: 'Network with 3 People',
      asset_class: 'TDAY',
      stake_amount: 400,
      status: 'LOST',
      deadline: subDays(new Date(), 2).toISOString(),
      completed_at: subDays(new Date(), 2).toISOString(),
      pnl_percentage: -100,
      created_at: subDays(new Date(), 3).toISOString(),
    },
    {
      user_id: user.id,
      title: 'Launch Product Beta',
      asset_class: 'SHIP',
      stake_amount: 3000,
      status: 'WON',
      deadline: subDays(new Date(), 1).toISOString(),
      completed_at: subDays(new Date(), 1).toISOString(),
      pnl_percentage: 40,
      created_at: subDays(new Date(), 31).toISOString(),
    },
    // Open wagers
    {
      user_id: user.id,
      title: 'Build Authentication System',
      asset_class: 'TDAY',
      stake_amount: 1500,
      status: 'OPEN',
      deadline: addDays(new Date(), 1).toISOString(),
      created_at: new Date().toISOString(),
    },
    {
      user_id: user.id,
      title: 'Launch SaaS Product',
      asset_class: 'SHIP',
      stake_amount: 5000,
      status: 'OPEN',
      deadline: addDays(new Date(), 30).toISOString(),
      created_at: new Date().toISOString(),
    },
    {
      user_id: user.id,
      title: 'Run First Marathon',
      asset_class: 'YEAR',
      stake_amount: 10000,
      status: 'OPEN',
      deadline: addDays(new Date(), 365).toISOString(),
      created_at: new Date().toISOString(),
    },
  ];

  const { error } = await supabase
    .from('wagers')
    .insert(demoWagers);

  if (error) {
    console.error('Error seeding demo data:', error);
  } else {
    console.log('Demo data seeded successfully');
  }
}
