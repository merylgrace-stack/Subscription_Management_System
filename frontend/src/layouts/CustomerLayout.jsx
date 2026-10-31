import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import {
  Layers,
  Home,
  RotateCcw,
  Receipt,
  DollarSign,
  TrendingUp,
  BarChart2,
  Settings,
  HelpCircle,
  Menu,
  Bell,
  ChevronDown,
  LogOut,
  Shield,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/layouts.css';
import '../styles/components.css';

const CustomerLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, switchRole, logout } = useAuth();
  const navigate = useNavigate();

  const customerNavItems = [
    { name: 'Portal Home', path: '/customer', icon: Home, exact: true },
    { name: 'My Subscriptions', path: '/customer/subscriptions', icon: RotateCcw },
    { name: 'Subscription Analytics', path: '/customer/analytics', icon: BarChart2 },
    { name: 'Invoices & Billing', path: '/customer/invoices', icon: Receipt },
    { name: 'Payments & History', path: '/customer/payments', icon: DollarSign },
    { name: 'Spending Analytics', path: '/customer/spending', icon: TrendingUp },
    { name: 'Account Settings', path: '/customer/settings', icon: Settings },
    { name: 'Help & Support', path: '/customer/support', icon: HelpCircle },
  ];

  return (
    <div className="app-container">
      {/* Background ambient lighting */}
      <div className="ambient-glow glow-top-right" />
      <div className="ambient-glow glow-bottom-left" />

      {/* Customer Sidebar */}
      <aside className={`app-sidebar ${collapsed ? 'sidebar-collapsed' : ''} ${mobileOpen ? 'sidebar-mobile-open' : ''}`}>
        <div className="sidebar-header">
          <Link to="/customer" className="brand-container" onClick={() => setMobileOpen(false)}>
            <div className="brand-icon">
              <Layers size={20} strokeWidth={2.5} />
            </div>
            {!collapsed && (
              <div className="brand-info">
                <span className="brand-name">Bright<span>Loop</span></span>
                <span className="brand-tagline">Customer Portal</span>
              </div>
            )}
          </Link>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-group">
            {!collapsed && <div className="nav-group-title">Self-Service</div>}
            <ul className="nav-links-list">
              {customerNavItems.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <li key={idx}>
                    <NavLink
                      to={item.path}
                      end={item.exact}
                      className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}
                      onClick={() => setMobileOpen(false)}
                      title={collapsed ? item.name : ''}
                    >
                      <span className="nav-icon">
                        <IconComponent size={18} strokeWidth={2} />
                      </span>
                      {!collapsed && <span className="nav-label">{item.name}</span>}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {!collapsed && (
          <div className="sidebar-footer-card">
            <div className="footer-card-header">
              <div className="footer-card-icon" style={{ background: 'rgba(56, 189, 248, 0.15)', color: 'var(--accent-blue)' }}>
                <HelpCircle size={16} />
              </div>
              <span className="footer-card-title">Need Assistance?</span>
            </div>
            <p className="footer-card-desc">Our dedicated enterprise account team is available 24/7.</p>
            <Link to="/customer/support" className="footer-card-btn" style={{ background: 'linear-gradient(135deg, #38BDF8 0%, #0284C7 100%)', boxShadow: '0 4px 12px rgba(56, 189, 248, 0.25)' }}>
              <span>Contact Support</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        )}
      </aside>

      {/* Main Container */}
      <div className={`app-main ${collapsed ? 'main-collapsed' : ''}`}>
        <header className="app-topbar">
          <div className="topbar-left">
            <button
              className="menu-toggle-btn"
              onClick={() => {
                if (window.innerWidth <= 1024) {
                  setMobileOpen(!mobileOpen);
                } else {
                  setCollapsed(!collapsed);
                }
              }}
              title="Toggle Navigation"
            >
              <Menu size={18} />
            </button>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
              Customer Account: <strong style={{ color: 'var(--text-primary)' }}>Acme Global Corp</strong>
            </span>
          </div>

          <div className="topbar-right">
            <button className="icon-btn-badge" title="Notifications">
              <Bell size={18} />
              <span className="badge-pill">1</span>
            </button>

            <div className="user-profile-wrapper" style={{ position: 'relative' }}>
              <div className="user-profile-menu" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <div className="user-avatar-circle" style={{ background: 'linear-gradient(135deg, #1E293B, #0F172A)', color: 'var(--accent-primary)' }}>
                  AC
                </div>
                <span className="user-role-label">Customer Portal</span>
                <ChevronDown size={14} className="user-chevron" />
              </div>

              {dropdownOpen && (
                <div className="user-dropdown-popover">
                  <div className="dropdown-user-header">
                    <div className="dropdown-user-name">Acme Corp (John Doe)</div>
                    <div className="dropdown-user-email">john@acme.com</div>
                  </div>

                  <div
                    className="dropdown-item"
                    onClick={() => {
                      switchRole('admin');
                      setDropdownOpen(false);
                      navigate('/admin');
                    }}
                  >
                    <Shield size={14} color="var(--accent-primary)" />
                    <span>Return to Admin Console</span>
                  </div>

                  <div style={{ height: '1px', background: 'var(--border-color)', margin: '0.25rem 0' }} />

                  <div
                    className="dropdown-item danger"
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                    }}
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="page-content-wrapper">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CustomerLayout;
