import React, { useContext, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
    ShieldCheck, LogOut, Home, Activity, Lock, 
    Radio, RefreshCw, Menu, X, Terminal, Shield 
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const AdminLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navLinks = [
    { name: 'SOC Command', path: '/admin', icon: <Home size={20} /> },
    { name: 'Live Monitoring', path: '/admin/monitoring', icon: <Activity size={20} /> },
    { name: 'Threat Radar', path: '/admin/radar', icon: <Radio size={20} /> },
    { name: 'Security Audit', path: '/admin/security-audit', icon: <Lock size={20} /> },
    { name: 'Disaster Recovery', path: '/admin/disaster-recovery', icon: <RefreshCw size={20} /> },
  ];

  // If user is not admin, they shouldn't even see this (App.jsx will handle protection)

  return (
    <div className="min-h-screen bg-[#030712] text-slate-300 flex">
      {/* Admin Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} glass-dark border-r border-white/5 flex flex-col`}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)]">
            <Shield className="text-white" size={24} />
          </div>
          {isSidebarOpen && (
            <div className="flex flex-col">
              <span className="text-white font-black tracking-tighter text-lg leading-none">SOVEREIGN</span>
              <span className="text-blue-500 font-mono text-[10px] font-bold tracking-[0.2em]">SOC_ADMIN_V3</span>
            </div>
          )}
        </div>

        <nav className="flex-1 mt-6 px-4 space-y-2">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-4 p-3.5 rounded-xl transition-all group ${
                  isActive 
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' 
                  : 'hover:bg-white/5 text-slate-500'
                }`}
              >
                <span className={`${isActive ? 'text-blue-400' : 'group-hover:text-slate-300'}`}>{link.icon}</span>
                {isSidebarOpen && <span className="text-sm font-bold uppercase tracking-wider">{link.name}</span>}
                {isActive && isSidebarOpen && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(37,99,235,1)]"></div>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 p-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-all font-bold uppercase text-xs tracking-widest"
          >
            <LogOut size={18} />
            {isSidebarOpen && <span>Terminate Session</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'pl-64' : 'pl-20'}`}>
        <header className="h-20 border-b border-white/5 bg-[#030712]/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-40">
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/5 rounded-lg text-slate-400">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 px-4 py-2 bg-black/40 border border-white/5 rounded-xl">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">Gateway: Secure</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-white text-xs font-black uppercase tracking-tight">{user?.name || 'Administrator'}</p>
                <p className="text-[9px] text-blue-500 font-mono font-bold uppercase tracking-widest">Clearance: Level 9</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-white/5 flex items-center justify-center overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${user?.email}`} alt="Admin" />
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
