import React, { useState, useEffect } from 'react';
import { api } from '../context/AuthContext';
import { Layers, Plus, Link as LinkIcon, Check, Clock } from 'lucide-react';

const ServiceRequests = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchServices = async () => {
        try {
            // First fetch general requests and tax status
            const currentReqsRes = await api.get('/services/my-services');
            let allReqs = [...currentReqsRes.data];

            try {
                const taxRes = await api.get('/tax/tax-status');
                allReqs = [...allReqs, ...taxRes.data];
            } catch (e) { console.warn('Tax service fetch ignored', e); }

            // Then fetch blockchain certificates
            try {
                const certsRes = await api.get('/services/my-certificates'); // Wait, let's just make a new endpoint or grab all via DB.
                // For simplicity we will assume the main requests endpoint fetches all via a combined query or we just rely on Supabase directly if we want.
                // Let's rely on the backend /services/my-services to aggregate them if we want, OR just rely on databaseService directly.
                // Actually the current architecture uses api calls. Let's make an api call in frontend.
            } catch (e) { }

            setServices(allReqs.sort((a,b) => new Date(a.created_at || a.timestamp) < new Date(b.created_at || b.timestamp) ? 1 : -1));
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
            if (type === 'Birth Certificate') {
                await api.post('/certificates/birth-certificate');
            } else if (type === 'Tax Filing') {
                await api.post('/tax/tax-file');
            } else {
                await api.post('/services/request', { serviceType: type, simulateAnomaly: type === 'Healthcare Record Access' });
            }
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
                                 <tr key={s.id || s.certificate_id} className="border-b hover:bg-gray-50">
                                     <td className="px-6 py-4 font-medium text-gray-900">{s.service_type || s.type}</td>
                                     <td className="px-6 py-4">
                                         <span className={`px-2 py-1 rounded-full text-xs font-semibold flex w-max items-center ${
                                             (s.status === 'Approved' || s.data_hash) ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                         }`}>
                                            {(s.status === 'Approved' || s.data_hash) ? <Check size={12} className="mr-1"/> : <Clock size={12} className="mr-1"/>}
                                            {s.data_hash ? 'Issued (Blockchain)' : (s.status || 'Verified')}
                                         </span>
                                     </td>
                                     <td className="px-6 py-4">{new Date(s.timestamp || s.created_at || new Date()).toLocaleString()}</td>
                                     <td className="px-6 py-4 font-mono text-xs text-sovBlue">
                                         {s.blockHash || s.data_hash ? (
                                             <div className="flex items-center" title={s.blockHash || s.data_hash}><LinkIcon size={12} className="mr-1"/> {(s.blockHash || s.data_hash).substring(0, 16)}...</div>
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
