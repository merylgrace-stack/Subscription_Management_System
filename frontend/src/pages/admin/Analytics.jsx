import React, { useState } from 'react';
import { BarChart3, TrendingUp, Users, DollarSign, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('6M');

  // Realistic revenue trend data
  const revenueTrendData = [
    { month: 'Jun', mrr: 18500, arr: 222000, newSubscriptions: 18 },
    { month: 'Jul', mrr: 19800, arr: 237600, newSubscriptions: 22 },
    { month: 'Aug', mrr: 21200, arr: 254400, newSubscriptions: 25 },
    { month: 'Sep', mrr: 22900, arr: 274800, newSubscriptions: 29 },
    { month: 'Oct', mrr: 24780, arr: 297360, newSubscriptions: 34 },
  ];

  // Subscription status distribution
  const statusDistribution = [
    { name: 'Active', value: 74, color: '#32B67A' },
    { name: 'Paused', value: 12, color: '#E9AC4B' },
    { name: 'Closed', value: 14, color: '#E05B61' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-primary)', marginBottom: '0.35rem' }}>
            Executive Intelligence
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <BarChart3 size={26} color="var(--accent-primary)" />
            Administrator Analytics & Insights
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Multi-dimensional SaaS metrics: Monthly Recurring Revenue (MRR), ARR, and retention trends.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-card)', padding: '0.35rem', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-color)' }}>
          {['1M', '3M', '6M', '1Y'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              style={{
                padding: '0.35rem 0.85rem',
                borderRadius: 'var(--radius-pill)',
                fontSize: '0.78rem',
                fontWeight: '600',
                background: timeRange === range ? 'var(--accent-primary-gradient)' : 'transparent',
                color: timeRange === range ? '#FFFFFF' : 'var(--text-secondary)',
                boxShadow: timeRange === range ? '0 2px 8px var(--accent-primary-glow)' : 'none',
              }}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 High Level KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
        <div className="card">
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: '600' }}>Annual Recurring Revenue (ARR)</div>
          <div style={{ fontSize: '2.1rem', fontWeight: '800', color: 'var(--text-primary)', margin: '0.4rem 0' }}>$297,360</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: 'var(--accent-green)', fontWeight: '600' }}>
            <ArrowUpRight size={14} />
            <span>+16.4% YoY Growth</span>
          </div>
        </div>

        <div className="card">
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: '600' }}>Customer Retention Rate</div>
          <div style={{ fontSize: '2.1rem', fontWeight: '800', color: 'var(--accent-green)', margin: '0.4rem 0' }}>94.8%</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: 'var(--accent-green)', fontWeight: '600' }}>
            <ArrowUpRight size={14} />
            <span>+1.2% this quarter</span>
          </div>
        </div>

        <div className="card">
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: '600' }}>Average Revenue Per User (ARPU)</div>
          <div style={{ fontSize: '2.1rem', fontWeight: '800', color: 'var(--accent-primary)', margin: '0.4rem 0' }}>$1,245</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: 'var(--accent-green)', fontWeight: '600' }}>
            <ArrowUpRight size={14} />
            <span>+8.3% expansion</span>
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* MRR Expansion Area Chart */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              Monthly Recurring Revenue (MRR) Trajectory
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
              Historical billed revenue trend in USD
            </p>
          </div>

          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrendData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F28C45" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#F28C45" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#303744" opacity={0.5} />
                <XAxis dataKey="month" stroke="#969EAD" fontSize={12} tickLine={false} />
                <YAxis stroke="#969EAD" fontSize={12} tickLine={false} tickFormatter={(val) => `$${val/1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1C222D', borderColor: '#303744', borderRadius: '8px', color: '#FFF' }}
                  formatter={(value) => [`$${value.toLocaleString()}`, 'MRR']}
                />
                <Area type="monotone" dataKey="mrr" stroke="#F28C45" strokeWidth={3} fillOpacity={1} fill="url(#colorMrr)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subscription Status Breakdown Pie */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              Portfolio Status Mix
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
              Active vs Paused vs Churned contracts
            </p>
          </div>

          <div style={{ height: '240px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1C222D', borderColor: '#303744', borderRadius: '8px', color: '#FFF' }}
                  formatter={(value) => [`${value}%`, 'Share']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', fontSize: '0.8rem' }}>
            {statusDistribution.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color }} />
                <span style={{ color: 'var(--text-secondary)' }}>{item.name}: <strong>{item.value}%</strong></span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
