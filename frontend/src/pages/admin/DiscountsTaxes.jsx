import React, { useState, useEffect } from 'react';
import { Percent, Tag, Plus, CheckCircle, ShieldCheck } from 'lucide-react';
import { catalogService } from '../../services/api';

const DiscountsTaxes = () => {
  const [discounts, setDiscounts] = useState([]);
  const [taxes, setTaxes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [discRes, taxRes] = await Promise.all([
        catalogService.getDiscounts(),
        catalogService.getTaxes(),
      ]);
      setDiscounts(discRes.data?.results || discRes.data || []);
      setTaxes(taxRes.data?.results || taxRes.data || []);
    } catch (err) {
      console.error('Error fetching discounts and taxes:', err);
      // Fallback display
      setDiscounts([
        {
          id: 1,
          name: 'Q4 Enterprise Expansion Promo',
          code: 'PROMO15',
          discount_type: 'PERCENTAGE',
          value: '15.0000',
          min_spend: '1000.0000',
          current_usage_count: 3,
          max_usage_count: 50,
          is_active: true,
        },
      ]);
      setTaxes([
        {
          id: 1,
          name: 'Standard Corporate VAT',
          tax_type: 'VAT',
          rate_percentage: '10.0000',
          country_code: 'GLOBAL',
          is_active: true,
        },
        {
          id: 2,
          name: 'US California Sales Tax',
          tax_type: 'SALES_TAX',
          rate_percentage: '8.2500',
          country_code: 'US-CA',
          is_active: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div>
        <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-primary)', marginBottom: '0.35rem' }}>
          Financial Rules
        </div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <Percent size={26} color="var(--accent-primary)" />
          Discounts & Tax Configuration
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          Admin-only configuration of percentage/fixed promotional discounts and regional tax rates.
        </p>
      </div>

      {/* Grid containing Discounts and Taxes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '2rem' }}>
        {/* Discounts Section */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Tag size={18} color="var(--accent-primary)" />
              <span>Discount Promotional Rules</span>
            </h3>
            <button className="btn btn-primary btn-sm">
              <Plus size={14} />
              <span>New Rule</span>
            </button>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Discount</th>
                  <th>Usage Limit</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {discounts.map((d) => (
                  <tr key={d.id}>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--accent-primary)', background: 'rgba(242, 140, 69, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                        {d.code}
                      </span>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{d.name}</div>
                    </td>
                    <td>
                      <span style={{ fontWeight: '700', color: 'var(--accent-green)' }}>
                        {d.discount_type === 'PERCENTAGE' ? `${Number(d.value)}%` : `$${Number(d.value)}`}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                        {d.current_usage_count} / {d.max_usage_count || '∞'} used
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${d.is_active ? 'badge-active' : 'badge-danger'}`}>
                        {d.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tax Rules Section */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Percent size={18} color="var(--accent-purple)" />
              <span>Regional Tax Rules</span>
            </h3>
            <button className="btn btn-secondary btn-sm">
              <Plus size={14} />
              <span>Add Tax</span>
            </button>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tax Name</th>
                  <th>Type</th>
                  <th>Rate (%)</th>
                  <th>Region</th>
                </tr>
              </thead>
              <tbody>
                {taxes.map((t) => (
                  <tr key={t.id}>
                    <td style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                      {t.name}
                    </td>
                    <td>
                      <span className="badge badge-confirmed">{t.tax_type}</span>
                    </td>
                    <td style={{ fontWeight: '700', color: 'var(--accent-primary)' }}>
                      {Number(t.rate_percentage).toFixed(2)}%
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>
                      {t.country_code}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscountsTaxes;
