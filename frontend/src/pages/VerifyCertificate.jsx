import React, { useState } from 'react';
import { api } from '../context/AuthContext';
import { ShieldCheck, Crosshair, Cpu, XCircle, Search } from 'lucide-react';

const VerifyCertificate = () => {
    const [recordId, setRecordId] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

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
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-sovNavy text-white p-6 pb-8 border-b-4 border-sovAccent">
                    <h2 className="text-2xl font-bold flex items-center mb-2"><Crosshair className="mr-3" size={28}/> Verify Certificate Integrity</h2>
                    <p className="text-gray-300 text-sm">Every government service request is logged into the Sovereign Hash Chain. Input a Record ID to cryptographically verify its integrity and origin.</p>
                </div>
                
                <form onSubmit={handleVerify} className="p-8 -mt-6">
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                        <label className="text-sm font-semibold text-gray-700 block mb-2 text-center tracking-widest uppercase">Target Record ID</label>
                        <div className="flex items-center">
                           <input type="text"
                               required
                               placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
                               className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-l-lg outline-none focus:ring-2 focus:ring-sovBlue focus:border-transparent font-mono text-sm"
                               value={recordId}
                               onChange={(e) => setRecordId(e.target.value)}
                           />
                           <button type="submit" disabled={loading} className="bg-sovBlue hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-r-lg shadow-md transition-colors flex items-center justify-center">
                              {loading ? <Cpu className="animate-spin mr-2" /> : <Search className="mr-2"/>} {loading ? 'Verifying...' : 'Verify'}
                           </button>
                        </div>
                    </div>
                </form>

                {result && (
                    <div className="px-8 pb-8">
                        <div className="bg-emerald-50 border-2 border-emerald-500 rounded-xl p-8 flex flex-col items-center text-center shadow-inner relative overflow-hidden">
                            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #10b981 10px, #10b981 20px)' }}></div>
                            <ShieldCheck className="text-emerald-500 h-20 w-20 mb-4 z-10" />
                            <h3 className="text-3xl font-extrabold text-emerald-800 mb-2 z-10 tracking-tight">{result.message}</h3>
                            <p className="text-emerald-700 font-medium mb-6 z-10">Cryptographic hash matches immutable ledger.</p>
                            
                            <div className="bg-white w-full rounded-lg shadow border border-emerald-200 text-left overflow-hidden z-10 text-sm">
                                <div className="bg-emerald-100 px-4 py-2 font-semibold text-emerald-800 border-b border-emerald-200 border-dashed">Polygon Smart Contract Extracted Metadata</div>
                                <div className="p-4 font-mono text-xs text-gray-600 space-y-2">
                                    <p><span className="text-gray-400">Timestamp:</span> {new Date(result.certificate.created_at).toLocaleString()}</p>
                                    <p><span className="text-gray-400">Previous Tx Hash:</span> N/A (Stored On-Chain)</p>
                                    <p className="break-all"><span className="text-gray-400">Current Hash:</span> {result.certificate.data_hash}</p>
                                    <p><span className="text-gray-400">Service:</span> {result.certificate.service_type}</p>
                                    <p><span className="text-gray-400">Status:</span> Verified ✔</p>
                                </div>
                            </div>
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
