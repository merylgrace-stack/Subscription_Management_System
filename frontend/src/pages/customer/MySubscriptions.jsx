import React, { useState, useEffect } from 'react';
import { RotateCcw, Calendar, CheckCircle2, ShieldCheck, ArrowRight, ExternalLink } from 'lucide-react';
import { customerPortalService } from '../../services/api';

const MySubscriptions = () => {
  const [data, setData] = useState({
    subscriptions: [
      {
        id: 1,
        subscription_code: 'SUB-ACME-001',
        plan_name: 'Enterprise Monthly Suite',
        billing_frequency: 'MONTHLY',
        start_date: '2026-08-01',
        next_billing_date: '2026-11-07',
        total_recurring_amount: '1936.00',
        status: 'ACTIVE',
      },
    ],
  });

  useEffect(() => {
    customerPortalService.getPortalDashboard()
      .then(res => {
        if (res.data?.subscriptions?.length > 0) {
          setData(res.data);
        }
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div>
        <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-primary)', marginBottom: '0.35rem' }}>
          Customer Self-Service
        </div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <RotateCcw size={26} color="var(--accent-primary)" />
          My Enterprise Subscriptions
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          Review active services, included platform modules, and renewal schedules.
        </p>
      </div>

      {/* Subscriptions List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {data.subscriptions.map((sub) => (
          <div key={sub.id} className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--accent-primary)', background: 'rgba(242, 140, 69, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                    {sub.subscription_code}
                  </span>
                  <span className="badge badge-active">Active Service</span>
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                  {sub.plan_name}
                </h3>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.85rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                  ${Number(sub.total_recurring_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Billed {sub.billing_frequency}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Contract Activated</div>
                <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginTop: '0.2rem' }}>{sub.start_date}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Next Renewal Date</div>
                <div style={{ fontWeight: '600', color: 'var(--accent-primary)', marginTop: '0.2rem' }}>{sub.next_billing_date}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Service Status</div>
                <div style={{ fontWeight: '600', color: 'var(--accent-green)', marginTop: '0.2rem' }}>Operational (99.99% SLA)</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MySubscriptions;
