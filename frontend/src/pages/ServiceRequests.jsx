import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../context/AuthContext';
import { Layers, Plus, Link as LinkIcon, Check, Clock, Copy } from 'lucide-react';

const ServiceRequests = () => {
    const navigate = useNavigate();
    const [services, setServices] = useState([]);
    const [loadingType, setLoadingType] = useState(null);
    const [message, setMessage] = useState(null);

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
        if (type === 'Birth Certificate') {
            navigate('/services/birth-certificate');
        } else if (type === 'Tax Filing') {
            navigate('/services/tax-filing');
        } else {
            setLoadingType(type);
            setMessage(null);
            try {
                await api.post('/services/request', { serviceType: type, simulateAnomaly: type === 'Healthcare Record Access' });
                await fetchServices();
                setMessage({ type: 'success', text: `${type} securely requested!` });
            } catch (err) {
                setMessage({ type: 'error', text: err.response?.data?.error || `Failed to process ${type}` });
            }
            setLoadingType(null);
            setTimeout(() => setMessage(null), 5000);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 mt-4 pb-10">
            <div className="bg-[#0f172a]/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/5 p-6 md:p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-sovBlue rounded-full blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none"></div>
                <h2 className="text-3xl font-bold text-slate-100 flex items-center mb-8 relative z-10"><Layers className="text-blue-400 mr-3" size={32}/> Government Services</h2>
                
                {message && (
                    <div className={`p-4 mb-8 rounded-xl text-sm font-bold relative z-10 shadow-lg ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                        {message.text}
                    </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                    {['Tax Filing', 'Birth Certificate', 'Subsidy Application', 'Health Record Access'].map(service => (
                        <div key={service} className="bg-[#1e293b]/50 border border-white/5 p-6 rounded-2xl hover:border-blue-500/50 hover:bg-[#1e293b]/80 hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:-translate-y-1 transition-all group flex flex-col justify-between">
                            <div>
                                <h3 className="font-bold text-slate-100 text-lg mb-3 leading-tight">{service}</h3>
                                <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                                    Securely apply using automated <strong className="text-slate-300">ZKP verification</strong>.
                                    {service === 'Health Record Access' && <span className="block mt-2 text-xs text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-1 rounded inline-block font-bold tracking-wide">(Demo: Triggers Anomaly)</span>}
                                </p>
                            </div>
                            <button 
                                onClick={() => handleRequest(service)}
                                disabled={loadingType !== null}
                                className={`w-full font-bold py-3 px-4 rounded-xl border transition-all flex justify-center items-center text-sm shadow-md mt-auto ${loadingType === service ? 'bg-[#0f172a] text-slate-500 border-white/5 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-white border-transparent hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:-translate-y-0.5'}`}
                            >
                                {loadingType === service ? <Clock size={16} className="mr-2 animate-spin"/> : <Plus size={18} className="mr-2"/>}
                                {loadingType === service ? 'Processing...' : 'Request'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-[#0f172a]/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/5 p-6 md:p-8">
                 <h3 className="text-xl font-bold text-slate-100 mb-6 border-b border-white/5 pb-4 flex items-center">
                    <div className="p-2 bg-[#1e293b] rounded-lg mr-3 border border-white/5">
                        <LinkIcon className="h-5 w-5 text-emerald-400"/>
                    </div>
                    My Requests & Blockchain Records
                 </h3>
                 <div className="overflow-x-auto rounded-xl border border-white/5 bg-[#1e293b]/30">
                     <table className="w-full text-left text-sm text-slate-300">
                         <thead className="text-xs text-slate-400 uppercase bg-[#1e293b] border-b border-white/5 font-bold tracking-wider">
                             <tr>
                                 <th className="px-6 py-4">Service</th>
                                 <th className="px-6 py-4">Record ID</th>
                                 <th className="px-6 py-4">Status</th>
                                 <th className="px-6 py-4">Date</th>
                                 <th className="px-6 py-4">Blockchain Hash</th>
                             </tr>
                         </thead>
                         <tbody className="divide-y divide-white/5">
                             {services.map(s => (
                                 <tr key={s.id || s.certificate_id} className="hover:bg-[#1e293b]/80 transition-colors group">
                                     <td className="px-6 py-4 font-bold text-slate-100">{s.service_type || s.type}</td>
                                     <td className="px-6 py-4">
                                         <div className="flex items-center space-x-2">
                                             <span className="font-mono text-xs text-slate-500 bg-[#0f172a] px-2 py-1 rounded border border-white/5 shadow-inner">{(s.id || s.certificate_id)?.substring(0, 8)}...</span>
                                             <button 
                                                 onClick={() => {
                                                     navigator.clipboard.writeText(s.id || s.certificate_id);
                                                     alert('Record ID Copied!');
                                                 }}
                                                 className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-blue-500/20 hover:text-blue-400 rounded-md text-slate-500 transition-all border border-transparent hover:border-blue-500/30"
                                                 title="Copy Full ID"
                                             >
                                                 <Copy size={12} />
                                             </button>
                                         </div>
                                     </td>
                                     <td className="px-6 py-4">
                                         <span className={`px-3 py-1.5 rounded-full text-xs font-bold flex w-max items-center shadow-sm border ${
                                             (s.status === 'Approved' || s.data_hash) ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                                         }`}>
                                            {(s.status === 'Approved' || s.data_hash) ? <Check size={12} className="mr-1.5"/> : <Clock size={12} className="mr-1.5"/>}
                                            {s.data_hash ? 'Issued (Blockchain)' : (s.status || 'Verified')}
                                         </span>
                                     </td>
                                     <td className="px-6 py-4 text-xs font-medium text-slate-400">{new Date(s.timestamp || s.created_at || new Date()).toLocaleString()}</td>
                                     <td className="px-6 py-4 font-mono text-xs text-blue-400">
                                         {s.blockHash || s.data_hash ? (
                                             <div className="flex flex-col space-y-1.5">
                                                <div className="flex items-center bg-[#0f172a] w-max px-2 py-1 rounded border border-white/5" title={s.blockHash || s.data_hash}><LinkIcon size={12} className="mr-1.5 text-slate-500"/> {(s.blockHash || s.data_hash).substring(0, 16)}...</div>
                                                <Link to={`/verify-cert?id=${s.id || s.certificate_id}`} className="text-[10px] text-emerald-400 underline hover:text-emerald-300 w-max font-bold tracking-wide">Verify Integrity</Link>
                                             </div>
                                         ) : <span className="text-slate-500 italic">Processing...</span>}
                                     </td>
                                 </tr>
                             ))}
                             {services.length === 0 && (
                                 <tr>
                                     <td colSpan="5" className="px-6 py-12 text-center text-slate-500 italic bg-[#1e293b]/10">No services requested yet. Initiate a request to see records.</td>
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
