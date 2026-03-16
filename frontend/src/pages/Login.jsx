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
    <div className="min-h-screen bg-[#030712] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[#030712] z-0 pointer-events-none flex items-center justify-center">
          <div className="w-[800px] h-[800px] bg-blue-600/10 blur-[150px] rounded-full"></div>
      </div>
      
      <div className="max-w-md w-full bg-[#0f172a]/80 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden border border-white/10 relative z-10 group hover:shadow-[0_0_40px_rgba(37,99,235,0.15)] transition-all duration-700">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-emerald-400 to-blue-600"></div>
        <div className="bg-[#1e293b]/50 border-b border-white/5 p-8 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px] rounded-full"></div>
            <ShieldCheck className="h-16 w-16 text-emerald-400 mb-3 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)] relative z-10" />
            <h2 className="text-3xl font-black text-white tracking-tight relative z-10">Sovereign<span className="text-emerald-400">Shield</span></h2>
            <p className="text-xs text-slate-400 mt-2 uppercase tracking-[0.2em] text-center font-bold bg-black/20 px-3 py-1 rounded-full border border-white/5 relative z-10">Zero-Trust Identity Portal</p>
        </div>
        
        <form onSubmit={handleLogin} className="p-8 space-y-6">
          {error && <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-4 text-sm font-bold rounded-xl shadow-[0_0_15px_rgba(239,68,68,0.1)] flex items-center"><Lock size={18} className="mr-3"/>{error}</div>}
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 flex items-center uppercase tracking-widest"><User size={14} className="mr-2 text-blue-400"/> Email Address</label>
            <input 
              type="email" required
              className="w-full px-5 py-3.5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all outline-none bg-[#1e293b]/50 text-white font-medium placeholder-slate-600 shadow-inner" 
              placeholder="e.g. citizen@sovereign.gov"
              value={email} onChange={e => setEmail(e.target.value)} 
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 flex items-center uppercase tracking-widest"><KeyRound size={14} className="mr-2 text-blue-400"/> Passphrase</label>
            <input 
              type="password" required
              className="w-full px-5 py-3.5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all outline-none bg-[#1e293b]/50 text-white font-medium placeholder-slate-600 shadow-inner tracking-widest" 
              placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)} 
            />
          </div>

          {/* MFA Simulation */}
          <div className="space-y-2 pt-2 border-t border-white/5 mt-6">
            <label className="text-xs font-bold text-emerald-400 flex items-center uppercase tracking-widest"><ShieldCheck size={14} className="mr-2"/> MFA Authenticator Token</label>
            <input 
              type="text" required
              className="w-full px-5 py-3.5 border border-emerald-500/30 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none bg-emerald-500/5 text-emerald-400 font-mono tracking-[0.5em] text-center text-xl shadow-[0_0_15px_rgba(52,211,153,0.1)] placeholder-emerald-800" 
              placeholder="000000"
              maxLength={6}
              value={otp} onChange={e => setOtp(e.target.value)} 
            />
            <p className="text-xs text-center mt-2 text-slate-500 font-mono">Demo value: <span className="text-slate-400 bg-black/30 px-2 py-0.5 rounded">123456</span></p>
          </div>

          <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-black py-4 px-4 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all flex items-center justify-center space-x-3 hover:-translate-y-0.5 uppercase tracking-widest text-sm border border-blue-400 mt-8">
             <Lock size={18} />
             <span>Secure Login</span>
          </button>
          
          <p className="text-center text-sm text-slate-400 mt-6 font-medium">
             New Citizen? <Link to="/register" className="text-blue-400 font-bold hover:text-blue-300 transition-colors bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20 ml-2">Register Identity</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
