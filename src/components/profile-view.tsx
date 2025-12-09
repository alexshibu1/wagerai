'use client';

import { TrendingUp, TrendingDown, ArrowRight, Shield, BarChart3, AlertTriangle, Wallet, BadgeCheck } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { GlassCard } from './ui/glass-card';

// Mock data for charts
const FOCUS_CAPITAL_DATA = Array.from({ length: 12 }, (_, i) => ({
  month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
  value: 88 + Math.random() * 10,
}));

const BUDGET_TRACKING_DATA = Array.from({ length: 8 }, (_, i) => ({
  month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'][i],
  actual: 3200 + Math.random() * 1000,
  target: 3500 + Math.random() * 800,
}));

const WAGER_ALERTS = [
  {
    icon: AlertTriangle,
    type: 'Access attempt',
    date: 'Jun 15, 09:42',
    response: 'Denied',
    responseColor: 'bg-red-500/20 text-red-400 border-red-500/30',
    origin: 'Singapore (IP 203.*)',
    method: 'Safari · iOS 16',
  },
  {
    icon: Wallet,
    type: 'Large withdrawal',
    date: 'Jun 14, 16:22',
    response: 'Under Review',
    responseColor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    origin: 'Unknown Location',
    method: 'MasterCard · Google Pay',
  },
  {
    icon: BadgeCheck,
    type: 'Scheduled payment',
    date: 'Jun 13, 08:00',
    response: 'Processed',
    responseColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    origin: 'Canada (IP 142.*)',
    method: 'MoneyFlow App',
  },
];

export default function ProfileView() {
  return (
    <main className="w-full min-h-screen pl-28 pt-16 bg-[#020617]">
      <div className="container mx-auto px-6 py-8 max-w-[1600px]">
        {/* Page Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Financial Overview</h1>
            <p className="text-sm text-zinc-400">
              Track expenses, detect anomalies, and manage your wealth intelligently.
            </p>
          </div>
          <button className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white text-sm font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            Export
          </button>
        </div>

        {/* Top Stats Grid - 3 Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* Card 1 - Weekly Outflow (Blue Gradient) */}
          <div className="relative overflow-hidden rounded-[24px] border border-white/10">
            {/* Blue gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/80 via-blue-700/60 to-blue-900/90"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <TrendingDown size={16} />
                  <span>Weekly Outflow</span>
                </div>
                <span className="text-red-400 text-sm font-medium">-12.4%</span>
              </div>
              <div className="mb-6">
                <div className="text-5xl font-bold text-white font-mono tracking-tight">$2,840</div>
              </div>
              <button className="flex items-center gap-2 text-white/80 hover:text-white text-sm transition-colors">
                View Details
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Card 2 - Savings Balance (Pink/Orange Gradient) */}
          <div className="relative overflow-hidden rounded-[24px] border border-white/10">
            {/* Pink to orange gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-600/80 via-orange-600/70 to-orange-700/80"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <Wallet size={16} />
                  <span>Savings Balance</span>
                </div>
                <span className="text-emerald-400 text-sm font-medium">+18.7%</span>
              </div>
              <div className="mb-6">
                <div className="text-5xl font-bold text-white font-mono tracking-tight">$12,450</div>
              </div>
              <button className="flex items-center gap-2 text-white/80 hover:text-white text-sm transition-colors">
                View Details
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Card 3 - Total Volume (Dark with colorful accent) */}
          <div className="relative overflow-hidden rounded-[24px] border border-white/10">
            {/* Dark gradient with colorful bottom accent */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-r from-purple-500/30 via-blue-500/30 to-cyan-500/30 blur-2xl"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <BarChart3 size={16} />
                  <span>Total Volume</span>
                </div>
                <span className="text-emerald-400 text-sm font-medium">+7.1%</span>
              </div>
              <div className="mb-6">
                <div className="text-5xl font-bold text-white font-mono tracking-tight">$156,780</div>
              </div>
              <button className="flex items-center gap-2 text-white/80 hover:text-white text-sm transition-colors">
                View Details
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Charts Grid - 2 columns */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Account Protection Chart */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Account Protection</h3>
              </div>
              <button className="px-4 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-zinc-400 hover:text-white transition-colors">
                Review
              </button>
            </div>
            
            <div className="h-[280px] mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={FOCUS_CAPITAL_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis 
                    dataKey="month" 
                    stroke="rgba(255,255,255,0.3)" 
                    tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }}
                  />
                  <YAxis 
                    stroke="rgba(255,255,255,0.3)" 
                    tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }}
                    domain={[80, 100]}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#a855f7" 
                    strokeWidth={3}
                    dot={{ fill: '#a855f7', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-center">
              <div className="px-4 py-1.5 rounded-full bg-orange-500/20 border border-orange-500/30">
                <span className="text-xs text-orange-400 font-medium">All Systems Normal</span>
              </div>
            </div>
          </GlassCard>

          {/* Budget Tracking Chart */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Budget Tracking</h3>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="text-zinc-400">Actual Spending</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full border-2 border-pink-500"></div>
                  <span className="text-zinc-400">Target Budget</span>
                </div>
              </div>
            </div>
            
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={BUDGET_TRACKING_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis 
                    dataKey="month" 
                    stroke="rgba(255,255,255,0.3)" 
                    tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }}
                  />
                  <YAxis 
                    stroke="rgba(255,255,255,0.3)" 
                    tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }}
                    domain={[3000, 4500]}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="actual" 
                    stroke="#a855f7" 
                    strokeWidth={3}
                    dot={{ fill: '#a855f7', r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="target" 
                    stroke="#ec4899" 
                    strokeWidth={3}
                    strokeDasharray="5 5"
                    dot={{ fill: '#ec4899', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>

        {/* Risk Alerts Table */}
        <GlassCard className="overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-white/5">
            <h3 className="text-xl font-semibold text-white">Risk Alerts</h3>
            <button className="text-sm text-zinc-400 hover:text-white transition-colors">
              Smart Filters
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Alert Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    AI Response
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Origin
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Method
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {WAGER_ALERTS.map((alert, index) => {
                  const Icon = alert.icon;
                  return (
                    <tr key={index} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                            <Icon className="w-4 h-4 text-zinc-400" />
                          </div>
                          <span className="text-sm text-white font-medium">{alert.type}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-zinc-400 font-mono">{alert.date}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex px-3 py-1 rounded-full border text-xs font-medium ${alert.responseColor}`}>
                          {alert.response}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-zinc-400">{alert.origin}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-zinc-400">{alert.method}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </main>
  );
}
