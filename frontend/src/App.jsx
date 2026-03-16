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
import SystemStatus from './pages/SystemStatus';
import DisasterRecovery from './pages/DisasterRecovery';
import AdminDashboard from './pages/AdminDashboard';
import AdminExceptionQueue from './pages/AdminExceptionQueue';
import AdminCitizenRecords from './pages/AdminCitizenRecords';
import AdminBlockchainIntegrity from './pages/AdminBlockchainIntegrity';
import AdminAuditLogs from './pages/AdminAuditLogs';
import AdminManagement from './pages/AdminManagement';
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
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin-exceptions" element={<AdminExceptionQueue />} />
            <Route path="/admin-citizens" element={<AdminCitizenRecords />} />
            <Route path="/admin-chain" element={<AdminBlockchainIntegrity />} />
            <Route path="/admin-audit" element={<AdminAuditLogs />} />
            <Route path="/admin-management" element={<AdminManagement />} />
            <Route path="/admin-radar" element={<AdminRadar />} />
            <Route path="/services/birth-certificate" element={<BirthCertificateApply />} />
            <Route path="/services/tax-filing" element={<TaxFilingApply />} />
            <Route path="/system-status" element={<SystemStatus />} />
            <Route path="/disaster-recovery" element={<DisasterRecovery />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
