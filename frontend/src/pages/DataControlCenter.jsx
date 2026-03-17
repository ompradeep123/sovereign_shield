import React, { useState, useEffect } from 'react';
import { api } from '../context/AuthContext';
import { 
  Shield, 
  History, 
  ToggleLeft, 
  ToggleRight, 
  AlertCircle, 
  CheckCircle2, 
  Fingerprint, 
  Activity,
  Eye,
  Lock,
  ChevronRight,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const DataControlCenter = () => {
    const { t } = useLanguage();
    const [history, setHistory] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [requests, setRequests] = useState([]);
    const [scoreData, setScoreData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [hist, perms, reqs, score] = await Promise.all([
                api.get('/privacy/access-history').catch(e => ({ data: [] })),
                api.get('/privacy/permissions').catch(e => ({ data: [] })),
                api.get('/privacy/requests').catch(e => ({ data: [] })),
                api.get('/privacy/transparency-score').catch(e => ({ data: null }))
            ]);
            setHistory(hist.data || []);
            setPermissions(perms.data || []);
            setRequests(reqs.data || []);
            setScoreData(score.data);
        } catch (err) {
            console.error('Data Control Fetch Error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const togglePermission = async (perm) => {
        const nextStatus = perm.permission_status === 'allow' ? 'deny' : 'allow';
        try {
            await api.post('/privacy/permissions/update', {
                service_name: perm.service_name,
                attribute: perm.attribute,
                permission_status: nextStatus
            });
            setPermissions(prev => prev.map(p => 
                (p.service_name === perm.service_name && p.attribute === perm.attribute) 
                ? { ...p, permission_status: nextStatus } 
                : p
            ));
        } catch (err) {
            console.error('Update Permission Error:', err);
        }
    };

    const handleRequest = async (requestId, action) => {
        try {
            await api.post('/privacy/requests/respond', { requestId, action });
            setRequests(prev => prev.filter(r => r.id !== requestId));
        } catch (err) {
            console.error('Request Action Error:', err);
        }
    };

    if (loading) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
            <p className="text-slate-500 font-mono text-xs uppercase tracking-[0.2em] animate-pulse">Syncing Privacy Ledger...</p>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto space-y-10 pb-20 animate-fade-in px-4 sm:px-0">
            {/* Header & Score Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2">
                    <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight mb-2">
                        {t('data_control')}
                    </h1>
                    <p className="text-slate-500 font-medium max-w-2xl">
                        Empowering citizens with full transparency and autonomic control over their personal data usage across government services.
                    </p>
                </div>

                {/* Transparency Score Card */}
                <div className="bg-[#0f172a] border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden group shadow-2xl">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px] rounded-full"></div>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Transparency Score</h3>
                        <ShieldCheck className="text-emerald-400" size={20} />
                    </div>
                    
                    <div className="flex items-baseline gap-4 mb-6">
                        <span className="text-6xl font-black text-white tabular-nums">{scoreData?.score}%</span>
                        <div className="flex flex-col">
                            <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider">High Trust</span>
                            <span className="text-slate-600 text-[10px] font-bold uppercase">Profile Optimal</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        {scoreData?.factors.map((f, i) => (
                            <div key={i} className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                                <span className={f.active ? 'text-slate-400' : 'text-slate-600'}>{f.name}</span>
                                <span className={f.active ? 'text-emerald-400' : 'text-slate-700'}>{f.active ? 'ACTIVE' : 'INACTIVE'}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Active Data Requests Section */}
            {requests.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                        <AlertCircle className="text-blue-500" size={18} />
                        <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Action Required: Data Access Requests</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {requests.map((req) => (
                            <div key={req.id} className="bg-blue-600/5 border border-blue-500/20 p-6 rounded-3xl flex flex-col sm:flex-row justify-between items-center gap-6 group hover:border-blue-500/40 transition-all">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[10px] font-black bg-blue-500 text-white px-2 py-0.5 rounded">{req.id}</span>
                                        <h4 className="text-sm font-black text-white uppercase">{req.service}</h4>
                                    </div>
                                    <p className="text-xs text-slate-400 font-medium mb-3">Requesting access to: <span className="text-blue-400 font-bold">{req.attribute}</span></p>
                                    <p className="text-[10px] text-slate-500 font-mono uppercase italic italic">{req.purpose}</p>
                                </div>
                                <div className="flex gap-2 shrink-0">
                                    <button onClick={() => handleRequest(req.id, 'reject')} className="px-6 py-2.5 bg-slate-800 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500/10 hover:text-red-400 transition-all">Deny</button>
                                    <button onClick={() => handleRequest(req.id, 'approve')} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:shadow-blue-500/20 transition-all">Allow</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 2. DATA PERMISSION MANAGEMENT */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Lock className="text-slate-500" size={18} />
                        <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Data Permissions</h2>
                    </div>
                    <div className="bg-[#0f172a] border border-white/5 rounded-[2.5rem] p-6 space-y-4 shadow-xl">
                        {permissions.map((perm, i) => (
                            <div key={i} className="p-4 bg-slate-900/50 border border-white/5 rounded-2xl flex justify-between items-center group hover:border-blue-500/20 transition-all">
                                <div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5">{perm.service_name}</p>
                                    <p className="text-xs font-bold text-white uppercase tracking-tight">{perm.attribute}</p>
                                </div>
                                <button 
                                    onClick={() => togglePermission(perm)}
                                    className={`p-2 rounded-xl transition-all ${perm.permission_status === 'allow' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}
                                >
                                    {perm.permission_status === 'allow' ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                                </button>
                            </div>
                        ))}
                        <div className="pt-4 mt-4 border-t border-white/5 text-center">
                            <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest leading-relaxed">
                                <Shield className="inline-block mr-1" size={10} />
                                Zero-Trust Managed: Admins cannot override these settings.
                            </p>
                        </div>
                    </div>
                </div>

                {/* 1. DATA ACCESS HISTORY */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <History className="text-slate-500" size={18} />
                        <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">{t('recent_activity')}</h2>
                    </div>
                    
                    <div className="bg-[#0f172a] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-black/20 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                        <th className="px-6 py-5">Timestamp</th>
                                        <th className="px-6 py-5">Service Authority</th>
                                        <th className="px-6 py-5">Attribute Accessed</th>
                                        <th className="px-6 py-5">Integrity</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {history.map((log) => (
                                        <tr key={log.id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-6 py-5 text-[10px] font-mono text-slate-500">
                                                {new Date(log.timestamp).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-blue-400 transition-colors">
                                                        <Activity size={14} />
                                                    </div>
                                                    <div>
                                                        <p className="text-[11px] font-black text-white uppercase">{log.service_name}</p>
                                                        <p className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter truncate max-w-[150px]">{log.purpose}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="px-3 py-1 bg-blue-600/10 text-blue-400 rounded-full text-[9px] font-black uppercase border border-blue-500/10">
                                                    {log.attribute_accessed}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-1.5 text-emerald-500/50 group-hover:text-emerald-500 transition-all">
                                                    <ShieldCheck size={14} />
                                                    <span className="text-[9px] font-black uppercase">ZKP_VERIFIED</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {history.length === 0 && (
                            <div className="p-20 text-center flex flex-col items-center">
                                <History size={48} className="text-slate-800 mb-4" />
                                <p className="text-slate-600 font-bold uppercase tracking-widest">No access history recorded.</p>
                            </div>
                        )}
                    </div>

                    {/* Attribute-Based Sharing Showcase */}
                    <div className="bg-gradient-to-r from-blue-600/10 to-emerald-500/10 border border-white/5 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-8 group">
                        <div className="flex-1">
                            <h3 className="text-lg font-black text-white uppercase tracking-tight mb-2 flex items-center gap-2">
                                <Fingerprint className="text-emerald-400" /> Selective Attribute Disclosure
                            </h3>
                            <p className="text-sm text-slate-400 font-medium">
                                SovereignShield uses Zero-Knowledge Proofs to verify attributes (like age or citizenship) without ever exposing your raw underlying data to the requesting service.
                            </p>
                        </div>
                        <div className="flex items-center gap-4 bg-[#0f172a] p-4 rounded-2xl border border-white/10 shrink-0">
                            <div className="text-center">
                                <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Raw Proof</p>
                                <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="w-full h-full bg-emerald-500 animate-pulse"></div>
                                </div>
                            </div>
                            <ChevronRight className="text-slate-700" size={20} />
                            <div className="flex flex-col items-center">
                                <CheckCircle2 className="text-emerald-400" size={20} />
                                <span className="text-[10px] font-black text-white mt-1">VERIFIED</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataControlCenter;
