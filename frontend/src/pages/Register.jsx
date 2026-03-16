import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, UserPlus, Fingerprint } from 'lucide-react';
import { signUp } from '../services/authService';

const Register = () => {
  const [form, setForm] = useState({ email: '', nid: '', name: '', password: '' });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await signUp(form.email, form.password, { role: 'citizen', nid: form.nid, name: form.name });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-sovNavy flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="p-8 pb-4 text-center border-b border-gray-100">
           <Fingerprint className="h-12 w-12 text-sovBlue mx-auto mb-2" />
           <h2 className="text-2xl font-bold text-sovNavy">Identity Onboarding</h2>
           <p className="text-sm text-gray-500">Decentralized Trust Network</p>
        </div>
        
        <form onSubmit={handleRegister} className="p-8 space-y-5">
          {error && <div className="bg-red-50 text-red-600 p-3 text-sm rounded shadow-inner">{error}</div>}
          {success && <div className="bg-green-50 text-green-700 p-3 text-sm rounded shadow-inner flex items-center"><ShieldCheck size={16} className="mr-2"/> Registration Approved</div>}
          
          <input type="email" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sovBlue outline-none bg-gray-50" placeholder="Email Address" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          <input type="text" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sovBlue outline-none bg-gray-50" placeholder="Full Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          <input type="text" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sovBlue outline-none bg-gray-50" placeholder="National ID (NID)" value={form.nid} onChange={e => setForm({...form, nid: e.target.value})} />
          <input type="password" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sovBlue outline-none bg-gray-50" placeholder="Strong Password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />

          <button type="submit" className="w-full bg-sovBlue hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 shadow-lg transition-transform hover:scale-105">
             <UserPlus size={18} />
             <span>Create Identity</span>
          </button>
          
          <p className="text-center text-sm text-gray-500 mt-4">
             Already registered? <Link to="/login" className="text-sovBlue font-medium hover:underline">Access Portal</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
