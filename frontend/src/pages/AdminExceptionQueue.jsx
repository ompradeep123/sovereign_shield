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
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-sovNavy flex items-center"><AlertCircle className="text-orange-500 mr-3" size={28}/> Service Exception Queue</h2>
                        <p className="text-sm text-gray-500 mt-1">Manual review required for ZKP anomalies and flagged citizen requests.</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {exceptions.length === 0 ? (
                        <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                             <CheckCircle className="mx-auto h-12 w-12 text-gray-300 mb-2"/>
                             <p className="text-gray-500 font-medium">No exceptions pending.</p>
                        </div>
                    ) : (
                        exceptions.map(ex => (
                            <div key={ex.id} className={`border rounded-lg p-5 flex flex-col md:flex-row justify-between md:items-center ${ex.status === 'Resolved' ? 'bg-gray-50 border-gray-200' : 'bg-orange-50 border-orange-200 shadow-sm'}`}>
                                <div className="space-y-2 mb-4 md:mb-0">
                                    <div className="flex items-center space-x-3">
                                        <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wide ${ex.status === 'Resolved' ? 'bg-green-100 text-green-800' : 'bg-orange-200 text-orange-900'}`}>{ex.status}</span>
                                        <span className="text-sm font-semibold text-gray-900">{ex.type}</span>
                                    </div>
                                    <div className="text-sm text-gray-600 font-mono"><span className="text-gray-400">Citizen NID:</span> {ex.userNID}</div>
                                    <div className="text-sm text-red-600 font-medium flex items-center"><ShieldAlert size={14} className="mr-1"/> Reason: {ex.reason}</div>
                                    <div className="text-xs text-gray-400">{new Date(ex.timestamp).toLocaleString()}</div>
                                </div>
                                <div className="flex space-x-3">
                                    <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded shadow-sm hover:bg-gray-50 text-sm font-medium flex items-center">
                                         <FileSearch size={16} className="mr-2"/> View Profile
                                    </button>
                                    {ex.status !== 'Resolved' && (
                                        <button 
                                           onClick={() => handleResolve(ex.id)}
                                           disabled={loading[ex.id]}
                                           className="bg-sovBlue hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded shadow flex items-center text-sm font-medium"
                                        >
                                            <CheckCircle size={16} className="mr-2"/> {loading[ex.id] ? 'Resolving...' : 'Override & Approve'}
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
