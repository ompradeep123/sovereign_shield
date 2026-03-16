import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import DashboardLayout from './layouts/DashboardLayout';
import CitizenDashboard from './pages/CitizenDashboard';
import Profile from './pages/Profile';
import DigitalIdentityWallet from './pages/DigitalIdentityWallet';
import ServiceRequests from './pages/ServiceRequests';
import VerifyCertificate from './pages/VerifyCertificate';
import TrustTimeline from './pages/TrustTimeline';
import AdminRadar from './pages/AdminRadar';
import AdminMonitoring from './pages/AdminMonitoring';
import AdminSecurityAudit from './pages/AdminSecurityAudit';
import AdminDisasterRecovery from './pages/AdminDisasterRecovery';
import AdminDashboard from './pages/AdminDashboard';
import BirthCertificateApply from './pages/BirthCertificateApply';
import TaxFilingApply from './pages/TaxFilingApply';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<CitizenDashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/wallet" element={<DigitalIdentityWallet />} />
            <Route path="/services" element={<ServiceRequests />} />
            <Route path="/verify-cert" element={<VerifyCertificate />} />
            <Route path="/timeline" element={<TrustTimeline />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/monitoring" element={<AdminMonitoring />} />
            <Route path="/admin/security-audit" element={<AdminSecurityAudit />} />
            <Route path="/admin/disaster-recovery" element={<AdminDisasterRecovery />} />
            <Route path="/admin/radar" element={<AdminRadar />} />
            <Route path="/services/birth-certificate" element={<BirthCertificateApply />} />
            <Route path="/services/tax-filing" element={<TaxFilingApply />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
