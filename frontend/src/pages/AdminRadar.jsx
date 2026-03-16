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
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-2xl p-6 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-500 opacity-5 blur-[100px] rounded-full"></div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-gray-800 pb-4 gap-4">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold flex items-center tracking-tight"><ActivitySquare className="text-red-500 mr-3 shrink-0" size={32}/> National Threat Radar</h2>
                        <p className="text-gray-400 mt-1 uppercase text-xs md:text-sm tracking-widest font-mono">Quantum-Resistant Telemetry</p>
                    </div>
                    <div className="bg-gray-800 p-3 rounded-lg border border-gray-700 text-center shadow-inner w-full md:w-auto">
                        <div className="text-xs text-gray-400 font-mono mb-1 uppercase tracking-wider">Defcon Level</div>
                        <div className={`text-2xl font-bold ${radarData.systemThreatLevel === 'HIGH' ? 'text-red-500 animate-pulse' : 'text-emerald-500'}`}>
                            {radarData.systemThreatLevel}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gray-800 p-5 rounded-lg border border-gray-700 flex items-center justify-between">
                        <div><p className="text-gray-400 text-xs font-mono uppercase">Active Nodes</p><h3 className="text-2xl font-bold mt-1">{radarData.totalUsers}</h3></div>
                        <Network className="text-blue-500 h-10 w-10 opacity-50"/>
                    </div>
                    <div className="bg-gray-800 p-5 rounded-lg border border-gray-700 flex items-center justify-between">
                        <div><p className="text-gray-400 text-xs font-mono uppercase">DDoS Mitigated</p><h3 className="text-2xl font-bold mt-1 text-emerald-400">1.2M</h3></div>
                        <ShieldAlert className="text-emerald-500 h-10 w-10 opacity-50"/>
                    </div>
                    <div className="bg-gray-800 p-5 rounded-lg border border-gray-700 flex items-center justify-between col-span-2">
                        <div><p className="text-gray-400 text-xs font-mono uppercase">Failed Authentication Attempts</p><h3 className="text-2xl font-bold mt-1 text-red-400">{radarData.failedLogins}</h3></div>
                        <AlertTriangle className="text-red-500 h-10 w-10 opacity-50 animate-pulse"/>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="col-span-2 bg-gray-800 p-5 rounded-lg border border-gray-700 shadow-inner">
                        <h3 className="text-sm font-mono text-gray-400 uppercase mb-4 tracking-widest border-b border-gray-700 pb-2">Network Traffic Metrics</h3>
                        <div className="h-64">
                             <Line data={chartData} options={{ maintainAspectRatio: false, scales: { x: { grid: { color: '#374151' } }, y: { grid: { color: '#374151' } } } }} />
                        </div>
                    </div>

                    <div className="bg-gray-800 p-5 rounded-lg border border-gray-700 overflow-y-auto max-h-80 custom-scrollbar shadow-inner text-sm">
                        <h3 className="text-sm font-mono text-gray-400 uppercase mb-4 tracking-widest border-b border-gray-700 pb-2 flex items-center"><ShieldAlert size={14} className="mr-2 text-red-500"/> Live Penetration Logs</h3>
                        <div className="space-y-3 font-mono text-gray-300">
                             {radarData.recentThreats.length === 0 ? <p className="text-emerald-500 text-xs">No threats detected.</p> : null}
                             {radarData.recentThreats.map((t, idx) => (
                                 <div key={idx} className={`p-2 rounded border-l-4 ${t.severity === 'HIGH' ? 'bg-red-900 border-red-500 text-red-100' : 'bg-yellow-900 border-yellow-500 text-yellow-100'} text-xs`}>
                                     <div className="flex justify-between font-bold mb-1">
                                        <span>[{t.severity}] {t.ip || 'UNKNOWN'}</span>
                                        <span>{new Date(t.timestamp).toLocaleTimeString()}</span>
                                     </div>
                                     <div className="text-gray-300 break-all">{t.message} ➔ {t.path}</div>
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
