import React, { useState, useEffect } from 'react';
import { api } from '../context/AuthContext';
import { Home, Users, Layers, AlertTriangle, Link as LinkIcon, ShieldCheck, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/admin/stats');
                setStats(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchStats();
    }, []);

    if (!stats) return <div className="p-8 text-center text-gray-500 font-mono tracking-widest animate-pulse">LOADING DASHBOARD...</div>;

    const navCards = [
        { label: 'Citizen Records', path: '/admin-citizens', icon: <Users size={24}/>, val: stats.totalUsers, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
        { label: 'Biometric Vaults', path: '/admin-radar', icon: <ShieldCheck size={24}/>, val: stats.biometricVaults, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
        { label: 'Trusted Devices', path: '/admin-radar', icon: <Smartphone size={24}/>, val: stats.trustedDevices, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
        { label: 'Exception Queue', path: '/admin-exceptions', icon: <AlertTriangle size={24}/>, val: stats.pendingExceptions, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' }
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-800 p-8 flex justify-between items-center text-white">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center"><ShieldCheck className="mr-3 text-sovAccent"/> Central Command Center</h1>
                    <p className="text-gray-400 font-mono text-sm tracking-wider uppercase">SovereignShield Infrastructure Management</p>
                </div>
                <div className="hidden md:block text-right">
                    <div className="text-xs text-gray-500 font-mono uppercase mb-1">System State</div>
                    <div className="text-lg font-bold text-emerald-500 flex items-center"><div className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></div> FULLY OPERATIONAL</div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                 {navCards.map((card, idx) => (
                      <Link to={card.path} key={idx} className="bg-[#0f172a]/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/5 p-6 hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-all hover:border-blue-500/50 hover:-translate-y-1 group relative overflow-hidden">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 border ${card.bg} ${card.color} group-hover:scale-110 transition-transform`}>
                              {card.icon}
                          </div>
                          <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">{card.label}</h3>
                          <div className="text-3xl font-extrabold text-white">{card.val}</div>
                      </Link>
                 ))}
            </div>
            
            <div className="bg-[#0f172a]/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/5 p-6 md:p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-sovBlue rounded-full blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none"></div>
                <h3 className="text-lg font-bold text-slate-100 mb-6 flex items-center relative z-10">
                  <div className="p-2 bg-[#1e293b] rounded-lg mr-3 border border-white/5">
                    <Home className="h-5 w-5 text-blue-400"/>
                  </div>
                  System Overview
                </h3>
                <div className="text-sm text-slate-400 leading-relaxed max-w-3xl relative z-10 bg-[#1e293b]/30 p-5 rounded-xl border border-white/5">
                    <p className="mb-4 text-slate-300 font-medium">Admin Portal gives you root clearance over the SovereignShield digital infrastructure.</p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Monitor real-time network threats via the <strong className="text-emerald-400">Threat Radar</strong>.</li>
                        <li>Review anomalous ZKP failures in the <strong className="text-orange-400">Exception Queue</strong>.</li>
                        <li>Cryptographically audit the ledger under <strong className="text-blue-400">Tracking Ledger</strong>.</li>
                        <li>Trace citizen service interactions using <strong className="text-indigo-400">Audit Logs</strong>.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
