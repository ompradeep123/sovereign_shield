import React, { useContext, useEffect, useState } from 'react';
import { AuthContext, api } from '../context/AuthContext';
import { ShieldCheck, Activity, Bell, FileText, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CitizenDashboard = () => {
  const { user } = useContext(AuthContext);
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get('/services/my-services');
        setServices(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-sovNavy to-blue-900 text-white">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">Welcome back, {user?.name}</h1>
          <p className="text-blue-100 font-medium flex items-center flex-wrap gap-1">Digital Identity Status: <span className="text-green-300 font-semibold flex items-center"><ShieldCheck size={16} className="mr-1"/> Verified Citizen</span></p>
        </div>
        <div className="hidden md:flex flex-col items-end">
          <div className="text-sm text-blue-200">System Integrity</div>
          <div className="text-xl font-mono text-green-400 font-bold bg-black bg-opacity-30 px-3 py-1 rounded badge-secure mt-1">100% SECURE</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Security Status Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <ShieldCheck className="h-6 w-6 text-sovAccent" />
              <h3 className="font-semibold text-gray-800">Zero-Trust Shield</h3>
            </div>
            <p className="text-sm text-gray-600">Your connection is fully encrypted. All attributes are protected by ZKP algorithms.</p>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-sm">
            <span className="text-gray-500">Last scanned: Just now</span>
            <span className="text-green-600 font-medium flex items-center bg-green-50 px-2 py-1 rounded">Protected</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center"><Activity className="mr-2 h-5 w-5 text-sovBlue"/> Quick Actions</h3>
            <div className="space-y-3">
               <Link to="/wallet" className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors group">
                  <span className="text-sm font-medium text-gray-700">Digital Identity Wallet</span>
                  <ChevronRight size={16} className="text-gray-400 group-hover:text-sovBlue transition-colors" />
               </Link>
               <Link to="/services" className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors group">
                  <span className="text-sm font-medium text-gray-700">Request Service</span>
                  <ChevronRight size={16} className="text-gray-400 group-hover:text-sovBlue transition-colors" />
               </Link>
            </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center"><Bell className="mr-2 h-5 w-5 text-gray-600"/> Recent Activity</h3>
            {services.length === 0 ? (
                <div className="text-sm text-gray-500 italic text-center py-4">No recent activity</div>
            ) : (
                <div className="space-y-3">
                  {services.slice(0, 3).map(s => (
                     <div key={s.id} className="flex items-start space-x-3 text-sm border-b border-gray-50 pb-2">
                        <FileText className="text-sovBlue mt-0.5" size={16} />
                        <div>
                          <p className="font-medium text-gray-700">{s.type}</p>
                          <p className="text-xs text-gray-400">{new Date(s.timestamp).toLocaleDateString()}</p>
                        </div>
                     </div>
                  ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default CitizenDashboard;
