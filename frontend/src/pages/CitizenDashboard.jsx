import React, { useContext, useEffect, useState } from 'react';
import { AuthContext, api } from '../context/AuthContext';
import { ShieldCheck, Activity, Bell, FileText, ChevronRight, Layers, Fingerprint, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const CitizenDashboard = () => {
  const { user } = useContext(AuthContext);
  const { t } = useLanguage();
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get('/services/my-services');
        setServices(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 mt-2 pb-12 sm:pb-24 animate-scale-in overflow-x-hidden">
      {/* Welcome Section */}
      <div className="rounded-2xl sm:rounded-3xl shadow-2xl border border-white/10 p-5 sm:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gradient-to-br from-blue-700 via-blue-900 to-[#030712] text-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sovBlue rounded-full blur-[120px] opacity-10 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none"></div>
        <div className="relative z-10 w-full sm:w-auto overflow-hidden">
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-2 sm:mb-3 truncate">{t('welcome')}, {user?.name}</h1>
          <p className="text-blue-100/70 font-medium flex items-center flex-wrap gap-2 text-xs sm:text-base">
            {t('status')}: 
            <span className="text-emerald-400 font-semibold flex items-center bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20 shadow-sm leading-none whitespace-nowrap">
              <ShieldCheck size={14} className="mr-1.5"/> Verified Identity
            </span>
          </p>
        </div>
        <div className="hidden sm:flex flex-col items-end relative z-10 bg-white/5 p-4 rounded-xl border border-white/5 backdrop-blur-md flex-shrink-0">
          <div className="text-[10px] text-blue-200/50 font-mono tracking-widest uppercase mb-1">Authenticated ID</div>
          <div className="text-lg font-mono text-emerald-400 font-bold tracking-wider">#{user?.id?.slice(0,8).toUpperCase() || 'SESSION_ACTIVE'}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Core Services Section */}
        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <Link to="/services/birth-certificate" className="bg-[#0f172a] hover:bg-[#1e293b] border border-white/5 p-5 sm:p-6 rounded-2xl sm:rounded-3xl shadow-lg transition-all group overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-3xl rounded-full"></div>
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="p-2 sm:p-3 bg-blue-600/10 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all text-blue-400">
                  <FileText size={20} className="sm:w-6 sm:h-6" />
                </div>
                <div className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-[8px] sm:text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Active</div>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-1 uppercase tracking-tight truncate">Birth Certificate</h3>
              <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed line-clamp-2">Official registry services for national vital records.</p>
            </Link>

            <Link to="/services/tax-filing" className="bg-[#0f172a] hover:bg-[#1e293b] border border-white/5 p-5 sm:p-6 rounded-2xl sm:rounded-3xl shadow-lg transition-all group overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-3xl rounded-full"></div>
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="p-2 sm:p-3 bg-emerald-600/10 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-all text-emerald-400">
                  <Activity size={20} className="sm:w-6 sm:h-6" />
                </div>
                <div className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-[8px] sm:text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Active</div>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-1 uppercase tracking-tight truncate">Direct Tax Portal</h3>
              <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed line-clamp-2">Manage income tax compliance and verified returns.</p>
            </Link>

            <Link to="/privacy" className="bg-[#0f172a] hover:bg-[#1e293b] border border-white/5 p-5 sm:p-6 rounded-2xl sm:rounded-3xl shadow-lg transition-all group overflow-hidden relative sm:col-span-2">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[80px] rounded-full"></div>
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="p-2 sm:p-3 bg-blue-600/10 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all text-blue-400">
                  <Fingerprint size={20} className="sm:w-6 sm:h-6" />
                </div>
                <div className="flex gap-2">
                    <div className="px-2 py-1 bg-blue-500/10 border border-blue-500/20 rounded text-[8px] sm:text-[9px] font-bold text-blue-400 uppercase tracking-widest">Zero-Trust</div>
                    <div className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-[8px] sm:text-[9px] font-bold text-emerald-400 uppercase tracking-widest">Citizen-Led</div>
                </div>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-1 uppercase tracking-tight truncate">{t('data_control')}</h3>
              <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed line-clamp-2">View and control how government services access your verified personal attributes.</p>
            </Link>
          </div>

          {/* Quick Access List */}
          <div className="bg-[#0f172a]/50 border border-white/5 rounded-2xl sm:rounded-3xl p-5 sm:p-8">
            <h3 className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-4 sm:mb-6 flex items-center">
              <Activity className="mr-3" size={14} /> {t('quick_actions')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <Link to="/wallet" className="flex items-center gap-3 sm:gap-4 p-4 rounded-2xl bg-black/20 hover:bg-black/40 border border-white/5 hover:border-blue-500/30 transition-all group min-w-0">
                <div className="p-2 sm:p-2.5 bg-blue-500/10 rounded-xl text-blue-400 group-hover:scale-110 transition-transform flex-shrink-0"><FileText size={18} /></div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-200 truncate">{t('wallet')}</p>
                  <p className="text-[9px] sm:text-[10px] text-slate-500 uppercase tracking-tighter truncate">Identity Management</p>
                </div>
              </Link>
              <Link to="/services" className="flex items-center gap-3 sm:gap-4 p-4 rounded-2xl bg-black/20 hover:bg-black/40 border border-white/5 hover:border-emerald-500/30 transition-all group min-w-0">
                <div className="p-2 sm:p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400 group-hover:scale-110 transition-transform flex-shrink-0"><Layers size={18} /></div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-200 truncate">{t('services')}</p>
                  <p className="text-[9px] sm:text-[10px] text-slate-500 uppercase tracking-tighter truncate">View All Requests</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Sidebar Status Area */}
        <div className="space-y-6 sm:space-y-8">
          <div className="bg-[#0f172a] border border-white/5 p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl">
             <h3 className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-4 sm:mb-6 flex items-center">
                <Bell className="mr-3" size={14} /> {t('recent_activity')}
             </h3>
             {services.length === 0 ? (
                <div className="text-[11px] sm:text-xs text-slate-600 italic text-center py-8 sm:py-10 bg-black/20 rounded-2xl border border-white/5 border-dashed">No recent activity detected.</div>
             ) : (
                <div className="space-y-3 sm:space-y-4">
                  {services.slice(0, 4).map(s => (
                     <div key={s.id} className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 transition-all border border-transparent hover:border-white/5 group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-12 h-12 bg-blue-500/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors flex-shrink-0">
                          <FileText size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-200 truncate group-hover:text-blue-400 transition-colors uppercase tracking-tight">{s.type}</p>
                          <p className="text-[10px] text-slate-600 font-mono mt-0.5">{new Date(s.timestamp).toLocaleDateString()}</p>
                        </div>
                     </div>
                  ))}
                </div>
             )}
          </div>

          <Link to="/timeline" className="block bg-gradient-to-br from-[#1e40af]/10 to-transparent border border-blue-500/20 p-5 sm:p-6 rounded-2xl sm:rounded-3xl hover:border-blue-500/50 transition-all text-center group">
             <ShieldCheck size={28} className="mx-auto text-blue-500 mb-2 sm:mb-3 group-hover:scale-110 transition-transform" />
             <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-widest">{t('trust_timeline')}</h4>
             <p className="text-[9px] sm:text-[10px] text-slate-500 mt-1 uppercase tracking-tight">Audit Your Blockchain Integrity</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CitizenDashboard;
