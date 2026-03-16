import React, { useState, useEffect } from 'react';
import { api } from '../context/AuthContext';
import { Layers, Plus, Link as LinkIcon, Check, Clock } from 'lucide-react';

const ServiceRequests = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchServices = async () => {
        try {
            const res = await api.get('/services/my-services');
            setServices(res.data.reverse());
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleRequest = async (type) => {
        setLoading(true);
        try {
            await api.post('/services/request', { serviceType: type, simulateAnomaly: type === 'Healthcare Record Access' });
            await fetchServices();
        } catch (err) {
            console.error('Request failed', err);
        }
        setLoading(false);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-sovNavy flex items-center mb-6"><Layers className="text-sovBlue mr-3" size={28}/> Government Services</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {['Tax Filing', 'Birth Certificate', 'Subsidy Application', 'Health Record Access'].map(service => (
                        <div key={service} className="border border-gray-200 p-5 rounded-xl hover:border-sovBlue hover:shadow-md transition-all group">
                            <h3 className="font-semibold text-gray-800 text-lg mb-2">{service}</h3>
                            <p className="text-sm text-gray-500 mb-4 h-15">
                                Securely apply for {service.toLowerCase()} using automated ZKP verification.
                                {service === 'Healthcare Record Access' && <span className="block mt-1 text-xs text-orange-500 font-semibold">(Demo: Will trigger anomaly exception)</span>}
                            </p>
                            <button 
                                onClick={() => handleRequest(service)}
                                disabled={loading}
                                className="w-full bg-gray-50 hover:bg-sovBlue hover:text-white text-sovBlue font-medium py-2 rounded border border-gray-200 hover:border-transparent transition-colors flex justify-center items-center text-sm"
                            >
                                <Plus size={16} className="mr-1"/> Request
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                 <h3 className="text-xl font-bold text-sovNavy mb-6 border-b pb-4">My Requests & Blockchain Records</h3>
                 <div className="overflow-x-auto">
                     <table className="w-full text-left text-sm text-gray-600">
                         <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
                             <tr>
                                 <th className="px-6 py-3">Service</th>
                                 <th className="px-6 py-3">Status</th>
                                 <th className="px-6 py-3">Date</th>
                                 <th className="px-6 py-3">Blockchain Hash</th>
                             </tr>
                         </thead>
                         <tbody>
                             {services.map(s => (
                                 <tr key={s.id} className="border-b hover:bg-gray-50">
                                     <td className="px-6 py-4 font-medium text-gray-900">{s.type}</td>
                                     <td className="px-6 py-4">
                                         <span className={`px-2 py-1 rounded-full text-xs font-semibold flex w-max items-center ${
                                             s.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                         }`}>
                                            {s.status === 'Approved' ? <Check size={12} className="mr-1"/> : <Clock size={12} className="mr-1"/>}
                                            {s.status}
                                         </span>
                                     </td>
                                     <td className="px-6 py-4">{new Date(s.timestamp).toLocaleString()}</td>
                                     <td className="px-6 py-4 font-mono text-xs text-sovBlue">
                                         {s.blockHash ? (
                                             <div className="flex items-center" title={s.blockHash}><LinkIcon size={12} className="mr-1"/> {s.blockHash.substring(0, 16)}...</div>
                                         ) : 'Pending'}
                                     </td>
                                 </tr>
                             ))}
                             {services.length === 0 && (
                                 <tr>
                                     <td colSpan="4" className="px-6 py-8 text-center text-gray-500 italic">No services requested yet.</td>
                                 </tr>
                             )}
                         </tbody>
                     </table>
                 </div>
            </div>
        </div>
    );
};

export default ServiceRequests;
