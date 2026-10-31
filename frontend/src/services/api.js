import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token and active role
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('brightloop_token');
  if (token && token !== 'demo_token') {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const userStr = localStorage.getItem('brightloop_user');
    if (userStr) {
      const userObj = JSON.parse(userStr);
      if (userObj?.role) {
        config.headers['X-Dev-Role'] = userObj.role;
      }
    }
  } catch (e) {}

  return config;
}, (error) => Promise.reject(error));

// API Services Map
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
  inviteStaff: (data) => api.post('/auth/invite-staff', data),
};

export const customerService = {
  getAll: (params) => api.get('/customers/', { params }),
  getById: (id) => api.get(`/customers/${id}/`),
  create: (data) => api.post('/customers/', data),
  update: (id, data) => api.patch(`/customers/${id}/`, data),
};

export const catalogService = {
  getProducts: () => api.get('/catalog/products/'),
  getPlans: () => api.get('/catalog/plans/'),
  getDiscounts: () => api.get('/catalog/discounts/'),
  getTaxes: () => api.get('/catalog/taxes/'),
};

export const quotationService = {
  getAll: () => api.get('/quotations/'),
  getById: (id) => api.get(`/quotations/${id}/`),
  create: (data) => api.post('/quotations/', data),
  approve: (id) => api.post(`/quotations/${id}/approve/`),
  reject: (id) => api.post(`/quotations/${id}/reject/`),
  convertToSubscription: (id) => api.post(`/quotations/${id}/convert-to-subscription/`),
};

export const subscriptionService = {
  getAll: () => api.get('/subscriptions/'),
  getById: (id) => api.get(`/subscriptions/${id}/`),
  activate: (id) => api.post(`/subscriptions/${id}/activate/`),
  pause: (id, reason) => api.post(`/subscriptions/${id}/pause/`, { reason }),
  resume: (id) => api.post(`/subscriptions/${id}/resume/`),
  cancel: (id, reason) => api.post(`/subscriptions/${id}/cancel/`, { reason }),
};

export const billingService = {
  getInvoices: () => api.get('/invoices/'),
  getInvoiceById: (id) => api.get(`/invoices/${id}/`),
  confirmInvoice: (id) => api.post(`/invoices/${id}/confirm/`),
  cancelInvoice: (id) => api.post(`/invoices/${id}/cancel/`),
  recordPayment: (id, data) => api.post(`/invoices/${id}/payments/`, data),
  runBillingCycle: () => api.post('/billing/run-cycle'),
  getPayments: () => api.get('/payments/'),
};

export const financeService = {
  getDashboard: () => api.get('/finance/dashboard'),
  getOverdueInvoices: () => api.get('/finance/overdue-invoices'),
};

export const calendarService = {
  getEvents: () => api.get('/calendar/events/'),
  getUpcomingReminders: () => api.get('/calendar/events/upcoming_reminders/'),
  runScheduler: () => api.post('/calendar/events/run_scheduler/'),
};

export const customerPortalService = {
  getPortalDashboard: () => api.get('/customer/portal'),
};

export default api;
