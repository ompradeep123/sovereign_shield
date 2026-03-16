import React from 'react';
import { Settings, Shield, UserX, UserCheck, KeyRound } from 'lucide-react';

const AdminManagement = () => {
    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-sovNavy flex items-center"><Settings className="text-sovBlue mr-3" size={28}/> Global Administrator Policies</h2>
                        <p className="text-sm text-gray-500 mt-1">Manage system-level access and encryption keys for the SovereignShield architecture.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center mb-4">
                            <div className="bg-blue-50 p-3 rounded-lg mr-4">
                                <Shield className="text-sovBlue h-6 w-6"/>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">Admin Clearance Levels</h3>
                                <p className="text-xs text-gray-500">Configure Role-Based Access Controls (RBAC) across nodes.</p>
                            </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
                             <div className="flex justify-between items-center text-sm">
                                  <span className="font-semibold text-gray-700">Level 5 (Cyber Command)</span>
                                  <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded font-bold uppercase">Active</span>
                             </div>
                             <div className="flex justify-between items-center text-sm">
                                  <span className="font-semibold text-gray-700">Level 4 (Audit Node)</span>
                                  <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded font-bold uppercase">Active</span>
                             </div>
                             <div className="flex justify-between items-center text-sm">
                                  <span className="font-semibold text-gray-700">Level 1-3 Override</span>
                                  <span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded font-bold uppercase">Restricted</span>
                             </div>
                        </div>
                    </div>

                    <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center mb-4">
                            <div className="bg-red-50 p-3 rounded-lg mr-4">
                                <KeyRound className="text-red-500 h-6 w-6"/>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">Cryptographic Key Rotation</h3>
                                <p className="text-xs text-gray-500">Manage encryption keys for the Zero Knowledge Proof verification engine.</p>
                            </div>
                        </div>
                        <div className="space-y-3 mt-6">
                            <button className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg py-2.5 text-sm font-semibold shadow-sm transition-colors flex justify-center items-center">
                                Rotate JWT Genesis Key
                            </button>
                            <button className="w-full bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 rounded-lg py-2.5 text-sm font-semibold shadow-sm transition-colors flex justify-center items-center">
                                Reset Master Password Protocol
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center"><UserX className="mr-2 text-gray-500" size={20}/> Emergency Actions</h3>
                    <div className="bg-red-50 rounded-lg border border-red-200 p-6 flex items-start justify-between">
                         <div>
                             <h4 className="font-bold text-red-900 text-sm">Revoke All Active Sessions</h4>
                             <p className="text-xs text-red-700 mt-1 max-w-xl">Instantly terminates all active citizen and admin JWT sessions across the global network. Forces immediate re-authentication with multi-factor validation.</p>
                         </div>
                         <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded shadow-lg text-sm transition-transform active:scale-95">
                             Execute Global Revocation
                         </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminManagement;
