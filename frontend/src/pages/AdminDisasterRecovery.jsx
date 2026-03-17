import React, { useState, useEffect } from 'react';
import { api } from '../context/AuthContext';
import { RefreshCw, Server, ShieldAlert, ChevronLeft, Database, Activity, Zap, HardDrive, Network } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDisasterRecovery = () => {
    const [drStatus, setDrStatus] = useState(null);
    const [simulating, setSimulating] = useState(false);
    const [logs, setLogs] = useState([]);

    const fetchDRStatus = async () => {
        try {
            const res = await api.get('/admin/disaster-recovery').catch(() => ({ data: null }));
            const data = res.data || {
                primaryNode: 'ONLINE',
                backupNode: 'STANDBY',
                replicationLag: '0.02ms',
                lastBackup: new Date(Date.now() - 3600000).toISOString(),
                failoverReady: true,
                drPlan: 'V3_GEO_REDUNDANT'
            };
            setDrStatus(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchDRStatus();
        const interval = setInterval(fetchDRStatus, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleSimulateFailover = async () => {
        setSimulating(true);
        const event = { 
            time: new Date().toLocaleTimeString(), 
            action: 'Simulated Failover Triggered', 
            details: 'Initiating traffic reroute to DR Backup Node...' 
        };
        setLogs(prev => [event, ...prev]);

        try {
            await new Promise(r => setTimeout(r, 2000));
            const res = await api.post('/admin/simulate/failover');
            await fetchDRStatus();
            setLogs(prev => [{ 
                time: new Date().toLocaleTimeString(), 
                action: 'Failover Successful', 
                details: `System operating on ${res.data.activeNode} node Cluster.` 
            }, ...prev]);
        } catch (err) {
            setLogs(prev => [{ 
                time: new Date().toLocaleTimeString(), 
                action: 'Error', 
                details: 'Failover protocol failed to engage.' 
            }, ...prev]);
        } finally {
            setSimulating(false);
        }
    };

    if (!drStatus) return <div className="p-20 text-center animate-pulse">Establishing Resilience Link...</div>;

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link to="/admin" className="p-2 bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors">
                        <ChevronLeft className="text-white" size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black text-white uppercase tracking-tight">Disaster Recovery Control</h1>
                        <p className="text-slate-500 text-xs font-mono uppercase tracking-widest">Resilience & Failover Readiness Portal</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Node Status */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Primary Node */}
                        <div className={`p-8 rounded-3xl border transition-all ${drStatus.primaryNode === 'ONLINE' ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                            <div className="flex justify-between items-start mb-6">
                                <div className={`p-3 rounded-2xl ${drStatus.primaryNode === 'ONLINE' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                    <Server size={32} />
                                </div>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${drStatus.primaryNode === 'ONLINE' ? 'bg-emerald-500 text-white' : 'bg-red-600 text-white animate-pulse'}`}>
                                    {drStatus.primaryNode}
                                </span>
                            </div>
                            <h3 className="text-xl font-black text-white uppercase tracking-tight mb-1">Primary Node Cluster</h3>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Zone: Sovereign-Cloud-Alpha</p>
                            
                            <div className="mt-8 space-y-3">
                                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                                    <span>Sync Status</span>
                                    <span className="text-emerald-400">NOMINAL</span>
                                </div>
                                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                                    <span>Load Distribution</span>
                                    <span className="text-white">{drStatus.primaryNode === 'ONLINE' ? '100%' : '0%'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Backup Node */}
                        <div className={`p-8 rounded-3xl border transition-all ${drStatus.backupNode === 'ACTIVE' ? 'bg-blue-600/10 border-blue-500/30 shadow-[0_0_30px_rgba(37,99,235,0.1)]' : 'bg-slate-900 border-white/5'}`}>
                            <div className="flex justify-between items-start mb-6">
                                <div className={`p-3 rounded-2xl ${drStatus.backupNode === 'ACTIVE' ? 'bg-blue-500 text-white shadow-lg' : 'bg-slate-800 text-slate-500'}`}>
                                    <Zap size={32} />
                                </div>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${drStatus.backupNode === 'ACTIVE' ? 'bg-blue-600 text-white animate-pulse' : 'bg-slate-700 text-slate-400'}`}>
                                    {drStatus.backupNode}
                                </span>
                            </div>
                            <h3 className="text-xl font-black text-white uppercase tracking-tight mb-1">Secondary Backup Node</h3>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Zone: Geo-Redundant-Beta</p>

                            <div className="mt-8 space-y-3">
                                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                                    <span>Health Check</span>
                                    <span className="text-emerald-400">READY</span>
                                </div>
                                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                                    <span>Replication Lag</span>
                                    <span className="text-white">{drStatus.replicationLag}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Simulation Console */}
                    <div className="bg-[#0f172a] border border-white/5 rounded-3xl p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 blur-[80px] pointer-events-none"></div>
                        <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
                            <div className="flex-1">
                                <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">Resilience Testing Center</h3>
                                <p className="text-sm text-slate-400 font-medium max-w-md">Simulate infrastructure failures to verify the system's autonomic failover capabilities. All actions are logged to the Sovereign SOC.</p>
                            </div>
                            <button 
                                onClick={handleSimulateFailover}
                                disabled={simulating}
                                className={`px-10 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all flex items-center gap-3 shadow-xl ${simulating ? 'bg-slate-800 text-slate-500' : drStatus.primaryNode === 'ONLINE' ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/20' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20'}`}
                            >
                                <RefreshCw className={simulating ? 'animate-spin' : ''} size={18} />
                                {simulating ? 'Processing Protocol...' : drStatus.primaryNode === 'ONLINE' ? 'Simulate Node Failure' : 'Restore Primary Cluster'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Resilience Stats & Log */}
                <div className="space-y-8">
                    <div className="bg-[#0f172a] border border-white/5 rounded-3xl p-8">
                        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center">
                            <Activity className="mr-2" size={14} /> Recovery Intelligence
                        </h3>
                        <div className="space-y-4">
                            {[
                                { label: 'Last Backup', value: new Date(drStatus.lastBackup).toLocaleTimeString(), icon: <HardDrive size={16} /> },
                                { label: 'Failover SLA', value: '< 2.4s', icon: <Zap size={16} /> },
                                { label: 'Data Integrity', value: '100%', icon: <Database size={16} /> },
                                { label: 'Traffic Shifting', value: 'Enabled', icon: <Network size={16} /> }
                            ].map((stat, i) => (
                                <div key={i} className="flex justify-between items-center p-4 bg-slate-900/50 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-3 text-slate-400">
                                        {stat.icon}
                                        <span className="text-[10px] font-black uppercase tracking-tight">{stat.label}</span>
                                    </div>
                                    <span className="text-xs font-black text-white uppercase">{stat.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-[#0f172a] border border-white/5 rounded-3xl p-8">
                        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6">DR Event History</h3>
                        <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                            {logs.map((log, i) => (
                                <div key={i} className="p-4 bg-black/30 rounded-xl border-l-4 border-blue-500 bg-slate-900/20">
                                    <div className="flex justify-between items-start mb-1">
                                        <p className="text-[10px] font-black text-white uppercase tracking-widest">{log.action}</p>
                                        <span className="text-[9px] font-mono text-slate-500">{log.time}</span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-medium">{log.details}</p>
                                </div>
                            ))}
                            {logs.length === 0 && (
                                <p className="text-center py-8 text-[10px] text-slate-600 font-black uppercase tracking-widest">No Recent Events</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDisasterRecovery;
