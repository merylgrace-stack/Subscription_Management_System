import React, { useState, useEffect } from 'react';
import {
  RotateCcw,
  Play,
  Pause,
  XCircle,
  CheckCircle,
  Calendar,
  RefreshCw,
  AlertCircle,
  Search,
  Plus,
  Filter,
  ArrowUpRight,
  ShieldCheck,
  TrendingUp,
  DollarSign,
  Clock,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import { subscriptionService, customerService, catalogService } from '../../services/api';

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSub, setSelectedSub] = useState(null);
  const [pauseReason, setPauseReason] = useState('');
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMsg, setToastMsg] = useState(null);

  // New Subscription Form State
  const todayStr = new Date().toISOString().split('T')[0];
  const nextMonthDate = new Date();
  nextMonthDate.setDate(nextMonthDate.getDate() + 30);
  const nextMonthStr = nextMonthDate.toISOString().split('T')[0];

  const [newSub, setNewSub] = useState({
    customer_id: '',
    plan_id: '',
    billing_frequency: 'MONTHLY',
    total_recurring_amount: '1200.00',
    start_date: todayStr,
    next_billing_date: nextMonthStr,
    auto_renew: true,
  });

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  const fetchDependencies = async () => {
    try {
      const [custRes, planRes] = await Promise.allSettled([
        customerService.getAll(),
        catalogService.getPlans()
      ]);
      if (custRes.status === 'fulfilled' && custRes.value?.data) {
        const cData = custRes.value.data.results || custRes.value.data || [];
        setCustomers(cData);
        if (cData.length > 0 && !newSub.customer_id) {
          setNewSub(prev => ({ ...prev, customer_id: cData[0].id }));
        }
      }
      if (planRes.status === 'fulfilled' && planRes.value?.data) {
        const pData = planRes.value.data.results || planRes.value.data || [];
        setPlans(pData);
        if (pData.length > 0 && !newSub.plan_id) {
          setNewSub(prev => ({ ...prev, plan_id: pData[0].id }));
        }
      }
    } catch (e) {
      console.warn('Could not load catalog dependencies:', e);
    }
  };

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const res = await subscriptionService.getAll();
      const data = res.data?.results || res.data || [];
      setSubscriptions(data);
    } catch (err) {
      console.error('Failed to fetch subscriptions:', err);
      // Fallback seed display
      setSubscriptions([
        {
          id: 1,
          subscription_code: 'SUB-ACME-001',
          customer_name: 'Acme Global Corp',
          plan_name: 'Enterprise Monthly Core',
          billing_frequency: 'MONTHLY',
          start_date: '2026-08-01',
          next_billing_date: '2026-11-07',
          total_recurring_amount: '1936.0000',
          status: 'ACTIVE',
        },
        {
          id: 2,
          subscription_code: 'SUB-TECH-002',
          customer_name: 'TechVanguard Inc',
          plan_name: 'Enterprise Annual Scale',
          billing_frequency: 'YEARLY',
          start_date: '2026-05-15',
          next_billing_date: '2027-05-15',
          total_recurring_amount: '12000.0000',
          status: 'ACTIVE',
        },
        {
          id: 3,
          subscription_code: 'SUB-NEXUS-003',
          customer_name: 'Nexus Logistics LLC',
          plan_name: 'Growth Monthly Cloud',
          billing_frequency: 'MONTHLY',
          start_date: '2026-09-01',
          next_billing_date: '2026-11-15',
          total_recurring_amount: '850.0000',
          status: 'CONFIRMED',
        },
        {
          id: 4,
          subscription_code: 'SUB-HORIZON-004',
          customer_name: 'Horizon Software Ltd',
          plan_name: 'Custom Team Suite',
          billing_frequency: 'QUARTERLY',
          start_date: '2026-03-01',
          next_billing_date: '2026-12-01',
          total_recurring_amount: '3200.0000',
          status: 'PAUSED',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
    fetchDependencies();
  }, []);

  const handleCreateSubscription = async (e) => {
    e.preventDefault();
    try {
      const code = `SUB-${Math.floor(1000 + Math.random() * 9000)}`;
      await subscriptionService.create({
        subscription_code: code,
        customer: parseInt(newSub.customer_id) || (customers[0]?.id || 1),
        plan: parseInt(newSub.plan_id) || (plans[0]?.id || 1),
        billing_frequency: newSub.billing_frequency,
        total_recurring_amount: newSub.total_recurring_amount,
        start_date: newSub.start_date,
        next_billing_date: newSub.next_billing_date,
        auto_renew: newSub.auto_renew,
        status: 'ACTIVE',
      });
      setShowAddModal(false);
      showToast(`Subscription ${code} saved to backend and activated!`);
      await fetchSubscriptions();
    } catch (err) {
      const msg = err.response?.data?.error || err.message;
      alert(`Could not save subscription to backend: ${msg}`);
    }
  };

  const handleActivate = async (id) => {
    try {
      await subscriptionService.activate(id);
      showToast('Subscription state updated to ACTIVE in backend.');
      fetchSubscriptions();
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };

  const handlePause = async () => {
    if (!selectedSub) return;
    try {
      await subscriptionService.pause(selectedSub.id, pauseReason);
      setShowPauseModal(false);
      setPauseReason('');
      showToast(`Subscription ${selectedSub.subscription_code} paused in backend.`);
      fetchSubscriptions();
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };

  const handleResume = async (id) => {
    try {
      await subscriptionService.resume(id);
      showToast('Subscription resumed to ACTIVE state.');
      fetchSubscriptions();
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to terminate this subscription contract?')) return;
    try {
      await subscriptionService.cancel(id, 'Admin termination');
      showToast('Subscription transitioned to CLOSED.');
      fetchSubscriptions();
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACTIVE': return <span className="badge badge-active">Active</span>;
      case 'PAUSED': return <span className="badge badge-paused">Paused</span>;
      case 'CLOSED': return <span className="badge badge-cancelled">Closed</span>;
      case 'CONFIRMED': return <span className="badge badge-confirmed">Confirmed</span>;
      default: return <span className="badge badge-draft">{status}</span>;
    }
  };

  // Filter subscriptions
  const filteredSubs = subscriptions.filter(sub => {
    const matchesSearch = (sub.subscription_code || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (sub.customer_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (sub.plan_name || '').toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (activeTab === 'ALL') return true;
    if (activeTab === 'ACTIVE') return sub.status === 'ACTIVE';
    if (activeTab === 'CONFIRMED') return sub.status === 'CONFIRMED';
    if (activeTab === 'PAUSED') return sub.status === 'PAUSED';
    if (activeTab === 'CLOSED') return sub.status === 'CLOSED';
    return true;
  });

  const activeSubsCount = subscriptions.filter(s => s.status === 'ACTIVE').length;
  const totalMrr = subscriptions
    .filter(s => s.status === 'ACTIVE')
    .reduce((acc, s) => {
      const amt = Number(s.total_recurring_amount) || 0;
      return acc + (s.billing_frequency === 'YEARLY' ? amt / 12 : amt);
    }, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
      {/* Toast Notification Banner */}
      {toastMsg && (
        <div className="toast-notification">
          <CheckCircle2 size={18} color="var(--accent-green)" />
          <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: '600' }}>
            {toastMsg}
          </span>
        </div>
      )}

      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-primary)', marginBottom: '0.35rem' }}>
            Subscription Governance & Contracts
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.65rem', letterSpacing: '-0.02em' }}>
            <RotateCcw size={26} color="var(--accent-primary)" />
            Subscriptions Directory
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Manage lifecycle states (Confirmed → Active → Paused → Closed), automated renewal milestones, and pricing overrides.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button className="btn btn-secondary btn-sm" onClick={fetchSubscriptions}>
            <RefreshCw size={14} className={loading ? 'spin-animation' : ''} />
            <span>Refresh</span>
          </button>

          <button
            className="btn btn-primary btn-sm"
            onClick={() => {
              fetchDependencies();
              setShowAddModal(true);
            }}
          >
            <Plus size={15} />
            <span>New Subscription</span>
          </button>
        </div>
      </div>

      {/* Quick Summary Metrics Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.15rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
            Active Subscriptions
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '0.35rem' }}>
            {activeSubsCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-green)', marginTop: '0.2rem' }}>
            ● Healthy billing status
          </div>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.15rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
            Normalized Active MRR
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: '800', color: 'var(--accent-primary)', marginTop: '0.35rem' }}>
            ${totalMrr.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Excluding paused/draft tiers
          </div>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.15rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
            Onboarding & Paused
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: '800', color: 'var(--accent-amber)', marginTop: '0.35rem' }}>
            {subscriptions.filter(s => s.status === 'CONFIRMED' || s.status === 'PAUSED').length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Pending activation or review
          </div>
        </div>
      </div>

      {/* Control Bar: Tabs & Search */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div className="contracts-tabs-pills">
          <button
            className={`contract-pill-btn ${activeTab === 'ALL' ? 'active' : ''}`}
            onClick={() => setActiveTab('ALL')}
          >
            All Subscriptions ({subscriptions.length})
          </button>
          <button
            className={`contract-pill-btn ${activeTab === 'ACTIVE' ? 'active' : ''}`}
            onClick={() => setActiveTab('ACTIVE')}
          >
            Active ({subscriptions.filter(s => s.status === 'ACTIVE').length})
          </button>
          <button
            className={`contract-pill-btn ${activeTab === 'CONFIRMED' ? 'active' : ''}`}
            onClick={() => setActiveTab('CONFIRMED')}
          >
            Confirmed / Onboarding ({subscriptions.filter(s => s.status === 'CONFIRMED').length})
          </button>
          <button
            className={`contract-pill-btn ${activeTab === 'PAUSED' ? 'active' : ''}`}
            onClick={() => setActiveTab('PAUSED')}
          >
            Paused ({subscriptions.filter(s => s.status === 'PAUSED').length})
          </button>
          <button
            className={`contract-pill-btn ${activeTab === 'CLOSED' ? 'active' : ''}`}
            onClick={() => setActiveTab('CLOSED')}
          >
            Closed ({subscriptions.filter(s => s.status === 'CLOSED').length})
          </button>
        </div>

        <div className="contracts-search-bar" style={{ width: '280px' }}>
          <Search size={14} color="var(--text-muted)" />
          <input
            type="text"
            className="contracts-search-input"
            placeholder="Search code, customer, plan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Subscription Table */}
      <div className="table-container">
        <table className="data-table zylo-table">
          <thead>
            <tr>
              <th>Subscription Code</th>
              <th>Customer Account</th>
              <th>Plan & Frequency</th>
              <th>Next Billing Milestone</th>
              <th style={{ textAlign: 'right' }}>Recurring Amount</th>
              <th>Lifecycle State</th>
              <th style={{ textAlign: 'right' }}>Operations</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubs.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-secondary)' }}>
                  No subscriptions match the selected criteria.
                </td>
              </tr>
            ) : (
              filteredSubs.map((sub) => (
                <tr key={sub.id}>
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--accent-primary)', background: 'rgba(242, 140, 69, 0.1)', padding: '0.25rem 0.55rem', borderRadius: '4px', fontSize: '0.8rem' }}>
                      {sub.subscription_code}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                      {sub.customer_name}
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                      Commenced: {sub.start_date}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.85rem' }}>
                      {sub.plan_name}
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                      Cycle: {sub.billing_frequency}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--text-primary)', fontWeight: '500', fontSize: '0.85rem' }}>
                      <Calendar size={13} color="var(--accent-primary)" />
                      <span>{sub.next_billing_date}</span>
                    </div>
                  </td>
                  <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                    <span style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                      ${Number(sub.total_recurring_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td>
                    {getStatusBadge(sub.status)}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.45rem' }}>
                      {sub.status === 'CONFIRMED' && (
                        <button className="btn btn-sm btn-primary" onClick={() => handleActivate(sub.id)}>
                          <Play size={12} />
                          <span>Activate</span>
                        </button>
                      )}
                      {sub.status === 'ACTIVE' && (
                        <button className="btn btn-sm btn-secondary" onClick={() => { setSelectedSub(sub); setShowPauseModal(true); }}>
                          <Pause size={12} color="var(--accent-amber)" />
                          <span>Pause</span>
                        </button>
                      )}
                      {sub.status === 'PAUSED' && (
                        <button className="btn btn-sm btn-primary" onClick={() => handleResume(sub.id)}>
                          <Play size={12} />
                          <span>Resume</span>
                        </button>
                      )}
                      {sub.status !== 'CLOSED' && (
                        <button className="btn btn-sm btn-ghost" style={{ color: 'var(--accent-danger)' }} onClick={() => handleCancel(sub.id)}>
                          <XCircle size={13} />
                          <span>Close</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* New Subscription Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px', padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                Create New Customer Subscription
              </h3>
              <button onClick={() => setShowAddModal(false)} style={{ color: 'var(--text-secondary)', fontSize: '1.25rem' }}>✕</button>
            </div>

            <form onSubmit={handleCreateSubscription}>
              <div className="form-group">
                <label className="form-label">Customer Account *</label>
                <select
                  className="form-control"
                  required
                  value={newSub.customer_id}
                  onChange={(e) => setNewSub({ ...newSub, customer_id: e.target.value })}
                >
                  <option value="">Select Customer...</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.company_name} ({c.customer_code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Subscription Plan *</label>
                <select
                  className="form-control"
                  required
                  value={newSub.plan_id}
                  onChange={(e) => setNewSub({ ...newSub, plan_id: e.target.value })}
                >
                  <option value="">Select Plan...</option>
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Billing Frequency *</label>
                  <select
                    className="form-control"
                    value={newSub.billing_frequency}
                    onChange={(e) => setNewSub({ ...newSub, billing_frequency: e.target.value })}
                  >
                    <option value="MONTHLY">Monthly</option>
                    <option value="YEARLY">Yearly (Annual)</option>
                    <option value="QUARTERLY">Quarterly</option>
                    <option value="DAILY">Daily</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Recurring Amount ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="form-control"
                    value={newSub.total_recurring_amount}
                    onChange={(e) => setNewSub({ ...newSub, total_recurring_amount: e.target.value })}
                    placeholder="1200.00"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Start Date *</label>
                  <input
                    type="date"
                    required
                    className="form-control"
                    value={newSub.start_date}
                    onChange={(e) => setNewSub({ ...newSub, start_date: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Next Billing Date *</label>
                  <input
                    type="date"
                    required
                    className="form-control"
                    value={newSub.next_billing_date}
                    onChange={(e) => setNewSub({ ...newSub, next_billing_date: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save & Activate in Backend
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pause Modal */}
      {showPauseModal && (
        <div className="modal-overlay" onClick={() => setShowPauseModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Pause Subscription {selectedSub?.subscription_code}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem', lineHeight: '1.4' }}>
              Pausing will temporarily suspend the automated recurring billing engine for this contract until manually resumed.
            </p>
            <div className="form-group">
              <label className="form-label">Pause Reason *</label>
              <textarea
                className="form-control"
                rows="3"
                value={pauseReason}
                onChange={(e) => setPauseReason(e.target.value)}
                placeholder="e.g. Seasonal customer operational hold requested..."
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button className="btn btn-secondary" onClick={() => setShowPauseModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handlePause}>Confirm Pause</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subscriptions;
