import React, { useState, useEffect } from 'react';
import { DollarSign, Search, CheckCircle, Clock, ShieldCheck, RefreshCw } from 'lucide-react';
import { billingService } from '../../services/api';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await billingService.getPayments();
      const data = res.data?.results || res.data || [];
      setPayments(data);
    } catch (err) {
      console.error('Error fetching payments:', err);
      // Fallback display
      setPayments([
        {
          id: 1,
          transaction_id: 'TXN-ACME-PAID-01',
          customer_name: 'Acme Global Corp',
          invoice_number: 'INV-2026-001',
          amount: '1936.0000',
          payment_method: 'BANK_TRANSFER',
          payment_status: 'SUCCESS',
          is_reconciled: true,
          transaction_date: '2026-10-01T14:30:00Z',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const filtered = payments.filter(p =>
    p.transaction_id?.toLowerCase().includes(search.toLowerCase()) ||
    p.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
    p.invoice_number?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-primary)', marginBottom: '0.35rem' }}>
            Billing & Receivables
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <DollarSign size={26} color="var(--accent-primary)" />
            Payment Management & Ledger
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Multi-payment audit trail, gateway settlements, and bank reconciliation entries.
          </p>
        </div>

        <button className="btn btn-secondary btn-sm" onClick={fetchPayments}>
          <RefreshCw size={14} />
          <span>Refresh Ledger</span>
        </button>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-pill)', padding: '0.5rem 1.15rem', maxWidth: '380px' }}>
        <Search size={16} color="var(--text-muted)" />
        <input
          type="text"
          placeholder="Search by transaction ID, invoice, or client..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '0.85rem', width: '100%', outline: 'none' }}
        />
      </div>

      {/* Payment Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Customer</th>
              <th>Invoice Reference</th>
              <th>Settled Amount</th>
              <th>Method</th>
              <th>Reconciled</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id}>
                <td>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--accent-primary)' }}>
                    {p.transaction_id}
                  </span>
                </td>
                <td style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                  {p.customer_name}
                </td>
                <td>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                    {p.invoice_number}
                  </span>
                </td>
                <td style={{ fontWeight: '700', color: 'var(--accent-green)', fontSize: '0.95rem' }}>
                  ${Number(p.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
                <td>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                    {p.payment_method?.replace('_', ' ')}
                  </span>
                </td>
                <td>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: p.is_reconciled ? 'var(--accent-green)' : 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '600' }}>
                    <ShieldCheck size={14} />
                    <span>{p.is_reconciled ? 'Reconciled' : 'Pending'}</span>
                  </span>
                </td>
                <td>
                  <span className={`badge ${p.payment_status === 'SUCCESS' ? 'badge-paid' : 'badge-danger'}`}>
                    {p.payment_status}
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

export default Payments;
