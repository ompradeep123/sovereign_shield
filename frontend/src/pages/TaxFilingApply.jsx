import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../context/AuthContext';
import { Landmark, ShieldCheck, Clock, CheckCircle, ChevronRight, AlertCircle, TrendingUp, Calculator, Wallet, User, ArrowLeft, ReceiptText } from 'lucide-react';

const TaxFilingApply = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);
    const [formData, setFormData] = useState({
        taxpayerId: '',
        financialYear: '2025-26',
        employmentType: 'Salaried',
        income: '',
        deductions: '',
        taxPaid: ''
    });

    const [processingStep, setProcessingStep] = useState(0); 

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setStep(2); 

        try {
            setProcessingStep(1); // Verifying Taxpayer Identity
            await new Promise(r => setTimeout(r, 1500));
            
            setProcessingStep(2); // Calculating Liability & Audit
            await new Promise(r => setTimeout(r, 2000));

            setProcessingStep(3); // Anchoring Receipt to Blockchain
            const response = await api.post('/services/tax-filing/request', {
                ...formData,
                income: parseFloat(formData.income),
                deductions: parseFloat(formData.deductions),
                taxPaid: parseFloat(formData.taxPaid)
            });
            setResult(response.data);
            await new Promise(r => setTimeout(r, 1500));

            if (response.data.status === 'SUCCESS') {
                setProcessingStep(4); // Completed
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Tax processing engine timed out. Please verify connectivity.');
            setStep(1); 
        } finally {
            setLoading(false);
        }
    };

    const statusSteps = [
        { label: 'Identity Verified', desc: 'Secure connection to Tax API.' },
        { label: 'Rules Calculation', desc: 'Applying deduction logic.' },
        { label: 'Liability Finalized', desc: 'Cross-checking with Bank records.' },
        { label: 'Ledger Anchoring', desc: 'Receipt vaulted to Polygon.' },
        { label: 'Filing Complete', desc: 'Zero-Knowledge Receipt Issued.' }
    ];

    if (step === 2) {
        return (
            <div className="max-w-3xl mx-auto mt-10 p-8 glass-panel rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
                {error ? (
                    <div className="text-center space-y-6">
                        <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
                        <h2 className="text-2xl font-bold text-white">Tax Filing Failed</h2>
                        <p className="text-slate-400">{error}</p>
                        <button onClick={() => setStep(1)} className="px-6 py-2 bg-slate-800 text-white rounded-xl">Try Again</button>
                    </div>
                ) : (
                    <div className="relative z-10 text-center space-y-8">
                        <div className="inline-flex p-4 bg-[#1e293b] rounded-2xl border border-white/5 shadow-inner mb-4">
                            <Landmark className={`h-12 w-12 ${processingStep === 4 ? 'text-emerald-400' : 'text-sovBlue animate-pulse'}`} />
                        </div>
                        
                        <h2 className="text-3xl font-black text-white tracking-tight">
                            {processingStep < 4 ? 'Sovereign Tax Engine Active' : 'Filing Successfully Vaulted'}
                        </h2>
                        
                        <div className="max-w-md mx-auto space-y-6 text-left">
                            {statusSteps.map((s, idx) => (
                                <div key={idx} className="flex items-start space-x-4 relative">
                                    {idx < statusSteps.length - 1 && (
                                        <div className={`absolute left-3.5 top-8 w-0.5 h-10 border-l ${processingStep > idx ? 'border-emerald-400' : 'border-slate-800 border-dashed'}`}></div>
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

                        {processingStep === 4 && result && (
                            <div className="pt-8 space-y-6">
                                <div className="bg-emerald-500/5 border border-emerald-500/20 p-6 rounded-2xl inline-block max-w-sm w-full">
                                    <p className="text-xs font-bold text-slate-500 uppercase mb-2">Calculated Liability</p>
                                    <p className="text-4xl font-black text-white mb-2">₹{result.taxLiability.toLocaleString()}</p>
                                    <p className={`text-sm font-bold ${result.balance <= 0 ? 'text-emerald-400' : 'text-orange-400'}`}>
                                        {result.balance <= 0 ? 'Tax Cleared ✔' : `Pending: ₹${result.balance.toLocaleString()}`}
                                    </p>
                                </div>
                                <div className="flex flex-col items-center space-y-4">
                                    <button 
                                        onClick={() => navigate('/services')}
                                        className="bg-blue-600 hover:bg-blue-500 text-white font-black px-8 py-4 rounded-2xl shadow-lg transition-all flex items-center space-x-2"
                                    >
                                        <span>Access Trust Records</span>
                                        <ChevronRight size={18} />
                                    </button>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest bg-black/30 px-4 py-1.5 rounded-full border border-white/5">Receipt ID: {result.recordId.substring(0,18)}...</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto mt-4 pb-20 px-4">
            <button 
                onClick={() => navigate('/services')}
                className="flex items-center text-slate-400 hover:text-white mb-6 transition-colors font-bold text-sm uppercase tracking-wider"
            >
                <ArrowLeft size={16} className="mr-2" /> Back to Services
            </button>

            <div className="bg-[#0f172a]/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/5 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-900 via-[#0a192f] to-[#040b14] p-8 border-b-4 border-emerald-500">
                    <h2 className="text-3xl font-extrabold flex items-center mb-2"><ReceiptText className="mr-3 text-emerald-400" size={32}/> Individual Tax Filing (ITR)</h2>
                    <p className="text-blue-200/60 text-sm">Automated Digital Filing · Blockchain Anchored Transparency</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Profile */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-400 flex items-center border-b border-white/5 pb-2">
                                <User size={14} className="mr-2" /> Taxpayer Profile
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Taxpayer Permanent ID (PAN/ID)</label>
                                    <input type="text" name="taxpayerId" required className="w-full bg-[#1e293b]/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-all font-mono" placeholder="ABCDE1234F" value={formData.taxpayerId} onChange={handleChange} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Financial Year</label>
                                        <select name="financialYear" className="w-full bg-[#1e293b]/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-all font-medium" value={formData.financialYear} onChange={handleChange}>
                                            <option>2025-26</option>
                                            <option>2024-25</option>
                                            <option>2023-24</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Employment</label>
                                        <select name="employmentType" className="w-full bg-[#1e293b]/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-all font-medium" value={formData.employmentType} onChange={handleChange}>
                                            <option>Salaried</option>
                                            <option>Business</option>
                                            <option>Freelance</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Financials */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-400 flex items-center border-b border-white/5 pb-2">
                                <Wallet size={14} className="mr-2" /> Financial Metrics
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Total Annual Income (₹)</label>
                                    <div className="relative">
                                        <input type="number" name="income" required className="w-full bg-[#1e293b]/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white outline-none focus:border-blue-500 transition-all font-medium" placeholder="0.00" value={formData.income} onChange={handleChange} />
                                        <span className="absolute left-4 top-3.5 text-slate-500 font-bold">₹</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Total Deductions</label>
                                        <input type="number" name="deductions" required className="w-full bg-[#1e293b]/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-all font-medium" placeholder="e.g. 50000" value={formData.deductions} onChange={handleChange} />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">TDS / Advance Tax</label>
                                        <input type="number" name="taxPaid" required className="w-full bg-[#1e293b]/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-all font-medium" placeholder="0.00" value={formData.taxPaid} onChange={handleChange} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-white/5 bg-[#1e293b]/20 -mx-8 px-8 flex items-center justify-between">
                         <div className="flex items-center space-x-4">
                             <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                                 <Calculator className="text-blue-400" size={24} />
                             </div>
                             <div>
                                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Estimated Liability</p>
                                 <p className="text-xl font-black text-white">₹{Math.max(0, (parseFloat(formData.income || 0) - parseFloat(formData.deductions || 0)) * 0.1).toLocaleString()}</p>
                             </div>
                         </div>
                         <button 
                            type="submit" 
                            disabled={loading} 
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-12 py-5 rounded-2xl shadow-xl transition-all flex items-center space-x-3 active:scale-95 disabled:opacity-50"
                        >
                            <TrendingUp size={20} />
                            <span>Process Filing</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaxFilingApply;
