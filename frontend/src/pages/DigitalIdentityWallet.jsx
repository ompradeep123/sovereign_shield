import React, { useState, useEffect } from 'react';
import { api } from '../context/AuthContext';
import { KeyRound, CheckCircle, ShieldAlert, Fingerprint } from 'lucide-react';

const DigitalIdentityWallet = () => {
    const [proofs, setProofs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const generateProofs = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get('/services/wallet/zkp');
            setProofs(res.data.proofs);
        } catch (err) {
            setError('Failed to generate cryptographic proofs');
        }
        setLoading(false);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-start justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-sovNavy flex items-center"><Fingerprint className="text-sovBlue mr-3" size={28}/> Digital Identity Wallet</h2>
                    <p className="text-gray-500 mt-2 max-w-xl text-sm leading-relaxed">
                        This wallet uses <strong className="text-sovNavy font-semibold">Zero-Knowledge Proofs (ZKP)</strong>. Instead of revealing your raw personal data (like your exact birthdate or exact income), it generates a cryptographic proof verifying that you meet the underlying criteria (e.g., "Over 18", "Income Tier 1"). 
                    </p>
                </div>
                <button 
                  onClick={generateProofs} 
                  disabled={loading}
                  className="bg-sovNavy text-white hover:bg-blue-900 px-5 py-2.5 rounded-lg shadow-md font-medium text-sm transition-colors disabled:opacity-50 flex items-center space-x-2"
                >
                    <KeyRound size={18} />
                    <span>{loading ? 'Generating Proofs...' : 'Generate ZKP Proofs'}</span>
                </button>
            </div>

            {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center shadow-inner text-sm"><ShieldAlert className="mr-2"/> {error}</div>}

            {proofs.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {proofs.map((p, idx) => (
                        <div key={idx} className="bg-white border text-sm border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-sovAccent"></div>
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="font-semibold text-gray-800 text-base">{p.property}</h3>
                                <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center"><CheckCircle size={14} className="mr-1"/> {p.status}</span>
                            </div>
                            <div className="bg-gray-50 p-3 rounded border border-gray-100 mb-2 font-mono text-xs text-gray-600 break-all">
                                {p.proofValue}
                            </div>
                            <div className="text-xs text-gray-400 flex justify-between">
                                <span>Verification Key: {p.verificationKey.substring(0,8)}...</span>
                                <span>{new Date(p.verifiedAt).toLocaleTimeString()}</span>
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
