import React, { useState } from 'react';
import { FileSpreadsheet, Download, Calendar, ArrowUpRight, DollarSign } from 'lucide-react';

const Reports = () => {
  const [reportType, setReportType] = useState('REVENUE_REALIZATION');

  const reportData = [
    { period: '2026-10 (Current)', mrr: '$24,780.00', realizedRevenue: '$24,780.00', taxCollected: '$2,478.00', netRevenue: '$22,302.00' },
    { period: '2026-09', mrr: '$22,900.00', realizedRevenue: '$22,900.00', taxCollected: '$2,290.00', netRevenue: '$20,610.00' },
    { period: '2026-08', mrr: '$21,200.00', realizedRevenue: '$21,200.00', taxCollected: '$2,120.00', netRevenue: '$19,080.00' },
    { period: '2026-07', mrr: '$19,800.00', realizedRevenue: '$19,800.00', taxCollected: '$1,980.00', netRevenue: '$17,820.00' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-primary)', marginBottom: '0.35rem' }}>
            Financial Operations
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <FileSpreadsheet size={26} color="var(--accent-primary)" />
            Financial Reports & Tax Summaries
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            GAAP / IFRS revenue realization schedules, VAT liability statements, and ledger summaries.
          </p>
        </div>

        <button className="btn btn-secondary btn-sm" onClick={() => window.print()}>
          <Download size={14} />
          <span>Export Financial Statement (PDF)</span>
        </button>
      </div>

      {/* Report Table */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)' }}>
            Revenue Realization & Tax Ledger
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Currency: USD ($)</span>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Accounting Period</th>
                <th>Contract MRR</th>
                <th>Gross Realized</th>
                <th>Tax / VAT Collected</th>
                <th>Net Recognized</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((row, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: '600', color: 'var(--accent-primary)' }}>{row.period}</td>
                  <td>{row.mrr}</td>
                  <td style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{row.realizedRevenue}</td>
                  <td style={{ color: 'var(--accent-amber)', fontWeight: '600' }}>{row.taxCollected}</td>
                  <td style={{ fontWeight: '800', color: 'var(--accent-green)' }}>{row.netRevenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
