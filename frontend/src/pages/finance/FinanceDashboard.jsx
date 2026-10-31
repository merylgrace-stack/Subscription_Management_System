import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, AlertCircle, CheckCircle2, ShieldAlert, ArrowUpRight, Filter } from 'lucide-react';
import { financeService } from '../../services/api';

const FinanceDashboard = () => {
  const [data, setData] = useState({
    total_active_subscriptions: 2,
    total_revenue_collected: '1936.00',
    total_outstanding_receivables: '1320.00',
    overdue_invoices_count: 1,
    recent_reconciliations: [],
  });
  const [overdueInvoices, setOverdueInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFinanceData = async () => {
    try {
      setLoading(true);
      const [dashRes, overdueRes] = await Promise.all([
        financeService.getDashboard(),
        financeService.getOverdueInvoices(),
      ]);
      setData(dashRes.data);
      setOverdueInvoices(overdueRes.data?.results || overdueRes.data || []);
    } catch (err) {
      console.error('Error fetching finance dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinanceData();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div>
        <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-primary)', marginBottom: '0.35rem' }}>
          Executive Financial Cockpit
        </div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <TrendingUp size={26} color="var(--accent-primary)" />
          Finance Lead Dashboard
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          Cash collections, overdue receivables aging, and transactional reconciliation audit trail.
        </p>
      </div>

      {/* 4 Key Financial Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        {/* Total Collected */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Total Collected Revenue</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(50, 182, 122, 0.12)', color: 'var(--accent-green)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-primary)' }}>
            ${Number(data.total_revenue_collected || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--accent-green)', fontWeight: '600' }}>
            ✓ Settled in General Ledger
          </span>
        </div>

        {/* Total Outstanding Receivables */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Outstanding Receivables</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(233, 172, 75, 0.12)', color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertCircle size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-primary)' }}>
            ${Number(data.total_outstanding_receivables || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--accent-amber)', fontWeight: '600' }}>
            Awaiting Customer Settlement
          </span>
        </div>

        {/* Overdue Count */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Overdue Invoices</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(224, 91, 97, 0.12)', color: 'var(--accent-danger)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldAlert size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--accent-danger)' }}>
            {data.overdue_invoices_count || 0}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--accent-danger)', fontWeight: '600' }}>
            Collections Action Required
          </span>
        </div>

        {/* Active Subscriptions */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Active Recurring Accounts</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(139, 124, 246, 0.12)', color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-primary)' }}>
            {data.total_active_subscriptions || 0}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--accent-purple)', fontWeight: '600' }}>
            Operational Subscriptions
          </span>
        </div>
      </div>

      {/* Overdue Invoices Aging Table */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldAlert size={18} color="var(--accent-danger)" />
          <span>Overdue Invoices & Aging Receivables</span>
        </h3>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Client</th>
                <th>Due Date</th>
                <th>Overdue Amount</th>
                <th>Aging Bracket</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {overdueInvoices.length > 0 ? (
                overdueInvoices.map((inv) => (
                  <tr key={inv.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--accent-primary)' }}>
                      {inv.invoice_number}
                    </td>
                    <td style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                      {inv.customer_name}
                    </td>
                    <td style={{ color: 'var(--accent-danger)', fontWeight: '600' }}>
                      {inv.due_date}
                    </td>
                    <td style={{ fontWeight: '700', color: 'var(--accent-danger)' }}>
                      ${Number(inv.outstanding_balance).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td>
                      <span className="badge badge-danger">15-30 Days Past Due</span>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-secondary">Schedule Collection Call</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No overdue accounts. All customer invoices are current.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FinanceDashboard;
