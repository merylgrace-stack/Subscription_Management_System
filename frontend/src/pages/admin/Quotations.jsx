import React, { useState, useEffect } from 'react';
import { FileCheck, Plus, Check, X, ArrowRight, Calendar, DollarSign, RefreshCw } from 'lucide-react';
import { quotationService } from '../../services/api';

const Quotations = () => {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchQuotations = async () => {
    try {
      setLoading(true);
      const res = await quotationService.getAll();
      const data = res.data?.results || res.data || [];
      setQuotations(data);
    } catch (err) {
      console.error('Failed to fetch quotations:', err);
      // Fallback display
      setQuotations([
        {
          id: 1,
          quotation_number: 'QUOTE-2026-001',
          customer_name: 'Nexus Logistics LLC',
          valid_until: '2026-11-30',
          grand_total: '2450.0000',
          status: 'APPROVED',
        },
        {
          id: 2,
          quotation_number: 'QUOTE-2026-002',
          customer_name: 'TechVanguard Inc',
          valid_until: '2026-11-15',
          grand_total: '12000.0000',
          status: 'DRAFT',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

  const handleApprove = async (id) => {
    try {
      await quotationService.approve(id);
      fetchQuotations();
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };

  const handleReject = async (id) => {
    try {
      await quotationService.reject(id);
      fetchQuotations();
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };

  const handleConvertToSubscription = async (id) => {
    try {
      const res = await quotationService.convertToSubscription(id);
      alert(res.data.message || 'Quotation converted to subscription!');
      fetchQuotations();
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED': return <span className="badge badge-paid">Approved</span>;
      case 'CONVERTED': return <span className="badge badge-active">Converted</span>;
      case 'REJECTED': return <span className="badge badge-danger">Rejected</span>;
      case 'EXPIRED': return <span className="badge badge-paused">Expired</span>;
      default: return <span className="badge badge-draft">Draft</span>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-primary)', marginBottom: '0.35rem' }}>
            Sales & Proposals
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <FileCheck size={26} color="var(--accent-primary)" />
            Quotation Management
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Review customer proposals, approvals, and convert directly into active subscriptions.
          </p>
        </div>

        <button className="btn btn-secondary btn-sm" onClick={fetchQuotations}>
          <RefreshCw size={14} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Quotations Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Quotation #</th>
              <th>Customer</th>
              <th>Valid Until</th>
              <th>Proposal Total</th>
              <th>Status</th>
              <th>Conversion & Actions</th>
            </tr>
          </thead>
          <tbody>
            {quotations.map((q) => (
              <tr key={q.id}>
                <td>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--accent-primary)' }}>
                    {q.quotation_number}
                  </span>
                </td>
                <td style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                  {q.customer_name}
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-secondary)' }}>
                    <Calendar size={13} color="var(--accent-amber)" />
                    <span>{q.valid_until}</span>
                  </div>
                </td>
                <td>
                  <span style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                    ${Number(q.grand_total).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </td>
                <td>
                  {getStatusBadge(q.status)}
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {q.status === 'DRAFT' && (
                      <>
                        <button className="btn btn-sm btn-primary" onClick={() => handleApprove(q.id)}>
                          <Check size={12} />
                          <span>Approve</span>
                        </button>
                        <button className="btn btn-sm btn-ghost" style={{ color: 'var(--accent-danger)' }} onClick={() => handleReject(q.id)}>
                          <X size={12} />
                          <span>Reject</span>
                        </button>
                      </>
                    )}
                    {q.status === 'APPROVED' && (
                      <button className="btn btn-sm btn-primary" style={{ background: 'var(--accent-green-gradient)', boxShadow: 'var(--shadow-glow-green)' }} onClick={() => handleConvertToSubscription(q.id)}>
                        <span>Convert to Subscription</span>
                        <ArrowRight size={13} />
                      </button>
                    )}
                    {q.status === 'CONVERTED' && (
                      <span style={{ fontSize: '0.8rem', color: 'var(--accent-green)', fontWeight: '600' }}>
                        ✓ Active Contract
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Quotations;
