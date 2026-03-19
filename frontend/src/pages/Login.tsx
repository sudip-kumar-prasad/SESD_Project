import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, Mail, Lock, 
  HelpCircle, Globe, Zap, Store
} from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      navigate('/');
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      alert(errorMsg);
    }
  };

  return (
    <div className="min-h-screen bg-[#f2f7f2] text-slate-900 font-sans relative overflow-hidden flex flex-col selection:bg-[#1a5d2e] selection:text-white">
      {/* Soft Radial Glows */}
      <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#1a5d2e]/5 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#ff6b00]/5 rounded-full blur-[100px]"></div>

      {/* Header */}
      <nav className="px-16 py-8 flex items-center justify-between z-10">
        <Link to="/" className="text-[20px] font-black text-[#1a5d2e] tracking-tight">KiranaQuick</Link>
        <div className="flex items-center gap-10 text-[12px] font-bold text-slate-400">
           <Link to="/explore" className="hover:text-slate-900 transition-colors">Explore</Link>
           <Link to="/support" className="hover:text-slate-900 transition-colors">Support</Link>
           <div className="flex items-center gap-5 ml-4">
              <HelpCircle size={20} className="cursor-pointer hover:text-[#1a5d2e] transition-colors" />
              <Globe size={20} className="cursor-pointer hover:text-[#1a5d2e] transition-colors" />
           </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center -mt-16 z-10 px-6">
         {/* Central Branding */}
         <div className="flex flex-col items-center mb-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="w-20 h-20 bg-[#1a5d2e] rounded-[32px] flex items-center justify-center shadow-2xl shadow-[#1a5d2e]/20 mb-8 group hover:scale-110 transition-transform duration-500 cursor-pointer">
               <Store className="text-white group-hover:rotate-6 transition-transform" size={40} />
            </div>
            <h1 className="text-[48px] font-black text-slate-950 italic tracking-tighter leading-none">KiranaQuick</h1>
            <p className="text-[12px] font-black text-slate-400 uppercase tracking-[4px] mt-3 italic mb-4">Hyper-local commerce reimagined.</p>
         </div>

         {/* Login Card */}
         <div className="w-full max-w-[500px] bg-white p-12 rounded-[56px] shadow-[0_32px_80px_rgba(26,93,46,0.06)] border border-white/50 relative animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200">
            {/* Verified Badge */}
            <div className="absolute -top-4 right-12 bg-[#f2f7f2] text-[#1a5d2e] px-6 py-2.5 rounded-full border border-white flex items-center gap-2 text-[9px] font-black uppercase tracking-widest shadow-sm">
               <ShieldCheck size={14} /> Verified Secure
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
               <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-900 uppercase tracking-widest ml-6">Operator Email</label>
                  <div className="relative group">
                     <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#1a5d2e] transition-colors" size={20} />
                     <input 
                        type="email" 
                        placeholder="operator@kiranquick.id"
                        className="w-full bg-[#f2f7f2] border-none rounded-[28px] py-6 pl-16 pr-8 outline-none focus:bg-white focus:ring-4 focus:ring-[#1a5d2e]/5 transition-all text-sm font-bold tracking-tight placeholder:text-slate-300"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                     />
                  </div>
               </div>

               <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-900 uppercase tracking-widest ml-6">Secure Passkey</label>
                  <div className="relative group">
                     <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#1a5d2e] transition-colors" size={20} />
                     <input 
                        type="password" 
                        placeholder="••••••••••••"
                        className="w-full bg-[#f2f7f2] border-none rounded-[28px] py-6 pl-16 pr-8 outline-none focus:bg-white focus:ring-4 focus:ring-[#1a5d2e]/5 transition-all text-sm font-bold tracking-tight placeholder:text-slate-300"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                     />
                  </div>
               </div>

               <div className="flex justify-end pr-4">
                  <button type="button" className="text-[11px] font-black text-[#1a5d2e] uppercase tracking-widest hover:underline decoration-2">Reset Access Key?</button>
               </div>

               <button 
                  type="submit" 
                  className="w-full py-7 bg-[#1a5d2e] text-white rounded-[32px] font-black text-[13px] uppercase tracking-[4px] shadow-2xl shadow-[#1a5d2e]/20 flex items-center justify-center gap-4 hover:bg-[#123e1e] active:scale-[0.98] transition-all group"
               >
                  Initialize Session
                  <Zap size={20} className="group-hover:scale-125 transition-transform" />
               </button>

               {/* Divider */}
               <div className="relative flex items-center justify-center py-4">
                  <div className="absolute inset-0 flex items-center">
                     <div className="w-full border-t border-slate-50"></div>
                  </div>
                  <span className="relative px-8 bg-white text-[9px] font-black text-slate-300 uppercase tracking-[4px]">Connect Via Node</span>
               </div>

               {/* Social Login */}
               <div className="grid grid-cols-2 gap-4">
                  <button type="button" className="flex items-center justify-center gap-3 py-5 bg-[#f2f7f2] rounded-[28px] text-[11px] font-black uppercase tracking-widest hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-slate-50">
                     <img src="https://www.google.com/favicon.ico" className="w-5 h-5 grayscale group-hover:grayscale-0" />
                     Google
                  </button>
                  <button type="button" className="flex items-center justify-center gap-3 py-5 bg-[#f2f7f2] rounded-[28px] text-[11px] font-black uppercase tracking-widest hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-slate-50">
                     <img src="https://www.apple.com/favicon.ico" className="w-5 h-5 grayscale" />
                     Apple ID
                  </button>
               </div>
            </form>
         </div>

         {/* Link to Signup */}
         <Link to="/register" className="mt-12 text-[12px] font-black text-[#1a5d2e] uppercase tracking-[3px] hover:underline decoration-2 italic animate-in fade-in slide-in-from-top-4 duration-1000 delay-500">
            New to the platform? Register Node
         </Link>
      </main>

      {/* Global Footer */}
      <footer className="px-16 py-12 flex items-end justify-between z-10 border-t border-[#e9eee9]">
        <div className="space-y-1">
           <h4 className="text-[13px] font-black text-slate-950 italic tracking-tight">KiranaQuick</h4>
           <p className="text-[10px] text-slate-400 font-bold opacity-60">© 2024 KiranaQuick. The Botanical Vault Security.</p>
        </div>
        <div className="flex gap-10 text-[10px] font-black text-[#1a5d2e] uppercase tracking-[3px] italic">
           <Link to="/privacy" className="hover:text-slate-900">Privacy Policy</Link>
           <Link to="/terms" className="hover:text-slate-900">Terms of Service</Link>
           <Link to="/security" className="hover:text-slate-900">Security Standards</Link>
           <Link to="/support" className="hover:text-slate-900">Support</Link>
        </div>
      </footer>
    </div>
  );
}
