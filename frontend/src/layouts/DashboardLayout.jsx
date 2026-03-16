import React, { useContext } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, User, LogOut, Home, Key, FileText, Activity, Layers, ActivitySquare, ServerCrash, AlertCircle, Users, Link as LinkIcon, Shield, Settings } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const DashboardLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <Home size={20} />, role: 'all' },
    { name: 'Digital Identity Wallet', path: '/wallet', icon: <Key size={20} />, role: 'all' },
    { name: 'My Services', path: '/services', icon: <Layers size={20} />, role: 'all' },
    { name: 'Trust Timeline', path: '/timeline', icon: <Activity className="text-blue-500" size={20} />, role: 'all' },
    { name: 'Verify Certificate', path: '/verify-cert', icon: <ShieldCheck size={20} />, role: 'all' },
    { name: 'System Dashboard', path: '/admin-dashboard', icon: <Home size={20} />, role: 'admin' },
    { name: 'National Threat Radar', path: '/admin-radar', icon: <ActivitySquare size={20} />, role: 'admin' },
    { name: 'Exception Queue', path: '/admin-exceptions', icon: <AlertCircle size={20} />, role: 'admin' },
    { name: 'Citizen Records', path: '/admin-citizens', icon: <Users size={20} />, role: 'admin' },
    { name: 'Blockchain Integrity', path: '/admin-chain', icon: <LinkIcon size={20} />, role: 'admin' },
    { name: 'System Health', path: '/system-status', icon: <Activity size={20} />, role: 'admin' },
    { name: 'Disaster Recovery', path: '/disaster-recovery', icon: <ServerCrash size={20} />, role: 'admin' },
    { name: 'Audit Logs', path: '/admin-audit', icon: <FileText size={20} />, role: 'admin' },
    { name: 'Admin Management', path: '/admin-management', icon: <Settings size={20} />, role: 'admin' },
  ];

  const filteredLinks = navLinks.filter(item => item.role === 'all' || item.role === user?.role);

  return (
    <div className="flex h-screen bg-sovLight font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-sovNavy text-white flex flex-col shadow-2xl z-10 transition-all duration-300">
        <div className="h-16 flex items-center justify-center border-b border-gray-800">
          <ShieldCheck className="h-8 w-8 text-sovAccent mr-2" />
          <span className="text-xl tracking-tight font-semibold">Sovereign<span className="text-sovAccent">Shield</span></span>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-2">
            {filteredLinks.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive ? 'bg-sovBlue text-white shadow-md' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span className="font-medium text-sm">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center shadow-inner">
               <User className="text-gray-300" size={20} />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
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
      <main className="flex-1 overflow-y-auto bg-[#F7F9FC]">
        <header className="h-16 bg-white shadow-sm border-b border-gray-200 flex items-center px-8 z-0">
            <div>
              <h2 className="text-xl font-semibold text-sovNavy tracking-tight">E-Governance Secure Gateway</h2>
              <div className="flex items-center text-xs space-x-2 text-gray-500 mt-1">
                 <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-green-500 mr-1 badge-secure"></div> Secure Connection</span>
                 <span>|</span>
                 <span>Zero Trust Architecture</span>
                 <span>|</span>
                 <span>Encrypted Data-in-Transit (TLS 1.3)</span>
              </div>
            </div>
        </header>
        <div className="p-8 pb-20">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
