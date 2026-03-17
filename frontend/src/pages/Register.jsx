import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, UserPlus, Fingerprint } from 'lucide-react';
import { signUp } from '../services/authService';
import LanguageSelector from '../components/LanguageSelector';

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
    <div className="min-h-screen bg-[#030712] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[#030712] z-0 pointer-events-none flex items-center justify-center">
          <div className="w-[300px] h-[300px] sm:w-[800px] sm:h-[800px] bg-blue-600/10 blur-[100px] sm:blur-[150px] rounded-full"></div>
      </div>
      
      <div className="absolute top-0 right-0 p-4 z-20">
        <LanguageSelector />
      </div>

      <div className="max-w-md w-full bg-[#0f172a]/80 backdrop-blur-2xl rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-white/10 relative z-10 group hover:shadow-[0_0_40px_rgba(37,99,235,0.15)] transition-all duration-700 animate-scale-in">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-emerald-400 to-blue-600"></div>
        <div className="bg-[#1e293b]/50 border-b border-white/5 p-6 sm:p-8 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px] rounded-full"></div>
           <Fingerprint className="h-12 w-12 sm:h-16 sm:w-16 text-emerald-400 mb-3 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)] relative z-10" />
           <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight relative z-10 text-center">Identity <span className="text-emerald-400">Onboarding</span></h2>
           <p className="text-[9px] sm:text-xs text-slate-400 mt-2 uppercase tracking-[0.2em] text-center font-bold bg-black/20 px-3 py-1 rounded-full border border-white/5 relative z-10">Decentralized Trust Network</p>
        </div>
        
        <form onSubmit={handleRegister} className="p-6 sm:p-8 space-y-4 sm:space-y-5">
          {error && <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-3 sm:p-4 text-xs sm:text-sm font-bold rounded-xl shadow-[0_0_15px_rgba(239,68,68,0.1)] flex items-center justify-center">{error}</div>}
          {success && <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 sm:p-4 text-xs sm:text-sm font-bold rounded-xl shadow-[0_0_15px_rgba(52,211,153,0.1)] flex items-center justify-center"><ShieldCheck size={18} className="mr-3"/> Registration Approved</div>}
          
          <div className="space-y-3 sm:space-y-4">
              <input type="email" required className="w-full px-4 sm:px-5 py-3 sm:py-3.5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all outline-none bg-[#1e293b]/50 text-white font-medium placeholder-slate-600 shadow-inner text-sm sm:text-base" placeholder="Email Address" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
              <input type="text" required className="w-full px-4 sm:px-5 py-3 sm:py-3.5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all outline-none bg-[#1e293b]/50 text-white font-medium placeholder-slate-600 shadow-inner text-sm sm:text-base" placeholder="Full Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              <input type="text" required className="w-full px-4 sm:px-5 py-3 sm:py-3.5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all outline-none bg-[#1e293b]/50 text-white font-medium placeholder-slate-600 shadow-inner text-sm sm:text-base" placeholder="National ID (NID)" value={form.nid} onChange={e => setForm({...form, nid: e.target.value})} />
              <input type="password" required className="w-full px-4 sm:px-5 py-3 sm:py-3.5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all outline-none bg-[#1e293b]/50 text-white font-medium placeholder-slate-600 shadow-inner tracking-widest text-sm sm:text-base" placeholder="Password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
          </div>

          <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-black py-3.5 sm:py-4 px-4 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all flex items-center justify-center space-x-3 hover:-translate-y-0.5 uppercase tracking-widest text-xs sm:text-sm border border-blue-400 mt-6 sm:mt-8 active:scale-95">
             <UserPlus size={18} />
             <span>Create Identity</span>
          </button>
          
          <p className="text-center text-xs sm:text-sm text-slate-400 mt-6 sm:mt-8 font-medium">
             Already registered? <Link to="/login" className="text-blue-400 font-bold hover:text-blue-300 transition-colors bg-blue-500/10 px-2 sm:px-3 py-1.5 rounded-lg border border-blue-500/20 ml-2 whitespace-nowrap">Access Portal</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
