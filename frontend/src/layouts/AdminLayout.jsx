import React, { useContext, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
    ShieldCheck, LogOut, Home, Activity, Lock, 
    Radio, RefreshCw, Menu, X, Terminal, Shield 
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from '../components/LanguageSelector';

const AdminLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const { t } = useLanguage();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navLinks = [
    { name: t('soc_command'), path: '/admin', icon: <Home size={20} /> },
    { name: t('live_monitoring'), path: '/admin/monitoring', icon: <Activity size={20} /> },
    { name: t('threat_radar'), path: '/admin/radar', icon: <Radio size={20} /> },
    { name: t('security_audit'), path: '/admin/security-audit', icon: <Lock size={20} /> },
    { name: t('disaster_recovery'), path: '/admin/disaster-recovery', icon: <RefreshCw size={20} /> },
  ];

  // If user is not admin, they shouldn't even see this (App.jsx will handle protection)

  return (
    <div className="min-h-screen bg-[#030712] text-slate-300 flex overflow-x-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Admin Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 transition-all duration-300 transform 
        ${isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0 lg:w-20'} 
        bg-[#0a0f1e] border-r border-white/5 flex flex-col shadow-2xl`}>
        
        <div className="p-6 flex items-center gap-3">
          <div className="min-w-[2.5rem] w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)]">
            <Shield className="text-white" size={24} />
          </div>
          {(isSidebarOpen) && (
            <div className={`flex flex-col transition-opacity duration-300 ${!isSidebarOpen && 'lg:opacity-0'}`}>
              <span className="text-white font-black tracking-tighter text-lg leading-none">SOVEREIGN</span>
              <span className="text-blue-500 font-mono text-[10px] font-bold tracking-[0.2em]">SOC_ADMIN_V3</span>
            </div>
          )}
        </div>

        <nav className="flex-1 mt-6 px-4 space-y-2 overflow-y-auto">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                className={`flex items-center gap-4 p-3.5 rounded-xl transition-all group ${
                  isActive 
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' 
                  : 'hover:bg-white/5 text-slate-500'
                }`}
              >
                <span className={`${isActive ? 'text-blue-400' : 'group-hover:text-slate-300'}`}>{link.icon}</span>
                <span className={`text-sm font-bold uppercase tracking-wider whitespace-nowrap lg:transition-opacity lg:duration-300 ${!isSidebarOpen && 'lg:hidden'}`}>{link.name}</span>
                {isActive && isSidebarOpen && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(37,99,235,1)]"></div>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5 bg-[#0a0f1e]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 p-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-all font-bold uppercase text-xs tracking-widest"
          >
            <LogOut size={18} />
            <span className={`lg:transition-opacity lg:duration-300 ${!isSidebarOpen && 'lg:hidden'}`}>{t('terminate_session')}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={`flex-1 transition-all duration-300 min-w-0 ${isSidebarOpen ? 'lg:pl-64' : 'lg:pl-20'} relative`}>
        <header className="h-20 border-b border-white/5 bg-[#030712]/50 backdrop-blur-md flex items-center justify-between px-4 sm:px-8 sticky top-0 z-40">
          <div className="flex items-center gap-2 sm:gap-4 overflow-hidden">
            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)} 
              className="p-2 hover:bg-white/5 rounded-lg text-slate-400 active:scale-95 transition-transform flex-shrink-0"
              aria-label="Toggle Sidebar"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex-shrink-0">
              <LanguageSelector />
            </div>
            <div className="hidden xs:flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 bg-black/40 border border-white/5 rounded-xl ml-1 sm:ml-2">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0"></div>
              <span className="text-[8px] sm:text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">Secure Gateway</span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-6 ml-auto">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-white text-xs font-black uppercase tracking-tight truncate max-w-[120px]">{user?.name || 'Administrator'}</p>
                <p className="text-[9px] text-blue-500 font-mono font-bold uppercase tracking-widest">Level 9</p>
              </div>
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-800 border-2 border-white/5 flex items-center justify-center overflow-hidden flex-shrink-0 hover:border-blue-500/50 transition-colors">
                <img src={`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${user?.email}`} alt="Admin" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8 max-w-full overflow-x-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );

};

export default AdminLayout;
