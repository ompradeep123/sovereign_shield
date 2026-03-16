import React, { useContext, useEffect, useState } from 'react';
import { AuthContext, api } from '../context/AuthContext';
import { ShieldCheck, Activity, Bell, FileText, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CitizenDashboard = () => {
  const { user } = useContext(AuthContext);
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
    <div className="max-w-7xl mx-auto space-y-8 mt-2 pb-10">
      {/* Welcome Section */}
      <div className="rounded-2xl shadow-2xl border border-white/10 p-6 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#1d4ed8] via-[#0a192f] to-[#050b14] text-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sovBlue rounded-full blur-[120px] opacity-20 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none"></div>
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">Welcome back, {user?.name}</h1>
          <p className="text-blue-100/80 font-medium flex items-center flex-wrap gap-2 text-sm md:text-base">Digital Identity Status: <span className="text-emerald-400 font-semibold flex items-center bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20 shadow-[0_0_15px_rgba(52,211,153,0.1)]"><ShieldCheck size={16} className="mr-1.5"/> Verified Citizen</span></p>
        </div>
        <div className="hidden md:flex flex-col items-end relative z-10 bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-md">
          <div className="text-xs text-blue-200/70 font-mono tracking-widest uppercase mb-1">System Integrity</div>
          <div className="text-2xl font-mono text-emerald-400 font-bold badge-secure tracking-wider">100% SECURE</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Security Status Card */}
        <div className="bg-[#0f172a]/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/5 p-6 md:p-8 flex flex-col justify-between hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:-translate-y-1 transition-all duration-300 group">
          <div>
            <div className="flex items-center space-x-3 mb-5">
              <div className="p-3 bg-emerald-500/10 rounded-xl group-hover:scale-110 transition-transform duration-300 border border-emerald-500/20">
                <ShieldCheck className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="font-bold text-slate-100 text-lg">Zero-Trust Shield</h3>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">Your connection is fully encrypted. All attributes are protected by ZKP algorithms on the Sovereign Hash Chain.</p>
          </div>
          <div className="mt-6 pt-5 border-t border-white/5 flex justify-between items-center text-sm">
            <span className="text-slate-500 font-medium text-xs">Last scanned: Just now</span>
            <span className="text-emerald-400 font-semibold flex items-center bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full shadow-sm">Protected</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-[#0f172a]/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/5 p-6 md:p-8 hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-all duration-300">
            <h3 className="font-bold text-slate-100 mb-6 flex items-center text-lg">
              <div className="p-2 bg-blue-500/10 rounded-lg mr-3 border border-blue-500/20">
                <Activity className="h-5 w-5 text-blue-400"/>
              </div>
              Quick Actions
            </h3>
            <div className="space-y-4">
               <Link to="/wallet" className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-[#1e293b]/50 hover:bg-[#1e293b] hover:border-blue-500/30 hover:shadow-md transition-all duration-300 group">
                  <span className="text-sm font-semibold text-slate-200 group-hover:text-blue-400 transition-colors">Digital Identity Wallet</span>
                  <div className="p-1.5 rounded-md bg-[#0f172a] shadow-sm border border-white/10 group-hover:bg-blue-500 group-hover:border-blue-500 transition-colors">
                    <ChevronRight size={14} className="text-slate-400 group-hover:text-white transition-colors" />
                  </div>
               </Link>
               <Link to="/services" className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-[#1e293b]/50 hover:bg-[#1e293b] hover:border-blue-500/30 hover:shadow-md transition-all duration-300 group">
                  <span className="text-sm font-semibold text-slate-200 group-hover:text-blue-400 transition-colors">Request Service</span>
                  <div className="p-1.5 rounded-md bg-[#0f172a] shadow-sm border border-white/10 group-hover:bg-blue-500 group-hover:border-blue-500 transition-colors">
                    <ChevronRight size={14} className="text-slate-400 group-hover:text-white transition-colors" />
                  </div>
               </Link>
            </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-[#0f172a]/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/5 p-6 md:p-8 hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-all duration-300">
            <h3 className="font-bold text-slate-100 mb-6 flex items-center text-lg">
              <div className="p-2 bg-[#1e293b] rounded-lg mr-3 border border-white/5">
                <Bell className="h-5 w-5 text-slate-400"/>
              </div>
              Recent Activity
            </h3>
            {services.length === 0 ? (
                <div className="text-sm text-slate-500 italic text-center py-6 bg-[#1e293b]/30 rounded-xl border border-white/5 border-dashed">No recent activity detected.</div>
            ) : (
                <div className="space-y-4">
                  {services.slice(0, 3).map(s => (
                     <div key={s.id} className="flex items-start space-x-4 text-sm border-b border-white/5 pb-3 last:border-0 last:pb-0 hover:bg-[#1e293b]/50 p-2 -mx-2 rounded-lg transition-colors cursor-default">
                        <div className="p-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg shrink-0">
                          <FileText size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-200 truncate">{s.type}</p>
                          <p className="text-xs text-slate-500 font-medium mt-0.5">{new Date(s.timestamp).toLocaleDateString()}</p>
                        </div>
                     </div>
                  ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default CitizenDashboard;
