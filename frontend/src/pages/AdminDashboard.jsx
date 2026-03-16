import React, { useState, useEffect } from 'react';
import { api } from '../context/AuthContext';
import { 
    Activity, ShieldAlert, Database, Cloud, Zap, 
    Lock, RefreshCw, BarChart3, Radio, Server,
    ShieldCheck, Smartphone, Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';
import BiometricGuard from '../components/BiometricGuard';

const AdminDashboard = () => {
    const [telemetry, setTelemetry] = useState(null);
    const [health, setHealth] = useState([]);
    const [socVerified, setSocVerified] = useState(false);

    useEffect(() => {
        const fetchSOCData = async () => {
            try {
                const [mon, hlt] = await Promise.all([
                    api.get('/admin/monitoring'),
                    api.get('/admin/health-overview')
                ]);
                setTelemetry(mon.data);
                setHealth(hlt.data);
            } catch (err) {
                console.error('SOC Fetch Error:', err);
            }
        };
        fetchSOCData();
        const interval = setInterval(fetchSOCData, 5000);
        return () => clearInterval(interval);
    }, []);

    if (!socVerified) return (
        <div className="p-20 flex flex-col items-center justify-center space-y-8 animate-scale-in">
            <div className="w-24 h-24 bg-blue-600/10 rounded-full flex items-center justify-center border border-blue-500/20 shadow-[0_0_50px_rgba(37,99,235,0.2)]">
                <Lock className="text-blue-500" size={40} />
            </div>
            <div className="text-center">
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Identity Confirmation Required</h2>
                <p className="text-slate-500 font-mono text-xs uppercase tracking-[0.2em] mt-2">Zero Trust: Re-verify biometrics for Level-9 SOC access</p>
            </div>
            <BiometricGuard 
                isOpen={true} 
                serviceName="SOC Central Command" 
                onVerified={() => setSocVerified(true)} 
                onCancel={() => window.history.back()}
            />
        </div>
    );

    if (!telemetry) return <div className="p-20 text-center text-blue-500 font-mono animate-pulse uppercase tracking-[0.5em]">Establishing Secure SOC Link...</div>;

    const socModules = [
        { label: 'System Monitoring', path: '/admin/monitoring', icon: <Activity />, desc: 'Live Infrastructure Telemetry', color: 'text-blue-400' },
        { label: 'Security Audit', path: '/admin/security-audit', icon: <Lock />, desc: 'Privacy-Preserving Logs', color: 'text-emerald-400' },
        { label: 'Threat Radar', path: '/admin/radar', icon: <Radio />, desc: 'Cyber Attack Intelligence', color: 'text-red-400' },
        { label: 'Disaster Recovery', path: '/admin/disaster-recovery', icon: <RefreshCw />, desc: 'Failover & Resilience Hub', color: 'text-orange-400' }
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20">
            {/* SOC Header */}
            <div className="bg-[#0f172a] border border-blue-500/20 rounded-3xl p-8 relative overflow-hidden shadow-[0_0_50px_rgba(30,58,138,0.3)]">
                <div className="absolute top-0 right-0 p-4 bg-blue-600/10 border-b border-l border-white/5 rounded-bl-2xl">
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Clearance: Level 9 SOC ADMIN</span>
                </div>
                
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">SovereignShield SOC</h1>
                        <p className="text-blue-400 font-mono text-xs uppercase tracking-[0.3em]">National Cybersecurity Operations Center</p>
                    </div>
                    
                    <div className="flex gap-4">
                        <div className="bg-black/40 border border-white/5 p-4 rounded-2xl text-center min-w-[120px]">
                            <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Global Health</div>
                            <div className="text-xl font-black text-emerald-500 uppercase tracking-tighter">Operational</div>
                        </div>
                        <div className="bg-black/40 border border-white/5 p-4 rounded-2xl text-center min-w-[120px]">
                            <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Threat Level</div>
                            <div className="text-xl font-black text-blue-500 uppercase tracking-tighter">Safe</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Metrics Multi-Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'API Throughput', val: `${telemetry.apiTraffic} req/m`, icon: <Zap className="text-yellow-400" /> },
                    { label: 'CPU Cluster Load', val: `${telemetry.cpuUsage}%`, icon: <Server className="text-blue-400" /> },
                    { label: 'Latency (Avg)', val: `${telemetry.latency}ms`, icon: <Activity className="text-emerald-400" /> },
                    { label: 'Error Margin', val: `${telemetry.errorRate}%`, icon: <ShieldAlert className="text-red-400" /> }
                ].map((m, i) => (
                    <div key={i} className="bg-slate-900/50 backdrop-blur-md border border-white/5 p-6 rounded-2xl hover:border-blue-500/30 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-slate-800 rounded-lg">{m.icon}</div>
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        </div>
                        <p className="text-xs font-bold text-slate-500 uppercase mb-1">{m.label}</p>
                        <p className="text-2xl font-black text-white tracking-tight">{m.val}</p>
                    </div>
                ))}
            </div>

            {/* SOC Modules Navigation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {socModules.map((mod, i) => (
                    <Link to={mod.path} key={i} className="group bg-[#0f172a]/80 border border-white/5 p-8 rounded-3xl hover:border-blue-500/50 transition-all shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-[60px] group-hover:bg-blue-600/10"></div>
                        <div className="flex items-center gap-6 relative z-10">
                            <div className={`w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center ${mod.color} group-hover:scale-110 transition-transform shadow-lg`}>
                                {React.cloneElement(mod.icon, { size: 32 })}
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-white uppercase tracking-tight">{mod.label}</h3>
                                <p className="text-sm text-slate-400 font-medium">{mod.desc}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Infrastructure Health Ticker */}
            <div className="bg-black/50 border border-white/5 rounded-3xl p-8">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center">
                    <Database className="mr-2" size={14} /> Service Health Pulse
                </h3>
                <div className="space-y-4">
                    {health.map((h, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-slate-900/30 rounded-xl border border-white/5">
                            <div className="flex items-center gap-4">
                                <div className={`w-2 h-2 rounded-full ${h.status === 'Operational' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-orange-500'}`}></div>
                                <span className="text-sm font-bold text-slate-300 uppercase tracking-widest">{h.service}</span>
                            </div>
                            <div className="flex items-center gap-8">
                                <span className="text-[10px] font-mono text-slate-500 uppercase">Uptime: {h.uptime}</span>
                                <span className="text-xs font-black text-emerald-400 uppercase tracking-tighter">{h.status}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
