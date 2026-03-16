import React, { useContext, useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
    ShieldCheck, User, LogOut, Home, Key, FileText, 
    Activity, Layers, Menu, X, Shield, History, Wallet 
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const DashboardLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <Home size={20} /> },
    { name: 'Identity Wallet', path: '/wallet', icon: <Wallet size={20} /> },
    { name: 'Government Services', path: '/services', icon: <Layers size={20} /> },
    { name: 'Trust Timeline', path: '/timeline', icon: <History size={20} /> },
    { name: 'Verify Certificate', path: '/verify-cert', icon: <ShieldCheck size={20} /> },
    { name: 'My Profile', path: '/profile', icon: <User size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-300 flex">
      {/* Mobile Sidebar Overlay */}
      {!isSidebarOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setSidebarOpen(true)}></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} bg-[#0a192f] border-r border-white/5 flex flex-col`}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
            <Shield className="text-white" size={24} />
          </div>
          {isSidebarOpen && (
            <div className="flex flex-col">
              <span className="text-white font-black tracking-tighter text-lg leading-none">SOVEREIGN</span>
              <span className="text-blue-500 font-mono text-[10px] font-bold tracking-[0.2em]">SHIELD_V3</span>
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
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                  : 'hover:bg-white/5 text-slate-500'
                }`}
              >
                <span className={`${isActive ? 'text-white' : 'group-hover:text-slate-300'}`}>{link.icon}</span>
                {isSidebarOpen && <span className="text-sm font-bold uppercase tracking-wider">{link.name}</span>}
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
            {isSidebarOpen && <span>Secure Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'pl-64' : 'pl-20'}`}>
        <header className="h-20 border-b border-white/5 bg-[#030712]/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-40">
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/5 rounded-lg text-slate-400">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-white text-xs font-black uppercase tracking-tight">{user?.name || 'Citizen'}</p>
              <p className="text-[9px] text-emerald-500 font-mono font-bold uppercase tracking-widest">ID Verified</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-white/5 flex items-center justify-center overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`} alt="Profile" />
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

export default DashboardLayout;
