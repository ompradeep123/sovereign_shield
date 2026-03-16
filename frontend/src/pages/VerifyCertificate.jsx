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

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const idFromUrl = queryParams.get('id');
        if (idFromUrl) {
            setRecordId(idFromUrl);
            autoVerify(idFromUrl);
        }
    }, [location]);

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
            <div className="bg-[#0f172a]/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/5 overflow-hidden">
                <div className="bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-blue-900 via-[#0a192f] to-[#040b14] text-white p-8 md:p-12 border-b-4 border-sovAccent relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-sovAccent blur-[100px] rounded-full opacity-10 pointer-events-none"></div>
                    <h2 className="text-3xl font-extrabold flex items-center mb-3 relative z-10"><Crosshair className="mr-3 text-emerald-400" size={32}/> Verify Certificate Integrity</h2>
                    <p className="text-blue-100/80 text-sm md:text-base leading-relaxed relative z-10 max-w-2xl">Every government service request is logged into the Sovereign Hash Chain. Input a Record ID below to cryptographically verify its integrity, origin, and immutability.</p>
                </div>
                
                <form onSubmit={handleVerify} className="p-6 md:p-10 -mt-8 relative z-20">
                    <div className="bg-[#1e293b] p-6 md:p-8 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-white/5">
                        <label className="text-sm font-bold text-slate-200 block mb-4 tracking-widest uppercase flex items-center"><Search size={16} className="mr-2 text-blue-400"/> Target Record ID</label>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-0">
                           <input type="text"
                               required
                               placeholder="e.g. 550e8400-e29b-..."
                               className="flex-1 px-5 py-4 bg-[#0f172a] text-white border border-white/10 rounded-xl sm:rounded-r-none outline-none focus:ring-0 focus:border-blue-500 focus:bg-[#0f172a]/80 font-mono text-sm w-full transition-all duration-300 placeholder-slate-500"
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
                        <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-xl p-8 flex flex-col items-center text-center shadow-inner relative overflow-hidden">
                            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #10b981 10px, #10b981 20px)' }}></div>
                            <ShieldCheck className="text-emerald-400 h-20 w-20 mb-4 z-10 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]" />
                            <h3 className="text-3xl font-extrabold text-emerald-400 mb-2 z-10 tracking-tight">{result.message}</h3>
                            <p className="text-emerald-500/80 font-medium mb-6 z-10">Cryptographic hash matches immutable ledger.</p>
                            
                            <div className="bg-[#0f172a] w-full rounded-lg shadow-lg border border-emerald-500/20 text-left overflow-hidden z-10 text-sm">
                                <div className="bg-emerald-900/40 px-4 py-3 font-semibold text-emerald-400 border-b border-emerald-500/20 border-dashed">Polygon Smart Contract Extracted Metadata</div>
                                <div className="p-4 font-mono text-xs text-slate-400 space-y-2">
                                    <p><span className="text-slate-500">Timestamp:</span> <span className="text-slate-200">{result.certificate?.created_at ? new Date(result.certificate.created_at).toLocaleString() : 'N/A'}</span></p>
                                    <p><span className="text-slate-500">Previous Tx Hash:</span> <span className="text-slate-200">N/A (Stored On-Chain)</span></p>
                                    <p className="break-all"><span className="text-slate-500">Current Hash:</span> <span className="text-emerald-400">{result.certificate?.data_hash || 'N/A'}</span></p>
                                    <p><span className="text-slate-500">Service:</span> <span className="text-slate-200">{result.certificate?.service_type || 'N/A'}</span></p>
                                    <p><span className="text-slate-500">Status:</span> <span className="text-emerald-400">Verified ✔</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {result && !result.valid && (
                    <div className="px-8 pb-8">
                        <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-8 flex flex-col items-center text-center shadow-inner">
                            <XCircle className="text-red-500 h-20 w-20 mb-4 animate-bounce drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
                            <h3 className="text-2xl font-bold text-red-400 mb-2">{result.message || 'Verification Failed'}</h3>
                            <p className="text-red-500/80">The requested record either does not exist or has been tampered with. The hash chain verification failed.</p>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="px-8 pb-8">
                        <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-8 flex flex-col items-center text-center shadow-inner">
                            <XCircle className="text-red-500 h-20 w-20 mb-4 animate-bounce drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
                            <h3 className="text-2xl font-bold text-red-400 mb-2">{error}</h3>
                            <p className="text-red-500/80">The requested record either does not exist or has been tampered with. The hash chain verification failed.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerifyCertificate;
