import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  LogOut, Settings, LayoutDashboard, ShoppingBag, 
  Wallet, Package, ChevronRight, Edit2, Shield,
  Mail, Phone, Building, Loader2, Camera
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function ShopProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Profile');
  const [shop, setShop] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const res = await api.get('/shops/my');
        setShop(res.data);
      } catch (err) {
        console.error('Failed to fetch shop:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchShop();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#f2f7f2]"><Loader2 className="animate-spin text-[#1a5d2e]" size={48} /></div>;

  return (
    <div className="min-h-screen bg-[#f2f7f2] flex font-sans">
      {/* Sidebar - Consistent with Biz pages */}
      <aside className="w-[320px] bg-white border-r border-[#e3eae3] p-10 flex flex-col sticky top-0 h-screen">
         <div className="flex items-center gap-3 mb-16">
            <h1 className="text-[20px] font-black text-[#1a5d2e] tracking-tighter italic">KiranaQuick <span className="text-slate-900 not-italic">Biz</span></h1>
         </div>
         
         <div 
            onClick={() => setActiveTab('Profile')}
            className={`flex items-center gap-5 mb-14 p-5 rounded-[32px] border group hover:shadow-xl transition-all duration-500 cursor-pointer ${
               activeTab === 'Profile' ? 'bg-[#e3f2e3] border-[#d7ecd7]' : 'bg-[#f8faf8] border-[#f0f4f0] hover:bg-white'
            }`}
         >
            <div className="relative">
               <img src="https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=100" className="w-12 h-12 rounded-[18px] object-cover border-2 border-white shadow-md group-hover:rotate-6 transition-transform" alt="Manager" />
               <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="overflow-hidden">
               <h4 className="font-black text-slate-950 text-[13px] tracking-tight truncate leading-tight">{user?.name || 'Store Manager'}</h4>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 opacity-60">{shop?.name || 'KIRANAQUICK BIZ'}</p>
            </div>
         </div>

         <nav className="flex-1 space-y-3">
           {[
             { id: 'Dashboard', icon: LayoutDashboard, path: '/' },
             { id: 'Inventory', icon: ShoppingBag, path: '/inventory' }
           ].map(item => (
             <button 
               key={item.id} 
               onClick={() => navigate(item.path)}
               className={`w-full flex items-center justify-between p-4.5 px-6 rounded-[22px] transition-all group text-slate-500 hover:bg-[#f8faf8]`}
             >
               <div className="flex items-center gap-5">
                  <item.icon size={20} className="text-slate-400 group-hover:text-slate-900" />
                  <span className="text-[13px] font-black italic tracking-tight group-hover:text-slate-900">{item.id}</span>
               </div>
             </button>
           ))}
         </nav>

         <div className="mt-auto space-y-4">
            <button 
               onClick={logout}
               className="w-full flex items-center justify-center gap-4 py-6 bg-red-50 text-red-500 rounded-[28px] font-black text-[12px] uppercase tracking-[3px] shadow-sm hover:bg-red-100 active:scale-95 transition-all group overflow-hidden relative"
            >
               <LogOut size={18} /> Logout Session
            </button>
         </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-14 overflow-y-auto max-h-screen">
         <header className="flex flex-col xl:flex-row xl:items-start justify-between gap-10 mb-16">
            <div>
               <div className="text-[10px] font-black text-[#1a5d2e] uppercase tracking-[4px] italic mb-3 leading-none">BUSINESS ACCOUNT</div>
               <h2 className="text-[56px] font-black text-slate-950 italic tracking-tighter leading-none">Manager Profile</h2>
            </div>
         </header>

         <div className="max-w-4xl space-y-12">
            
            {/* Header Profile Card */}
            <section className="bg-white p-12 rounded-[56px] shadow-sm border border-[#f0f4f0] flex items-center justify-between group overflow-hidden relative">
               <div className="absolute top-0 right-0 w-80 h-80 bg-[#1a5d2e]/5 -mr-20 -mt-20 rounded-full blur-3xl"></div>
               
               <div className="flex items-center gap-10 relative z-10">
                  <div className="relative group/avatar">
                     <div className="w-32 h-32 rounded-[40px] border-[6px] border-[#f2f7f2] shadow-2xl overflow-hidden group-hover/avatar:scale-105 transition-transform bg-white">
                        <img src="https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=300" className="w-full h-full object-cover" alt="Profile" />
                     </div>
                     <button className="absolute -bottom-2 -right-2 p-3 bg-[#1a5d2e] text-white rounded-full border-4 border-white shadow-xl hover:scale-110 active:scale-95 transition-all">
                        <Camera size={20} />
                     </button>
                  </div>
                  <div className="space-y-3">
                     <h2 className="text-[44px] font-black text-slate-950 italic tracking-tighter leading-none">{user?.name}</h2>
                     <p className="text-slate-400 font-bold italic tracking-wide">{user?.email}</p>
                     <div className="flex gap-4 pt-2">
                        <span className="bg-[#e3f2e3] text-[#1a5d2e] text-[10px] font-black px-4 py-1.5 rounded-full border border-white uppercase tracking-widest italic shadow-sm">Verified Partner</span>
                        <span className="bg-slate-50 text-slate-400 text-[10px] font-black px-4 py-1.5 rounded-full border border-slate-100 uppercase tracking-widest italic shadow-sm">{user?.role}</span>
                     </div>
                  </div>
               </div>
            </section>

            {/* Biz Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               <section className="space-y-8">
                  <h3 className="text-[20px] font-black text-slate-950 italic tracking-tight px-2">Account Details</h3>
                  <div className="space-y-4">
                     {[
                       { label: 'Full Name', val: user?.name, icon: Shield },
                       { label: 'Registered Email', val: user?.email, icon: Mail },
                       { label: 'Contact Phone', val: user?.phone || '+91 - Not Set', icon: Phone },
                     ].map((item, i) => (
                       <div key={i} className="bg-white p-6 px-8 rounded-[32px] border border-white shadow-sm flex items-center gap-6 group hover:-translate-y-1 transition-transform cursor-default">
                          <div className="p-3 bg-[#f2f7f2] rounded-2xl text-[#1a5d2e]">
                             <item.icon size={20} />
                          </div>
                          <div>
                             <p className="text-[9px] font-black text-slate-300 uppercase tracking-[2px] mb-1">{item.label}</p>
                             <p className="font-bold text-slate-950 italic truncate max-w-[200px]">{item.val}</p>
                          </div>
                       </div>
                     ))}
                  </div>
               </section>

               <section className="space-y-8">
                  <h3 className="text-[20px] font-black text-slate-950 italic tracking-tight px-2">Store Information</h3>
                  <div className="bg-white p-10 px-12 rounded-[48px] border border-white shadow-sm space-y-8 h-full flex flex-col justify-center relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 -mr-10 -mt-10 rounded-full blur-2xl"></div>
                     <div className="relative z-10 flex items-start gap-6">
                        <div className="w-16 h-16 rounded-[24px] bg-orange-50 text-orange-500 flex items-center justify-center shadow-inner mt-1">
                           <Building size={28} />
                        </div>
                        <div className="space-y-3">
                           <div>
                              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[3px] mb-1">Store Name</p>
                              <p className="text-xl font-black text-slate-950 italic leading-tight">{shop?.name || 'Not Configured'}</p>
                           </div>
                           <div className="pt-4 border-t border-slate-50">
                              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[3px] mb-1">Store Address</p>
                              <p className="font-bold text-slate-400 italic text-sm leading-relaxed">{shop?.address || 'Address pending setup.'}</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </section>
            </div>
            
         </div>
      </main>
    </div>
  );
}
