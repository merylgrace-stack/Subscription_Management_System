import React, { useState, useRef, useEffect } from 'react';
import { Menu, Search, Bell, ChevronDown, User, LogOut, Shield, Briefcase, DollarSign, ExternalLink, Layers } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const TopNavbar = ({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) => {
  const { user, switchRole, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRoleChange = (newRole) => {
    switchRole(newRole);
    setDropdownOpen(false);
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

  return (
    <header className="app-topbar">
      <div className="topbar-left">
        <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginRight: '0.75rem', textDecoration: 'none' }}>
          <div className="brand-icon" style={{ width: '32px', height: '32px', minWidth: '32px', borderRadius: '8px' }}>
            <Layers size={18} strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: '1.15rem', fontWeight: '800', letterSpacing: '-0.02em', color: '#FFFFFF' }}>
            Bright<span style={{ color: 'var(--accent-primary)' }}>Loop</span>
          </span>
        </Link>

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

        <div className="search-bar-container">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search anything (subscriptions, customers, invoices)..."
          />
        </div>
      </div>

      <div className="topbar-right">
        {/* Notifications */}
        <button
          className="icon-btn-badge"
          onClick={() => navigate('/admin/notifications')}
          title="Notifications"
        >
          <Bell size={18} />
          {user?.unreadNotifications > 0 && (
            <span className="badge-pill">{user.unreadNotifications}</span>
          )}
        </button>

        {/* User Profile Pill */}
        <div className="user-profile-wrapper" ref={dropdownRef}>
          <div
            className="user-profile-menu"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className="user-avatar-circle">
              {user?.avatar || 'AD'}
            </div>
            <span className="user-role-label">{getRoleDisplayName(user?.role)}</span>
            <ChevronDown size={14} className="user-chevron" />
          </div>

          {dropdownOpen && (
            <div className="user-dropdown-popover">
              <div className="dropdown-user-header">
                <div className="dropdown-user-name">{user?.name || 'Administrator'}</div>
                <div className="dropdown-user-email">{user?.email || 'admin@brightloop.io'}</div>
              </div>

              <div style={{ padding: '0.25rem 0.75rem', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>
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

              <div style={{ height: '1px', background: 'var(--border-color)', margin: '0.25rem 0' }} />

              <div
                className="dropdown-item"
                onClick={() => {
                  setDropdownOpen(false);
                  navigate('/admin/settings');
                }}
              >
                <User size={14} />
                <span>Profile Settings</span>
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
