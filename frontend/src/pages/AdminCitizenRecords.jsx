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
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-sovNavy flex items-center mb-6"><Users className="text-sovBlue mr-3" size={28}/> Citizen Identity Records</h2>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-4">NID</th>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">ZKP Attributes Status</th>
                                <th className="px-6 py-4 text-center">Gov Services</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {citizens.map(c => (
                                <tr key={c.id} className="border-b hover:bg-gray-50 bg-white">
                                    <td className="px-6 py-4 font-mono font-medium text-sovNavy">{c.nid}</td>
                                    <td className="px-6 py-4 font-semibold text-gray-800">{c.name}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-2">
                                            {c.attributes && Object.keys(c.attributes).map(attr => (
                                                 <span key={attr} className="text-[10px] bg-green-50 text-green-700 px-2 py-1 flex items-center rounded border border-green-200 font-bold uppercase tracking-wider">
                                                     <ShieldCheck size={10} className="mr-1"/> {attr}
                                                 </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                         <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-bold text-xs border border-blue-200">{c.requestCount}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">Active</span>
                                    </td>
                                </tr>
                            ))}
                            {citizens.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500 italic">No citizens registered.</td>
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
