import React, { useState, useEffect } from 'react';
import { Users, Plus, Search, Mail, Phone, Building, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { customerService } from '../../services/api';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    company_name: '',
    contact_name: '',
    email: '',
    phone: '',
    billing_address: '',
    tax_id: '',
  });

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await customerService.getAll();
      // Handle both paginated response (.results) and direct array
      const data = res.data?.results || res.data || [];
      setCustomers(data);
    } catch (err) {
      console.error('Failed to fetch customers:', err);
      // Fallback seed display
      setCustomers([
        {
          id: 1,
          customer_code: 'CUST-001',
          company_name: 'Acme Global Corp',
          contact_name: 'John Doe',
          email: 'john@acme.com',
          phone: '+1 (555) 234-5678',
          status: 'ACTIVE',
          active_subscriptions_count: 1,
          outstanding_balance: '0.00',
        },
        {
          id: 2,
          customer_code: 'CUST-002',
          company_name: 'TechVanguard Inc',
          contact_name: 'Elena Rostova',
          email: 'elena@techvanguard.io',
          phone: '+1 (555) 987-6543',
          status: 'ACTIVE',
          active_subscriptions_count: 0,
          outstanding_balance: '1320.00',
        },
        {
          id: 3,
          customer_code: 'CUST-003',
          company_name: 'Nexus Logistics LLC',
          contact_name: 'Marcus Vance',
          email: 'marcus@nexuslogistics.com',
          phone: '+1 (555) 345-6789',
          status: 'ACTIVE',
          active_subscriptions_count: 0,
          outstanding_balance: '0.00',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    try {
      const code = `CUST-${Math.floor(1000 + Math.random() * 9000)}`;
      await customerService.create({
        ...newCustomer,
        customer_code: code,
        status: 'ACTIVE',
      });
      setShowAddModal(false);
      setNewCustomer({ company_name: '', contact_name: '', email: '', phone: '', billing_address: '', tax_id: '' });
      await fetchCustomers();
    } catch (err) {
      let errMsg = err.message;
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          errMsg = err.response.data;
        } else {
          errMsg = Object.entries(err.response.data)
            .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
            .join(' | ');
        }
      }
      alert('Could not save customer: ' + errMsg);
    }
  };

  const filteredCustomers = customers.filter(c =>
    c.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.contact_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.customer_code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-primary)', marginBottom: '0.35rem' }}>
            Business Management
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Users size={26} color="var(--accent-primary)" />
            Customer Management
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Manage client corporate entities, contact personnel, and contract balances.
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={16} />
          <span>Add Customer</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-pill)', padding: '0.5rem 1rem', width: '100%', maxWidth: '360px' }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search by company, contact, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '0.85rem', width: '100%', outline: 'none' }}
          />
        </div>

        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Showing <strong>{filteredCustomers.length}</strong> enterprise accounts
        </div>
      </div>

      {/* Customer Data Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Account Code</th>
              <th>Company & Contact</th>
              <th>Contact Details</th>
              <th>Active Subscriptions</th>
              <th>Outstanding Balance</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((cust) => (
              <tr key={cust.id}>
                <td>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '600', color: 'var(--accent-primary)', background: 'rgba(242, 140, 69, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                    {cust.customer_code}
                  </span>
                </td>
                <td>
                  <div style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                    {cust.company_name}
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
                    Attn: {cust.contact_name}
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                    <Mail size={13} color="var(--text-muted)" />
                    <span>{cust.email}</span>
                  </div>
                  {cust.phone && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.15rem' }}>
                      <Phone size={13} color="var(--text-muted)" />
                      <span>{cust.phone}</span>
                    </div>
                  )}
                </td>
                <td>
                  <span className="badge badge-confirmed">
                    {cust.active_subscriptions_count || 0} Active
                  </span>
                </td>
                <td>
                  <span style={{ fontWeight: '700', color: Number(cust.outstanding_balance) > 0 ? 'var(--accent-amber)' : 'var(--accent-green)' }}>
                    ${Number(cust.outstanding_balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </td>
                <td>
                  <span className={`badge ${cust.status === 'ACTIVE' ? 'badge-active' : 'badge-danger'}`}>
                    {cust.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px', padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                Add New Enterprise Customer
              </h3>
              <button onClick={() => setShowAddModal(false)} style={{ color: 'var(--text-secondary)', fontSize: '1.25rem' }}>✕</button>
            </div>

            <form onSubmit={handleCreateCustomer}>
              <div className="form-group">
                <label className="form-label">Company Name *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  value={newCustomer.company_name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, company_name: e.target.value })}
                  placeholder="e.g. Acme Corporation"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Primary Contact *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    value={newCustomer.contact_name}
                    onChange={(e) => setNewCustomer({ ...newCustomer, contact_name: e.target.value })}
                    placeholder="e.g. Jane Miller"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    required
                    className="form-control"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                    placeholder="e.g. contact@acme.com"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Tax ID / VAT</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newCustomer.tax_id}
                    onChange={(e) => setNewCustomer({ ...newCustomer, tax_id: e.target.value })}
                    placeholder="US-12-3456789"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Billing Address</label>
                <textarea
                  rows="2"
                  className="form-control"
                  value={newCustomer.billing_address}
                  onChange={(e) => setNewCustomer({ ...newCustomer, billing_address: e.target.value })}
                  placeholder="Street, Suite, City, State, ZIP, Country"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Customer Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
