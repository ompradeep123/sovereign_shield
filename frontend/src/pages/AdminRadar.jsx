import React, { useState, useEffect } from 'react';
import { api } from '../context/AuthContext';
import { ShieldAlert, Users, Network, ActivitySquare, AlertTriangle } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const AdminRadar = () => {
    const [radarData, setRadarData] = useState(null);

    const fetchRadar = async () => {
        try {
            const res = await api.get('/admin/radar');
            setRadarData(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchRadar();
        const interval = setInterval(fetchRadar, 5000); // Live poll
        return () => clearInterval(interval);
    }, []);

    if (!radarData) return <div className="p-8 text-center text-gray-500 font-mono tracking-widest animate-pulse">SIEM INITIALIZING...</div>;

    const chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Threat Mitigations',
                data: [12, 19, 3, 5, 2, 3],
                fill: true,
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                borderColor: 'rgb(239, 68, 68)',
            },
            {
                label: 'Secure Connections',
                data: [45, 60, 55, 80, 75, radarData.totalUsers * 10],
                fill: true,
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                borderColor: 'rgb(16, 185, 129)',
            }
        ],
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6 mt-4">
            <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-white/5 rounded-2xl shadow-2xl p-6 lg:p-8 text-white overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-red-500 opacity-10 group-hover:opacity-20 transition-opacity duration-700 blur-[120px] rounded-full pointer-events-none"></div>
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-white/5 pb-6 gap-4 relative z-10">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-extrabold flex items-center tracking-tight text-white mb-2"><ActivitySquare className="text-red-500 mr-4 shrink-0 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]" size={36}/> National Threat Radar</h2>
                        <p className="text-slate-400 uppercase text-xs tracking-widest font-mono font-bold">Quantum-Resistant Telemetry</p>
                    </div>
                    <div className="bg-[#1e293b]/50 p-4 rounded-xl border border-white/5 text-center shadow-inner w-full md:w-auto backdrop-blur-sm">
                        <div className="text-xs text-slate-400 font-mono mb-2 uppercase tracking-widest font-bold">Defcon Level</div>
                        <div className={`text-3xl font-black ${radarData.systemThreatLevel === 'HIGH' ? 'text-red-500 animate-pulse drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]'}`}>
                            {radarData.systemThreatLevel}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 relative z-10">
                    <div className="bg-[#1e293b]/50 p-6 rounded-xl border border-white/5 flex items-center justify-between hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:-translate-y-1 transition-all">
                        <div><p className="text-slate-400 text-xs font-mono uppercase font-bold tracking-widest">Active Nodes</p><h3 className="text-3xl font-black mt-2 text-white">{radarData.totalUsers}</h3></div>
                        <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20"><Network className="text-blue-400 h-8 w-8"/></div>
                    </div>
                    <div className="bg-[#1e293b]/50 p-6 rounded-xl border border-white/5 flex items-center justify-between hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:-translate-y-1 transition-all">
                        <div><p className="text-slate-400 text-xs font-mono uppercase font-bold tracking-widest">DDoS Mitigated</p><h3 className="text-3xl font-black mt-2 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]">1.2M</h3></div>
                        <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20"><ShieldAlert className="text-emerald-400 h-8 w-8"/></div>
                    </div>
                    <div className="bg-[#1e293b]/50 p-6 rounded-xl border border-white/5 flex items-center justify-between col-span-1 md:col-span-2 hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:-translate-y-1 transition-all">
                        <div><p className="text-slate-400 text-xs font-mono uppercase font-bold tracking-widest">Failed Authentication Attempts</p><h3 className="text-3xl font-black mt-2 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">{radarData.failedLogins}</h3></div>
                        <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20"><AlertTriangle className="text-red-500 h-8 w-8 animate-pulse"/></div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
                    <div className="col-span-1 lg:col-span-2 bg-[#1e293b]/30 p-6 rounded-xl border border-white/5 shadow-inner">
                        <h3 className="text-xs font-mono text-slate-400 uppercase font-bold tracking-widest mb-6 border-b border-white/5 pb-3">Network Traffic Metrics</h3>
                        <div className="h-64">
                             <Line data={chartData} options={{ maintainAspectRatio: false, plugins: { legend: { labels: { color: '#cbd5e1' } } }, scales: { x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } }, y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } } } }} />
                        </div>
                    </div>

                    <div className="bg-[#1e293b]/30 p-6 rounded-xl border border-white/5 overflow-y-auto max-h-[340px] custom-scrollbar shadow-inner text-sm">
                        <h3 className="text-xs font-mono text-slate-400 uppercase font-bold tracking-widest mb-6 border-b border-white/5 pb-3 flex items-center"><ShieldAlert size={16} className="mr-2 text-red-500"/> Live Penetration Logs</h3>
                        <div className="space-y-3 font-mono">
                             {radarData.recentThreats.length === 0 ? <p className="text-emerald-500 font-bold p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20 text-xs">No threats detected.</p> : null}
                             {radarData.recentThreats.map((t, idx) => (
                                 <div key={idx} className={`p-3 rounded-lg border-l-4 ${t.severity === 'HIGH' ? 'bg-[#0f172a] border-red-500 text-red-400' : 'bg-[#0f172a] border-yellow-500 text-yellow-400'} text-xs border border-white/5 shadow-sm`}>
                                     <div className="flex justify-between font-bold mb-2 tracking-wide">
                                        <span>[{t.severity}] {t.ip || 'UNKNOWN'}</span>
                                        <span className="text-slate-500">{new Date(t.timestamp).toLocaleTimeString()}</span>
                                     </div>
                                     <div className="text-slate-400 break-all bg-black/20 p-2 rounded">{t.message} ➔ {t.path}</div>
                                 </div>
                             ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminRadar;
