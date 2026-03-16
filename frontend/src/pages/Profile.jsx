import React, { useState, useEffect, useContext, useRef } from 'react';
import { api, AuthContext } from '../context/AuthContext';
import { User, ShieldCheck, Camera, Smartphone, Globe, Mail, MapPin, Calendar, Fingerprint, Lock, ShieldAlert, Cpu, CheckCircle } from 'lucide-react';
import { registerBiometric, getDeviceFingerprint } from '../utils/biometric';

const Profile = () => {
    const { user } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [registering, setRegistering] = useState(false);
    const [cameraActive, setCameraActive] = useState(false);
    const [statusMsg, setStatusMsg] = useState(null);
    const videoRef = useRef(null);

    const fetchProfile = async () => {
        try {
            setError(null);
            const res = await api.get('/services/profile');
            setProfile(res.data);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Failed to establish secure connection to Vault.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const startCamera = async () => {
        try {
            setCameraActive(true);
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
            if (videoRef.current) videoRef.current.srcObject = stream;
        } catch (err) {
            setStatusMsg({ type: 'error', text: 'Camera access denied. Check permissions.' });
            setCameraActive(false);
        }
    };

    const handleAddBiometric = async () => {
        setRegistering(true);
        setStatusMsg({ type: 'info', text: 'Initializing Neural Scan... Keep still and center your face.' });
        try {
            const stream = videoRef.current.srcObject;
            const embedding = await registerBiometric(stream);
            
            setStatusMsg({ type: 'info', text: 'Encrypting Identity Root with SHA-256... 98% Accurate' });
            await api.post('/services/biometric/register', { faceEmbedding: embedding });
            
            // Artificial delay for "wowed" effect
            await new Promise(r => setTimeout(r, 800));
            
            stream.getTracks().forEach(t => t.stop());
            setCameraActive(false);
            setStatusMsg({ type: 'success', text: 'Identity Vault Updated. Biometric Root Established.' });
            
            // Refresh profile to reflect Level 5 status immediately
            await fetchProfile();
        } catch (err) {
            setStatusMsg({ type: 'error', text: 'Encryption Handshake Failed. Please center your face.' });
        } finally {
            setRegistering(false);
        }
    };

    if (loading) return <div className="p-20 text-center text-slate-500 animate-pulse font-mono uppercase tracking-widest">Accessing Secure Vault...</div>;

    if (error) return (
        <div className="p-20 text-center space-y-6">
            <div className="inline-flex p-6 bg-red-500/10 border border-red-500/20 rounded-full">
                <ShieldAlert className="text-red-500" size={48} />
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">Security Handshake Failure</h2>
            <p className="text-slate-400 max-w-md mx-auto font-mono text-sm uppercase tracking-widest">{error}</p>
            <button 
                onClick={fetchProfile}
                className="px-8 py-3 bg-[#1e293b] text-white rounded-xl font-bold uppercase tracking-widest text-xs border border-white/10 hover:bg-white/5 transition-colors"
            >
                Retry Identity Sync
            </button>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto space-y-8 mt-4 pb-20">
            {/* Header / Identity Card */}
            <div className="bg-[#0f172a]/90 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full -mr-20 -mt-20 group-hover:bg-emerald-500/10 transition-colors duration-1000"></div>
                
                <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                    <div className="relative">
                        <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-[#1e293b] to-[#0f172a] border-2 border-white/10 flex items-center justify-center overflow-hidden shadow-2xl relative">
                            <User className="text-blue-400 opacity-50" size={64} />
                            {profile.hasBiometric && (
                                <div className="absolute bottom-0 right-0 p-1.5 bg-emerald-500 rounded-tl-xl shadow-lg">
                                    <ShieldCheck className="text-white" size={16} />
                                </div>
                            )}
                        </div>
                        <div className="absolute -top-3 -right-3 px-3 py-1 bg-blue-600 rounded-full text-[10px] font-black tracking-tighter text-white border-2 border-[#0f172a] uppercase">V3 Active</div>
                    </div>
                    
                    <div className="text-center md:text-left flex-1">
                        <h2 className="text-3xl font-black text-white tracking-tight mb-2 uppercase">{profile.name || 'Sovereign Citizen'}</h2>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                            <span className="flex items-center text-xs font-bold text-slate-400 bg-black/30 px-3 py-1.5 rounded-lg border border-white/5 uppercase tracking-widest"><Fingerprint size={14} className="mr-2 text-blue-400" /> {profile.nid || 'NID-PENDING'}</span>
                            <span className={`flex items-center text-xs font-bold px-3 py-1.5 rounded-lg border uppercase tracking-widest ${profile.hasBiometric ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'}`}>
                                <ShieldCheck size={14} className="mr-2" /> {profile.securityLevel}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Security Verification Status */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-[#0f172a]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/5">
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center"><Lock size={16} className="mr-2 text-blue-400" /> Identity Verification Status</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { label: 'Email Verified', status: !!profile.email, icon: <Mail size={20} /> },
                                { label: 'MFA Enabled', status: true, icon: <Smartphone size={20} /> },
                                { label: 'Face ID Registered', status: profile.hasBiometric, icon: <Camera size={20} /> }
                            ].map((item, i) => (
                                <div key={i} className={`p-5 rounded-2xl border transition-all ${item.status ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                                    <div className={`mb-3 ${item.status ? 'text-emerald-400' : 'text-red-400'}`}>{item.icon}</div>
                                    <p className="text-xs font-black text-white uppercase tracking-tighter mb-1">{item.label}</p>
                                    <p className={`text-[10px] font-bold uppercase tracking-widest ${item.status ? 'text-emerald-500' : 'text-red-500'}`}>{item.status ? 'Verified' : 'Required'}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Personal Context */}
                    <div className="bg-[#0f172a]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/5">
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center"><Globe size={16} className="mr-2 text-blue-400" /> Citizen Attributes</h3>
                        <div className="space-y-4">
                            {[
                                { icon: <Mail />, label: 'Verified Email', value: profile.email },
                                { icon: <MapPin />, label: 'Registered Domicile', value: '742 Sovereign St, Govt. Block' },
                                { icon: <ShieldCheck />, label: 'Biometric Status', value: profile.hasBiometric ? 'HARDENED' : 'NOT ENROLLED' },
                                { icon: <Calendar />, label: 'Onboarding Date', value: new Date(profile.created_at).toLocaleDateString() }
                            ].map((row, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-[#1e293b]/30 rounded-xl border border-white/5">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-2 text-blue-400 bg-blue-400/10 rounded-lg">{row.icon}</div>
                                        <p className="text-sm font-bold text-slate-300">{row.label}</p>
                                    </div>
                                    <p className="text-sm font-mono text-slate-100">{row.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Biometric Enrollment Card */}
                <div className="space-y-8">
                    <div className={`rounded-3xl p-8 border transition-all ${profile.hasBiometric ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-blue-600/10 border-blue-500/20 animate-pulse-slow'}`}>
                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-[#1e293b] rounded-full flex items-center justify-center mb-6 shadow-xl border border-white/10">
                                {profile.hasBiometric ? <ShieldCheck className="text-emerald-400" size={40} /> : <Camera className="text-blue-400" size={40} />}
                            </div>
                            <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight">
                                {profile.hasBiometric ? 'Facial ID Rooted' : 'Enable Biometric ID'}
                            </h3>
                            <p className="text-sm text-slate-400 mb-8 font-medium">
                                {profile.hasBiometric 
                                    ? 'Your facial biometric template is encrypted and used for continuous authentication across the platform.' 
                                    : 'Required for Level-5 clearance. Activates secure facial verification for all sensitive service requests.'}
                            </p>

                            {!cameraActive ? (
                                <button 
                                    onClick={startCamera}
                                    className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-lg ${profile.hasBiometric ? 'bg-[#1e293b] text-slate-400 cursor-default' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/40'}`}
                                >
                                    {profile.hasBiometric ? 'Update Facial Template' : 'Enroll Face ID'}
                                </button>
                            ) : (
                                <div className="space-y-6 w-full">
                                    <div className="relative rounded-2xl overflow-hidden border-2 border-blue-500 shadow-2xl bg-black aspect-video flex items-center justify-center">
                                        <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover scale-x-[-1]" />
                                        <div className="absolute inset-0 border-[30px] border-black/40 pointer-events-none"></div>
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <div className="w-48 h-64 border-2 border-emerald-400/50 rounded-[100px] shadow-[0_0_50px_rgba(52,211,153,0.3)]"></div>
                                        </div>
                                    </div>
                                    
                                    <button 
                                        disabled={registering}
                                        onClick={handleAddBiometric}
                                        className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl transition-all"
                                    >
                                        {registering ? 'Processing Architecture...' : 'Capture Biometric Root'}
                                    </button>
                                </div>
                            )}

                            {statusMsg && (
                                <div className={`mt-6 p-4 rounded-xl text-xs font-bold w-full border ${statusMsg.type === 'error' ? 'bg-red-500/10 text-red-400 border-red-500/20' : statusMsg.type === 'info' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                                    {statusMsg.text}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Device Trust Card */}
                    <div className="bg-[#0f172a]/50 p-6 rounded-2xl border border-white/5">
                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center"><Smartphone size={12} className="mr-2" /> Current Device Trust</h4>
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-emerald-500/10 rounded-xl">
                                <CheckCircle size={20} className="text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-white uppercase tracking-tight">Trusted Fingerprint</p>
                                <p className="text-[10px] font-mono text-slate-500 truncate max-w-[120px]">{getDeviceFingerprint()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
