import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  User,
  LogOut,
  Shield,
  Briefcase,
  DollarSign,
  ExternalLink,
  Layers,
  Zap,
  CheckCircle2,
  Command,
  Clock,
  AlertTriangle,
  X,
  CreditCard,
  FileCheck,
  Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const TopNavbar = ({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) => {
  const { user, switchRole, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchPaletteOpen, setSearchPaletteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMsg, setToastMsg] = useState(null);
  const [unreadCount, setUnreadCount] = useState(3);

  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Notifications List
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Billing Cycle Execution',
      desc: 'Automated recurring billing cycle processed 4 due subscriptions with 0 errors.',
      time: '12m ago',
      type: 'billing',
      isUnread: true,
      link: '/admin/invoices'
    },
    {
      id: 2,
      title: 'Contract Renewal Deadline',
      desc: 'Salesforce Enterprise edition contract renewal in 12 days ($14,400 commitment).',
      time: '1h ago',
      type: 'alert',
      isUnread: true,
      link: '/admin/calendar'
    },
    {
      id: 3,
      title: 'Payment Reconciled via Stripe',
      desc: 'Wire transfer TXN-ACME-PAID-01 ($1,936.00) automatically matched with INV-2026-001.',
      time: '3h ago',
      type: 'payment',
      isUnread: true,
      link: '/admin/payments'
    },
    {
      id: 4,
      title: 'Snapshot Certified',
      desc: 'Immutable snapshot frozen for customer Acme Global Corp with certified Banker’s rounding.',
      time: '6h ago',
      type: 'security',
      isUnread: false,
      link: '/admin/audit'
    }
  ]);

  // Quick Search Index
  const searchableItems = [
    { name: 'Salesforce Enterprise', type: 'Subscription', link: '/admin/subscriptions', badge: '$14.4k/yr' },
    { name: 'AWS Cloud Infrastructure', type: 'Subscription', link: '/admin/subscriptions', badge: '$1.9k/mo' },
    { name: 'Acme Global Corp', type: 'Customer', link: '/admin/customers', badge: 'Active' },
    { name: 'TechVanguard Inc', type: 'Customer', link: '/admin/customers', badge: 'Active' },
    { name: 'INV-2026-001 (Acme Global)', type: 'Invoice', link: '/admin/invoices', badge: 'Paid' },
    { name: 'INV-2026-002 (TechVanguard)', type: 'Invoice', link: '/admin/invoices', badge: 'Confirmed' },
    { name: 'Financial Overview & KPI Cockpit', type: 'Finance', link: '/finance/dashboard', badge: 'Ops' },
    { name: 'Renewal Calendar & Milestones', type: 'Calendar', link: '/admin/calendar', badge: 'Milestones' },
    { name: 'Customer Self-Service Portal', type: 'Portal', link: '/customer', badge: 'Client' },
  ];

  const searchResults = searchableItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close popovers on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchPaletteOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const showToast = (text) => {
    setToastMsg(text);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isUnread: false })));
    setUnreadCount(0);
    showToast('All notifications marked as read.');
  };

  const handleNotificationClick = (notif) => {
    setNotifications(notifications.map(n => n.id === notif.id ? { ...n, isUnread: false } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
    setNotificationsOpen(false);
    showToast(`Notification acknowledged: ${notif.title}`);
    if (notif.link) navigate(notif.link);
  };

  const handleRoleChange = (newRole) => {
    switchRole(newRole);
    setDropdownOpen(false);
    showToast(`Switched active workspace role to ${getRoleDisplayName(newRole)}.`);
    if (newRole === 'customer') {
      navigate('/customer');
    } else {
      navigate('/admin');
    }
  };

  const getRoleDisplayName = (r) => {
    if (r === 'admin') return 'Admin';
    if (r === 'staff') return 'Staff';
    if (r === 'finance') return 'Finance Lead';
    if (r === 'customer') return 'Customer';
    return 'User';
  };

  const getPageTitle = () => {
    const p = location.pathname;
    if (p === '/admin' || p === '/admin/') return 'Command Center';
    if (p.includes('/customers')) return 'Customer Accounts';
    if (p.includes('/products')) return 'Product Catalog';
    if (p.includes('/plans')) return 'Subscription Plans';
    if (p.includes('/quotations')) return 'Sales Quotations';
    if (p.includes('/subscriptions')) return 'Active Subscriptions';
    if (p.includes('/invoices')) return 'Billing Invoices';
    if (p.includes('/payments')) return 'Payment Reconciliation';
    if (p.includes('/discounts-taxes')) return 'Tax & Discount Rules';
    if (p.includes('/finance')) return 'Finance Operations';
    if (p.includes('/analytics')) return 'SaaS Analytics';
    if (p.includes('/calendar')) return 'Renewal Calendar';
    if (p.includes('/audit')) return 'Audit & Security Trail';
    if (p.includes('/notifications')) return 'Notification Center';
    return 'Workspace';
  };

  return (
    <header className="app-topbar">
      {/* Toast Notification Banner */}
      {toastMsg && (
        <div className="toast-notification" style={{ top: '80px', bottom: 'auto' }}>
          <CheckCircle2 size={18} color="var(--accent-green)" />
          <span style={{ fontSize: '0.82rem', color: 'var(--text-primary)', fontWeight: '600' }}>
            {toastMsg}
          </span>
        </div>
      )}

      <div className="topbar-left">
        {/* Toggle Button */}
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

        {/* Section Context / Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <Link to="/" style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '600', textDecoration: 'none' }} title="Visit Welcome Homepage">
            BrightLoop
          </Link>
          <span style={{ color: 'var(--border-color)', fontSize: '0.75rem' }}>/</span>
          <span style={{ fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: '700' }}>
            {getPageTitle()}
          </span>
        </div>

        {/* Global Search Bar with keyboard shortcut badge */}
        <div className="search-bar-container" style={{ maxWidth: '340px', marginLeft: '0.5rem', position: 'relative' }} ref={searchRef}>
          <Search size={15} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search contracts, vendors, invoices..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSearchPaletteOpen(true);
            }}
            onFocus={() => setSearchPaletteOpen(true)}
          />
          <div
            onClick={() => setSearchPaletteOpen(!searchPaletteOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '0.68rem',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
              cursor: 'pointer'
            }}
          >
            <Command size={10} />
            <span>K</span>
          </div>

          {/* Search Results Dropdown Palette */}
          {searchPaletteOpen && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              left: 0,
              right: 0,
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              zIndex: 400,
              overflow: 'hidden'
            }}>
              <div style={{ padding: '0.5rem 0.75rem', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700', borderBottom: '1px solid var(--border-color)' }}>
                {searchQuery ? `Results for "${searchQuery}"` : 'Quick Navigation'}
              </div>
              <div style={{ maxHeight: '240px', overflowY: 'auto' }}>
                {searchResults.slice(0, 6).map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setSearchPaletteOpen(false);
                      setSearchQuery('');
                      navigate(item.link);
                    }}
                    style={{
                      padding: '0.65rem 0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                      cursor: 'pointer',
                      fontSize: '0.82rem',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-elevated)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{item.name}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', backgroundColor: 'var(--bg-secondary)', padding: '2px 6px', borderRadius: '4px' }}>
                      {item.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="topbar-right" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Live Billing Engine Status Pill */}
        <div
          onClick={() => showToast('Billing Engine is synchronized: Next scheduled run tomorrow at 00:00 UTC')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            backgroundColor: 'rgba(50, 182, 122, 0.1)',
            border: '1px solid rgba(50, 182, 122, 0.25)',
            padding: '0.35rem 0.75rem',
            borderRadius: 'var(--radius-pill)',
            fontSize: '0.75rem',
            color: 'var(--accent-green)',
            fontWeight: '600',
            cursor: 'pointer'
          }}
          title="Click to check engine status"
        >
          <span className="status-dot-pulse" style={{ width: '6px', height: '6px' }} />
          <span>Billing Engine: Live</span>
        </div>

        {/* Notifications Bell with Interactive Dropdown */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button
            className="icon-btn-badge"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            title="System & Billing Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="badge-pill">{unreadCount}</span>
            )}
          </button>

          {/* Notification Popover */}
          {notificationsOpen && (
            <div className="notifications-popover">
              <div className="notifications-header">
                <span className="notifications-title">
                  <Bell size={15} color="var(--accent-primary)" />
                  Operational Notifications
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    style={{ fontSize: '0.72rem', color: 'var(--accent-primary)', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="notifications-list">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`notification-item ${notif.isUnread ? 'unread' : ''}`}
                    onClick={() => handleNotificationClick(notif)}
                  >
                    <div
                      className="notif-icon-box"
                      style={{
                        backgroundColor: notif.type === 'billing' ? 'rgba(50, 182, 122, 0.15)' :
                                         notif.type === 'alert' ? 'rgba(233, 172, 75, 0.15)' :
                                         notif.type === 'payment' ? 'rgba(139, 124, 246, 0.15)' : 'rgba(242, 140, 69, 0.15)',
                        color: notif.type === 'billing' ? 'var(--accent-green)' :
                               notif.type === 'alert' ? 'var(--accent-amber)' :
                               notif.type === 'payment' ? 'var(--accent-purple)' : 'var(--accent-primary)'
                      }}
                    >
                      {notif.type === 'billing' && <Zap size={15} />}
                      {notif.type === 'alert' && <AlertTriangle size={15} />}
                      {notif.type === 'payment' && <DollarSign size={15} />}
                      {notif.type === 'security' && <Shield size={15} />}
                    </div>

                    <div className="notif-content">
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span className="notif-title">{notif.title}</span>
                        {notif.isUnread && (
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)' }} />
                        )}
                      </div>
                      <span className="notif-desc">{notif.desc}</span>
                      <span className="notif-time">{notif.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div
                className="notifications-footer"
                onClick={() => {
                  setNotificationsOpen(false);
                  navigate('/admin/audit');
                }}
              >
                View Full System Audit Trail & Logs →
              </div>
            </div>
          )}
        </div>

        {/* User Profile & Role Switcher Pill */}
        <div className="user-profile-wrapper" ref={dropdownRef}>
          <div
            className="user-profile-menu"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{
              padding: '0.35rem 0.75rem 0.35rem 0.45rem',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-secondary)',
              cursor: 'pointer'
            }}
          >
            <div className="user-avatar-circle" style={{ width: '28px', height: '28px', fontSize: '0.75rem' }}>
              {user?.avatar || 'AD'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: '1.2' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                {user?.name?.split(' ')[0] || 'Alex'}
              </span>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                {getRoleDisplayName(user?.role)}
              </span>
            </div>
            <ChevronDown size={13} className="user-chevron" />
          </div>

          {dropdownOpen && (
            <div className="user-dropdown-popover">
              <div className="dropdown-user-header">
                <div className="dropdown-user-name">{user?.name || 'Administrator'}</div>
                <div className="dropdown-user-email">{user?.email || 'admin@brightloop.io'}</div>
                <div style={{ marginTop: '0.25rem', fontSize: '0.72rem', color: 'var(--accent-primary)', fontWeight: '600' }}>
                  Active Role: {getRoleDisplayName(user?.role)}
                </div>
              </div>

              <div style={{ padding: '0.35rem 0.75rem', fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.05em' }}>
                Simulate Role
              </div>

              <div
                className="dropdown-item"
                onClick={() => handleRoleChange('admin')}
              >
                <Shield size={14} color="var(--accent-primary)" />
                <span>Admin View</span>
              </div>

              <div
                className="dropdown-item"
                onClick={() => handleRoleChange('staff')}
              >
                <Briefcase size={14} color="var(--accent-purple)" />
                <span>Staff View</span>
              </div>

              <div
                className="dropdown-item"
                onClick={() => handleRoleChange('finance')}
              >
                <DollarSign size={14} color="var(--accent-green)" />
                <span>Finance Lead View</span>
              </div>

              <div
                className="dropdown-item"
                onClick={() => handleRoleChange('customer')}
              >
                <ExternalLink size={14} color="var(--accent-blue)" />
                <span>Customer Portal</span>
              </div>

              <div style={{ height: '1px', background: 'var(--border-color)', margin: '0.35rem 0' }} />

              <div
                className="dropdown-item"
                onClick={() => {
                  setDropdownOpen(false);
                  navigate('/');
                }}
              >
                <Layers size={14} />
                <span>Welcome Homepage</span>
              </div>

              <div
                className="dropdown-item"
                onClick={() => {
                  setDropdownOpen(false);
                  navigate('/admin/settings');
                }}
              >
                <User size={14} />
                <span>Company Settings</span>
              </div>

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
  );
};

export default TopNavbar;
