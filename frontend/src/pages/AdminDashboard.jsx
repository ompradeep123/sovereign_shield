import React, { useState, useEffect } from 'react';
import { api } from '../context/AuthContext';
import { 
    Activity, ShieldAlert, Database, Lock, RefreshCw, BarChart3, Radio, Server,
    ShieldCheck, Smartphone, Eye, LayoutGrid, ChevronRight, Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import BiometricGuard from '../components/BiometricGuard';

const MODULES_CONFIG = [
    { label: 'System Monitoring', path: '/admin/monitoring', Icon: Activity, desc: 'Live Infrastructure Telemetry', color: 'text-blue-400' },
    { label: 'Security Audit', path: '/admin/security-audit', Icon: Lock, desc: 'Privacy-Preserving Logs', color: 'text-emerald-400' },
    { label: 'Threat Radar', path: '/admin/radar', Icon: Radio, desc: 'Cyber Attack Intelligence', color: 'text-red-400' },
    { label: 'Disaster Recovery', path: '/admin/disaster-recovery', Icon: RefreshCw, desc: 'Failover & Resilience Hub', color: 'text-orange-400' }
];

const AdminDashboard = () => {
    const [telemetry, setTelemetry] = useState(null);
    const [health, setHealth] = useState([]);
    const [socVerified, setSocVerified] = useState(false);
    const [loading, setLoading] = useState(true);
    const [renderError, setRenderError] = useState(null);

    const fetchSOCData = async () => {
        try {
            const [mon, hlt] = await Promise.all([
                api.get('/admin/monitoring'),
                api.get('/admin/health-overview')
            ]);
            setTelemetry(mon.data || {});
            setHealth(hlt.data || []);
        } catch (err) {
            console.error('SOC Fetch Error:', err);
            setTelemetry({}); // Non-null fallback
            setHealth([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSOCData();
        const interval = setInterval(fetchSOCData, 5000);
        return () => clearInterval(interval);
    }, []);

    // Safety: Render error catcher
    if (renderError) {
        return (
            <div className="p-20 text-center text-red-500 font-mono">
                <ShieldAlert size={48} className="mx-auto mb-4" />
                <h1 className="text-xl font-bold uppercase mb-2">SOC Logic Component Breach</h1>
                <p className="text-xs opacity-70">A rendering failure occurred in the Command Center. Trace logged to console.</p>
                <button onClick={() => setRenderError(null)} className="mt-6 px-4 py-2 bg-red-600 text-white rounded">Retry Initialization</button>
            </div>
        );
    }

    try {
        if (!socVerified) {
            return (
                <div className="p-20 flex flex-col items-center justify-center space-y-8 fade-in">
                    <div className="w-24 h-24 bg-blue-600/10 rounded-full flex items-center justify-center border border-blue-500/20">
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
        }

        if (loading || !telemetry) {
            return (
                <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
                    <div className="w-12 h-12 border-2 border-blue-500/10 border-t-blue-500 rounded-full animate-spin"></div>
                    <p className="text-blue-500 font-mono text-[10px] uppercase tracking-[0.5em] animate-pulse">Synchronizing Cryptographic Streams...</p>
                </div>
            );
        }

        return (
            <div className="max-w-7xl mx-auto space-y-8 pb-24 animate-scale-in">
                {/* SOC Header */}
                <div className="bg-[#0f172a] border border-blue-500/20 rounded-3xl p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 bg-blue-600/10 border-b border-l border-white/5 rounded-bl-2xl">
                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Clearance: Level 9 SOC ADMIN</span>
                    </div>
                    <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-8">
                        <div>
                            <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">SovereignShield SOC</h1>
                            <p className="text-blue-400 font-mono text-[10px] uppercase tracking-[0.4em] opacity-80">Cybersecurity Operations Hub</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="bg-black/40 border border-white/5 p-4 rounded-xl text-center min-w-[130px]">
                                <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Grid Health</div>
                                <div className="text-lg font-black text-emerald-500 uppercase">ONLINE</div>
                            </div>
                            <div className="bg-black/40 border border-white/5 p-4 rounded-xl text-center min-w-[130px]">
                                <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Alert Status</div>
                                <div className="text-lg font-black text-blue-400 uppercase tracking-tight">NOMINAL</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: 'API Throughput', val: `${telemetry?.apiTraffic || 0} r/m`, icon: Zap, color: 'text-yellow-400' },
                        { label: 'Cluster Load', val: `${telemetry?.cpuUsage || 0}%`, icon: Server, color: 'text-blue-400' },
                        { label: 'Request Latency', val: `${telemetry?.latency || 0}ms`, icon: Activity, color: 'text-emerald-400' },
                        { label: 'System Errors', val: `${telemetry?.errorRate || 0}%`, icon: ShieldAlert, color: 'text-red-400' }
                    ].map((m, i) => {
                        const Icon = m.icon;
                        return (
                            <div key={i} className="bg-[#0f172a] border border-white/5 p-6 rounded-2xl hover:border-blue-500/30 transition-all group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2.5 bg-slate-900 rounded-xl">
                                        <Icon className={m.color} size={20} />
                                    </div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                </div>
                                <p className="text-[10px] font-black text-slate-500 uppercase mb-1 tracking-widest">{m.label}</p>
                                <p className="text-2xl font-black text-white">{m.val}</p>
                            </div>
                        );
                    })}
                </div>

                {/* Command Modules */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {MODULES_CONFIG.map((mod, i) => {
                        const Icon = mod.Icon;
                        return (
                            <Link to={mod.path} key={i} className="group bg-[#0f172a]/95 border border-white/5 p-8 rounded-[2rem] hover:border-blue-500/50 transition-all shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-[80px] group-hover:bg-blue-600/10"></div>
                                <div className="flex items-center gap-8 relative z-10 text-white">
                                    <div className={`w-16 h-16 rounded-2xl bg-black/40 flex items-center justify-center ${mod.color} group-hover:scale-110 transition-transform`}>
                                        <Icon size={32} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-black uppercase tracking-tight">{mod.label}</h3>
                                        <p className="text-sm text-slate-500 font-medium mt-1">{mod.desc}</p>
                                    </div>
                                    <ChevronRight className="text-slate-800 group-hover:text-blue-500 transition-all" size={24} />
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Infra Pulse */}
                <div className="bg-[#0f172a] border border-white/5 rounded-[2rem] p-8">
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6 flex items-center px-2">
                        <Database className="mr-3 opacity-50" size={14} /> Service Pulse Matrix
                    </h3>
                    <div className="space-y-4 px-2">
                        {(health || []).map((h, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-white/5 hover:border-blue-500/20 transition-all">
                                <div className="flex items-center gap-5">
                                    <div className={`w-2 h-2 rounded-full ${h.status === 'Operational' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-orange-500'}`}></div>
                                    <span className="text-sm font-bold text-slate-300 uppercase tracking-widest">{h?.service || 'NODE'}</span>
                                </div>
                                <div className="flex items-center gap-8">
                                    <span className="hidden md:block text-[10px] font-mono text-slate-600 uppercase">Uptime: {h?.uptime || '---'}</span>
                                    <span className={`text-[11px] font-black uppercase tracking-widest ${h?.status === 'Operational' ? 'text-emerald-500' : 'text-orange-400'}`}>{h?.status || 'OFFLINE'}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    } catch (e) {
        console.error('Fatal SOC Render Error:', e);
        setRenderError(e.message);
        return null;
    }
};

export default AdminDashboard;
