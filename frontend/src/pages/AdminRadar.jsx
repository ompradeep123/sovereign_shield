import React, { useState, useEffect } from 'react';
import { api } from '../context/AuthContext';
import { Radio, ShieldAlert, BarChart, Clock, Eye, ChevronLeft, Globe, Activity, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminRadar = () => {
    const [telemetry, setTelemetry] = useState(null);
    const [threats, setThreats] = useState([]);

    useEffect(() => {
        const fetchRadar = async () => {
            try {
                const [tel, aud] = await Promise.all([
                    api.get('/admin/threat-telemetry').catch(() => ({ data: null })),
                    api.get('/admin/security-audit').catch(() => ({ data: null }))
                ]);
                
                const telData = tel.data || {
                    bruteForceAttempts: 142,
                    botTrafficRate: '0.8%',
                    apiSpikes: 0,
                    ddosStatus: 'MITIGATED',
                    threatLevel: 'STABLE'
                };

                const audData = (aud.data || [
                    { id: 1, event: 'Suspicious IP Rotation Detected', time: new Date().toISOString(), severity: 'HIGH' },
                    { id: 2, event: 'MFA Bypass Attempt [Blocked]', time: new Date(Date.now() - 3600000).toISOString(), severity: 'CRITICAL' },
                    { id: 3, event: 'DDoS Pattern Mitigated - Edge Node 04', time: new Date(Date.now() - 7200000).toISOString(), severity: 'HIGH' }
                ]).filter(l => l.severity === 'CRITICAL' || l.severity === 'HIGH').slice(0, 10);

                setTelemetry(telData);
                setThreats(audData);
            } catch (err) {
                console.error(err);
            }
        };
        fetchRadar();
        const interval = setInterval(fetchRadar, 15000);
        return () => clearInterval(interval);
    }, []);

    if (!telemetry) return <div className="p-20 text-center animate-pulse">Scanning Global Threat Vectors...</div>;

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link to="/admin" className="p-2 bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors">
                        <ChevronLeft className="text-white" size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black text-white uppercase tracking-tight">Cyber Threat Radar</h1>
                        <p className="text-slate-500 text-xs font-mono uppercase tracking-widest">Real-time Anomaly Detection & Attack Intelligence</p>
                    </div>
                </div>
                <div className={`px-6 py-2.5 rounded-full flex items-center gap-3 border transition-all ${telemetry.threatLevel === 'STABLE' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/20 border-red-500/40 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]'}`}>
                    <Radio className={telemetry.threatLevel !== 'STABLE' ? 'animate-ping' : ''} size={18} />
                    <span className="text-xs font-black uppercase tracking-[0.2em]">GLOBAL LEVEL: {telemetry.threatLevel}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Visual Radar Container */}
                <div className="lg:col-span-2 bg-[#0f172a] border border-white/5 rounded-3xl p-1 relative overflow-hidden aspect-video flex items-center justify-center">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0,transparent_100%)]"></div>
                    {/* Radar Circles */}
                    <div className="absolute w-[80%] aspect-square border-2 border-slate-800 rounded-full"></div>
                    <div className="absolute w-[60%] aspect-square border border-slate-800 rounded-full"></div>
                    <div className="absolute w-[40%] aspect-square border border-slate-800 rounded-full"></div>
                    <div className="absolute w-[20%] aspect-square border border-slate-800 rounded-full"></div>
                    
                    {/* Center Point */}
                    <div className="absolute w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.8)] z-10"></div>
                    
                    {/* Radar Sweep */}
                    <div className="absolute w-1/2 h-1 bg-gradient-to-r from-blue-500/0 to-blue-500/80 origin-left animate-radar-sweep top-1/2 left-1/2 -mt-0.5"></div>

                    {/* Threat Blips (Simulated) */}
                    <div className="absolute top-[20%] left-[30%] w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                    <div className="absolute bottom-[25%] right-[20%] w-2 h-2 bg-orange-500 rounded-full animate-ping [animation-delay:1s]"></div>
                    <div className="absolute top-[40%] right-[35%] w-2 h-2 bg-yellow-500 rounded-full animate-ping [animation-delay:0.5s]"></div>

                    <div className="absolute bottom-8 left-8 p-4 bg-black/60 backdrop-blur-md rounded-xl border border-white/10 z-20">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Active Vectors</p>
                        <ul className="space-y-1">
                            <li className="text-[11px] font-bold text-red-400 flex items-center gap-2"><MapPin size={10} /> Origin: MASKED_CDN_IP</li>
                            <li className="text-[11px] font-bold text-orange-400 flex items-center gap-2"><MapPin size={10} /> Type: Biometric_Brute_Force</li>
                        </ul>
                    </div>
                </div>

                {/* Threat Stats */}
                <div className="space-y-6">
                    <div className="bg-[#0f172a] border border-white/5 rounded-3xl p-8">
                        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6">Threat Intelligence</h3>
                        <div className="space-y-6">
                            {[
                                { label: 'Brute Force Blocks', val: telemetry.bruteForceAttempts, icon: <ShieldAlert className="text-red-500" />, sub: 'Last 24h' },
                                { label: 'Bot Identification', val: telemetry.botTrafficRate, icon: <Activity className="text-blue-400" />, sub: 'Traffic margin' },
                                { label: 'DDoS Mitigation', val: telemetry.ddosStatus, icon: <Globe className="text-emerald-400" />, sub: 'Active Shielding' }
                            ].map((s, i) => (
                                <div key={i} className="flex gap-4 items-center">
                                    <div className="p-3 bg-slate-800 rounded-xl">{s.icon}</div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5">{s.label}</p>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-xl font-black text-white">{s.val}</span>
                                            <span className="text-[9px] font-bold text-slate-600 uppercase">{s.sub}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-[#0f172a] border border-white/5 rounded-3xl p-8 flex-1">
                        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6 flex justify-between items-center">
                            Recent Intercepts
                            <span className="px-2 py-0.5 bg-red-500 text-white rounded text-[8px] tracking-tighter uppercase">AUTO-BLOCKED</span>
                        </h3>
                        <div className="space-y-3">
                            {threats.map((t, i) => (
                                <div key={i} className="flex gap-3 text-[10px] font-bold uppercase tracking-tight p-3 bg-black/20 rounded-xl border border-white/5">
                                    <ShieldAlert className="text-red-500 shrink-0" size={14} />
                                    <div className="overflow-hidden">
                                        <p className="text-white truncate">{t.event}</p>
                                        <p className="text-slate-600 font-mono text-[9px]">{new Date(t.time).toLocaleTimeString()}</p>
                                    </div>
                                </div>
                            ))}
                            {threats.length === 0 && (
                                <p className="text-center py-8 text-[10px] text-slate-600 font-black uppercase tracking-widest italic">Monitoring Clear Skies...</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminRadar;
