import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../context/AuthContext';
import { ShieldCheck, Crosshair, Cpu, XCircle, Search } from 'lucide-react';

const VerifyCertificate = () => {
    const [recordId, setRecordId] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const idFromUrl = queryParams.get('id');
        if (idFromUrl) {
            setRecordId(idFromUrl);
            autoVerify(idFromUrl);
        }
    }, [location]);

    const autoVerify = async (id) => {
        setLoading(true);
        setError(null);
        setResult(null);
        try {
            const res = await api.get(`/certificates/verify/${id}`);
            setResult(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Verification Error');
        }
        setLoading(false);
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const res = await api.get(`/certificates/verify/${recordId}`);
            setResult(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Verification Error');
        }
        setLoading(false);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 mt-4 pb-10">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-sovNavy via-[#0a192f] to-[#040b14] text-white p-8 md:p-12 border-b-4 border-sovAccent relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-sovAccent blur-[100px] rounded-full opacity-10 pointer-events-none"></div>
                    <h2 className="text-3xl font-extrabold flex items-center mb-3 relative z-10"><Crosshair className="mr-3 text-sovAccent" size={32}/> Verify Certificate Integrity</h2>
                    <p className="text-blue-100/80 text-sm md:text-base leading-relaxed relative z-10 max-w-2xl">Every government service request is logged into the Sovereign Hash Chain. Input a Record ID below to cryptographically verify its integrity, origin, and immutability.</p>
                </div>
                
                <form onSubmit={handleVerify} className="p-6 md:p-10 -mt-8 relative z-20">
                    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100">
                        <label className="text-sm font-bold text-gray-800 block mb-4 tracking-widest uppercase flex items-center"><Search size={16} className="mr-2 text-sovBlue"/> Target Record ID</label>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-0">
                           <input type="text"
                               required
                               placeholder="e.g. 550e8400-e29b-..."
                               className="flex-1 px-5 py-4 bg-gray-50/50 border-2 border-gray-200 rounded-xl sm:rounded-r-none outline-none focus:ring-0 focus:border-sovBlue focus:bg-white font-mono text-sm w-full transition-all duration-300"
                               value={recordId}
                               onChange={(e) => setRecordId(e.target.value)}
                           />
                           <button type="submit" disabled={loading} className="bg-sovBlue hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl sm:rounded-l-none shadow-[0_4px_14px_0_rgba(29,78,216,0.39)] hover:shadow-[0_6px_20px_rgba(29,78,216,0.23)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center w-full sm:w-auto shrink-0 z-10">
                              {loading ? <Cpu className="animate-spin mr-2" /> : <ShieldCheck className="mr-2"/>} {loading ? 'Verifying...' : 'Verify Hash'}
                           </button>
                        </div>
                    </div>
                </form>

                {result && result.valid && (
                    <div className="px-8 pb-8">
                        <div className="bg-emerald-50 border-2 border-emerald-500 rounded-xl p-8 flex flex-col items-center text-center shadow-inner relative overflow-hidden">
                            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #10b981 10px, #10b981 20px)' }}></div>
                            <ShieldCheck className="text-emerald-500 h-20 w-20 mb-4 z-10" />
                            <h3 className="text-3xl font-extrabold text-emerald-800 mb-2 z-10 tracking-tight">{result.message}</h3>
                            <p className="text-emerald-700 font-medium mb-6 z-10">Cryptographic hash matches immutable ledger.</p>
                            
                            <div className="bg-white w-full rounded-lg shadow border border-emerald-200 text-left overflow-hidden z-10 text-sm">
                                <div className="bg-emerald-100 px-4 py-2 font-semibold text-emerald-800 border-b border-emerald-200 border-dashed">Polygon Smart Contract Extracted Metadata</div>
                                <div className="p-4 font-mono text-xs text-gray-600 space-y-2">
                                    <p><span className="text-gray-400">Timestamp:</span> {result.certificate?.created_at ? new Date(result.certificate.created_at).toLocaleString() : 'N/A'}</p>
                                    <p><span className="text-gray-400">Previous Tx Hash:</span> N/A (Stored On-Chain)</p>
                                    <p className="break-all"><span className="text-gray-400">Current Hash:</span> {result.certificate?.data_hash || 'N/A'}</p>
                                    <p><span className="text-gray-400">Service:</span> {result.certificate?.service_type || 'N/A'}</p>
                                    <p><span className="text-gray-400">Status:</span> Verified ✔</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {result && !result.valid && (
                    <div className="px-8 pb-8">
                        <div className="bg-red-50 border-2 border-red-500 rounded-xl p-8 flex flex-col items-center text-center shadow-inner">
                            <XCircle className="text-red-500 h-20 w-20 mb-4 animate-bounce" />
                            <h3 className="text-2xl font-bold text-red-800 mb-2">{result.message || 'Verification Failed'}</h3>
                            <p className="text-red-700">The requested record either does not exist or has been tampered with. The hash chain verification failed.</p>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="px-8 pb-8">
                        <div className="bg-red-50 border-2 border-red-500 rounded-xl p-8 flex flex-col items-center text-center shadow-inner">
                            <XCircle className="text-red-500 h-20 w-20 mb-4 animate-bounce" />
                            <h3 className="text-2xl font-bold text-red-800 mb-2">{error}</h3>
                            <p className="text-red-700">The requested record either does not exist or has been tampered with. The hash chain verification failed.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerifyCertificate;
