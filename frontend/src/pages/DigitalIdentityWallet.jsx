import React, { useState, useEffect } from 'react';
import { api, AuthContext } from '../context/AuthContext';
import { KeyRound, CheckCircle, ShieldAlert, Fingerprint } from 'lucide-react';

const DigitalIdentityWallet = () => {
    const { user } = React.useContext(AuthContext);
    const [proofs, setProofs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Load persistent proofs from the browser's designated local wallet storage layer
    useEffect(() => {
        if (user?.id) {
            const savedProofs = localStorage.getItem(`zkp_proofs_${user.id}`);
            if (savedProofs) {
                setProofs(JSON.parse(savedProofs));
            }
        }
    }, [user]);

    const generateProofs = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get('/eligibility/verify');
            const generatedProofs = res.data.proofs;
            setProofs(generatedProofs);
            
            // Persist the cryptographically generated zero-knowledge proofs to local wallet
            if (user?.id) {
                localStorage.setItem(`zkp_proofs_${user.id}`, JSON.stringify(generatedProofs));
            }
        } catch (err) {
            console.error('ZKP Error:', err);
            setError(err.response?.data?.message || err.response?.data?.error || 'Failed to generate cryptographic proofs');
        }
        setLoading(false);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 mt-2 pb-10">
            <div className="rounded-2xl shadow-xl border border-white/20 p-6 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900 to-sovNavy text-white relative overflow-hidden group">
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-sovBlue rounded-full blur-[100px] opacity-30 pointer-events-none"></div>
                <div className="relative z-10 w-full md:w-2/3">
                    <h2 className="text-3xl md:text-4xl font-extrabold flex items-center mb-3">
                        <Fingerprint className="text-emerald-400 mr-3 shrink-0 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]" size={36}/> 
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">Digital Identity Wallet</span>
                    </h2>
                    <p className="text-blue-100/80 mt-2 text-sm md:text-base leading-relaxed font-medium">
                        This wallet uses <strong className="text-white">Zero-Knowledge Proofs (ZKP)</strong>. Instead of revealing raw personal data, it securely generates an on-device cryptographic proof verifying that you meet the underlying criteria without exposing the data itself. 
                    </p>
                </div>
                <button 
                  onClick={generateProofs} 
                  disabled={loading}
                  className="bg-white text-sovNavy hover:bg-emerald-50 hover:text-emerald-700 hover:shadow-[0_0_20px_rgba(52,211,153,0.3)] hover:-translate-y-0.5 px-6 py-4 w-full md:w-auto rounded-xl shadow-lg font-bold text-sm md:text-base transition-all duration-300 disabled:opacity-50 disabled:hover:translate-y-0 flex justify-center items-center space-x-2 shrink-0 relative z-10"
                >
                    <KeyRound size={20} className={loading ? "animate-pulse" : ""} />
                    <span>{loading ? 'Generating Proofs...' : 'Generate ZKP Proof'}</span>
                </button>
            </div>

            {error && <div className="bg-red-50 text-red-600 border border-red-200 p-4 rounded-xl flex items-center shadow-sm text-sm font-medium"><ShieldAlert className="mr-2 shrink-0 text-red-500"/> {error}</div>}

            {proofs.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {proofs.map((p, idx) => (
                        <div key={idx} className="bg-white border text-sm border-gray-200/60 rounded-2xl p-6 shadow-lg shadow-gray-200/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-emerald-400 to-sovAccent group-hover:w-2 transition-all"></div>
                            <div className="absolute -bottom-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity">
                               <ShieldAlert size={120} />
                            </div>
                            <div className="flex justify-between items-center mb-4 relative z-10">
                                <h3 className="font-bold text-gray-800 text-lg tracking-tight">{p.property}</h3>
                                <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm text-xs font-bold px-3 py-1.5 rounded-full flex items-center"><CheckCircle size={14} className="mr-1.5"/> {p.proof?.status || 'Verified Token'}</span>
                            </div>
                            <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-100 mb-4 font-mono text-xs text-gray-600 break-all relative z-10 group-hover:bg-gray-100/80 transition-colors">
                                <div className="text-[10px] uppercase tracking-widest text-gray-400 mb-1 font-sans font-bold">Cryptographic ZKP Hash</div>
                                {p.proof?.proofValue || 'Generative Error'}
                            </div>
                            <div className="text-xs font-medium text-gray-500 flex justify-between relative z-10 pt-2 border-t border-gray-100/60">
                                <span className="flex items-center"><KeyRound size={12} className="mr-1 text-gray-400"/> Key: <span className="font-mono text-gray-700 ml-1 bg-gray-100 px-1 py-0.5 rounded">{p.proof?.verificationKey?.substring(0,8) || 'N/A'}...</span></span>
                                <span>{p.proof?.verifiedAt ? new Date(p.proof.verifiedAt).toLocaleTimeString() : 'N/A'}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            {proofs.length === 0 && !loading && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center flex flex-col items-center">
                    <KeyRound className="h-12 w-12 text-gray-300 mb-3" />
                    <h3 className="text-gray-500 font-medium">No Identity Proofs Generated</h3>
                    <p className="text-sm text-gray-400 mt-1">Click the button above to simulate ZKP generation.</p>
                </div>
            )}
        </div>
    );
};

export default DigitalIdentityWallet;
