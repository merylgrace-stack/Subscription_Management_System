import React, { useState, useEffect } from 'react';
import { CreditCard, Plus, Check, Clock, ShieldCheck, RefreshCcw } from 'lucide-react';
import { catalogService } from '../../services/api';

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPlan, setNewPlan] = useState({
    name: '',
    base_recurring_fee: '499.00',
    billing_frequency: 'MONTHLY',
    minimum_purchase_quantity: 1,
    validity_period_days: 365,
    auto_close_on_expiry: true,
    allow_early_cancellation: true,
    allow_pausing: true,
    allow_renewal: true,
    is_active: true,
  });

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await catalogService.getPlans();
      const data = res.data?.results || res.data || [];
      setPlans(data);
    } catch (err) {
      console.error('Failed to fetch plans:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-primary)', marginBottom: '0.35rem' }}>
            Catalog Management
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <CreditCard size={26} color="var(--accent-primary)" />
            Subscription Plans
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Configure recurring billing intervals (Daily, Weekly, Monthly, Yearly), terms, and auto-renewals.
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={16} />
          <span>New Subscription Plan</span>
        </button>
      </div>

      {/* Plans Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem' }}>
        {plans.map((plan) => (
          <div key={plan.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '340px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span className="badge badge-confirmed">
                  {plan.billing_frequency} Cycle
                </span>
                <span className={`badge ${plan.is_active ? 'badge-active' : 'badge-danger'}`}>
                  {plan.is_active ? 'Active' : 'Archived'}
                </span>
              </div>

              <h3 style={{ fontSize: '1.35rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                {plan.name}
              </h3>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', margin: '1rem 0' }}>
                <span style={{ fontSize: '2.25rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                  ${Number(plan.base_recurring_fee).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  / {plan.billing_frequency.toLowerCase()}
                </span>
              </div>

              {/* Feature / Permission Checkmarks */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '1.25rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', fontSize: '0.82rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: plan.allow_pausing ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                  <Check size={14} color={plan.allow_pausing ? 'var(--accent-green)' : 'var(--text-muted)'} />
                  <span>Customer Pausing {plan.allow_pausing ? 'Permitted' : 'Disabled'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: plan.allow_early_cancellation ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                  <Check size={14} color={plan.allow_early_cancellation ? 'var(--accent-green)' : 'var(--text-muted)'} />
                  <span>Early Cancellation Allowed</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: plan.allow_renewal ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                  <Check size={14} color={plan.allow_renewal ? 'var(--accent-green)' : 'var(--text-muted)'} />
                  <span>Automatic Contract Renewal</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: plan.auto_close_on_expiry ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                  <Clock size={14} color="var(--accent-amber)" />
                  <span>Auto-close on Expiry</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
              <button className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                Edit Plan
              </button>
              <button className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                Create Quote
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Plans;
