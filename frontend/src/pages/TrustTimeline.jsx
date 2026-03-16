import React, { useState, useEffect } from 'react';
import { api } from '../context/AuthContext';
import { Activity, Clock } from 'lucide-react';

const TrustTimeline = () => {
    const [timeline, setTimeline] = useState([]);

    useEffect(() => {
        const fetchTimeline = async () => {
            try {
                const res = await api.get('/services/timeline');
                setTimeline(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchTimeline();
    }, []);

    return (
        <div className="max-w-3xl mx-auto space-y-6 mt-4">
            <div className="bg-[#0f172a]/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/5 p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-sovBlue rounded-full blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none"></div>
                <h2 className="text-3xl font-bold flex items-center mb-6 text-white relative z-10"><Activity className="text-blue-400 mr-3" size={32}/> Trust Timeline</h2>
                <p className="text-sm text-slate-400 mb-8 border-l-4 border-emerald-500/50 pl-4 relative z-10 leading-relaxed font-medium">
                   This timeline provides cryptographically-verified transparency into when and why your identity attributes or records were accessed by government systems. SovereignShield empowers citizens to track their own data continuously.
                </p>

                <div className="relative border-l-2 border-white/10 ml-4 space-y-8 pb-4 z-10">
                    {timeline.length === 0 ? (
                        <div className="pl-6 text-sm text-slate-500 italic">No access events recorded.</div>
                    ) : (
                        timeline.map((event, idx) => {
                            const rawReason = event.reason || event.action || 'System Process';
                            let dataAccessed = null;
                            let cleanReason = rawReason;
                            
                            // Extract Data Accessed tags if they exist
                            const extractedMatch = rawReason.match(/\[DATA_ACCESSED:(.*?)\]/);
                            if (extractedMatch) {
                                dataAccessed = extractedMatch[1].trim();
                                cleanReason = rawReason.replace(extractedMatch[0], '').trim();
                            }

                            return (
                                <div key={idx} className="relative pl-8">
                                    <div className="absolute w-4 h-4 bg-emerald-400 rounded-full -left-[9px] top-1 shadow-[0_0_10px_rgba(52,211,153,0.8)] border border-[#0f172a]"></div>
                                    <div className="bg-[#1e293b]/50 rounded-xl p-5 border border-white/5 hover:border-blue-500/50 hover:bg-[#1e293b]/80 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
                                            <h4 className="font-bold text-slate-100 text-lg tracking-tight">{event.service || 'SovereignShield'} System</h4>
                                            <span className="text-xs w-max bg-[#0f172a] text-slate-400 px-3 py-1.5 rounded-lg border border-white/5 shadow-inner flex items-center font-bold font-mono tracking-widest"><Clock size={12} className="mr-1.5 text-blue-400"/> {new Date(event.timestamp).toLocaleString()}</span>
                                        </div>
                                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1.5">Access Reason:</p>
                                        <p className="text-sm text-slate-300 bg-[#0f172a] p-3 rounded-lg border border-white/5 font-mono break-words">{cleanReason}</p>
                                        
                                        {dataAccessed && (
                                            <div className="mt-4 border-t border-white/5 pt-4">
                                                 <p className="text-xs text-slate-500 font-bold mb-2 uppercase tracking-widest flex items-center">Data Types Accessed</p>
                                                 <div className="flex flex-wrap gap-2">
                                                    {dataAccessed.split(',').map((tag, i) => (
                                                        <span key={i} className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide flex items-center shadow-[0_0_8px_rgba(59,130,246,0.1)]">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-2"></div>{tag.trim()}
                                                        </span>
                                                    ))}
                                                 </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default TrustTimeline;
