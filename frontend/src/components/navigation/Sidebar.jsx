import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  Layers,
  Home,
  Users,
  Box,
  CreditCard,
  FileText,
  Calendar,
  DollarSign,
  TrendingUp,
  FileCheck,
  Tag,
  Percent,
  BarChart3,
  FileSpreadsheet,
  Bell,
  History,
  UserCheck,
  ShieldAlert,
  Settings,
  Crown,
  ArrowRight,
  Receipt,
  RotateCcw,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ collapsed, mobileOpen, setMobileOpen }) => {
  const { user } = useAuth();
  const role = user?.role || 'admin';

  // Navigation structure based on Part 1.2
  const adminNavGroups = [
    {
      title: 'Overview',
      items: [
        { name: 'Home', path: '/admin', icon: Home, exact: true },
      ],
    },
    {
      title: 'Business Management',
      items: [
        { name: 'Customers', path: '/admin/customers', icon: Users },
        { name: 'Products & Variants', path: '/admin/products', icon: Box },
        { name: 'Subscription Plans', path: '/admin/plans', icon: CreditCard },
        { name: 'Quotations', path: '/admin/quotations', icon: FileCheck },
        { name: 'Subscriptions', path: '/admin/subscriptions', icon: RotateCcw },
      ],
    },
    {
      title: 'Billing & Finance',
      items: [
        { name: 'Invoices', path: '/admin/invoices', icon: Receipt },
        { name: 'Payments', path: '/admin/payments', icon: DollarSign },
        { name: 'Discounts & Taxes', path: '/admin/discounts-taxes', icon: Percent },
        { name: 'Financial Overview', path: '/finance/dashboard', icon: TrendingUp },
      ],
    },
    {
      title: 'Insights',
      items: [
        { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
        { name: 'Reports', path: '/admin/reports', icon: FileSpreadsheet },
      ],
    },
    {
      title: 'Operations',
      items: [
        { name: 'Operational Calendar', path: '/admin/calendar', icon: Calendar },
        { name: 'Notifications', path: '/admin/notifications', icon: Bell, badge: 3 },
        { name: 'Audit History', path: '/admin/audit', icon: History },
      ],
    },
    {
      title: 'Administration',
      items: [
        { name: 'Staff Management', path: '/admin/staff', icon: UserCheck },
        { name: 'Roles & Permissions', path: '/admin/roles', icon: ShieldAlert },
        { name: 'Company Settings', path: '/admin/settings', icon: Settings },
      ],
    },
  ];

  // Staff nav groups
  const staffNavGroups = [
    {
      title: 'Overview',
      items: [{ name: 'Home', path: '/admin', icon: Home }],
    },
    {
      title: 'Business Operations',
      items: [
        { name: 'Customers', path: '/admin/customers', icon: Users },
        { name: 'Quotations', path: '/admin/quotations', icon: FileCheck },
        { name: 'Subscriptions', path: '/admin/subscriptions', icon: RotateCcw },
        { name: 'Invoices', path: '/admin/invoices', icon: Receipt },
        { name: 'Payments', path: '/admin/payments', icon: DollarSign },
      ],
    },
    {
      title: 'Tasks & Calendar',
      items: [
        { name: 'Operational Calendar', path: '/admin/calendar', icon: Calendar },
        { name: 'Notifications', path: '/admin/notifications', icon: Bell },
      ],
    },
  ];

  // Finance lead nav groups
  const financeNavGroups = [
    {
      title: 'Overview',
      items: [{ name: 'Home', path: '/admin', icon: Home }],
    },
    {
      title: 'Financial Operations',
      items: [
        { name: 'Finance Dashboard', path: '/finance/dashboard', icon: TrendingUp },
        { name: 'Invoices', path: '/admin/invoices', icon: Receipt },
        { name: 'Overdue Invoices', path: '/finance/overdue', icon: ShieldAlert },
        { name: 'Payments', path: '/admin/payments', icon: DollarSign },
        { name: 'Reconciliation', path: '/finance/reconciliation', icon: RotateCcw },
      ],
    },
    {
      title: 'Analytics & Audit',
      items: [
        { name: 'Revenue Reports', path: '/admin/reports', icon: FileSpreadsheet },
        { name: 'Financial Audit', path: '/admin/audit', icon: History },
      ],
    },
  ];

  let currentNavGroups = adminNavGroups;
  if (role === 'staff') currentNavGroups = staffNavGroups;
  if (role === 'finance') currentNavGroups = financeNavGroups;

  return (
    <aside className={`app-sidebar ${collapsed ? 'sidebar-collapsed' : ''} ${mobileOpen ? 'sidebar-mobile-open' : ''}`}>
      {/* Brand Header */}
      <div className="sidebar-header">
        <Link to="/admin" className="brand-container" onClick={() => setMobileOpen(false)}>
          <div className="brand-icon">
            <Layers size={20} strokeWidth={2.5} />
          </div>
          {!collapsed && (
            <div className="brand-info">
              <span className="brand-name">Bright<span>Loop</span></span>
              <span className="brand-tagline">Subscription Ops</span>
            </div>
          )}
        </Link>
      </div>

      {/* Nav Links */}
      <nav className="sidebar-nav">
        {currentNavGroups.map((group, gIdx) => (
          <div key={gIdx} className="nav-group">
            {!collapsed && <div className="nav-group-title">{group.title}</div>}
            <ul className="nav-links-list">
              {group.items.map((item, iIdx) => {
                const IconComponent = item.icon;
                return (
                  <li key={iIdx}>
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
                      {!collapsed && item.badge && (
                        <span className="nav-badge">{item.badge}</span>
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Reference Image Matching Footer Card ("Upgrade to Pro") */}
      {!collapsed && (
        <div className="sidebar-footer-card">
          <div className="footer-card-header">
            <div className="footer-card-icon">
              <Crown size={16} />
            </div>
            <span className="footer-card-title">Upgrade to Pro</span>
          </div>
          <p className="footer-card-desc">Unlock advanced automated billing & deep analytics.</p>
          <Link to="/admin/plans" className="footer-card-btn">
            <span>Upgrade Now</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
