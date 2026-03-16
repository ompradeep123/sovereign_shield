import React, { useContext, useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, User, LogOut, Home, Key, FileText, Activity, Layers, ActivitySquare, ServerCrash, AlertCircle, Users, Link as LinkIcon, Shield, Settings, Menu, X, Radio, RefreshCw, Lock } from 'lucide-react';
import { AuthContext, api } from '../context/AuthContext';

const DashboardLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    if (user) {
        api.post('/services/device/register').catch(e => console.warn('Device trust init deferred', e));
        api.get('/services/profile').then(res => setIsVerified(res.data.hasBiometric)).catch(() => {});
    }
  }, [user]);

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <Home size={20} />, role: 'all' },
    { name: 'My Profile', path: '/profile', icon: <User size={20} />, role: 'all' },
    { name: 'Digital Identity Wallet', path: '/wallet', icon: <Key size={20} />, role: 'all' },
    { name: 'My Services', path: '/services', icon: <Layers size={20} />, role: 'all' },
    { name: 'Trust Timeline', path: '/timeline', icon: <Activity className="text-blue-500" size={20} />, role: 'all' },
    { name: 'Verify Certificate', path: '/verify-cert', icon: <ShieldCheck size={20} />, role: 'all' },
    { name: 'SOC Central Command', path: '/admin', icon: <Home size={20} />, role: 'admin' },
    { name: 'Live Monitoring', path: '/admin/monitoring', icon: <Activity size={20} />, role: 'admin' },
    { name: 'Cyber Threat Radar', path: '/admin/radar', icon: <Radio size={20} />, role: 'admin' },
    { name: 'Security Audit', path: '/admin/security-audit', icon: <Lock size={20} />, role: 'admin' },
    { name: 'Disaster Recovery', path: '/admin/disaster-recovery', icon: <RefreshCw size={20} />, role: 'admin' },
  ];

  const filteredLinks = navLinks.filter(item => item.role === 'all' || item.role === user?.role);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-sovLight font-sans overflow-hidden w-full">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-72 md:w-64 glass-dark text-white flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.15)] z-50 transform transition-transform duration-300 md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-800 shrink-0">
          <div className="flex items-center">
            <ShieldCheck className="h-8 w-8 text-sovAccent mr-2 shrink-0" />
            <span className="text-xl tracking-tight font-semibold">Sovereign<span className="text-sovAccent">Shield</span></span>
          </div>
          <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            {filteredLinks.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive ? 'bg-gradient-to-r from-sovBlue to-blue-600 text-white shadow-[0_4px_12px_rgba(29,78,216,0.3)] transform scale-[1.02]' : 'text-gray-400 hover:bg-white/10 hover:text-white hover:translate-x-1'
                  }`}
                >
                  <div className={`${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                    {item.icon}
                  </div>
                  <span className="font-medium text-sm">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center shadow-inner relative">
               <User className="text-gray-300" size={20} />
               {isVerified && (
                 <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-0.5 border border-gray-900">
                   <ShieldCheck size={10} className="text-white" />
                 </div>
               )}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate flex items-center">
                {user?.name}
                {isVerified && <ShieldCheck size={12} className="ml-1.5 text-emerald-400" />}
              </p>
              <p className="text-xs text-gray-400 truncate uppercase">{user?.role} · {user?.nid}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium shadow-md"
          >
            <LogOut size={16} />
            <span>Secure Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#030712] relative z-0 w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0f172a] to-[#030712]">
        <header className="h-16 glass-panel shadow-[0_4px_30px_rgba(0,0,0,0.5)] border-b border-white/5 flex flex-col justify-center px-4 md:px-8 z-10 shrink-0 sticky top-0">
          <div className="flex items-center">
            <button 
              className="mr-3 md:hidden p-2 -ml-2 text-gray-300 hover:bg-white/10 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg md:text-xl font-bold text-white tracking-tight truncate">E-Governance Secure Gateway</h2>
              <div className="hidden md:flex items-center text-xs space-x-2 text-gray-400 mt-0.5">
                 <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-emerald-500 mr-1 badge-secure"></div> Secure Connection</span>
                 <span>|</span>
                 <span>Zero Trust Architecture</span>
                 <span>|</span>
                 <span>Encrypted Data-in-Transit (TLS 1.3)</span>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 pb-24">
          <div className="max-w-7xl mx-auto w-full pb-8">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
