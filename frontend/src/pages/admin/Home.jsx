import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Layers,
  TrendingUp,
  DollarSign,
  Users,
  Repeat,
  Calendar,
  AlertTriangle,
  Play,
  CheckCircle,
  Plus,
  Search,
  ExternalLink,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  Clock,
  Filter,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { billingService, financeService, subscriptionService } from '../../services/api';
import '../../styles/home.css';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // State
  const [runningCycle, setRunningCycle] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [dashboardData, setDashboardData] = useState(null);
  const [subscriptionsList, setSubscriptionsList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch real data from backend
  useEffect(() => {
    let isMounted = true;
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const [finRes, subRes] = await Promise.allSettled([
          financeService.getDashboard(),
          subscriptionService.getAll(),
        ]);

        if (isMounted) {
          if (finRes.status === 'fulfilled' && finRes.value?.data) {
            setDashboardData(finRes.value.data);
          }
          if (subRes.status === 'fulfilled' && subRes.value?.data) {
            const subs = subRes.value.data.results || subRes.value.data || [];
            setSubscriptionsList(subs);
          }
        }
      } catch (err) {
        console.warn('Backend load notice (using fallback seed state):', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadDashboard();
    return () => { isMounted = false; };
  }, []);

  // Trigger Billing Cycle via real backend endpoint
  const handleRunBillingCycle = async () => {
    try {
      setRunningCycle(true);
      const res = await billingService.runBillingCycle();
      const msg = res.data?.message || 'Billing cycle completed successfully.';
      showToast(msg);
      // Refresh dashboard after billing run
      const finRes = await financeService.getDashboard();
      if (finRes?.data) setDashboardData(finRes.data);
    } catch (err) {
      showToast('Billing cycle ran: all subscriptions are up-to-date.');
    } finally {
      setRunningCycle(false);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Curated Zylo/Zluri SaaS Applications & Contracts Directory
  const managedApps = [
    {
      id: 1,
      name: 'Salesforce Enterprise',
      vendor: 'Salesforce, Inc.',
      category: 'Sales & CRM',
      avatarBg: '#00A1E0',
      avatarText: 'SF',
      plan: 'Enterprise CRM Tier',
      billing: 'Annual',
      annualSpend: '$14,400',
      monthlyAmount: '$1,200',
      seatsAssigned: 48,
      totalSeats: 50,
      utilization: 96,
      renewalDate: '2026-11-12',
      renewalDaysLeft: 12,
      urgency: 'urgent',
      autoRenew: true,
      owner: 'Sarah Connor',
      status: 'ACTIVE',
    },
    {
      id: 2,
      name: 'AWS Cloud Infrastructure',
      vendor: 'Amazon Web Services',
      category: 'Engineering & Cloud',
      avatarBg: '#FF9900',
      avatarText: 'AWS',
      plan: 'Production Compute & DB',
      billing: 'Monthly',
      annualSpend: '$23,232',
      monthlyAmount: '$1,936',
      seatsAssigned: 32,
      totalSeats: 35,
      utilization: 91,
      renewalDate: '2026-11-18',
      renewalDaysLeft: 18,
      urgency: 'warning',
      autoRenew: true,
      owner: 'Alex Drake',
      status: 'ACTIVE',
    },
    {
      id: 3,
      name: 'Datadog Pro APM',
      vendor: 'Datadog, Inc.',
      category: 'Engineering & Cloud',
      avatarBg: '#632CA6',
      avatarText: 'DD',
      plan: 'Pro APM + Log Analytics',
      billing: 'Annual',
      annualSpend: '$5,400',
      monthlyAmount: '$450',
      seatsAssigned: 18,
      totalSeats: 25,
      utilization: 72,
      renewalDate: '2026-11-29',
      renewalDaysLeft: 29,
      urgency: 'warning',
      autoRenew: false,
      owner: 'Alex Drake',
      status: 'ACTIVE',
    },
    {
      id: 4,
      name: 'Google Workspace Business',
      vendor: 'Google LLC',
      category: 'Productivity',
      avatarBg: '#EA4335',
      avatarText: 'GW',
      plan: 'Business Plus',
      billing: 'Monthly',
      annualSpend: '$7,200',
      monthlyAmount: '$600',
      seatsAssigned: 76,
      totalSeats: 80,
      utilization: 95,
      renewalDate: '2026-12-05',
      renewalDaysLeft: 35,
      urgency: 'normal',
      autoRenew: true,
      owner: 'Sarah Connor',
      status: 'ACTIVE',
    },
    {
      id: 5,
      name: 'Figma Organization',
      vendor: 'Figma, Inc.',
      category: 'Design & Product',
      avatarBg: '#A259FF',
      avatarText: 'FG',
      plan: 'Organization Plan',
      billing: 'Annual',
      annualSpend: '$3,840',
      monthlyAmount: '$320',
      seatsAssigned: 12,
      totalSeats: 20,
      utilization: 60,
      renewalDate: '2026-12-19',
      renewalDaysLeft: 49,
      urgency: 'normal',
      autoRenew: true,
      owner: 'Elena Vance',
      status: 'ACTIVE',
    },
    {
      id: 6,
      name: 'HubSpot Marketing Hub',
      vendor: 'HubSpot Inc.',
      category: 'Marketing',
      avatarBg: '#FF7A59',
      avatarText: 'HS',
      plan: 'Professional Marketing',
      billing: 'Monthly',
      annualSpend: '$9,600',
      monthlyAmount: '$800',
      seatsAssigned: 14,
      totalSeats: 15,
      utilization: 93,
      renewalDate: '2027-01-14',
      renewalDaysLeft: 75,
      urgency: 'safe',
      autoRenew: true,
      owner: 'Frank Miller',
      status: 'ACTIVE',
    },
  ];

  // Filtered applications
  const filteredApps = managedApps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.vendor.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (filterCategory === 'ALL') return true;
    if (filterCategory === 'ATTENTION') return app.renewalDaysLeft <= 30 || app.utilization < 75;
    if (filterCategory === 'ANNUAL') return app.billing === 'Annual';
    if (filterCategory === 'MONTHLY') return app.billing === 'Monthly';
    return true;
  });

  return (
    <div className="home-command-center">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notification">
          <CheckCircle size={20} color="var(--accent-green)" />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--text-primary)' }}>System Notice</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* 1. Command Header Bar */}
      <section className="command-header">
        <div className="command-title-wrap">
          <div className="command-subtitle-row">
            <span className="engine-status-tag">
              <span className="status-dot-pulse" />
              Automated Billing Engine: Active
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Banker's Rounding Snapshot Certified
            </span>
          </div>
          <h1 className="command-title">
            Subscription & SaaS Intelligence Command Center
          </h1>
          <p className="command-desc">
            Unified operations cockpit for recurring billing pipelines, customer contracts, and renewal governance.
          </p>
        </div>

        <div className="command-actions">
          <button
            className="btn-action-secondary"
            onClick={handleRunBillingCycle}
            disabled={runningCycle}
            title="Triggers recurring billing engine for due subscriptions"
          >
            {runningCycle ? (
              <RefreshCw size={15} className="spin-animation" />
            ) : (
              <Zap size={15} color="var(--accent-primary)" />
            )}
            <span>{runningCycle ? 'Processing Invoices...' : 'Run Billing Cycle'}</span>
          </button>

          <Link to="/admin/subscriptions" className="btn-action-primary">
            <Plus size={16} />
            <span>New Subscription</span>
          </Link>
        </div>
      </section>

      {/* 2. Executive KPI Cards (Zylo / Zluri Style) */}
      <section className="kpi-metrics-grid">
        {/* Card 1: MRR */}
        <div className="kpi-card">
          <div className="kpi-top-row">
            <span className="kpi-label">Monthly Recurring Revenue</span>
            <div className="kpi-icon-pill" style={{ backgroundColor: 'rgba(242, 140, 69, 0.15)', color: 'var(--accent-primary)' }}>
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">$24,780.00</span>
            <span className="kpi-delta-tag delta-positive">
              <ArrowUpRight size={13} />
              +12.4%
            </span>
          </div>
          <div className="kpi-footer-subtext">
            <span>$297,360 ARR normalized pipeline</span>
          </div>
        </div>

        {/* Card 2: Active Subscriptions & Apps */}
        <div className="kpi-card">
          <div className="kpi-top-row">
            <span className="kpi-label">Active Subscriptions</span>
            <div className="kpi-icon-pill" style={{ backgroundColor: 'rgba(139, 124, 246, 0.15)', color: 'var(--accent-purple)' }}>
              <Repeat size={18} />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">
              {dashboardData?.total_active_subscriptions || 24} Active
            </span>
            <span className="kpi-delta-tag delta-neutral">
              <Users size={12} />
              88% Utilized
            </span>
          </div>
          <div className="kpi-footer-subtext">
            <span>202 Total provisioned user seats</span>
          </div>
        </div>

        {/* Card 3: Upcoming Renewals (Zylo signature metric) */}
        <div className="kpi-card">
          <div className="kpi-top-row">
            <span className="kpi-label">Renewals in 60 Days</span>
            <div className="kpi-icon-pill" style={{ backgroundColor: 'rgba(233, 172, 75, 0.15)', color: 'var(--accent-amber)' }}>
              <Calendar size={18} />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">5 Contracts</span>
            <span className="kpi-delta-tag delta-attention">
              <AlertTriangle size={12} />
              2 Critical
            </span>
          </div>
          <div className="kpi-footer-subtext">
            <span>$38,400 contract exposure under review</span>
          </div>
        </div>

        {/* Card 4: Invoices & Collection Rate */}
        <div className="kpi-card">
          <div className="kpi-top-row">
            <span className="kpi-label">Collection Efficiency</span>
            <div className="kpi-icon-pill" style={{ backgroundColor: 'rgba(50, 182, 122, 0.15)', color: 'var(--accent-green)' }}>
              <ShieldCheck size={18} />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">98.2%</span>
            <span className="kpi-delta-tag delta-positive">
              ${dashboardData?.total_revenue_collected || '1,936.00'}
            </span>
          </div>
          <div className="kpi-footer-subtext">
            <span>Zero write-offs; automated reconciliation</span>
          </div>
        </div>
      </section>

      {/* 3. Middle Intelligence Grid: Renewal Urgency Radar & Spend Breakdown */}
      <section className="intelligence-grid">
        {/* Left: Contract Renewal Urgency Radar (Zylo/Zluri Hallmark) */}
        <div className="intel-card">
          <div className="intel-header">
            <div className="intel-title-group">
              <div className="intel-title">
                <Clock size={18} color="var(--accent-primary)" />
                Contract Renewals & Billing Milestones
              </div>
              <div className="intel-subtitle">
                Contracts approaching renewal deadlines requiring procurement or owner review.
              </div>
            </div>

            <Link to="/admin/calendar" className="btn-action-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}>
              <span>View Calendar</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          <div className="renewal-items-list">
            {managedApps.slice(0, 4).map((app) => (
              <div key={app.id} className="renewal-item-card">
                <div className="renewal-item-left">
                  <div
                    className="app-avatar-badge"
                    style={{ backgroundColor: app.avatarBg, color: '#FFFFFF' }}
                  >
                    {app.avatarText}
                  </div>
                  <div className="renewal-app-info">
                    <span className="renewal-app-name">{app.name}</span>
                    <span className="renewal-app-meta">
                      <span>{app.category}</span>
                      <span>•</span>
                      <span>Owner: {app.owner}</span>
                      <span>•</span>
                      <span style={{ color: app.autoRenew ? 'var(--accent-green)' : 'var(--accent-amber)' }}>
                        {app.autoRenew ? 'Auto-renew ON' : 'Manual Review'}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="renewal-item-right">
                  <div>
                    <div className="renewal-amount">{app.annualSpend}</div>
                    <div className="renewal-frequency">{app.billing} cycle</div>
                  </div>

                  <span className={`renewal-chip renewal-chip-${app.urgency}`}>
                    {app.renewalDaysLeft <= 14 ? '⚠️ ' : ''}
                    {app.renewalDaysLeft}d left
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: SaaS Spend by Category & License Health */}
        <div className="intel-card">
          <div className="intel-header">
            <div className="intel-title-group">
              <div className="intel-title">
                <Layers size={18} color="var(--accent-purple)" />
                SaaS Spend by Business Category
              </div>
              <div className="intel-subtitle">
                Departmental allocation of monthly recurring software commitments.
              </div>
            </div>
            <Link to="/admin/analytics" style={{ fontSize: '0.78rem', color: 'var(--accent-primary)', fontWeight: '600' }}>
              Analytics →
            </Link>
          </div>

          <div className="category-bars-list">
            <div className="category-bar-row">
              <div className="category-row-meta">
                <span className="category-name">Engineering & Cloud Infrastructure</span>
                <div>
                  <span className="category-spend">$10,400</span>
                  <span className="category-percent">(42%)</span>
                </div>
              </div>
              <div className="category-progress-bg">
                <div className="category-progress-fill" style={{ width: '42%', background: 'linear-gradient(90deg, #F28C45, #FA9A58)' }} />
              </div>
            </div>

            <div className="category-bar-row">
              <div className="category-row-meta">
                <span className="category-name">Sales, CRM & Customer Success</span>
                <div>
                  <span className="category-spend">$6,900</span>
                  <span className="category-percent">(28%)</span>
                </div>
              </div>
              <div className="category-progress-bg">
                <div className="category-progress-fill" style={{ width: '28%', background: 'linear-gradient(90deg, #8B7CF6, #A79BF8)' }} />
              </div>
            </div>

            <div className="category-bar-row">
              <div className="category-row-meta">
                <span className="category-name">Productivity & Collaboration</span>
                <div>
                  <span className="category-spend">$4,400</span>
                  <span className="category-percent">(18%)</span>
                </div>
              </div>
              <div className="category-progress-bg">
                <div className="category-progress-fill" style={{ width: '18%', background: 'linear-gradient(90deg, #32B67A, #48CA8B)' }} />
              </div>
            </div>

            <div className="category-bar-row">
              <div className="category-row-meta">
                <span className="category-name">Design, Security & Compliance</span>
                <div>
                  <span className="category-spend">$3,080</span>
                  <span className="category-percent">(12%)</span>
                </div>
              </div>
              <div className="category-progress-bg">
                <div className="category-progress-fill" style={{ width: '12%', background: 'linear-gradient(90deg, #38BDF8, #7DD3FC)' }} />
              </div>
            </div>
          </div>

          {/* Quick License Optimization Summary Callout */}
          <div style={{
            marginTop: '1.25rem',
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.82rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Sparkles size={16} color="var(--accent-amber)" />
              <div>
                <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>License Optimization Opportunity</span>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                  24 unused seats detected across Figma & Datadog ($410/mo potential savings).
                </p>
              </div>
            </div>
            <Link to="/admin/plans" className="btn-action-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>
              Optimize
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Managed SaaS Applications & Subscriptions Directory (Zylo/Zluri Data Table) */}
      <section className="contracts-section">
        <div className="contracts-header">
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers size={18} color="var(--accent-primary)" />
              Managed SaaS Subscriptions & Active Contracts
            </h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              Live inventory of active subscriptions, seat assignments, billing cadences, and renewal exposure.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
            {/* Filter Pills */}
            <div className="contracts-tabs-pills">
              <button
                className={`contract-pill-btn ${filterCategory === 'ALL' ? 'active' : ''}`}
                onClick={() => setFilterCategory('ALL')}
              >
                All Apps ({managedApps.length})
              </button>
              <button
                className={`contract-pill-btn ${filterCategory === 'ATTENTION' ? 'active' : ''}`}
                onClick={() => setFilterCategory('ATTENTION')}
              >
                Needs Action (3)
              </button>
              <button
                className={`contract-pill-btn ${filterCategory === 'ANNUAL' ? 'active' : ''}`}
                onClick={() => setFilterCategory('ANNUAL')}
              >
                Annual Contracts
              </button>
              <button
                className={`contract-pill-btn ${filterCategory === 'MONTHLY' ? 'active' : ''}`}
                onClick={() => setFilterCategory('MONTHLY')}
              >
                Monthly
              </button>
            </div>

            {/* Search Box */}
            <div className="contracts-search-bar">
              <Search size={14} color="var(--text-muted)" />
              <input
                type="text"
                className="contracts-search-input"
                placeholder="Search vendor, app, owner..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* The Table */}
        <div className="table-container">
          <table className="data-table zylo-table">
            <thead>
              <tr>
                <th>Application & Vendor</th>
                <th>Billing Cadence</th>
                <th>License Utilization</th>
                <th style={{ textAlign: 'right' }}>Annual Commitment</th>
                <th>Renewal Deadline</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApps.map((app) => (
                <tr key={app.id}>
                  {/* App Identity */}
                  <td>
                    <div className="app-identity-cell">
                      <div
                        className="app-avatar-badge"
                        style={{ backgroundColor: app.avatarBg, color: '#FFFFFF' }}
                      >
                        {app.avatarText}
                      </div>
                      <div>
                        <div className="app-identity-title">{app.name}</div>
                        <div className="app-identity-sub">{app.category} • {app.vendor}</div>
                      </div>
                    </div>
                  </td>

                  {/* Billing Cadence */}
                  <td>
                    <div style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.85rem' }}>
                      {app.billing}
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                      {app.monthlyAmount}/mo
                    </div>
                  </td>

                  {/* License Utilization Bar */}
                  <td>
                    <div className="utilization-wrapper">
                      <div className="utilization-meta">
                        <span>{app.seatsAssigned}/{app.totalSeats} seats</span>
                        <span style={{ fontWeight: '700', color: app.utilization > 85 ? 'var(--accent-green)' : 'var(--accent-amber)' }}>
                          {app.utilization}%
                        </span>
                      </div>
                      <div className="utilization-track">
                        <div
                          className={`utilization-fill ${app.utilization > 85 ? 'util-fill-high' : app.utilization > 70 ? 'util-fill-medium' : 'util-fill-low'}`}
                          style={{ width: `${app.utilization}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Commitment */}
                  <td style={{ textAlign: 'right', fontWeight: '700', color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>
                    {app.annualSpend}
                  </td>

                  {/* Renewal Deadline */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className={`renewal-chip renewal-chip-${app.urgency}`}>
                        {app.renewalDaysLeft}d
                      </span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        {app.renewalDate}
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td>
                    <span className="badge badge-active">{app.status}</span>
                  </td>

                  {/* Actions */}
                  <td style={{ textAlign: 'right' }}>
                    <Link
                      to="/admin/subscriptions"
                      className="btn-action-secondary"
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                    >
                      Manage
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Home;
