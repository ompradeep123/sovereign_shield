import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, User, KeyRound } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState(null);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (otp !== '123456') throw new Error('Invalid MFA Token (Demo: use 123456)');
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-sovNavy flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 p-6 flex flex-col items-center justify-center">
            <ShieldCheck className="h-16 w-16 text-sovAccent mb-2" />
            <h2 className="text-3xl font-bold text-sovNavy tracking-tight">Sovereign<span className="text-sovAccent">Shield</span></h2>
            <p className="text-sm text-gray-500 mt-1 uppercase tracking-widest text-center">Zero-Trust Identity Portal</p>
        </div>
        
        <form onSubmit={handleLogin} className="p-8 space-y-6">
          {error && <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 text-sm rounded shadow-sm flex items-center"><Lock size={16} className="mr-2"/>{error}</div>}
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 flex items-center"><User size={16} className="mr-2 text-sovBlue"/> Email Address</label>
            <input 
              type="email" required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sovBlue focus:border-transparent transition-all outline-none bg-gray-50 text-sovNavy font-medium" 
              placeholder="e.g. citizen@sovereign.gov"
              value={email} onChange={e => setEmail(e.target.value)} 
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 flex items-center"><KeyRound size={16} className="mr-2 text-sovBlue"/> Passphrase</label>
            <input 
              type="password" required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sovBlue focus:border-transparent transition-all outline-none bg-gray-50 text-sovNavy font-medium" 
              placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)} 
            />
          </div>

          {/* MFA Simulation */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 flex items-center"><ShieldCheck size={16} className="mr-2 text-sovAccent"/> MFA Authenticator Token</label>
            <input 
              type="text" required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sovAccent focus:border-transparent transition-all outline-none bg-blue-50 text-sovNavy font-mono tracking-widest text-center text-lg" 
              placeholder="000000"
              maxLength={6}
              value={otp} onChange={e => setOtp(e.target.value)} 
            />
            <p className="text-xs text-center mt-1 text-gray-400">Demo value: 123456</p>
          </div>

          <button type="submit" className="w-full bg-sovBlue hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:shadow-cyan-500/30 transition-all flex items-center justify-center space-x-2">
             <Lock size={18} />
             <span>Secure Login</span>
          </button>
          
          <p className="text-center text-sm text-gray-500 mt-4">
             New Citizen? <Link to="/register" className="text-sovBlue font-medium hover:underline">Register Identity</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
