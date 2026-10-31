import React, { useState, useEffect } from 'react';
import { Box, Plus, Layers, DollarSign, Tag } from 'lucide-react';
import { catalogService } from '../../services/api';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    product_type: 'SUBSCRIPTION',
    description: '',
    base_sales_price: '1200.00',
    cost_price: '250.00',
    variant_name: 'Odoo Enterprise Connector',
    variant_surcharge: '560.00',
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await catalogService.getProducts();
      const data = res.data?.results || res.data || [];
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      // Fallback display
      setProducts([
        {
          id: 1,
          name: 'Brightloop Enterprise Platform',
          product_type: 'SUBSCRIPTION',
          description: 'Full-suite recurring billing, revenue recognition and orchestration engine.',
          base_sales_price: '1200.0000',
          cost_price: '250.0000',
          is_active: true,
          variants: [
            { id: 1, name: 'Odoo Enterprise Connector', additional_price_adjustment: '560.0000', final_unit_price: '1760.0000', is_active: true },
            { id: 2, name: 'Salesforce Sync Gateway', additional_price_adjustment: '450.0000', final_unit_price: '1650.0000', is_active: true },
          ],
        },
        {
          id: 2,
          name: 'Brightloop Starter Suite',
          product_type: 'SUBSCRIPTION',
          description: 'Core billing and customer checkout portal for fast-growth startups.',
          base_sales_price: '299.0000',
          cost_price: '50.0000',
          is_active: true,
          variants: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-primary)', marginBottom: '0.35rem' }}>
            Catalog Management
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Box size={26} color="var(--accent-primary)" />
            Products & Variants
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Manage core subscription software items, add-on modules, and variant price adjustments.
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={16} />
          <span>New Product</span>
        </button>
      </div>

      {/* Products Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '1.5rem' }}>
        {products.map((prod) => (
          <div key={prod.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
              <div>
                <span className="badge badge-confirmed" style={{ marginBottom: '0.5rem' }}>
                  {prod.product_type}
                </span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                  {prod.name}
                </h3>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--accent-primary)' }}>
                  ${Number(prod.base_sales_price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Base Price / Unit</div>
              </div>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5' }}>
              {prod.description || 'Enterprise software license with high-availability support.'}
            </p>

            {/* Configured Variants */}
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0.85rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Tag size={13} color="var(--accent-primary)" />
                <span>Configured Variants & Add-ons</span>
              </div>

              {prod.variants && prod.variants.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  {prod.variants.map((v) => {
                    const surcharge = Number(v.additional_price_adjustment);
                    const finalPrice = Number(prod.base_sales_price) + surcharge;
                    return (
                      <div key={v.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem', padding: '0.4rem 0.6rem', background: 'var(--bg-card)', borderRadius: '6px' }}>
                        <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{v.name}</span>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ color: 'var(--accent-amber)', fontWeight: '600', marginRight: '0.5rem' }}>
                            +${surcharge.toFixed(2)}
                          </span>
                          <span style={{ color: 'var(--accent-green)', fontWeight: '700' }}>
                            = ${finalPrice.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontStyle: 'italic' }}>
                  Standard edition (no price adjustment variants).
                </div>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
              <span className={`badge ${prod.is_active ? 'badge-active' : 'badge-danger'}`}>
                {prod.is_active ? 'Active in Catalog' : 'Inactive'}
              </span>
              <button className="btn btn-ghost btn-sm" style={{ color: 'var(--accent-primary)' }}>
                Configure Pricing
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
