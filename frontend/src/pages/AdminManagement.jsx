import React from 'react';
import { Settings, Shield, UserX, UserCheck, KeyRound } from 'lucide-react';

const AdminManagement = () => {
    return (
        <div className="max-w-6xl mx-auto space-y-6 mt-4">
            <div className="bg-[#0f172a]/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/5 p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600 opacity-10 group-hover:opacity-20 transition-opacity duration-700 blur-[120px] rounded-full pointer-events-none"></div>
                <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6 relative z-10">
                    <div>
                        <h2 className="text-3xl font-extrabold text-white flex items-center mb-2 tracking-tight"><Settings className="text-blue-400 mr-4 drop-shadow-[0_0_10px_rgba(37,99,235,0.5)] flex-shrink-0" size={32}/> Global Administrator Policies</h2>
                        <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Manage system-level access and encryption keys for the SovereignShield architecture.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                    <div className="bg-[#1e293b]/50 border border-white/5 rounded-2xl p-6 hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-all hover:-translate-y-1 hover:border-blue-500/30">
                        <div className="flex items-center mb-6">
                            <div className="bg-blue-500/10 p-3 rounded-lg mr-4 border border-blue-500/20 shadow-inner">
                                <Shield className="text-blue-400 h-6 w-6"/>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-100 text-lg">Admin Clearance Levels</h3>
                                <p className="text-xs text-slate-400 font-mono tracking-wide mt-1">Configure RBAC across nodes.</p>
                            </div>
                        </div>
                        <div className="bg-[#0f172a] p-5 rounded-xl border border-white/5 space-y-4 shadow-inner">
                             <div className="flex justify-between items-center text-sm">
                                  <span className="font-bold text-slate-300">Level 5 (Cyber Command)</span>
                                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_8px_rgba(52,211,153,0.1)] text-xs px-2.5 py-1 rounded font-bold uppercase tracking-widest">Active</span>
                             </div>
                             <div className="flex justify-between items-center text-sm">
                                  <span className="font-bold text-slate-300">Level 4 (Audit Node)</span>
                                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_8px_rgba(52,211,153,0.1)] text-xs px-2.5 py-1 rounded font-bold uppercase tracking-widest">Active</span>
                             </div>
                             <div className="flex justify-between items-center text-sm">
                                  <span className="font-bold text-slate-300">Level 1-3 Override</span>
                                  <span className="bg-white/5 text-slate-500 border border-white/10 text-xs px-2.5 py-1 rounded font-bold uppercase tracking-widest">Restricted</span>
                             </div>
                        </div>
                    </div>

                    <div className="bg-[#1e293b]/50 border border-white/5 rounded-2xl p-6 hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-all hover:-translate-y-1 hover:border-red-500/30">
                        <div className="flex items-center mb-6">
                            <div className="bg-red-500/10 p-3 rounded-lg mr-4 border border-red-500/20 shadow-inner">
                                <KeyRound className="text-red-500 h-6 w-6"/>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-100 text-lg">Cryptographic Key Rotation</h3>
                                <p className="text-xs text-slate-400 font-mono tracking-wide mt-1">Manage encryption keys for ZKP verification.</p>
                            </div>
                        </div>
                        <div className="space-y-4 mt-6">
                            <button className="w-full bg-[#0f172a] border border-white/5 hover:border-blue-500/50 text-slate-300 hover:text-white rounded-xl py-3 text-sm font-bold shadow-sm transition-all flex justify-center items-center">
                                Rotate JWT Genesis Key
                            </button>
                            <button className="w-full bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500/20 hover:text-red-400 rounded-xl py-3 text-sm font-black tracking-wide shadow-[0_0_10px_rgba(239,68,68,0.1)] transition-all flex justify-center items-center">
                                Reset Master Password Protocol
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-10 pt-8 border-t border-white/5 relative z-10">
                    <h3 className="font-bold text-slate-300 mb-6 flex items-center text-lg"><UserX className="mr-3 text-slate-500" size={24}/> Emergency Actions</h3>
                    <div className="bg-red-500/5 rounded-2xl border border-red-500/20 p-6 md:p-8 flex flex-col md:flex-row items-start justify-between gap-6 relative overflow-hidden">
                         <div className="absolute top-0 right-0 w-32 h-32 bg-red-500 opacity-5 blur-[50px] rounded-full"></div>
                         <div className="relative z-10">
                             <h4 className="font-black text-red-500 text-lg uppercase tracking-widest drop-shadow-[0_0_8px_rgba(239,68,68,0.3)]">Revoke All Active Sessions</h4>
                             <p className="text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">Instantly terminates all active citizen and admin JWT sessions across the global network. Forces immediate re-authentication with multi-factor validation.</p>
                         </div>
                         <button className="bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest py-3 px-8 rounded-xl shadow-[0_0_15px_rgba(220,38,38,0.5)] border border-red-400 text-sm transition-all hover:-translate-y-0.5 active:scale-95 whitespace-nowrap relative z-10">
                             Execute Global Revocation
                         </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminManagement;
