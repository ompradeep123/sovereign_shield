import React, { useContext, useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
    ShieldCheck, User, LogOut, Home, Key, FileText, 
    Activity, Layers, Menu, X, Shield, History, Wallet 
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from '../components/LanguageSelector';

const DashboardLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const { t } = useLanguage();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinks = [
    { name: t('dashboard'), path: '/dashboard', icon: <Home size={20} /> },
    { name: t('wallet'), path: '/wallet', icon: <Wallet size={20} /> },
    { name: t('services'), path: '/services', icon: <Layers size={20} /> },
    { name: t('trust_timeline'), path: '/timeline', icon: <History size={20} /> },
    { name: t('verify_cert'), path: '/verify-cert', icon: <ShieldCheck size={20} /> },
    { name: t('profile'), path: '/profile', icon: <User size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-300 flex overflow-x-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[45]" 
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 transition-all duration-300 transform 
        ${isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0 md:w-20'} 
        bg-[#0a192f] border-r border-white/5 flex flex-col shadow-2xl`}>
        
        <div className="p-6 flex items-center gap-3">
          <div className="min-w-[2.5rem] w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
            <Shield className="text-white" size={24} />
          </div>
          {(isSidebarOpen) && (
            <div className={`flex flex-col transition-opacity duration-300 ${!isSidebarOpen && 'md:opacity-0'}`}>
              <span className="text-white font-black tracking-tighter text-lg leading-none">SOVEREIGN</span>
              <span className="text-blue-500 font-mono text-[10px] font-bold tracking-[0.2em] whitespace-nowrap">SHIELD_V3</span>
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
                onClick={() => window.innerWidth < 768 && setSidebarOpen(false)}
                className={`flex items-center gap-4 p-3.5 rounded-xl transition-all group ${
                  isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                  : 'hover:bg-white/5 text-slate-500'
                }`}
              >
                <span className={`${isActive ? 'text-white' : 'group-hover:text-slate-300'}`}>{link.icon}</span>
                <span className={`text-sm font-bold uppercase tracking-wider whitespace-nowrap md:transition-opacity md:duration-300 ${!isSidebarOpen && 'md:hidden'}`}>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5 bg-[#0a192f]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 p-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-all font-bold uppercase text-xs tracking-widest"
          >
            <LogOut size={18} />
            <span className={`md:transition-opacity md:duration-300 ${!isSidebarOpen && 'md:hidden'}`}>{t('logout')}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={`flex-1 transition-all duration-300 min-w-0 ${isSidebarOpen ? 'md:pl-64' : 'md:pl-20'}`}>
        <header className="h-20 border-b border-white/5 bg-[#030712]/50 backdrop-blur-md flex items-center justify-between px-4 sm:px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 active:scale-95 transition-transform">
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div>
              <LanguageSelector />
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-white text-xs font-black uppercase tracking-tight truncate max-w-[120px]">{user?.name || 'Citizen'}</p>
              <p className="text-[9px] text-emerald-500 font-mono font-bold uppercase tracking-widest">ID Verified</p>
            </div>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-800 border-2 border-white/5 flex items-center justify-center overflow-hidden flex-shrink-0">
                <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`} alt="Profile" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-8 max-w-full overflow-x-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
