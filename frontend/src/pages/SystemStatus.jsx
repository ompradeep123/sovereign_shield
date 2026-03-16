import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, Server, ActivitySquare } from 'lucide-react';

const SystemStatus = () => {
    const [status, setStatus] = useState(null);

    const fetchStatus = async () => {
        try {
            const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
            const res = await axios.get(`${apiBase.replace('/api', '')}/api/status`);
            setStatus(res.data);
        } catch (err) {
            setStatus({ status: 'OFFLINE', node: 'Unknown' });
        }
    };

    useEffect(() => {
        fetchStatus();
        const interval = setInterval(fetchStatus, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="max-w-4xl mx-auto space-y-6 mt-4">
            <div className="bg-[#0f172a]/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-8 text-center text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-sovBlue rounded-full blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none"></div>
                <h2 className="text-3xl font-bold mb-6 flex items-center justify-center relative z-10"><Activity className="mr-3 text-blue-400" size={32}/> Cluster Status</h2>
                
                {status ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8 relative z-10">
                       <div className="bg-[#1e293b]/80 border border-white/5 p-6 rounded-xl text-left shadow-lg hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:-translate-y-1 transition-all">
                           <div className="text-sm uppercase tracking-widest text-slate-500 mb-2 flex items-center font-bold"><Server size={14} className="mr-2"/> Current Node</div>
                           <div className={`text-2xl font-black ${status.node === 'Backup Node' ? 'text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]' : 'text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.5)]'}`}>{status.node}</div>
                       </div>
                       <div className="bg-[#1e293b]/80 border border-white/5 p-6 rounded-xl text-left shadow-lg hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:-translate-y-1 transition-all">
                           <div className="text-sm uppercase tracking-widest text-slate-500 mb-2 flex items-center font-bold"><ActivitySquare size={14} className="mr-2"/> API Gateway</div>
                           <div className={`text-2xl font-black ${status.status === 'ONLINE' ? 'text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]' : 'text-red-400 drop-shadow-[0_0_10px_rgba(248,113,113,0.5)]'} flex items-center inline-flex`}>
                               {status.status}
                               {status.status === 'ONLINE' && <div className="ml-3 h-3 w-3 rounded-full bg-emerald-500 animate-pulse shrink-0 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>}
                           </div>
                       </div>
                       <div className="bg-[#0a0f1c]/50 border border-white/5 p-6 rounded-xl text-left col-span-1 sm:col-span-2 shadow-inner flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 text-sm font-mono text-slate-400">
                           <span>Uptime: {status.uptime ? <span className="text-slate-200">{`${(status.uptime / 3600).toFixed(2)}h`}</span> : 'N/A'}</span>
                           <span>Last Snapshot: {status.lastBackup ? <span className="text-slate-200">{new Date(status.lastBackup).toLocaleString()}</span> : 'N/A'}</span>
                       </div>
                    </div>
                ) : (
                    <div className="h-40 flex items-center justify-center font-mono text-slate-500 relative z-10 animate-pulse">Pinging Edge Nodes...</div>
                )}
            </div>
        </div>
    );
};

export default SystemStatus;
