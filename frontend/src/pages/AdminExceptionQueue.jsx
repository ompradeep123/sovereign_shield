import React, { useState, useEffect } from 'react';
import { api } from '../context/AuthContext';
import { AlertCircle, CheckCircle, ShieldAlert, FileSearch } from 'lucide-react';

const AdminExceptionQueue = () => {
    const [exceptions, setExceptions] = useState([]);
    const [loading, setLoading] = useState({});

    const fetchExceptions = async () => {
        try {
            const res = await api.get('/admin/exceptions');
            setExceptions(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchExceptions();
    }, []);

    const handleResolve = async (id) => {
        setLoading(prev => ({ ...prev, [id]: true }));
        try {
            await api.post(`/admin/exceptions/${id}/resolve`);
            await fetchExceptions();
        } catch (err) {
            console.error("Failed to resolve", err);
        }
        setLoading(prev => ({ ...prev, [id]: false }));
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 mt-4">
            <div className="bg-[#0f172a]/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/5 p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500 rounded-full blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none"></div>
                <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6 relative z-10">
                    <div>
                        <h2 className="text-3xl font-extrabold text-white flex items-center tracking-tight mb-2"><AlertCircle className="text-orange-400 mr-4 drop-shadow-[0_0_10px_rgba(251,146,60,0.5)]" size={36}/> Service Exception Queue</h2>
                        <p className="text-sm text-slate-400 uppercase tracking-widest font-bold">Manual review required for ZKP anomalies and flagged citizen requests.</p>
                    </div>
                </div>

                <div className="space-y-4 relative z-10">
                    {exceptions.length === 0 ? (
                        <div className="text-center py-16 bg-[#1e293b]/30 rounded-2xl border border-dashed border-white/10">
                             <CheckCircle className="mx-auto h-16 w-16 text-emerald-500/50 mb-4 drop-shadow-[0_0_10px_rgba(16,185,129,0.2)]"/>
                             <p className="text-emerald-400 font-bold tracking-wide">No exceptions pending.</p>
                        </div>
                    ) : (
                        exceptions.map(ex => (
                            <div key={ex.id} className={`border rounded-xl p-6 flex flex-col md:flex-row justify-between md:items-center transition-all ${ex.status === 'Resolved' ? 'bg-[#1e293b]/30 border-white/5 opacity-70' : 'bg-orange-500/10 border-orange-500/30 hover:shadow-[0_8px_30px_rgba(251,146,60,0.15)] hover:border-orange-500/50'}`}>
                                <div className="space-y-3 mb-6 md:mb-0">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <span className={`text-xs font-bold px-3 py-1.5 rounded-md uppercase tracking-widest shadow-sm ${ex.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-orange-500/20 text-orange-400 border border-orange-500/30 animate-pulse'}`}>{ex.status}</span>
                                        <span className="text-lg font-bold text-slate-100">{ex.type}</span>
                                    </div>
                                    <div className="text-sm text-slate-400 font-mono tracking-wide"><span className="text-slate-500 uppercase font-bold text-xs mr-2">Citizen NID:</span> <span className="text-slate-200 bg-[#0f172a] px-2 py-1 border border-white/5 rounded">{ex.userNID}</span></div>
                                    <div className="text-sm text-red-400 font-bold flex items-center"><ShieldAlert size={16} className="mr-2"/> Reason: {ex.reason}</div>
                                    <div className="text-xs text-slate-500 pt-2 font-mono flex items-center">{new Date(ex.timestamp).toLocaleString()}</div>
                                </div>
                                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
                                    <button className="bg-[#0f172a] border border-white/10 text-slate-300 hover:text-white px-5 py-3 rounded-xl shadow-sm hover:bg-[#1e293b] hover:border-white/20 text-sm font-bold flex items-center justify-center transition-all">
                                         <FileSearch size={18} className="mr-2 text-slate-400"/> View Profile
                                    </button>
                                    {ex.status !== 'Resolved' && (
                                        <button 
                                           onClick={() => handleResolve(ex.id)}
                                           disabled={loading[ex.id]}
                                           className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-5 py-3 rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.4)] flex items-center justify-center text-sm font-bold transition-all hover:-translate-y-0.5"
                                        >
                                            <CheckCircle size={18} className="mr-2"/> {loading[ex.id] ? 'Resolving...' : 'Override & Approve'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminExceptionQueue;
