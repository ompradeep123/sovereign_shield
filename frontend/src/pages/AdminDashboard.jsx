import React, { useState, useEffect } from 'react';
import { api } from '../context/AuthContext';
import { Home, Users, Layers, AlertTriangle, Link as LinkIcon, ShieldCheck } from 'lucide-react';
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
        { label: 'Citizen Records', path: '/admin-citizens', icon: <Users size={24}/>, val: stats.totalUsers, color: 'text-blue-500', bg: 'bg-blue-50' },
        { label: 'Exception Queue', path: '/admin-exceptions', icon: <AlertTriangle size={24}/>, val: stats.pendingExceptions, color: 'text-orange-500', bg: 'bg-orange-50' },
        { label: 'Blockchain Integrity', path: '/admin-chain', icon: <LinkIcon size={24}/>, val: `${stats.blockchainHeight} Blocks`, color: 'text-emerald-500', bg: 'bg-emerald-50' },
        { label: 'Gov Services', path: '/admin-audit', icon: <Layers size={24}/>, val: stats.activeServices, color: 'text-indigo-500', bg: 'bg-indigo-50' }
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
                      <Link to={card.path} key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow hover:border-sovBlue group">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${card.bg} ${card.color} group-hover:scale-110 transition-transform`}>
                              {card.icon}
                          </div>
                          <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-1">{card.label}</h3>
                          <div className="text-3xl font-bold text-gray-900">{card.val}</div>
                      </Link>
                 ))}
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-sovNavy mb-4 flex items-center"><Home className="mr-2 h-5 w-5 text-sovBlue"/> Quick Actions Overview</h3>
                <div className="text-sm text-gray-600 leading-relaxed max-w-3xl">
                    <p className="mb-2">Admin Portal gives you root clearance over the SovereignShield digital infrastructure.</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Monitor real-time network threats via the <strong>Threat Radar</strong>.</li>
                        <li>Review anomalous ZKP failures in the <strong>Exception Queue</strong>.</li>
                        <li>Cryptographically audit the ledger under <strong>Blockchain Integrity</strong>.</li>
                        <li>Trace citizen service interactions using <strong>Audit Logs</strong>.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
