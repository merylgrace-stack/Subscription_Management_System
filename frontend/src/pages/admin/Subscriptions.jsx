import React, { useState, useEffect } from 'react';
import { RotateCcw, Play, Pause, XCircle, CheckCircle, Calendar, RefreshCw, AlertCircle } from 'lucide-react';
import { subscriptionService } from '../../services/api';

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSub, setSelectedSub] = useState(null);
  const [pauseReason, setPauseReason] = useState('');
  const [showPauseModal, setShowPauseModal] = useState(false);

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
          plan_name: 'Enterprise Monthly',
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
          plan_name: 'Enterprise Annual',
          billing_frequency: 'YEARLY',
          start_date: '2026-05-15',
          next_billing_date: '2027-05-15',
          total_recurring_amount: '12000.0000',
          status: 'ACTIVE',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleActivate = async (id) => {
    try {
      await subscriptionService.activate(id);
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
      fetchSubscriptions();
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };

  const handleResume = async (id) => {
    try {
      await subscriptionService.resume(id);
      fetchSubscriptions();
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to terminate this subscription?')) return;
    try {
      await subscriptionService.cancel(id, 'Admin termination');
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-primary)', marginBottom: '0.35rem' }}>
            Lifecycle Management
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <RotateCcw size={26} color="var(--accent-primary)" />
            Subscriptions
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Manage subscription states (CONFIRMED, ACTIVE, PAUSED, CLOSED) and renewal cycles.
          </p>
        </div>

        <button className="btn btn-secondary btn-sm" onClick={fetchSubscriptions}>
          <RefreshCw size={14} />
          <span>Refresh Records</span>
        </button>
      </div>

      {/* Subscription Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Subscription ID</th>
              <th>Customer</th>
              <th>Plan & Frequency</th>
              <th>Next Billing</th>
              <th>Recurring Total</th>
              <th>State</th>
              <th>Lifecycle Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((sub) => (
              <tr key={sub.id}>
                <td>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--accent-primary)', background: 'rgba(242, 140, 69, 0.1)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                    {sub.subscription_code}
                  </span>
                </td>
                <td>
                  <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{sub.customer_name}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>Started: {sub.start_date}</div>
                </td>
                <td>
                  <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{sub.plan_name}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Interval: {sub.billing_frequency}</div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-primary)', fontWeight: '500' }}>
                    <Calendar size={13} color="var(--accent-primary)" />
                    <span>{sub.next_billing_date}</span>
                  </div>
                </td>
                <td>
                  <span style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--accent-green)' }}>
                    ${Number(sub.total_recurring_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </td>
                <td>
                  {getStatusBadge(sub.status)}
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
            ))}
          </tbody>
        </table>
      </div>

      {/* Pause Modal */}
      {showPauseModal && (
        <div className="modal-overlay" onClick={() => setShowPauseModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '1rem' }}>
              Pause Subscription {selectedSub?.subscription_code}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              Pausing will temporarily halt billing cycles until resumed.
            </p>
            <div className="form-group">
              <label className="form-label">Pause Reason *</label>
              <textarea
                className="form-control"
                rows="3"
                value={pauseReason}
                onChange={(e) => setPauseReason(e.target.value)}
                placeholder="e.g. Customer seasonal hold requested..."
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
