import React, { useState, useEffect } from 'react';
import { api } from '../context/AuthContext';
import { Users, ShieldCheck, FileText } from 'lucide-react';

const AdminCitizenRecords = () => {
    const [citizens, setCitizens] = useState([]);

    useEffect(() => {
        const fetchCitizens = async () => {
            try {
                const res = await api.get('/admin/citizens');
                setCitizens(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchCitizens();
    }, []);

    return (
        <div className="max-w-7xl mx-auto space-y-6 mt-4">
            <div className="bg-[#0f172a]/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/5 p-6 md:p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600 opacity-10 group-hover:opacity-20 transition-opacity duration-700 blur-[120px] rounded-full pointer-events-none"></div>
                <h2 className="text-3xl font-extrabold text-white flex items-center mb-8 relative z-10 tracking-tight"><Users className="text-blue-400 mr-4 drop-shadow-[0_0_10px_rgba(37,99,235,0.5)]" size={36}/> Citizen Identity Records</h2>

                <div className="overflow-x-auto rounded-xl border border-white/5 bg-[#1e293b]/30 shadow-inner relative z-10">
                    <table className="w-full text-left text-sm text-slate-300">
                        <thead className="text-xs text-slate-400 uppercase bg-[#1e293b] border-b border-white/5 font-bold tracking-widest">
                            <tr>
                                <th className="px-6 py-4">NID</th>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">ZKP Attributes Status</th>
                                <th className="px-6 py-4 text-center">Gov Services</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {citizens.map(c => (
                                <tr key={c.id} className="hover:bg-[#1e293b]/80 transition-colors group">
                                    <td className="px-6 py-4 font-mono font-bold text-slate-400">{c.nid}</td>
                                    <td className="px-6 py-4 font-black text-slate-100 text-base tracking-wide">{c.name}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-2">
                                            {c.attributes && Object.keys(c.attributes).map(attr => (
                                                 <span key={attr} className="text-[10px] bg-[#0f172a] text-emerald-400 px-3 py-1.5 flex items-center rounded-lg border border-emerald-500/20 font-bold uppercase tracking-widest shadow-sm">
                                                     <ShieldCheck size={12} className="mr-1.5 opacity-80"/> {attr}
                                                 </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                         <span className="bg-blue-600 text-white px-3.5 py-1.5 rounded-lg font-black text-xs border border-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.4)]">{c.requestCount}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 tracking-widest uppercase">Active</span>
                                    </td>
                                </tr>
                            ))}
                            {citizens.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500 font-bold bg-[#1e293b]/10 tracking-wide italic">No citizens registered in the network.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminCitizenRecords;
