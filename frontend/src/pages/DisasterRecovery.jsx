import React, { useState } from 'react';
import { api } from '../context/AuthContext';
import { ServerCrash, Terminal, HardDriveUpload, CheckCircle, RefreshCcw } from 'lucide-react';

const DisasterRecovery = () => {
    const [simulating, setSimulating] = useState(false);
    const [step, setStep] = useState(0);

    const handleFailover = async () => {
        if(simulating) return;
        setSimulating(true);
        setStep(1); // Detected
        
        setTimeout(() => setStep(2), 2000); // Rerouting
        setTimeout(() => setStep(3), 4000); // Restoring
        
        setTimeout(async () => {
            try {
                await api.post('/admin/simulate/failover');
                setStep(4); // Restored
            } catch(e) {}
            setSimulating(false);
        }, 6000);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6 mt-4">
            <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-white/5 rounded-2xl shadow-2xl p-6 lg:p-8 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-red-600 opacity-10 group-hover:opacity-20 transition-opacity duration-700 blur-[120px] rounded-full pointer-events-none"></div>
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b border-white/5 pb-8 relative z-10 gap-6">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-extrabold flex items-center tracking-tight text-white mb-2"><ServerCrash className="text-red-500 mr-4 shrink-0 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]" size={36}/> Deep Recovery Architect</h2>
                        <p className="text-slate-400 text-xs md:text-sm font-mono font-bold tracking-widest uppercase">Hot-Standby Failover Simulation</p>
                    </div>
                    <button 
                       onClick={handleFailover}
                       disabled={simulating}
                       className="bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-black py-4 px-8 rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all flex items-center font-mono uppercase text-sm tracking-widest w-full md:w-auto justify-center hover:-translate-y-1 active:scale-95 border border-red-500 border-b-4"
                    >
                       <Terminal size={20} className="mr-3"/> {simulating ? 'EXECUTING SIMULATION...' : 'SIMULATE CRITICAL FAILURE'}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8 relative z-10">
                    {[
                        { id: 1, label: 'Failure Detected', desc: 'Heartbeat timeout on Primary Node', icon: <ServerCrash size={28}/> },
                        { id: 2, label: 'Traffic Rerouted', desc: 'DNS shifted to secondary subnet', icon: <RefreshCcw size={28}/> },
                        { id: 3, label: 'Ledger Restored', desc: 'Immutable states synced', icon: <HardDriveUpload size={28}/> },
                        { id: 4, label: 'Service Resumed', desc: 'API Gateway operational', icon: <CheckCircle size={28}/> }
                    ].map(s => (
                        <div key={s.id} className={`p-6 rounded-2xl border-2 transition-all duration-700 ease-out transform ${step >= s.id ? 'bg-[#1e293b]/80 border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.15)] scale-100' : 'bg-[#0f172a]/50 border-white/5 opacity-50 scale-95'}`}>
                            <div className={`mb-4 flex justify-between items-start ${step >= s.id ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'text-slate-600'}`}>
                                {s.icon}
                                <span className={`text-xs font-mono font-bold tracking-widest px-2 py-1 rounded bg-black/20 ${step >= s.id ? 'text-emerald-400 border border-emerald-500/20' : 'text-slate-600 border border-white/5'}`}>STEP 0{s.id}</span>
                            </div>
                            <h4 className="font-extrabold text-white text-lg mb-2 tracking-tight">{s.label}</h4>
                            <p className="text-sm text-slate-400 font-mono tracking-wide leading-relaxed">{s.desc}</p>
                            
                            <div className="mt-5 h-6">
                                {step === s.id && <div className="text-xs text-emerald-400 font-mono animate-pulse tracking-widest flex items-center font-bold bg-emerald-500/10 w-max px-3 py-1.5 rounded-lg border border-emerald-500/20"><RefreshCcw size={12} className="mr-2 animate-spin"/> PROCESSING</div>}
                                {step > s.id && <div className="text-xs text-emerald-500 font-mono font-black tracking-widest uppercase flex items-center bg-emerald-500/10 w-max px-3 py-1.5 rounded-lg border border-emerald-500/30 shadow-inner"><CheckCircle size={12} className="mr-2"/> COMPLETED OK</div>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DisasterRecovery;
