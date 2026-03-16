import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import Register from './pages/Register';
import DashboardLayout from './layouts/DashboardLayout';
import AdminLayout from './layouts/AdminLayout';

// Citizen Pages
import CitizenDashboard from './pages/CitizenDashboard';
import Profile from './pages/Profile';
import DigitalIdentityWallet from './pages/DigitalIdentityWallet';
import ServiceRequests from './pages/ServiceRequests';
import VerifyCertificate from './pages/VerifyCertificate';
import TrustTimeline from './pages/TrustTimeline';
import BirthCertificateApply from './pages/BirthCertificateApply';
import TaxFilingApply from './pages/TaxFilingApply';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminMonitoring from './pages/AdminMonitoring';
import AdminSecurityAudit from './pages/AdminSecurityAudit';
import AdminDisasterRecovery from './pages/AdminDisasterRecovery';
import AdminRadar from './pages/AdminRadar';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Citizen Portal Routes */}
          <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<CitizenDashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/wallet" element={<DigitalIdentityWallet />} />
            <Route path="/services" element={<ServiceRequests />} />
            <Route path="/verify-cert" element={<VerifyCertificate />} />
            <Route path="/timeline" element={<TrustTimeline />} />
            <Route path="/services/birth-certificate" element={<BirthCertificateApply />} />
            <Route path="/services/tax-filing" element={<TaxFilingApply />} />
          </Route>

          {/* Admin Control Center Routes */}
          <Route element={<ProtectedRoute adminOnly={true}><AdminLayout /></ProtectedRoute>}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/monitoring" element={<AdminMonitoring />} />
            <Route path="/admin/security-audit" element={<AdminSecurityAudit />} />
            <Route path="/admin/disaster-recovery" element={<AdminDisasterRecovery />} />
            <Route path="/admin/radar" element={<AdminRadar />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
