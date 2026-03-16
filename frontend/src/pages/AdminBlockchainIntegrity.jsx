import React, { useState, useEffect } from 'react';
import { api } from '../context/AuthContext';
import { Link as LinkIcon, Database, KeyRound, Clock } from 'lucide-react';

const AdminBlockchainIntegrity = () => {
    const [chainData, setChainData] = useState(null);

    useEffect(() => {
        const fetchChain = async () => {
            try {
                const res = await api.get('/admin/chain/audit');
                setChainData(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchChain();
    }, []);

    if (!chainData) return <div className="p-8 text-center text-gray-500 font-mono animate-pulse">SYNCING LEDGER...</div>;

    return (
        <div className="max-w-7xl mx-auto space-y-6 mt-4">
            <div className="bg-[#0f172a]/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/5 p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500 opacity-10 group-hover:opacity-20 transition-opacity duration-700 blur-[120px] rounded-full pointer-events-none"></div>
                <div className="mb-6 md:mb-0 relative z-10">
                    <h2 className="text-3xl font-extrabold flex items-center tracking-tight text-white mb-2"><Database className="mr-4 text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]" size={36}/> Distributed Ledger Monitor</h2>
                    <p className="text-slate-400 text-sm font-bold font-mono tracking-widest uppercase">Real-time view of the Sovereign Hash Chain</p>
                </div>
                <div className="bg-[#1e293b]/50 p-5 rounded-xl border border-white/5 flex items-center shadow-inner relative z-10 backdrop-blur-sm">
                    <span className="text-xs uppercase font-mono font-bold text-slate-400 mr-4 tracking-widest">Consensus Status:</span>
                    {chainData.valid ? (
                        <span className="text-emerald-400 font-black tracking-widest text-lg flex items-center bg-emerald-500/10 px-4 py-2 rounded-lg border border-emerald-500/30 drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]"><LinkIcon size={18} className="mr-2"/> INTACT</span>
                    ) : (
                        <span className="text-red-500 font-black tracking-widest text-lg flex items-center bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/30 drop-shadow-[0_0_10px_rgba(239,68,68,0.3)] animate-pulse"><LinkIcon size={18} className="mr-2"/> COMPROMISED</span>
                    )}
                </div>
            </div>

            <div className="space-y-6">
                {chainData.chain.map((block, idx) => (
                     <div key={idx} className="bg-[#1e293b]/50 backdrop-blur-xl rounded-2xl shadow-xl border border-white/5 p-0 overflow-hidden relative hover:border-blue-500/30 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all group">
                         <div className="bg-[#0f172a] border-b border-white/5 px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                             <div className="flex items-center space-x-4">
                                  <span className="bg-blue-600/20 text-blue-400 border border-blue-500/30 font-mono font-bold px-3 py-1.5 rounded-lg text-sm tracking-wider shadow-inner">BLOCK #{block.index}</span>
                                  <span className="text-xs text-slate-400 font-bold font-mono tracking-widest flex items-center bg-[#1e293b] px-3 py-1.5 rounded-md border border-white/5"><Clock size={14} className="mr-2 text-slate-500"/> {new Date(block.timestamp).toLocaleString()}</span>
                             </div>
                             {block.index === 0 && <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-md uppercase tracking-widest shadow-[0_0_10px_rgba(52,211,153,0.2)]">Genesis Block</span>}
                         </div>
                         <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                              <div className="space-y-3 text-sm font-mono break-all">
                                  <p className="text-slate-500 font-bold tracking-widest uppercase text-xs">Previous Hash</p>
                                  <p className="bg-[#0f172a] p-3 rounded-xl text-slate-400 border border-white/5 shadow-inner leading-relaxed">{block.previousHash}</p>
                              </div>
                              <div className="space-y-3 text-sm font-mono break-all">
                                  <p className="text-blue-400 font-bold tracking-widest uppercase text-xs flex items-center"><KeyRound size={14} className="mr-2"/> Block Hash</p>
                                  <p className="bg-blue-500/5 p-3 rounded-xl text-blue-300 border border-blue-500/20 font-bold shadow-inner leading-relaxed">{block.hash}</p>
                              </div>
                         </div>
                         {block.index !== 0 && (
                             <div className="bg-black/40 text-slate-300 font-mono text-xs px-6 py-5 border-t border-white/5 max-h-48 overflow-y-auto custom-scrollbar">
                                 <div className="text-slate-500 font-bold uppercase tracking-widest mb-3 flex items-center"><Database size={12} className="mr-2"/> Block Data Payload</div>
                                 <pre className="whitespace-pre-wrap leading-relaxed text-emerald-400/80">{JSON.stringify(block.data, null, 2)}</pre>
                             </div>
                         )}
                     </div>
                ))}
            </div>
        </div>
    );
};

export default AdminBlockchainIntegrity;
