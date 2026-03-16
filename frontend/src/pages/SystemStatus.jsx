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
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white rounded-xl shadow border border-gray-200 p-8 text-center text-sovNavy">
                <h2 className="text-3xl font-bold mb-6 flex items-center justify-center"><Activity className="mr-3 text-sovBlue" size={32}/> Cluster Status</h2>
                
                {status ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                       <div className="bg-gray-50 border p-6 rounded-lg text-left shadow-sm hover:shadow-md transition">
                           <div className="text-sm uppercase tracking-widest text-gray-500 mb-1 flex items-center"><Server size={14} className="mr-2"/> Current Node</div>
                           <div className={`text-2xl font-bold ${status.node === 'Backup Node' ? 'text-yellow-600' : 'text-blue-600'}`}>{status.node}</div>
                       </div>
                       <div className="bg-gray-50 border p-6 rounded-lg text-left shadow-sm hover:shadow-md transition">
                           <div className="text-sm uppercase tracking-widest text-gray-500 mb-1 flex items-center"><ActivitySquare size={14} className="mr-2"/> API Gateway</div>
                           <div className={`text-2xl font-bold ${status.status === 'ONLINE' ? 'text-green-600' : 'text-red-600'} flex items-center inline-flex`}>
                               {status.status}
                               {status.status === 'ONLINE' && <div className="ml-3 h-3 w-3 rounded-full bg-green-500 animate-pulse shrink-0"></div>}
                           </div>
                       </div>
                       <div className="bg-gray-50 border p-6 rounded-lg text-left col-span-1 sm:col-span-2 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 text-sm font-mono text-gray-600">
                           <span>Uptime: {status.uptime ? `${(status.uptime / 3600).toFixed(2)}h` : 'N/A'}</span>
                           <span>Last Snapshot: {status.lastBackup ? new Date(status.lastBackup).toLocaleString() : 'N/A'}</span>
                       </div>
                    </div>
                ) : (
                    <div className="h-40 flex items-center justify-center font-mono text-gray-400">Pinging Edge Nodes...</div>
                )}
            </div>
        </div>
    );
};

export default SystemStatus;
