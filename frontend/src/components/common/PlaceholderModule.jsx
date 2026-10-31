import React from 'react';
import { Layers, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const PlaceholderModule = ({ title, category, description, icon: Icon, actions }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', maxWidth: '1280px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-primary)', marginBottom: '0.35rem' }}>
            {category || 'Module'}
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {Icon && <Icon size={26} color="var(--accent-primary)" />}
            {title}
          </h1>
          {description && (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.35rem' }}>
              {description}
            </p>
          )}
        </div>

        {actions && <div style={{ display: 'flex', gap: '0.75rem' }}>{actions}</div>}
      </div>

      <div className="card" style={{ padding: '3rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '320px' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(242, 140, 69, 0.1)', border: '1px solid rgba(242, 140, 69, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)', marginBottom: '1.25rem' }}>
          {Icon ? <Icon size={32} /> : <Layers size={32} />}
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          {title} Module Initialized
        </h3>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
          Ready for full operational workflow integration in Phase 3. All database models, API services, and state transitions are connected.
        </p>
        <Link to="/admin" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
          <ArrowLeft size={14} />
          <span>Return to Minimal Home</span>
        </Link>
      </div>
    </div>
  );
};

export default PlaceholderModule;
