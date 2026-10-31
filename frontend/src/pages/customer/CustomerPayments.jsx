import React, { useState, useEffect } from 'react';
import { DollarSign, ShieldCheck, Download, CheckCircle2 } from 'lucide-react';
import { customerPortalService } from '../../services/api';

const CustomerPayments = () => {
  const [payments, setPayments] = useState([
    {
      id: 1,
      transaction_id: 'TXN-ACME-PAID-01',
      invoice_number: 'INV-2026-001',
      amount: '1936.00',
      payment_method: 'BANK_TRANSFER',
      payment_status: 'SUCCESS',
      transaction_date: '2026-10-01',
    },
  ]);

  useEffect(() => {
    customerPortalService.getPortalDashboard()
      .then(res => {
        if (res.data?.recent_payments?.length > 0) {
          setPayments(res.data.recent_payments);
        }
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <div>
        <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-primary)', marginBottom: '0.35rem' }}>
          Customer Self-Service
        </div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <DollarSign size={26} color="var(--accent-primary)" />
          Payment Transactions & History
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          Review historical receipts, payment methods on file, and settlement confirmations.
        </p>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Receipt / Transaction ID</th>
              <th>Invoice Settled</th>
              <th>Payment Date</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id}>
                <td style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--accent-primary)' }}>
                  {p.transaction_id}
                </td>
                <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                  {p.invoice_number || 'INV-2026-001'}
                </td>
                <td>{p.transaction_date ? p.transaction_date.slice(0, 10) : '2026-10-01'}</td>
                <td style={{ fontWeight: '700', color: 'var(--accent-green)' }}>
                  ${Number(p.amount).toFixed(2)}
                </td>
                <td>{p.payment_method?.replace('_', ' ')}</td>
                <td>
                  <span className="badge badge-paid">
                    ✓ Settled
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerPayments;
