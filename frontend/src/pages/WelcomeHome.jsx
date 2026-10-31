import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Layers,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Zap,
  Repeat,
  Calendar,
  Users,
  CheckCircle,
  ExternalLink,
  DollarSign,
  Lock,
  ChevronRight,
  Briefcase,
  FileCheck
} from 'lucide-react';
import '../styles/welcome.css';
import { useAuth } from '../context/AuthContext';

const WelcomeHome = () => {
  const navigate = useNavigate();
  const { switchRole } = useAuth();

  const handleQuickRole = (role, path) => {
    switchRole(role);
    navigate(path);
  };

  return (
    <div className="welcome-page">
      {/* Ambient Visual Depth */}
      <div className="welcome-glow-1" />
      <div className="welcome-glow-2" />

      {/* Top Navbar */}
      <header className="welcome-nav">
        <Link to="/" className="welcome-logo">
          <div className="brand-icon" style={{ width: '36px', height: '36px', borderRadius: '10px' }}>
            <Layers size={20} strokeWidth={2.5} />
          </div>
          <span className="welcome-logo-text">
            Bright<span style={{ color: 'var(--accent-primary)' }}>Loop</span>
          </span>
        </Link>

        <nav className="welcome-nav-links">
          <a href="#features" className="welcome-nav-link">Platform Capabilities</a>
          <a href="#architecture" className="welcome-nav-link">Billing Engine</a>
          <Link to="/admin/subscriptions" className="welcome-nav-link">Contracts</Link>
          <Link to="/admin/analytics" className="welcome-nav-link">Analytics</Link>
        </nav>

        <div className="welcome-nav-ctas">
          <Link to="/customer" className="btn btn-secondary btn-sm" style={{ borderRadius: 'var(--radius-pill)', padding: '0.45rem 1rem' }}>
            Customer Portal
          </Link>
          <Link to="/admin" className="btn btn-primary btn-sm" style={{ borderRadius: 'var(--radius-pill)', padding: '0.45rem 1.15rem' }}>
            <span>Enter Workspace</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="welcome-hero">
        <div className="welcome-pill-badge">
          <Zap size={14} />
          <span>Next-Gen Subscription & SaaS Ops Platform</span>
        </div>

        <h1 className="welcome-title">
          Take Command of Enterprise Subscriptions,{' '}
          <span className="welcome-title-accent">Recurring Billing & Renewals</span>
        </h1>

        <p className="welcome-desc">
          Unified software intelligence engineered like Zylo & Zluri. Automate recurring billing cycles, eliminate seat wastage, enforce contract renewals, and freeze financial snapshots with Banker's Rounding precision.
        </p>

        <div className="welcome-cta-group">
          <Link to="/admin" className="btn-welcome-primary">
            <span>Launch Admin Workspace</span>
            <ArrowRight size={18} />
          </Link>

          <Link to="/customer" className="btn-welcome-secondary">
            <ExternalLink size={16} />
            <span>Customer Portal Access</span>
          </Link>

          <Link to="/admin/subscriptions" className="btn-welcome-secondary">
            <Repeat size={16} color="var(--accent-primary)" />
            <span>Manage Subscriptions</span>
          </Link>
        </div>

        {/* Quick Role Simulation Switcher directly on the Welcome Page */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          padding: '0.65rem 1.25rem',
          borderRadius: 'var(--radius-pill)',
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          fontSize: '0.8rem',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <span style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>Quick Interactive Role:</span>
          <button
            onClick={() => handleQuickRole('admin', '/admin')}
            className="btn btn-sm btn-ghost"
            style={{ color: 'var(--accent-primary)', fontWeight: '700' }}
          >
            ● Administrator
          </button>
          <span style={{ color: 'var(--border-color)' }}>|</span>
          <button
            onClick={() => handleQuickRole('finance', '/finance/dashboard')}
            className="btn btn-sm btn-ghost"
            style={{ color: 'var(--accent-green)', fontWeight: '700' }}
          >
            ● Finance Lead
          </button>
          <span style={{ color: 'var(--border-color)' }}>|</span>
          <button
            onClick={() => handleQuickRole('staff', '/admin')}
            className="btn btn-sm btn-ghost"
            style={{ color: 'var(--accent-purple)', fontWeight: '700' }}
          >
            ● Operations Staff
          </button>
          <span style={{ color: 'var(--border-color)' }}>|</span>
          <button
            onClick={() => handleQuickRole('customer', '/customer')}
            className="btn btn-sm btn-ghost"
            style={{ color: 'var(--accent-blue)', fontWeight: '700' }}
          >
            ● Customer Portal
          </button>
        </div>
      </main>

      {/* Metrics Counter Strip */}
      <section className="welcome-metrics-strip">
        <div className="welcome-metric-item">
          <span className="welcome-metric-num" style={{ color: 'var(--accent-primary)' }}>$24,780.00</span>
          <span className="welcome-metric-label">Tracked Monthly Recurring Revenue (MRR)</span>
        </div>
        <div className="welcome-metric-item">
          <span className="welcome-metric-num" style={{ color: 'var(--accent-green)' }}>98.2%</span>
          <span className="welcome-metric-label">Collection Rate with Zero Write-Offs</span>
        </div>
        <div className="welcome-metric-item">
          <span className="welcome-metric-num" style={{ color: 'var(--accent-purple)' }}>35.1ms</span>
          <span className="welcome-metric-label">Financial Aggregation API SLA</span>
        </div>
        <div className="welcome-metric-item">
          <span className="welcome-metric-num" style={{ color: 'var(--accent-amber)' }}>100%</span>
          <span className="welcome-metric-label">Certified Banker's Rounding Accuracy</span>
        </div>
      </section>

      {/* Feature Pillars (Zylo & Zluri Core Capabilities) */}
      <section className="welcome-features-section" id="features">
        <div className="features-header">
          <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-primary)', marginBottom: '0.4rem' }}>
            Enterprise Architecture
          </div>
          <h2 style={{ fontSize: '2.25rem', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Engineered for High-Growth SaaS Operations
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '0.5rem', maxWidth: '620px', margin: '0.5rem auto 0' }}>
            Comprehensive recurring billing and subscription lifecycle management designed for accuracy, speed, and governance.
          </p>
        </div>

        <div className="features-grid">
          {/* Pillar 1 */}
          <div className="feature-box">
            <div className="feature-box-icon" style={{ backgroundColor: 'rgba(242, 140, 69, 0.15)', color: 'var(--accent-primary)' }}>
              <Zap size={22} />
            </div>
            <h3 className="feature-box-title">Automated Recurring Billing Engine</h3>
            <p className="feature-box-desc">
              Execute recurring billing runs across daily, monthly, and yearly cycles. Automatically creates immutable invoices and synchronizes billing dates.
            </p>
            <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', fontWeight: '700', color: 'var(--accent-primary)', marginTop: 'auto' }}>
              <span>View Billing Engine</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          {/* Pillar 2 */}
          <div className="feature-box">
            <div className="feature-box-icon" style={{ backgroundColor: 'rgba(233, 172, 75, 0.15)', color: 'var(--accent-amber)' }}>
              <Calendar size={22} />
            </div>
            <h3 className="feature-box-title">Contract Renewal Urgency Radar</h3>
            <p className="feature-box-desc">
              Real-time radar tracking upcoming 30, 60, and 90-day renewal milestones. Enforce notice periods and auto-renew toggle governance.
            </p>
            <Link to="/admin/calendar" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', fontWeight: '700', color: 'var(--accent-amber)', marginTop: 'auto' }}>
              <span>Open Renewal Calendar</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          {/* Pillar 3 */}
          <div className="feature-box">
            <div className="feature-box-icon" style={{ backgroundColor: 'rgba(50, 182, 122, 0.15)', color: 'var(--accent-green)' }}>
              <ShieldCheck size={22} />
            </div>
            <h3 className="feature-box-title">Frozen Financial Snapshot Immutability</h3>
            <p className="feature-box-desc">
              Confirmed invoices lock tax, discount, and line items into certified snapshots. Supports instant printable PDF document generation.
            </p>
            <Link to="/admin/invoices" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', fontWeight: '700', color: 'var(--accent-green)', marginTop: 'auto' }}>
              <span>Inspect Invoices</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          {/* Pillar 4 */}
          <div className="feature-box">
            <div className="feature-box-icon" style={{ backgroundColor: 'rgba(139, 124, 246, 0.15)', color: 'var(--accent-purple)' }}>
              <Repeat size={22} />
            </div>
            <h3 className="feature-box-title">State Machine Subscription Lifecycle</h3>
            <p className="feature-box-desc">
              Deterministic state transitions: Quotation → Confirmed → Active → Paused → Closed. Audit-logged with rollback prevention.
            </p>
            <Link to="/admin/subscriptions" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', fontWeight: '700', color: 'var(--accent-purple)', marginTop: 'auto' }}>
              <span>Explore Subscriptions</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          {/* Pillar 5 */}
          <div className="feature-box">
            <div className="feature-box-icon" style={{ backgroundColor: 'rgba(56, 189, 248, 0.15)', color: 'var(--accent-blue)' }}>
              <TrendingUp size={22} />
            </div>
            <h3 className="feature-box-title">Executive SaaS Spend Intelligence</h3>
            <p className="feature-box-desc">
              Interactive breakdowns by business department: Cloud Infrastructure, CRM, Collaboration, and Security with seat optimization flags.
            </p>
            <Link to="/admin/analytics" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', fontWeight: '700', color: 'var(--accent-blue)', marginTop: 'auto' }}>
              <span>View Spend Analytics</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          {/* Pillar 6 */}
          <div className="feature-box">
            <div className="feature-box-icon" style={{ backgroundColor: 'rgba(242, 140, 69, 0.15)', color: 'var(--accent-primary)' }}>
              <Users size={22} />
            </div>
            <h3 className="feature-box-title">Customer Self-Service Billing Portal</h3>
            <p className="feature-box-desc">
              Dedicated client portal enabling self-service invoice inspection, payment method management, and plan upgrades.
            </p>
            <Link to="/customer" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', fontWeight: '700', color: 'var(--accent-primary)', marginTop: 'auto' }}>
              <span>Open Customer Portal</span>
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="welcome-footer">
        <div className="welcome-footer-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="brand-icon" style={{ width: '28px', height: '28px', borderRadius: '7px' }}>
              <Layers size={16} />
            </div>
            <span style={{ fontWeight: '700', color: '#FFFFFF', fontSize: '0.95rem' }}>
              Bright<span style={{ color: 'var(--accent-primary)' }}>Loop</span>
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginLeft: '0.5rem' }}>
              Enterprise SaaS Management Platform v2.4.0
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            <Link to="/admin" style={{ color: 'inherit' }}>Admin Workspace</Link>
            <Link to="/customer" style={{ color: 'inherit' }}>Customer Portal</Link>
            <Link to="/admin/audit" style={{ color: 'inherit' }}>Audit Ledger</Link>
            <Link to="/admin/settings" style={{ color: 'inherit' }}>Settings</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WelcomeHome;
