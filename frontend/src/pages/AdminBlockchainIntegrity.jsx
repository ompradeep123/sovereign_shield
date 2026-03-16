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
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-800 p-6 flex justify-between items-center text-white">
                <div>
                    <h2 className="text-2xl font-bold flex items-center tracking-tight text-white mb-2"><Database className="mr-3 text-emerald-500" size={28}/> Distributed Ledger Monitor</h2>
                    <p className="text-gray-400 text-sm font-mono tracking-widest uppercase">Real-time view of the Sovereign Hash Chain</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex items-center shadow-inner">
                    <span className="text-xs uppercase font-mono text-gray-400 mr-4">Consensus Status:</span>
                    {chainData.valid ? (
                        <span className="text-emerald-500 font-bold tracking-widest text-lg flex items-center bg-gray-900 px-3 py-1 rounded border border-emerald-500/30"><LinkIcon size={16} className="mr-2"/> INTACT</span>
                    ) : (
                        <span className="text-red-500 font-bold tracking-widest text-lg flex items-center"><LinkIcon size={16} className="mr-2"/> COMPROMISED</span>
                    )}
                </div>
            </div>

            <div className="space-y-4">
                {chainData.chain.map((block, idx) => (
                     <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 p-0 overflow-hidden relative">
                         <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 flex justify-between items-center">
                             <div className="flex items-center space-x-3">
                                  <span className="bg-sovNavy text-white font-mono font-bold px-3 py-1 rounded text-sm">BLOCK #{block.index}</span>
                                  <span className="text-xs text-gray-500 font-medium flex items-center"><Clock size={12} className="mr-1"/> {new Date(block.timestamp).toLocaleString()}</span>
                             </div>
                             {block.index === 0 && <span className="text-xs font-bold text-sovAccent bg-emerald-50 px-2 py-1 rounded uppercase tracking-wider">Genesis Block</span>}
                         </div>
                         <div className="px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2 text-sm font-mono break-all">
                                  <p className="text-gray-400">Previous Hash:</p>
                                  <p className="bg-gray-50 p-2 rounded text-gray-600 border border-gray-100">{block.previousHash}</p>
                              </div>
                              <div className="space-y-2 text-sm font-mono break-all">
                                  <p className="text-gray-400 flex items-center"><KeyRound size={14} className="mr-1"/> Block Hash:</p>
                                  <p className="bg-blue-50 p-2 rounded text-sovBlue border border-blue-100 font-bold">{block.hash}</p>
                              </div>
                         </div>
                         {block.index !== 0 && (
                             <div className="bg-gray-800 text-gray-300 font-mono text-xs px-6 py-3 border-t border-gray-700 max-h-32 overflow-y-auto">
                                 <div className="text-gray-500 mb-1">Block Data:</div>
                                 <pre className="whitespace-pre-wrap">{JSON.stringify(block.data, null, 2)}</pre>
                             </div>
                         )}
                     </div>
                ))}
            </div>
        </div>
    );
};

export default AdminBlockchainIntegrity;
