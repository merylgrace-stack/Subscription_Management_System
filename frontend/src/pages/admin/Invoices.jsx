import React, { useState, useEffect } from 'react';
import { Receipt, Play, CheckCircle, DollarSign, Calendar, AlertTriangle, FileText } from 'lucide-react';
import { billingService } from '../../services/api';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('BANK_TRANSFER');
  const [showPayModal, setShowPayModal] = useState(false);
  const [runningCycle, setRunningCycle] = useState(false);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const res = await billingService.getInvoices();
      const data = res.data?.results || res.data || [];
      setInvoices(data);
    } catch (err) {
      console.error('Failed to fetch invoices:', err);
      // Fallback seed display
      setInvoices([
        {
          id: 1,
          invoice_number: 'INV-2026-001',
          customer_name: 'Acme Global Corp',
          invoice_date: '2026-09-01',
          due_date: '2026-10-01',
          grand_total: '1936.0000',
          amount_paid: '1936.0000',
          outstanding_balance: '0.0000',
          status: 'PAID',
          is_overdue: false,
        },
        {
          id: 2,
          invoice_number: 'INV-2026-002',
          customer_name: 'TechVanguard Inc',
          invoice_date: '2026-09-15',
          due_date: '2026-10-15',
          grand_total: '1320.0000',
          amount_paid: '0.0000',
          outstanding_balance: '1320.0000',
          status: 'CONFIRMED',
          is_overdue: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleRunBillingCycle = async () => {
    try {
      setRunningCycle(true);
      const res = await billingService.runBillingCycle();
      alert(res.data.message || 'Billing cycle executed.');
      fetchInvoices();
    } catch (err) {
      alert('Error running billing cycle: ' + (err.response?.data?.error || err.message));
    } finally {
      setRunningCycle(false);
    }
  };

  const handleConfirmInvoice = async (id) => {
    try {
      await billingService.confirmInvoice(id);
      fetchInvoices();
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    if (!selectedInvoice) return;
    try {
      await billingService.recordPayment(selectedInvoice.id, {
        amount: paymentAmount,
        payment_method: paymentMethod,
        notes: 'Manual reconciliation entry',
      });
      setShowPayModal(false);
      setPaymentAmount('');
      fetchInvoices();
    } catch (err) {
      alert('Payment recording failed: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-primary)', marginBottom: '0.35rem' }}>
            Billing & Receivables
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Receipt size={26} color="var(--accent-primary)" />
            Invoice Management
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Immutable financial snapshots, Banker's rounded tax realization, and settlement tracking.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={handleRunBillingCycle}
          disabled={runningCycle}
        >
          <Play size={16} />
          <span>{runningCycle ? 'Processing...' : 'Run Automated Billing Cycle'}</span>
        </button>
      </div>

      {/* Invoice Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Invoice Number</th>
              <th>Customer</th>
              <th>Invoice Date</th>
              <th>Due Date</th>
              <th>Grand Total</th>
              <th>Outstanding</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id}>
                <td>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--accent-primary)' }}>
                    {inv.invoice_number}
                  </span>
                </td>
                <td style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                  {inv.customer_name}
                </td>
                <td>{inv.invoice_date}</td>
                <td>
                  <span style={{ color: inv.is_overdue ? 'var(--accent-danger)' : 'var(--text-secondary)', fontWeight: inv.is_overdue ? '700' : '400' }}>
                    {inv.due_date} {inv.is_overdue && '⚠️ (Overdue)'}
                  </span>
                </td>
                <td style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
                  ${Number(inv.grand_total).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
                <td>
                  <span style={{ fontWeight: '800', color: Number(inv.outstanding_balance) > 0 ? 'var(--accent-amber)' : 'var(--accent-green)' }}>
                    ${Number(inv.outstanding_balance).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </td>
                <td>
                  {inv.status === 'PAID' && <span className="badge badge-paid">Paid</span>}
                  {inv.status === 'CONFIRMED' && <span className="badge badge-confirmed">Confirmed</span>}
                  {inv.status === 'DRAFT' && <span className="badge badge-draft">Draft</span>}
                  {inv.status === 'CANCELLED' && <span className="badge badge-danger">Cancelled</span>}
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    {inv.status === 'DRAFT' && (
                      <button className="btn btn-sm btn-primary" onClick={() => handleConfirmInvoice(inv.id)}>
                        Confirm
                      </button>
                    )}
                    {inv.status === 'CONFIRMED' && (
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => {
                          setSelectedInvoice(inv);
                          setPaymentAmount(inv.outstanding_balance);
                          setShowPayModal(true);
                        }}
                      >
                        <DollarSign size={13} color="var(--accent-green)" />
                        <span>Pay</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Payment Recording Modal */}
      {showPayModal && (
        <div className="modal-overlay" onClick={() => setShowPayModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Record Payment for {selectedInvoice?.invoice_number}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              Outstanding Balance: <strong style={{ color: 'var(--accent-amber)' }}>${Number(selectedInvoice?.outstanding_balance).toFixed(2)}</strong>
            </p>

            <form onSubmit={handleRecordPayment}>
              <div className="form-group">
                <label className="form-label">Payment Amount ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  className="form-control"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Payment Method *</label>
                <select
                  className="form-control"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="BANK_TRANSFER">Bank Wire / ACH</option>
                  <option value="CREDIT_CARD">Credit Card</option>
                  <option value="STRIPE">Stripe Gateway</option>
                  <option value="CHECK">Corporate Check</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowPayModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Settle Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoices;
