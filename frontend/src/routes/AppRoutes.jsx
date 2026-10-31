import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import CustomerLayout from '../layouts/CustomerLayout';
import WelcomeHome from '../pages/WelcomeHome';
import Home from '../pages/admin/Home';
import Customers from '../pages/admin/Customers';
import Products from '../pages/admin/Products';
import Subscriptions from '../pages/admin/Subscriptions';
import Invoices from '../pages/admin/Invoices';
import Plans from '../pages/admin/Plans';
import Quotations from '../pages/admin/Quotations';
import DiscountsTaxes from '../pages/admin/DiscountsTaxes';
import Calendar from '../pages/admin/Calendar';
import Analytics from '../pages/admin/Analytics';
import Payments from '../pages/admin/Payments';
import Reports from '../pages/admin/Reports';
import AuditHistory from '../pages/admin/AuditHistory';
import StaffSettings from '../pages/admin/StaffSettings';
import FinanceDashboard from '../pages/finance/FinanceDashboard';
import CustomerHome from '../pages/customer/CustomerHome';
import MySubscriptions from '../pages/customer/MySubscriptions';
import CustomerInvoices from '../pages/customer/CustomerInvoices';
import CustomerPayments from '../pages/customer/CustomerPayments';
import HelpSupport from '../pages/customer/HelpSupport';
import PlaceholderModule from '../components/common/PlaceholderModule';
import {
  Users,
  Box,
  CreditCard,
  FileCheck,
  RotateCcw,
  Receipt,
  DollarSign,
  Percent,
  BarChart3,
  FileSpreadsheet,
  Calendar as CalendarIcon,
  Bell,
  History,
  UserCheck,
  ShieldAlert,
  Settings,
  TrendingUp,
  User,
  HelpCircle,
} from 'lucide-react';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Welcome Homepage */}
      <Route path="/" element={<WelcomeHome />} />

      {/* Admin / Staff / Finance Layout */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Home />} />
        <Route path="customers" element={<Customers />} />
        <Route path="products" element={<Products />} />
        <Route path="plans" element={<Plans />} />
        <Route path="quotations" element={<Quotations />} />
        <Route path="subscriptions" element={<Subscriptions />} />
        <Route path="invoices" element={<Invoices />} />
        <Route path="payments" element={<Payments />} />
        <Route path="discounts-taxes" element={<DiscountsTaxes />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="reports" element={<Reports />} />
        <Route path="calendar" element={<Calendar />} />
        <Route
          path="notifications"
          element={
            <PlaceholderModule
              title="System Notifications"
              category="Operations"
              description="Real-time operational alerts, billing notifications, and customer lifecycle triggers."
              icon={Bell}
            />
          }
        />
        <Route path="audit" element={<AuditHistory />} />
        <Route path="staff" element={<StaffSettings />} />
        <Route
          path="roles"
          element={
            <PlaceholderModule
              title="Roles & Permissions (RBAC)"
              category="Administration"
              description="Granular permission matrices for Admin, Staff, Finance Lead, and Customer roles."
              icon={ShieldAlert}
            />
          }
        />
        <Route
          path="settings"
          element={
            <PlaceholderModule
              title="Company Settings"
              category="Administration"
              description="Manage organization metadata, default currencies, invoice prefixes, and branding."
              icon={Settings}
            />
          }
        />
      </Route>

      {/* Finance Specific Layout Routes */}
      <Route path="/finance" element={<AdminLayout />}>
        <Route path="dashboard" element={<FinanceDashboard />} />
        <Route
          path="overdue"
          element={
            <PlaceholderModule
              title="Overdue Invoices & Aging"
              category="Finance Lead"
              description="Track delinquent accounts, aging buckets (1-30, 31-60, 60+ days), and collection actions."
              icon={Receipt}
            />
          }
        />
        <Route
          path="reconciliation"
          element={
            <PlaceholderModule
              title="Payment Reconciliation"
              category="Finance Lead"
              description="Bank statement and gateway settlement matching, discrepancy tracking, and ledger postings."
              icon={DollarSign}
            />
          }
        />
      </Route>

      {/* Customer Portal Layout Routes */}
      <Route path="/customer" element={<CustomerLayout />}>
        <Route index element={<CustomerHome />} />
        <Route path="subscriptions" element={<MySubscriptions />} />
        <Route path="invoices" element={<CustomerInvoices />} />
        <Route path="payments" element={<CustomerPayments />} />
        <Route path="support" element={<HelpSupport />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};

export default AppRoutes;
