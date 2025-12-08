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

  // Create demo wagers
  const demoWagers = [
    // Completed wins
    {
      user_id: user.id,
      title: 'Ship MVP Landing Page',
      asset_class: 'TDAY',
      stake_amount: 1000,
      status: 'WON',
      deadline: subDays(new Date(), 5).toISOString(),
      completed_at: subDays(new Date(), 5).toISOString(),
      pnl_percentage: 25,
      created_at: subDays(new Date(), 6).toISOString(),
    },
    {
      user_id: user.id,
      title: 'Complete Python Course Module 3',
      asset_class: 'SHIP',
      stake_amount: 2000,
      status: 'WON',
      deadline: subDays(new Date(), 3).toISOString(),
      completed_at: subDays(new Date(), 3).toISOString(),
      pnl_percentage: 30,
      created_at: subDays(new Date(), 33).toISOString(),
    },
    {
      user_id: user.id,
      title: 'Morning Workout Routine',
      asset_class: 'TDAY',
      stake_amount: 500,
      status: 'WON',
      deadline: subDays(new Date(), 2).toISOString(),
      completed_at: subDays(new Date(), 2).toISOString(),
      pnl_percentage: 20,
      created_at: subDays(new Date(), 3).toISOString(),
    },
    {
      user_id: user.id,
      title: 'Write Technical Blog Post',
      asset_class: 'TDAY',
      stake_amount: 800,
      status: 'WON',
      deadline: subDays(new Date(), 1).toISOString(),
      completed_at: subDays(new Date(), 1).toISOString(),
      pnl_percentage: 22,
      created_at: subDays(new Date(), 2).toISOString(),
    },
    // Some losses
    {
      user_id: user.id,
      title: 'Read 50 Pages',
      asset_class: 'TDAY',
      stake_amount: 300,
      status: 'LOST',
      deadline: subDays(new Date(), 4).toISOString(),
      completed_at: subDays(new Date(), 4).toISOString(),
      pnl_percentage: -100,
      created_at: subDays(new Date(), 5).toISOString(),
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
