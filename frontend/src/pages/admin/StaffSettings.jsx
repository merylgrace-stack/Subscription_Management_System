import React, { useState } from 'react';
import { UserCheck, Plus, Mail, Shield, User } from 'lucide-react';
import { authService } from '../../services/api';

const StaffSettings = () => {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [newStaff, setNewStaff] = useState({
    email: '',
    first_name: '',
    last_name: '',
    role: 'STAFF',
  });
  const [staffList, setStaffList] = useState([
    { id: 1, name: 'Alex Drake', email: 'admin@brightloop.io', role: 'ADMIN', status: 'Active' },
    { id: 2, name: 'Sarah Connor', email: 'staff@brightloop.io', role: 'STAFF', status: 'Active' },
    { id: 3, name: 'Frank Miller', email: 'finance@brightloop.io', role: 'FINANCE', status: 'Active' },
  ]);

  const handleInvite = async (e) => {
    e.preventDefault();
    try {
      await authService.inviteStaff(newStaff);
      setStaffList([...staffList, {
        id: staffList.length + 1,
        name: `${newStaff.first_name} ${newStaff.last_name}`,
        email: newStaff.email,
        role: newStaff.role,
        status: 'Invited',
      }]);
      setShowInviteModal(false);
      setNewStaff({ email: '', first_name: '', last_name: '', role: 'STAFF' });
      alert(`Invitation sent to ${newStaff.email}`);
    } catch (err) {
      alert('Error sending invitation: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-primary)', marginBottom: '0.35rem' }}>
            Administration
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <UserCheck size={26} color="var(--accent-primary)" />
            Staff Management & Onboarding
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Admin-only personnel invitations, role assignments (Staff, Finance Lead), and RBAC access permissions.
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setShowInviteModal(true)}>
          <Plus size={16} />
          <span>Invite New Staff</span>
        </button>
      </div>

      {/* Staff Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Personnel</th>
              <th>Email</th>
              <th>Assigned Role</th>
              <th>Account Status</th>
            </tr>
          </thead>
          <tbody>
            {staffList.map((st) => (
              <tr key={st.id}>
                <td style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{st.name}</td>
                <td>{st.email}</td>
                <td>
                  <span className={`badge ${st.role === 'ADMIN' ? 'badge-confirmed' : st.role === 'FINANCE' ? 'badge-active' : 'badge-draft'}`}>
                    {st.role}
                  </span>
                </td>
                <td>
                  <span className="badge badge-active">{st.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="modal-overlay" onClick={() => setShowInviteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
              Invite Internal Staff Member
            </h3>

            <form onSubmit={handleInvite}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    value={newStaff.first_name}
                    onChange={(e) => setNewStaff({ ...newStaff, first_name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    value={newStaff.last_name}
                    onChange={(e) => setNewStaff({ ...newStaff, last_name: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Corporate Email</label>
                <input
                  type="email"
                  required
                  className="form-control"
                  value={newStaff.email}
                  onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                  placeholder="name@brightloop.io"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Role Assignment</label>
                <select
                  className="form-control"
                  value={newStaff.role}
                  onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                >
                  <option value="STAFF">Staff (Operations & Quotations)</option>
                  <option value="FINANCE">Finance Lead (Receivables & Ledger)</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowInviteModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Send Invitation</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffSettings;
