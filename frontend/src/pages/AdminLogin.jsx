import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Shield, Lock, User, Eye, EyeOff, Terminal, Activity } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsAuthenticating(true);
    
    try {
      const { data, error: loginError } = await login(email, password);
      
      const user = data?.user;
      const role = user?.user_metadata?.role || user?.app_metadata?.role || user?.role;

      if (loginError) {
        setError(loginError.message);
      } else if (role !== 'admin') {
        setError('SEC_VIOLATION: Non-administrative account detected. Access Denied.');
      } else {
        navigate('/admin');
      }
    } catch (err) {
      setError('System connection failure. Please try again.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
      <div className="absolute inset-0 bg-blue-600/5 backdrop-blur-[2px]"></div>
      
      <div className="max-w-md w-full relative z-10">
        {/* SOC Logo Section */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex p-4 rounded-3xl bg-blue-600/10 border border-blue-500/20 mb-6 shadow-[0_0_50px_rgba(37,99,235,0.2)]">
            <Shield className="text-blue-500" size={48} />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">SOC CONTROL</h1>
          <p className="text-blue-500 font-mono text-xs uppercase tracking-[0.4em] font-bold">National Cyber Defense Layer</p>
        </div>

        {/* Login Card */}
        <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden scale-in-center">
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <Terminal size={40} className="text-white" />
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold text-white uppercase tracking-tight">System Authentication</h2>
            <p className="text-slate-500 text-xs mt-1 uppercase tracking-widest font-mono">Input secure credentials for gateway entry</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-xs font-bold uppercase animate-shake">
              <Activity size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Operator ID</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="email"
                  required
                  placeholder="admin@gov.shield"
                  className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-slate-700 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Secure Key</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-12 text-white placeholder-slate-700 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-[0_10px_30px_rgba(37,99,235,0.3)] hover:shadow-[0_15px_40px_rgba(37,99,235,0.4)] transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              {isAuthenticating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span>Verifying Gateway...</span>
                </>
              ) : (
                <>
                  <span>Initialize Connection</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link to="/login" className="text-[10px] font-bold text-slate-600 hover:text-blue-500 uppercase tracking-widest transition-colors">
              Access Citizen Portal Gateway
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-[10px] font-mono text-slate-700 uppercase tracking-widest">
            Authorization Logs Monitored by Sovereign Control
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
