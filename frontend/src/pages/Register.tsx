import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, Mail, Phone, Lock, Eye, EyeOff, 
  LocateFixed, ShieldCheck, Zap, Truck, ArrowRight,
  UserCheck, Store, Bike, HelpCircle
} from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'customer',
    address: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
       alert('Please accept the Terms and Privacy Policy');
       return;
    }
    try {
      await register(formData);
      navigate('/');
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Registration failed. Please try again.';
      alert(errorMsg);
    }
  };

  const roles = [
    { id: 'customer', name: 'Customer', desc: 'Access fresh goods locally.', icon: User },
    { id: 'shop_owner', name: 'Shop Owner', desc: 'Digitalize your kirana store.', icon: Store },
    { id: 'delivery_partner', name: 'Delivery Partner', desc: 'Fuel the local logistics.', icon: Bike }
  ];

  return (
    <div className="min-h-screen bg-[#f2f7f2] text-slate-900 font-sans p-6 md:p-12 selection:bg-[#1a5d2e] selection:text-white">
      {/* Header */}
      <nav className="max-w-[1440px] mx-auto flex justify-between items-center mb-16 px-4">
        <Link to="/" className="text-[20px] font-black text-[#1a5d2e] tracking-tight">KiranaQuick</Link>
        <button className="p-2 hover:bg-white rounded-full transition-all text-slate-400 hover:text-[#1a5d2e]">
           <HelpCircle size={22} />
        </button>
      </nav>

      <main className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-8 space-y-12">
             <header className="space-y-4 max-w-2xl px-4">
                <h1 className="text-[72px] font-black text-[#1a5d2e] tracking-tighter leading-[0.9] italic">Join the Grid</h1>
                <p className="text-[14px] text-slate-400 font-bold leading-relaxed max-w-md">
                   Activate your nodes in the most efficient hyperlocal ecosystem. Secure, fast, and community-driven commerce.
                </p>
             </header>

             <form onSubmit={handleSubmit} className="space-y-14">
                {/* Role Selection */}
                <section className="space-y-6">
                   <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[3px] ml-4">Select Identity Node</h3>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      {roles.map(r => (
                        <div 
                          key={r.id}
                          onClick={() => setFormData({...formData, role: r.id})}
                          className={`p-8 rounded-[32px] border-2 cursor-pointer transition-all duration-500 relative group h-[160px] flex flex-col justify-between ${
                            formData.role === r.id ? 'bg-white border-[#1a5d2e] shadow-[0_20px_40px_rgba(26,93,46,0.1)]' : 'bg-transparent border-slate-200 hover:border-slate-300'
                          }`}
                        >
                           {formData.role === r.id && (
                             <div className="absolute top-4 right-4 w-6 h-6 bg-[#1a5d2e] rounded-full flex items-center justify-center">
                                <UserCheck size={14} className="text-white" />
                             </div>
                           )}
                           <r.icon size={28} className={formData.role === r.id ? 'text-[#1a5d2e]' : 'text-slate-400 group-hover:text-slate-600'} />
                           <div className="space-y-1">
                              <h4 className="font-black text-slate-900 text-[14px]">{r.name}</h4>
                              <p className="text-[10px] text-slate-400 font-bold italic">{r.desc}</p>
                           </div>
                        </div>
                      ))}
                   </div>
                </section>

                {/* Personal Info */}
                <section className="space-y-6">
                   <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[3px] ml-4">Personal Information</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { id: 'name', label: 'Full Legal Name', icon: User, type: 'text' },
                        { id: 'email', label: 'Email Address', icon: Mail, type: 'email' },
                        { id: 'phone', label: 'Phone Number', icon: Phone, type: 'text' },
                        { id: 'password', label: 'Passkey', icon: Lock, type: showPassword ? 'text' : 'password', isPassword: true }
                      ].map(field => (
                        <div key={field.id} className="relative group">
                           <field.icon className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#1a5d2e] transition-colors" size={18} />
                           {field.isPassword && (
                             <button 
                               type="button" 
                               onClick={() => setShowPassword(!showPassword)}
                               className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-[#1a5d2e]"
                             >
                               {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                             </button>
                           )}
                           <input 
                              type={field.type}
                              placeholder={field.label}
                              className={`w-full bg-[#e9eee9]/50 border-none rounded-[28px] py-6 pl-14 pr-12 outline-none focus:bg-white focus:ring-4 focus:ring-[#1a5d2e]/5 transition-all font-bold text-sm tracking-tight placeholder:text-slate-400 ${field.isPassword ? 'pr-24' : ''}`}
                              value={(formData as any)[field.id]}
                              onChange={(e) => setFormData({...formData, [field.id]: e.target.value})}
                              required
                           />
                           {field.isPassword && formData.password && (
                             <div className="absolute bottom-4 left-14 right-12 h-1 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-[70%]" />
                             </div>
                           )}
                        </div>
                      ))}
                   </div>
                </section>

                {/* Address Terminal */}
                <section className="space-y-6">
                   <div className="flex justify-between items-center px-4">
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[3px]">Address Terminal</h3>
                      <button type="button" className="flex items-center gap-2 px-6 py-2.5 bg-[#d7ecd7] text-[#1a5d2e] text-[10px] font-black rounded-full border border-white hover:bg-[#c6dfc6] transition-all uppercase tracking-widest italic">
                         <LocateFixed size={14} /> Locate Me
                      </button>
                   </div>
                   <div className="relative group overflow-hidden rounded-[48px] border border-white/50 bg-[#e9eee9]/50">
                      <textarea 
                        className="w-full bg-transparent border-none p-10 py-12 outline-none font-bold text-sm tracking-tight placeholder:text-slate-400 h-48 resize-none relative z-10"
                        placeholder="Define your node location (Address, Landmark, Street)..."
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                      />
                      <div className="absolute bottom-0 left-0 right-0 h-28 opacity-40 z-0">
                         <img src="https://images.unsplash.com/photo-1524660988544-1429dd47405b?w=600" className="w-full h-full object-cover grayscale invert contrast-125" alt="Map UI" />
                      </div>
                   </div>
                </section>

                <div className="space-y-8 px-4">
                   <label className="flex items-center gap-4 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 rounded-lg border-slate-200 text-[#1a5d2e] focus:ring-[#1a5d2e]"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                      />
                      <span className="text-[11px] text-slate-400 font-bold">
                        I accept the <Link to="/terms" className="text-slate-900 hover:underline transition-all">Terms of Service</Link> and <Link to="/privacy" className="text-slate-900 hover:underline transition-all">Privacy Policy</Link>.
                      </span>
                   </label>

                   <div className="flex flex-col gap-8">
                      <button 
                        type="submit" 
                        className="w-fit px-12 py-6 bg-[#1a5d2e] text-white rounded-[32px] font-black text-[13px] uppercase tracking-[4px] shadow-2xl shadow-[#1a5d2e]/20 flex items-center gap-6 hover:bg-[#123e1e] active:scale-95 transition-all group"
                      >
                         Register Identity
                         <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </button>

                      <p className="text-slate-400 text-[11px] font-bold italic">
                        Already an operator? <Link to="/login" className="text-slate-900 hover:underline transition-colors ml-1 font-black underline-offset-4">Connect Node</Link>
                      </p>
                   </div>
                </div>
             </form>
          </div>

          {/* Right Column: Info Cards & Image */}
          <aside className="lg:col-span-4 space-y-8 h-full flex flex-col justify-start">
             <div className="bg-[#1a5d2e] p-10 rounded-[48px] text-white space-y-6 shadow-2xl shadow-[#1a5d2e]/10 group hover:scale-[1.02] transition-transform">
                <h3 className="text-[28px] font-black italic tracking-tighter leading-none">Elite Secure Encryption.</h3>
                <p className="text-[11px] font-bold text-emerald-100 opacity-60 leading-relaxed uppercase tracking-widest">
                   Your data is stored in the vault using enterprise-grade botanical encryption nodes.
                </p>
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
                   <ShieldCheck size={24} />
                </div>
             </div>

             <div className="bg-white p-10 rounded-[48px] border border-white/50 space-y-8 shadow-sm">
                <div className="flex items-start gap-5 group">
                   <div className="w-10 h-10 bg-emerald-50 text-[#1a5d2e] rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                      <Zap size={18} />
                   </div>
                   <div className="space-y-1">
                      <h4 className="text-[13px] font-black italic">Instant Setup</h4>
                      <p className="text-[10px] text-slate-400 font-bold">Live in under 3 minutes.</p>
                   </div>
                </div>
                <div className="flex items-start gap-5 group">
                   <div className="w-10 h-10 bg-emerald-50 text-[#1a5d2e] rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                      <Truck size={18} />
                   </div>
                   <div className="space-y-1">
                      <h4 className="text-[13px] font-black italic">Local Velocity</h4>
                      <p className="text-[10px] text-slate-400 font-bold">Optimized delivery routes.</p>
                   </div>
                </div>
             </div>

             <div className="flex-1 rounded-[56px] overflow-hidden min-h-[300px] border-[12px] border-white shadow-2xl relative group">
                <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3s]" alt="KiranaQuick Vibe" />
                <div className="absolute inset-0 bg-emerald-950/20 mix-blend-overlay"></div>
             </div>
          </aside>
        </div>
      </main>

      {/* Global Footer */}
      <footer className="max-w-[1440px] mx-auto px-4 mt-32 flex justify-between items-end border-t border-[#e9eee9] pt-12">
        <div className="space-y-1">
           <h4 className="text-[12px] font-black text-slate-300 italic opacity-60">KiranaQuick v4.0</h4>
           <div className="w-24 h-1 bg-[#1a5d2e]/10 rounded-full"></div>
        </div>
        <div className="flex gap-8 text-[10px] font-black text-slate-400 uppercase tracking-[3px] italic">
           <Link to="/support" className="hover:text-slate-900 transition-colors">Support</Link>
           <Link to="/security" className="hover:text-slate-900 transition-colors">Security</Link>
           <Link to="/nodes" className="hover:text-slate-900 transition-colors">Nodes</Link>
        </div>
      </footer>
    </div>
  );
}
