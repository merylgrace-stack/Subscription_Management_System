import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, Bell, CheckCircle2, Play, AlertTriangle, ShieldCheck, Tag } from 'lucide-react';
import { calendarService } from '../../services/api';

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await calendarService.getEvents();
      const data = res.data?.results || res.data || [];
      setEvents(data);
    } catch (err) {
      console.error('Error fetching calendar events:', err);
      // Fallback display
      setEvents([
        {
          id: 1,
          event_type: 'PAYMENT_DUE',
          title: 'Collections Follow-up: Invoice INV-2026-002',
          description: 'Invoice of $1,320.00 for TechVanguard is overdue.',
          event_date: '2026-10-31',
          status: 'PENDING',
        },
        {
          id: 2,
          event_type: 'RENEWAL_REMINDER',
          title: 'Subscription Renewal Review: SUB-ACME-001',
          description: 'Acme Global Corp subscription renewal scheduled in 7 days.',
          event_date: '2026-11-07',
          status: 'PENDING',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleRunScheduler = async () => {
    try {
      setRunning(true);
      const res = await calendarService.runScheduler();
      alert(`Scheduler executed!\n• Quotation Reminders: ${res.data.quotation_reminders}\n• Renewal Reminders: ${res.data.renewal_reminders}\n• Collections Reminders: ${res.data.collections_reminders}`);
      fetchEvents();
    } catch (err) {
      alert('Error running scheduler: ' + (err.response?.data?.error || err.message));
    } finally {
      setRunning(false);
    }
  };

  const getEventBadge = (type) => {
    switch (type) {
      case 'PAYMENT_DUE': return <span className="badge badge-danger">Payment Due</span>;
      case 'RENEWAL_REMINDER': return <span className="badge badge-confirmed">Renewal Review</span>;
      case 'QUOTE_EXPIRATION': return <span className="badge badge-paused">Quote Expiry</span>;
      default: return <span className="badge badge-draft">{type}</span>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-primary)', marginBottom: '0.35rem' }}>
            Operations & Tasks
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <CalendarIcon size={26} color="var(--accent-primary)" />
            Operational Calendar & Reminders
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Automated contract expiration reminders, collections tasks, and team milestones.
          </p>
        </div>

        <button className="btn btn-primary" onClick={handleRunScheduler} disabled={running}>
          <Play size={16} />
          <span>{running ? 'Running Automation...' : 'Run Auto-Scheduler Now'}</span>
        </button>
      </div>

      {/* Events List */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock size={18} color="var(--accent-primary)" />
          <span>Upcoming Scheduled Reminders & Milestones</span>
        </h3>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Event Type</th>
                <th>Title & Description</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((ev) => (
                <tr key={ev.id}>
                  <td>{getEventBadge(ev.event_type)}</td>
                  <td>
                    <div style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                      {ev.title}
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.15rem' }}>
                      {ev.description}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: '600', color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>
                      {ev.event_date}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${ev.status === 'COMPLETED' ? 'badge-active' : 'badge-paused'}`}>
                      {ev.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-secondary">
                      <span>Acknowledge</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
