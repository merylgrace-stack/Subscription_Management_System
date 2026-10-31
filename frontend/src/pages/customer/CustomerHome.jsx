import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  RotateCcw,
  Receipt,
  CreditCard,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import '../../styles/home.css';

const CustomerHome = () => {
  const [metrics] = useState({
    activeSubscriptions: '2 Active Plans',
    outstandingBalance: '$0.00',
    totalPayments: '$14,250',
  });

  return (
    <div className="home-page">
      {/* Welcome Hero */}
      <section className="home-hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome back,{' '}
            <span className="hero-name">Acme Corp!</span>
            <span className="hero-wave" role="img" aria-label="wave">👋</span>
          </h1>

          <p className="hero-subtitle">
            Manage your subscriptions, invoices and payments in one secure portal.
          </p>

          <Link to="/customer/subscriptions" className="hero-cta-btn">
            <span>Explore My Subscriptions</span>
            <ArrowRight size={18} className="hero-cta-arrow" />
          </Link>
        </div>

        {/* Subtle Customer Visual */}
        <div className="hero-visual-wrapper">
          <div className="isometric-composition">
            <div className="orbit-ring" style={{ borderColor: 'rgba(56, 189, 248, 0.4)' }} />
            <div className="sparkle-dot sparkle-1" style={{ backgroundColor: 'var(--accent-blue)' }} />

            <div className="floating-badge badge-users" style={{ color: 'var(--accent-blue)', borderColor: 'rgba(56, 189, 248, 0.3)' }}>
              <ShieldCheck size={18} />
            </div>

            <div className="iso-main-card" style={{ borderTopColor: 'rgba(56, 189, 248, 0.4)' }}>
              <div className="iso-trend-arrow" style={{ color: 'var(--accent-blue)' }}>
                <Zap size={28} />
              </div>
              <div className="iso-chart-bars">
                <div className="chart-bar bar-1" style={{ background: 'linear-gradient(180deg, #38BDF8 0%, rgba(56, 189, 248, 0.2) 100%)' }} />
                <div className="chart-bar bar-2" style={{ background: 'linear-gradient(180deg, #38BDF8 0%, rgba(56, 189, 248, 0.2) 100%)' }} />
                <div className="chart-bar bar-3" style={{ background: 'linear-gradient(180deg, #38BDF8 0%, rgba(56, 189, 248, 0.2) 100%)' }} />
                <div className="chart-bar bar-4" style={{ background: 'linear-gradient(180deg, #38BDF8 0%, rgba(56, 189, 248, 0.2) 100%)' }} />
                <div className="chart-bar bar-5" style={{ background: 'linear-gradient(180deg, #38BDF8 0%, rgba(56, 189, 248, 0.2) 100%)' }} />
              </div>
            </div>

            <div className="floating-badge badge-card-chip">
              <CreditCard size={18} />
            </div>
          </div>
        </div>
      </section>

      {/* Three Compact Customer Overview Cards */}
      <section className="home-overview-grid">
        {/* 1. Active Subscriptions */}
        <div className="overview-metric-card">
          <div className="card-left">
            <div className="metric-icon-box icon-box-orange">
              <RotateCcw size={24} strokeWidth={2.2} />
            </div>
            <div className="metric-details">
              <div className="metric-value">{metrics.activeSubscriptions}</div>
              <div className="metric-title">Active Subscriptions</div>
              <div className="metric-trend trend-positive">
                <span>All Services Operational</span>
              </div>
            </div>
          </div>

          <div className="card-right-sparkline">
            <svg viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
              <path d="M 5 20 Q 50 10, 95 20" stroke="#F28C45" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* 2. Outstanding Balance */}
        <div className="overview-metric-card">
          <div className="card-left">
            <div className="metric-icon-box icon-box-green">
              <Receipt size={24} strokeWidth={2.2} />
            </div>
            <div className="metric-details">
              <div className="metric-value">{metrics.outstandingBalance}</div>
              <div className="metric-title">Outstanding Balance</div>
              <div className="metric-trend trend-positive" style={{ color: 'var(--accent-green)' }}>
                <span>✓ Up to date</span>
              </div>
            </div>
          </div>

          <div className="card-right-sparkline">
            <svg viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
              <path d="M 5 30 L 95 30" stroke="#32B67A" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* 3. Total Payments */}
        <div className="overview-metric-card">
          <div className="card-left">
            <div className="metric-icon-box icon-box-purple">
              <CreditCard size={24} strokeWidth={2.2} />
            </div>
            <div className="metric-details">
              <div className="metric-value">{metrics.totalPayments}</div>
              <div className="metric-title">Lifetime Paid Amount</div>
              <div className="metric-trend trend-positive" style={{ color: 'var(--accent-purple)' }}>
                <span>12 Invoices Settled</span>
              </div>
            </div>
          </div>

          <div className="card-right-sparkline">
            <svg viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
              <path d="M 5 35 Q 35 20, 95 10" stroke="#8B7CF6" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </section>

      {/* Small Interactive Detail */}
      <div
        className="scroll-indicator-container"
        onClick={() => window.scrollBy({ top: 150, behavior: 'smooth' })}
        style={{ cursor: 'pointer' }}
      >
        <div className="mouse-icon">
          <div className="mouse-wheel-dot" />
        </div>
        <span>Scroll to view services</span>
      </div>
    </div>
  );
};

export default CustomerHome;
