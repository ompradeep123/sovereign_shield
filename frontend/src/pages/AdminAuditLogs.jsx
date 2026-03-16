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
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 space-y-4 md:space-y-0">
                    <div>
                        <h2 className="text-2xl font-bold text-sovNavy flex items-center"><FileText className="text-sovBlue mr-3" size={28}/> Security Audit Logs</h2>
                        <p className="text-sm text-gray-500 mt-1">Immutable record of all citizen data access events across the SovereignShield network.</p>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search logs by NID, Name, or Service..."
                            className="pl-10 pr-4 py-2 w-full md:w-80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sovBlue outline-none bg-gray-50 text-sm transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto rounded-lg border border-gray-100">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-4">Timestamp</th>
                                <th className="px-6 py-4">Citizen Context</th>
                                <th className="px-6 py-4">System Trigger</th>
                                <th className="px-6 py-4 w-1/3">Cryptographic Reason</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLogs.map((log, idx) => (
                                <tr key={idx} className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                         <span className="bg-gray-100 text-gray-600 font-mono text-xs px-2 py-1 rounded border border-gray-200 flex w-min items-center">
                                             <Clock size={12} className="mr-1"/> {new Date(log.timestamp).toLocaleString()}
                                         </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-gray-800">{log.userName}</span>
                                            <span className="text-xs text-gray-400 font-mono mt-0.5"><User size={10} className="inline mr-1"/>{log.userNID}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-sovBlue">
                                        <div className="flex items-center"><Shield size={14} className="mr-2"/> {log.service}</div>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-xs text-gray-500 bg-white border-l border-r border-gray-50">
                                        {log.reason}
                                    </td>
                                </tr>
                            ))}
                            {filteredLogs.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-10 text-center text-gray-500 font-medium bg-gray-50">No matching audit logs found in the ledger.</td>
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
