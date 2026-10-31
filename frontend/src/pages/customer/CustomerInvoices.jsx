import React, { useState, useEffect } from 'react';
import { Receipt, Download, CreditCard, CheckCircle2 } from 'lucide-react';
import { customerPortalService } from '../../services/api';

const CustomerInvoices = () => {
  const [invoices, setInvoices] = useState([
    {
      id: 1,
      invoice_number: 'INV-2026-001',
      invoice_date: '2026-09-01',
      due_date: '2026-10-01',
      grand_total: '1936.00',
      outstanding_balance: '0.00',
      status: 'PAID',
    },
  ]);

  useEffect(() => {
    customerPortalService.getPortalDashboard()
      .then(res => {
        if (res.data?.recent_invoices?.length > 0) {
          setInvoices(res.data.recent_invoices);
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
          <Receipt size={26} color="var(--accent-primary)" />
          Invoices & Statements
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          View itemized billing records, tax receipts, and download official statement records.
        </p>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Issued Date</th>
              <th>Due Date</th>
              <th>Total Amount</th>
              <th>Balance</th>
              <th>Status</th>
              <th>Download</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id}>
                <td style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--accent-primary)' }}>
                  {inv.invoice_number}
                </td>
                <td>{inv.invoice_date}</td>
                <td>{inv.due_date}</td>
                <td style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
                  ${Number(inv.grand_total).toFixed(2)}
                </td>
                <td>
                  <span style={{ fontWeight: '700', color: Number(inv.outstanding_balance) > 0 ? 'var(--accent-amber)' : 'var(--accent-green)' }}>
                    ${Number(inv.outstanding_balance).toFixed(2)}
                  </span>
                </td>
                <td>
                  <span className={`badge ${inv.status === 'PAID' ? 'badge-paid' : 'badge-confirmed'}`}>
                    {inv.status}
                  </span>
                </td>
                <td>
                  <button className="btn btn-ghost btn-sm" style={{ color: 'var(--accent-primary)' }} onClick={() => window.print()}>
                    <Download size={13} />
                    <span>Print PDF</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerInvoices;
