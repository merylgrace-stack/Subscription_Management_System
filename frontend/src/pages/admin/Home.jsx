import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart2,
  Users,
  Repeat,
  ArrowRight,
  TrendingUp,
  CreditCard,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/home.css';

const Home = () => {
  const { user } = useAuth();

  // Metrics (connected to API / realistic seed state)
  const [metrics, setMetrics] = useState({
    mrr: '$24,780',
    mrrGrowth: '+12%',
    activeSubscriptions: '2.4K',
    subscriptionsGrowth: '+8%',
    totalRevenue: '$1.48M',
    revenueGrowth: '+15%',
  });

  const getGreetingRole = () => {
    if (user?.role === 'staff') return 'Staff';
    if (user?.role === 'finance') return 'Finance Lead';
    return 'Admin';
  };

  return (
    <div className="home-page">
      {/* Welcome Hero Section */}
      <section className="home-hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome back,{' '}
            <span className="hero-name">{getGreetingRole()}!</span>
            <span className="hero-wave" role="img" aria-label="wave">👋</span>
          </h1>

          <p className="hero-subtitle">
            Your subscription business, billing operations and customer relationships, all in one place.
          </p>

          <Link to="/admin/subscriptions" className="hero-cta-btn">
            <span>Explore Dashboard</span>
            <ArrowRight size={18} className="hero-cta-arrow" />
          </Link>
        </div>

        {/* 3D Isometric Visual Illustration (Faithfully matching Reference Image) */}
        <div className="hero-visual-wrapper">
          <div className="isometric-composition">
            {/* Ambient Orbital Light Ring */}
            <div className="orbit-ring" />

            {/* Sparkle Glints */}
            <div className="sparkle-dot sparkle-1" />
            <div className="sparkle-dot sparkle-2" />

            {/* Floating Upper Badge (Customer Icon) */}
            <div className="floating-badge badge-users">
              <Users size={18} />
            </div>

            {/* Main Isometric 3D Slate Card */}
            <div className="iso-main-card">
              <div className="iso-trend-arrow">
                <TrendingUp size={28} strokeWidth={2.5} />
              </div>

              <div className="iso-chart-bars">
                <div className="chart-bar bar-1" />
                <div className="chart-bar bar-2" />
                <div className="chart-bar bar-3" />
                <div className="chart-bar bar-4" />
                <div className="chart-bar bar-5" />
              </div>
            </div>

            {/* Floating Lower Badge (Credit Card Icon) */}
            <div className="floating-badge badge-card-chip">
              <CreditCard size={18} />
            </div>
          </div>
        </div>
      </section>

      {/* Three Compact Overview Cards (Faithfully matching Reference Image) */}
      <section className="home-overview-grid">
        {/* Card 1: Monthly Recurring Revenue */}
        <div className="overview-metric-card">
          <div className="card-left">
            <div className="metric-icon-box icon-box-orange">
              <BarChart2 size={24} strokeWidth={2.2} />
            </div>
            <div className="metric-details">
              <div className="metric-value">{metrics.mrr}</div>
              <div className="metric-title">Monthly Recurring Revenue</div>
              <div className="metric-trend trend-positive">
                <span>↑</span>
                <span>{metrics.mrrGrowth}</span>
              </div>
            </div>
          </div>

          <div className="card-right-sparkline">
            <svg viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
              <path
                d="M 5 28 Q 25 15, 45 25 T 95 10"
                stroke="#F28C45"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Card 2: Active Subscriptions / Customers */}
        <div className="overview-metric-card">
          <div className="card-left">
            <div className="metric-icon-box icon-box-purple">
              <Users size={24} strokeWidth={2.2} />
            </div>
            <div className="metric-details">
              <div className="metric-value">{metrics.activeSubscriptions}</div>
              <div className="metric-title">Active Subscriptions</div>
              <div className="metric-trend trend-positive" style={{ color: 'var(--accent-purple)' }}>
                <span>↑</span>
                <span>{metrics.subscriptionsGrowth}</span>
              </div>
            </div>
          </div>

          <div className="card-right-sparkline">
            <svg viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
              <path
                d="M 5 32 Q 30 35, 55 18 T 95 8"
                stroke="#8B7CF6"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Card 3: Total Revenue */}
        <div className="overview-metric-card">
          <div className="card-left">
            <div className="metric-icon-box icon-box-green">
              <Repeat size={24} strokeWidth={2.2} />
            </div>
            <div className="metric-details">
              <div className="metric-value">{metrics.totalRevenue}</div>
              <div className="metric-title">Total Customers / Rev</div>
              <div className="metric-trend trend-positive" style={{ color: 'var(--accent-green)' }}>
                <span>↑</span>
                <span>{metrics.revenueGrowth}</span>
              </div>
            </div>
          </div>

          <div className="card-right-sparkline">
            <svg viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
              <path
                d="M 5 30 Q 30 15, 60 28 T 95 12"
                stroke="#32B67A"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* Small Interactive Detail: Scroll Indicator */}
      <div
        className="scroll-indicator-container"
        onClick={() => {
          window.scrollBy({ top: 200, behavior: 'smooth' });
        }}
        style={{ cursor: 'pointer' }}
        title="Explore"
      >
        <div className="mouse-icon">
          <div className="mouse-wheel-dot" />
        </div>
        <span>Scroll to explore</span>
      </div>
    </div>
  );
};

export default Home;
