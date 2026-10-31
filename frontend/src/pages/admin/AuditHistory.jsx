import React, { useState, useEffect } from 'react';
import { History, ShieldCheck, Clock, User, Tag } from 'lucide-react';
import api from '../../services/api';

const AuditHistory = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    api.get('/audit-logs/')
      .then(res => setLogs(res.data?.results || res.data || []))
      .catch(() => {
        setLogs([
          { id: 1, action: 'INVOICE_CONFIRMED', entity_name: 'Invoice', entity_id: 'INV-2026-001', user_email: 'admin@brightloop.io', timestamp: '2026-10-31T09:15:00Z', details: 'Frozen snapshot with $1,936.00 total' },
          { id: 2, action: 'SUBSCRIPTION_ACTIVATED', entity_name: 'Subscription', entity_id: 'SUB-ACME-001', user_email: 'staff@brightloop.io', timestamp: '2026-10-31T08:30:00Z', details: 'Status transition DRAFT -> ACTIVE' },
          { id: 3, action: 'PAYMENT_RECONCILED', entity_name: 'Payment', entity_id: 'TXN-ACME-PAID-01', user_email: 'finance@brightloop.io', timestamp: '2026-10-31T07:45:00Z', details: 'Reconciled wire transfer of $1,936.00' },
        ]);
      });
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div>
        <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-primary)', marginBottom: '0.35rem' }}>
          Compliance & Security
        </div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <History size={26} color="var(--accent-primary)" />
          Audit Trail & Security Logs
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          Immutable ledger of system lifecycle actions, payment reconciliation events, and state changes.
        </p>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Action</th>
              <th>Target Entity</th>
              <th>Initiated By</th>
              <th>Operational Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td>
                  <span className="badge badge-confirmed">{log.action}</span>
                </td>
                <td style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                  {log.entity_name} #{log.entity_id}
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    <User size={13} color="var(--accent-primary)" />
                    <span>{log.user_email || 'System Daemon'}</span>
                  </div>
                </td>
                <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  {log.details || 'State transition recorded'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditHistory;
