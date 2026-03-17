import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from '../components/LanguageSelector';
import { Shield, Lock, User, Eye, EyeOff, Terminal, Activity } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const { login } = useContext(AuthContext);
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsAuthenticating(true);
    
    try {
      const response = await login(email, password);
      // login returns { user, session } from authService.js
      
      const user = response?.user;
      const role = user?.user_metadata?.role || user?.app_metadata?.role || user?.role;

      if (role !== 'admin') {
        setError('SEC_VIOLATION: Non-administrative account detected. Access Denied.');
      } else {
        navigate('/admin');
      }
    } catch (err) {
      setError(err.message || 'System connection failure. Please try again.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center p-4 sm:p-6 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] relative overflow-hidden">
      <div className="absolute inset-0 bg-blue-600/5 backdrop-blur-[2px]"></div>
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 sm:w-64 h-32 sm:h-64 bg-blue-600/10 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-32 sm:w-64 h-32 sm:h-64 bg-emerald-600/10 blur-[100px] rounded-full"></div>
      </div>
      
      <div className="absolute top-0 right-0 p-4 z-20">
        <LanguageSelector />
      </div>

      <div className="max-w-md w-full relative z-10 animate-fade-in">
        {/* SOC Logo Section */}
        <div className="text-center mb-6 sm:mb-10">
          <div className="inline-flex p-3 sm:p-4 rounded-3xl bg-blue-600/10 border border-blue-500/20 mb-4 sm:mb-6 shadow-[0_0_50px_rgba(37,99,235,0.2)]">
            <Shield className="text-blue-500" size={32} sm:size={48} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tighter uppercase mb-1 sm:mb-2">{t('soc_command')}</h1>
          <p className="text-blue-500 font-mono text-[9px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] font-bold">National Cyber Defense Layer</p>
        </div>

        {/* Login Card */}
        <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-white/5 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 shadow-2xl relative overflow-hidden animate-scale-in">
          <div className="absolute top-0 right-0 p-4 opacity-10 hidden xs:block">
            <Terminal size={32} sm:size={40} className="text-white" />
          </div>

          <div className="mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-tight">System Authentication</h2>
            <p className="text-slate-500 text-[10px] sm:text-xs mt-1 uppercase tracking-widest font-mono line-clamp-1">Input secure credentials for gateway entry</p>
          </div>

          {error && (
            <div className="mb-6 p-3 sm:p-4 bg-red-500/10 border border-red-500/20 rounded-xl sm:rounded-2xl flex items-center gap-2 sm:gap-3 text-red-500 text-[10px] sm:text-xs font-bold uppercase animate-shake overflow-hidden">
              <Activity size={14} sm:size={16} className="shrink-0" />
              <span className="break-words min-w-0">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">{t('operator_id')}</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} sm:size={18} />
                <input
                  type="email"
                  required
                  placeholder="admin@gov.shield"
                  className="w-full bg-black/40 border border-white/10 sm:border-white/5 rounded-xl sm:rounded-2xl py-3.5 sm:py-4 pl-11 sm:pl-12 pr-4 text-white placeholder-slate-700 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">{t('secure_key')}</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} sm:size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  className="w-full bg-black/40 border border-white/10 sm:border-white/5 rounded-xl sm:rounded-2xl py-3.5 sm:py-4 pl-11 sm:pl-12 pr-11 sm:pr-12 text-white placeholder-slate-700 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-sm tracking-widest sm:tracking-normal"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={16} sm:size={18} /> : <Eye size={16} sm:size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] sm:text-xs shadow-[0_10px_30px_rgba(37,99,235,0.3)] hover:shadow-[0_15px_40px_rgba(37,99,235,0.4)] transition-all flex items-center justify-center gap-2 sm:gap-3 active:scale-[0.98] mt-4 sm:mt-8"
            >
              {isAuthenticating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span>Verifying Gateway...</span>
                </>
              ) : (
                <>
                  <span>{t('initialize_connection')}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 sm:mt-8 text-center">
            <Link to="/login" className="text-[9px] sm:text-[10px] font-bold text-slate-600 hover:text-blue-500 uppercase tracking-widest transition-colors py-2 px-4 block">
              Access Citizen Portal Gateway
            </Link>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 text-center px-4">
          <p className="text-[9px] sm:text-[10px] font-mono text-slate-700 uppercase tracking-widest leading-relaxed">
            Authorization Logs Monitored by Sovereign Control
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
