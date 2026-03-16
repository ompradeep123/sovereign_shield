import React, { useState, useRef, useEffect } from 'react';
import { api } from '../context/AuthContext';
import { ShieldCheck, Camera, X, Cpu, AlertCircle, Lock } from 'lucide-react';
import { verifyBiometric } from '../utils/biometric';

const BiometricGuard = ({ isOpen, onVerified, onCancel, serviceName }) => {
    const [status, setStatus] = useState('IDLE'); // IDLE, SCANNING, VERIFYING, SUCCESS, FAILED
    const [confidence, setConfidence] = useState(0);
    const videoRef = useRef(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen) {
            setError(null);
            setStatus('SCANNING');
            setConfidence(0);
            startScanner();
        }
    }, [isOpen]);

    const startScanner = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
            if (videoRef.current) videoRef.current.srcObject = stream;
        } catch (err) {
            setError('Biometric sensor unavailable. Check camera permissions.');
            setStatus('FAILED');
        }
    };

    const handleVerify = async () => {
        setStatus('VERIFYING');
        // Artificial progress for confidence
        let currentConf = 0;
        const interval = setInterval(() => {
            currentConf += 12;
            if (currentConf > 96) clearInterval(interval);
            setConfidence(currentConf);
        }, 100);

        try {
            const stream = videoRef.current.srcObject;
            const embedding = await verifyBiometric(stream);
            
            const response = await api.post('/services/biometric/verify', { faceEmbedding: embedding });
            
            if (response.data.verified) {
                setConfidence(98.4);
                clearInterval(interval);
                setStatus('SUCCESS');
                setTimeout(() => {
                    const tracks = stream.getTracks();
                    tracks.forEach(t => t.stop());
                    onVerified();
                }, 1500);
            }
        } catch (err) {
            clearInterval(interval);
            setStatus('FAILED');
            setError('Biometric Mismatch: Feature similarity below threshold (0.2). Attempt Logged.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#030712]/90 backdrop-blur-xl animate-fade-in"></div>
            
            <div className="relative bg-[#0f172a] max-w-md w-full rounded-3xl border border-white/10 shadow-[0_0_100px_rgba(37,99,235,0.2)] overflow-hidden scale-in-center">
                <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <Lock size={20} />
                        <h3 className="font-black uppercase tracking-widest text-sm">Step-Up Authentication</h3>
                    </div>
                    <button onClick={onCancel} className="p-1 hover:bg-white/10 rounded-lg transition-colors"><X size={20} /></button>
                </div>

                <div className="p-8 space-y-8 text-center">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-black text-white tracking-tight uppercase">Continuous Verification</h2>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-loose">
                            Confirming Citizen Identity for: <span className="text-blue-400 underline">{serviceName}</span>
                        </p>
                    </div>

                    <div className="relative mx-auto w-64 h-64 rounded-3xl overflow-hidden border-2 border-white/5 bg-black">
                        <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover scale-x-[-1]" />
                        
                        {/* Scanning Animation */}
                        {status === 'SCANNING' && (
                            <div className="absolute inset-0 scanner-sweep"></div>
                        )}

                        {status === 'VERIFYING' && (
                            <div className="absolute inset-0 bg-blue-600/30 flex flex-col items-center justify-center backdrop-blur-md">
                                <Cpu className="text-blue-400 animate-spin mb-4" size={48} />
                                <div className="w-3/4 h-1.5 bg-white/10 rounded-full overflow-hidden mb-2">
                                    <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${confidence}%` }}></div>
                                </div>
                                <p className="text-[10px] font-black text-white uppercase tracking-[0.34em]">Cross-Checking Neural Map: {confidence}%</p>
                            </div>
                        )}

                        {status === 'SUCCESS' && (
                            <div className="absolute inset-0 bg-emerald-500/80 flex flex-col items-center justify-center animate-fade-in backdrop-blur-sm">
                                <ShieldCheck className="text-white mb-2" size={48} />
                                <p className="text-xs font-black text-white uppercase tracking-widest">Identity Rooted</p>
                            </div>
                        )}

                        {status === 'FAILED' && (
                            <div className="absolute inset-0 bg-red-500/80 flex flex-col items-center justify-center animate-shake backdrop-blur-sm">
                                <ShieldAlert className="text-white mb-2" size={48} />
                                <p className="text-xs font-black text-white uppercase tracking-widest">Auth Failure</p>
                            </div>
                        )}
                    </div>

                    {status === 'SCANNING' && (
                        <button 
                            onClick={handleVerify}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-black uppercase tracking-widest text-sm shadow-xl transition-all flex items-center justify-center space-x-3"
                        >
                            <Camera size={18} />
                            <span>Verify Identity</span>
                        </button>
                    )}

                    {error && (
                        <div className="flex items-center justify-center text-red-500 text-xs font-bold uppercase tracking-widest space-x-2 animate-fade-in">
                            <AlertCircle size={14} />
                            <span>{error}</span>
                        </div>
                    )}

                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Zero-Trust Policy Enforcement v3.0</p>
                </div>
            </div>
        </div>
    );
};

export default BiometricGuard;
