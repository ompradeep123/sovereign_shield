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
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="bg-gray-900 text-white rounded-xl shadow-2xl p-8 border-2 border-gray-800">
                <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-6">
                    <div>
                        <h2 className="text-3xl font-extrabold flex items-center tracking-tight text-white mb-2"><ServerCrash className="text-red-500 mr-3" size={32}/> Deep Recovery Architect</h2>
                        <p className="text-gray-400 text-sm font-mono tracking-widest uppercase">Hot-Standby Failover Simulation</p>
                    </div>
                    <button 
                       onClick={handleFailover}
                       disabled={simulating}
                       className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-lg shadow-[0_0_15px_rgba(220,38,38,0.5)] transition-all flex items-center font-mono uppercase text-sm tracking-wider"
                    >
                       <Terminal size={18} className="mr-2"/> {simulating ? 'EXECUTING SIMULATION...' : 'SIMULATE CRITICAL FAILURE'}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
                    {[
                        { id: 1, label: 'Failure Detected', desc: 'Heartbeat timeout on Primary Node', icon: <ServerCrash size={24}/> },
                        { id: 2, label: 'Traffic Rerouted', desc: 'DNS shifted to secondary subnet', icon: <RefreshCcw size={24}/> },
                        { id: 3, label: 'Ledger Restored', desc: 'Immutable states synced', icon: <HardDriveUpload size={24}/> },
                        { id: 4, label: 'Service Resumed', desc: 'API Gateway operational', icon: <CheckCircle size={24}/> }
                    ].map(s => (
                        <div key={s.id} className={`p-5 rounded-lg border-2 transition-all duration-500 ${step >= s.id ? 'bg-gray-800 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'bg-gray-800/50 border-gray-700 opacity-50'}`}>
                            <div className={`mb-3 ${step >= s.id ? 'text-emerald-400' : 'text-gray-500'}`}>{s.icon}</div>
                            <h4 className="font-bold text-white text-base mb-1">{s.label}</h4>
                            <p className="text-xs text-gray-400 font-mono tracking-wide">{s.desc}</p>
                            {step === s.id && <div className="mt-3 text-xs text-emerald-300 font-mono animate-pulse">PROCESSING...</div>}
                            {step > s.id && <div className="mt-3 text-xs text-emerald-500 font-mono font-bold tracking-widest uppercase">COMPLETED OK</div>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DisasterRecovery;
