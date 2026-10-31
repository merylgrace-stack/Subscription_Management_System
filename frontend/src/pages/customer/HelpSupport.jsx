import React, { useState } from 'react';
import { HelpCircle, Send, MessageSquare, CheckCircle, Mail, Phone } from 'lucide-react';

const HelpSupport = () => {
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDesc, setTicketDesc] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setTicketSubject('');
      setTicketDesc('');
      setSubmitted(false);
      alert('Support ticket submitted! Your technical account manager will reply within 2 hours.');
    }, 600);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <div>
        <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-primary)', marginBottom: '0.35rem' }}>
          Customer Self-Service
        </div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <HelpCircle size={26} color="var(--accent-primary)" />
          Help & Dedicated Enterprise Support
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          Submit priority support requests, access subscription documentation, and connect with technical advisors.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Support Ticket Submission */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)' }}>
            Submit a Priority Request
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Subject *</label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="e.g. Plan upgrade assistance or API integration inquiry"
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Detailed Description *</label>
              <textarea
                rows="4"
                required
                className="form-control"
                placeholder="Explain your request or issue in detail..."
                value={ticketDesc}
                onChange={(e) => setTicketDesc(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
              <Send size={15} />
              <span>{submitted ? 'Submitting Request...' : 'Submit Support Ticket'}</span>
            </button>
          </form>
        </div>

        {/* Enterprise Support Contact Information */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)' }}>
            Enterprise Account Team
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5' }}>
            As an enterprise customer, you have 24/7 priority SLA coverage with a guaranteed 2-hour response window.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.85rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
              <Mail size={18} color="var(--accent-primary)" />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Direct Escalation Email</div>
                <div style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.9rem' }}>enterprise-support@brightloop.io</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.85rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
              <Phone size={18} color="var(--accent-green)" />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Emergency Hotline</div>
                <div style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.9rem' }}>+1 (800) 555-LOOP (Toll-Free)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;
