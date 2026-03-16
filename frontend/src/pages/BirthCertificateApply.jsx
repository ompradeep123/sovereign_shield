import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../context/AuthContext';
import { FileText, ShieldCheck, Clock, CheckCircle, ChevronRight, AlertCircle, Building2, Hospital, MapPin, User, ArrowLeft } from 'lucide-react';
import BiometricGuard from '../components/BiometricGuard';

const BirthCertificateApply = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        childName: '',
        dob: '',
        pob: '',
        hospitalName: '',
        hospitalRecordId: '',
        parentName: '',
        parentNid: '',
        address: ''
    });

    const [isBiometricOpen, setIsBiometricOpen] = useState(false);
    const [biometricVerified, setBiometricVerified] = useState(false);

    const [processingStep, setProcessingStep] = useState(0); // 0: Idle, 1: Validating, 2: Hospital Logic, 3: Blockchain Anchor

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFormPreSubmit = (e) => {
        e.preventDefault();
        setIsBiometricOpen(true);
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        setStep(2); // Move to processing stage

        try {
            // Processing Lifecycle Visualization
            setProcessingStep(1); // Identity Verification
            await new Promise(r => setTimeout(r, 1500));
            
            setProcessingStep(2); // Hospital Record Corroboration
            await new Promise(r => setTimeout(r, 2000));

            setProcessingStep(3); // Blockchain Anchoring
            const response = await api.post('/services/birth-certificate/request', {
                ...formData,
                biometricVerified: true
            });
            await new Promise(r => setTimeout(r, 1500));

            if (response.data.status === 'SUCCESS') {
                setProcessingStep(4); // Completed
            }
        } catch (err) {
            setError(err.response?.data?.reason || err.response?.data?.error || 'System Failure during anchor. Please retry.');
            setStep(1); // Revert to form
        } finally {
            setLoading(false);
        }
    };

    const statusSteps = [
        { label: 'Submitted', desc: 'Secure transmission received.' },
        { label: 'Under Verification', desc: 'Health stack cross-match.' },
        { label: 'Processing', desc: 'Issuing Authority Approval.' },
        { label: 'Anchoring', desc: 'Immutable Ledger Write (Polygon).' },
        { label: 'Completed', desc: 'Certificate ready.' }
    ];

    if (step === 2) {
        return (
            <div className="max-w-3xl mx-auto mt-10 p-8 glass-panel rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-emerald-400/5 pointer-events-none"></div>
                <div className="relative z-10 text-center space-y-8">
                    <div className="inline-flex p-4 bg-[#1e293b] rounded-2xl border border-white/5 shadow-inner mb-4">
                        <ShieldCheck className={`h-12 w-12 ${processingStep === 4 ? 'text-emerald-400' : 'text-blue-400 animate-pulse'}`} />
                    </div>
                    
                    <h2 className="text-3xl font-black text-white tracking-tight">
                        {processingStep < 4 ? 'Secure Service Pipeline Active' : 'Birth Certificate Vaulted'}
                    </h2>
                    
                    <p className="text-slate-400 max-w-md mx-auto">
                        Your request is moving through the SovereignShield secure infrastructure lifecycle.
                    </p>

                    <div className="max-w-md mx-auto space-y-6 text-left">
                        {statusSteps.map((s, idx) => (
                            <div key={idx} className="flex items-start space-x-4 relative">
                                {idx < statusSteps.length - 1 && (
                                    <div className={`absolute left-3.5 top-8 w-0.5 h-10 border-l ${processingStep > idx ? 'border-emerald-500' : 'border-slate-800 border-dashed'}`}></div>
                                )}
                                <div className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 z-10 ${
                                    processingStep > idx ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 
                                    processingStep === idx ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]' : 
                                    'bg-[#0f172a] text-slate-700 border border-white/5'
                                }`}>
                                    {processingStep > idx ? <CheckCircle size={14} /> : idx + 1}
                                </div>
                                <div>
                                    <p className={`font-bold text-sm ${processingStep >= idx ? 'text-slate-100' : 'text-slate-600'}`}>{s.label}</p>
                                    <p className="text-xs text-slate-500">{s.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {processingStep === 4 && (
                        <div className="pt-8 flex flex-col items-center space-y-4">
                            <button 
                                onClick={() => navigate('/services')}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-8 py-4 rounded-2xl shadow-lg transition-all flex items-center space-x-2"
                            >
                                <span>Go to My Services</span>
                                <ChevronRight size={18} />
                            </button>
                            <p className="text-xs text-emerald-500 font-bold uppercase tracking-widest">Hash Anchored to Polygon Ledger ✔</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto mt-4 pb-20 px-4">
            <button 
                onClick={() => navigate('/services')}
                className="flex items-center text-slate-400 hover:text-white mb-6 transition-colors font-bold text-sm uppercase tracking-wider"
            >
                <ArrowLeft size={16} className="mr-2" /> Back to Catalog
            </button>

            <div className="bg-[#0f172a]/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/5 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-900 via-[#0a192f] to-[#040b14] text-white p-8 border-b-4 border-sovAccent">
                    <h2 className="text-3xl font-extrabold flex items-center mb-2"><FileText className="mr-3 text-emerald-400" size={32}/> Birth Certificate Registration</h2>
                    <p className="text-blue-200/60 text-sm">Secure Government Service Portal · End-to-End Encrypted</p>
                </div>

                <form onSubmit={handleFormPreSubmit} className="p-8 space-y-8">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-4 rounded-xl text-sm font-bold flex items-center">
                            <AlertCircle size={18} className="mr-3 shrink-0"/> {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Child Info */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-400 flex items-center border-b border-white/5 pb-2">
                                <User size={14} className="mr-2" /> Child Details
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Full Name of Child</label>
                                    <input type="text" name="childName" required className="w-full bg-[#1e293b]/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-all font-medium" placeholder="Legal Name" value={formData.childName} onChange={handleChange} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Date of Birth</label>
                                        <input type="date" name="dob" required className="w-full bg-[#1e293b]/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-all font-medium" value={formData.dob} onChange={handleChange} />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Place of Birth</label>
                                        <input type="text" name="pob" required className="w-full bg-[#1e293b]/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-all font-medium" placeholder="City" value={formData.pob} onChange={handleChange} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Birth Record Info */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-400 flex items-center border-b border-white/5 pb-2">
                                <Hospital size={14} className="mr-2" /> Hospital Context
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Hospital / Health Center Name</label>
                                    <input type="text" name="hospitalName" required className="w-full bg-[#1e293b]/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-all font-medium" placeholder="Registered Hospital" value={formData.hospitalName} onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block tracking-tight">Hospital Birth Record ID (e.g., HOSP-XXXX)</label>
                                    <input type="text" name="hospitalRecordId" required className="w-full bg-[#1e293b]/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-all font-mono" placeholder="HOSP-123456" value={formData.hospitalRecordId} onChange={handleChange} />
                                </div>
                            </div>
                        </div>

                        {/* Parent Info */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-400 flex items-center border-b border-white/5 pb-2">
                                <Building2 size={14} className="mr-2" /> Parental Identity
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Parent's Full Name</label>
                                    <input type="text" name="parentName" required className="w-full bg-[#1e293b]/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-all font-medium" placeholder="As per National ID" value={formData.parentName} onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Parent National ID (NID)</label>
                                    <input type="text" name="parentNid" required className="w-full bg-[#1e293b]/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-all font-mono" placeholder="NID-XXXX-XXXX" value={formData.parentNid} onChange={handleChange} />
                                </div>
                            </div>
                        </div>

                        {/* Jurisdictional Info */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-400 flex items-center border-b border-white/5 pb-2">
                                <MapPin size={14} className="mr-2" /> Jurisdictional Residency
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Residential Address</label>
                                    <textarea name="address" required rows="3" className="w-full bg-[#1e293b]/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-all font-medium resize-none" placeholder="Current Primary Residence" value={formData.address} onChange={handleChange}></textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-start space-x-3 max-w-lg">
                            <ShieldCheck className="text-emerald-500 shrink-0 mt-1" size={20} />
                            <p className="text-[10px] text-slate-500 tracking-wide uppercase font-bold leading-relaxed">
                                I solemnly declare the above information is true. This request will be cryptographically anchored to the National Blockchain Ledger upon approval.
                            </p>
                        </div>
                        <button 
                            type="submit" 
                            disabled={loading} 
                            className="bg-blue-600 hover:bg-blue-500 text-white font-black px-12 py-5 rounded-2xl shadow-xl transition-all flex items-center space-x-3 active:scale-95 disabled:opacity-50"
                        >
                            <span>Validate & Submit</span>
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </form>

                <BiometricGuard 
                    isOpen={isBiometricOpen} 
                    onVerified={() => {
                        setIsBiometricOpen(false);
                        handleSubmit();
                    }}
                    onCancel={() => setIsBiometricOpen(false)}
                    serviceName="Birth Certificate Issuance"
                />
            </div>
        </div>
    );
};

export default BirthCertificateApply;
