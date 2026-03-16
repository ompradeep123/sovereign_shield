import React, { useState, useEffect } from 'react';
import { api } from '../context/AuthContext';
import { FileText, Shield, User, Clock, Search } from 'lucide-react';

const AdminAuditLogs = () => {
    const [auditLogs, setAuditLogs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await api.get('/admin/audit-logs');
                setAuditLogs(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchLogs();
    }, []);

    const filteredLogs = auditLogs.filter(log => 
        log.userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        log.userNID.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.reason.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto space-y-6 mt-4">
            <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-white/5 shadow-2xl rounded-2xl p-6 lg:p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500 opacity-10 group-hover:opacity-20 transition-opacity duration-700 blur-[120px] rounded-full pointer-events-none"></div>
                <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 space-y-4 md:space-y-0 border-b border-white/5 pb-6 relative z-10">
                    <div>
                        <h2 className="text-3xl font-extrabold text-white flex items-center mb-2 tracking-tight"><FileText className="text-blue-400 mr-4 drop-shadow-[0_0_10px_rgba(37,99,235,0.5)]" size={32}/> Security Audit Logs</h2>
                        <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Immutable record of all citizen data access events across the SovereignShield network.</p>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search logs by NID, Name, or Service..."
                            className="pl-12 pr-4 py-3 w-full md:w-80 bg-[#1e293b]/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 outline-none text-slate-200 text-sm transition-all shadow-inner placeholder-slate-500 font-medium tracking-wide"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-white/5 bg-[#1e293b]/30 shadow-inner relative z-10">
                    <table className="w-full text-left text-sm text-slate-300">
                        <thead className="text-xs text-slate-400 uppercase bg-[#1e293b]/50 border-b border-white/5 font-bold tracking-widest">
                            <tr>
                                <th className="px-6 py-4">Timestamp</th>
                                <th className="px-6 py-4">Citizen Context</th>
                                <th className="px-6 py-4">System Trigger</th>
                                <th className="px-6 py-4 w-1/3">Cryptographic Reason</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredLogs.map((log, idx) => (
                                <tr key={idx} className="hover:bg-[#1e293b]/80 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                         <span className="bg-[#0f172a] text-slate-400 font-mono text-xs px-3 py-1.5 rounded-lg border border-white/5 flex w-min items-center font-bold shadow-sm group-hover:bg-[#1e293b]/50 transition-colors">
                                             <Clock size={12} className="mr-2 text-blue-400"/> {new Date(log.timestamp).toLocaleString()}
                                         </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-100 tracking-wide text-base">{log.userName}</span>
                                            <span className="text-xs text-slate-500 font-mono mt-1 font-bold flex items-center bg-[#0f172a] w-max px-2 py-0.5 rounded border border-white/5"><User size={10} className="mr-1 text-slate-400"/>{log.userNID}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-blue-400 tracking-wide">
                                        <div className="flex items-center"><Shield size={16} className="mr-2 text-blue-500/80"/> {log.service}</div>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-xs text-slate-400 bg-black/10 border-l border-r border-white/5">
                                        <div className="break-words leading-relaxed">{log.reason}</div>
                                    </td>
                                </tr>
                            ))}
                            {filteredLogs.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-slate-500 font-bold bg-[#1e293b]/10 tracking-wide italic">No matching audit logs found in the immutable ledger.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminAuditLogs;
