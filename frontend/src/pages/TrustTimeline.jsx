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
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-sovNavy flex items-center mb-6"><Activity className="text-sovBlue mr-3" size={28}/> Trust Timeline</h2>
                <p className="text-sm text-gray-500 mb-8 border-l-4 border-sovAccent pl-3">
                   This timeline provides complete transparency into when and why your identity attributes or records were accessed by government systems. SovereignShield empowers citizens to track their own data.
                </p>

                <div className="relative border-l-2 border-gray-100 ml-4 space-y-8 pb-4">
                    {timeline.length === 0 ? (
                        <div className="pl-6 text-sm text-gray-500 italic">No access events recorded.</div>
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
                                    <div className="absolute w-4 h-4 bg-sovAccent rounded-full -left-[9px] top-1 shadow-[0_0_0_4px_rgba(16,185,129,0.2)]"></div>
                                    <div className="bg-gray-50 rounded-lg p-5 border border-gray-100 hover:border-sovBlue hover:shadow-md transition-all">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-semibold text-gray-800">{event.service || 'SovereignShield'} System</h4>
                                            <span className="text-xs bg-white text-gray-500 px-2 py-1 rounded border shadow-sm flex items-center font-medium"><Clock size={12} className="mr-1"/> {new Date(event.timestamp).toLocaleString()}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 font-medium">Access Reason:</p>
                                        <p className="text-sm text-sovNavy bg-white p-2 rounded border border-gray-200 mt-1 font-mono">{cleanReason}</p>
                                        
                                        {dataAccessed && (
                                            <div className="mt-3 border-t border-gray-100 pt-3">
                                                 <p className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wider">Data Types Accessed:</p>
                                                 <div className="flex flex-wrap gap-2">
                                                    {dataAccessed.split(',').map((tag, i) => (
                                                        <span key={i} className="bg-blue-50 text-sovBlue border border-blue-100 px-2 py-0.5 rounded text-xs font-medium">
                                                            {tag.trim()}
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
