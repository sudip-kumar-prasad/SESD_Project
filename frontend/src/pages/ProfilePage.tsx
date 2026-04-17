import { useState, useEffect } from 'react';
import { 
  User, Package, MapPin, CreditCard, Bell, 
  HelpCircle, LogOut, Camera, ChevronRight,
  Mail, Cake, Moon, MailQuestion, Trash2, Edit2,
  CheckCircle2, Loader2, ShoppingCart
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('My Profile');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/my');
        setOrders(res.data.slice(0, 3)); // Only show last 3 for logic matching mockup
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchOrders();
  }, [user]);

  const sidebarItems = [
    { id: 'My Profile', icon: User },
    { id: 'Order History', icon: Package },
    { id: 'Manage Addresses', icon: MapPin },
    { id: 'Payment Methods', icon: CreditCard },
    { id: 'Notifications', icon: Bell },
  ];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f2f7f2]">
      <Loader2 className="animate-spin text-[#1a5d2e]" size={48} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f2f7f2] font-sans text-slate-900 pb-20">
      {/* Navbar Logic - Consistent Branding */}
      <nav className="px-12 py-6 flex items-center justify-between sticky top-0 bg-[#f2f7f2]/90 backdrop-blur-xl z-[100]">
        <Link to="/" className="text-[22px] font-black text-[#1a5d2e] tracking-tight hover:scale-105 transition-transform">KiranaQuick</Link>
        <div className="flex items-center gap-8">
           <Bell size={22} className="text-slate-400 cursor-pointer hover:text-slate-600 transition-colors" />
           <Link to="/checkout"><ShoppingCart size={22} className="text-slate-400 cursor-pointer hover:text-slate-600 transition-colors" /></Link>
           <div className="w-10 h-10 rounded-full border-2 border-white shadow-lg overflow-hidden flex items-center justify-center bg-white cursor-pointer hover:rotate-6 transition-transform">
              <img src={`https://ui-avatars.com/api/?name=${user?.name}&background=1a5d2e&color=fff`} className="w-full h-full object-cover" alt="User" />
           </div>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto px-12 py-10 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        
        {/* Left Sidebar */}
        <aside className="lg:col-span-3 space-y-12 animate-in fade-in slide-in-from-left-6 duration-700">
           <div className="bg-white/50 backdrop-blur-md p-6 rounded-[36px] space-y-2 border border-white/40">
              {sidebarItems.map(item => (
                <button 
                   key={item.id}
                   onClick={() => setActiveTab(item.id)}
                   className={`w-full flex items-center gap-4 px-6 py-4.5 rounded-2x transition-all group ${
                     activeTab === item.id ? 'bg-[#e3f2e3] text-[#1a5d2e] shadow-sm rounded-3xl' : 'text-slate-400 hover:text-slate-900'
                   }`}
                >
                   <item.icon size={20} />
                   <span className="text-[13px] font-black italic tracking-tight uppercase tracking-widest">{item.id}</span>
                </button>
              ))}
           </div>

           <div className="bg-white/50 backdrop-blur-md p-6 rounded-[36px] space-y-2 border border-white/40">
              <button className="w-full flex items-center gap-4 px-6 py-4.5 text-slate-400 hover:text-slate-900 transition-all rounded-3xl">
                 <HelpCircle size={20} />
                 <span className="text-[13px] font-black italic tracking-tight uppercase tracking-widest">Help & Support</span>
              </button>
              <button onClick={logout} className="w-full flex items-center gap-4 px-6 py-4.5 text-red-400 hover:text-red-600 transition-all rounded-3xl">
                 <LogOut size={20} />
                 <span className="text-[13px] font-black italic tracking-tight uppercase tracking-widest">Logout</span>
              </button>
           </div>
        </aside>

        {/* Right Content */}
        <div className="lg:col-span-9 space-y-12 animate-in fade-in slide-in-from-right-6 duration-700">
           
           {/* Summary Profile Header */}
           <section className="bg-white p-12 rounded-[56px] shadow-sm border border-white flex items-center justify-between group overflow-hidden relative">
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#1a5d2e]/5 -mr-20 -mt-20 rounded-full blur-3xl"></div>
              
              <div className="flex items-center gap-10 relative z-10">
                 <div className="relative group/avatar">
                    <div className="w-32 h-32 rounded-full border-[6px] border-[#f2f7f2] shadow-2xl overflow-hidden group-hover/avatar:scale-105 transition-transform">
                       <img src={`https://ui-avatars.com/api/?name=${user?.name}&background=1a5d2e&color=fff&bold=true`} className="w-full h-full object-cover" />
                    </div>
                    <button className="absolute bottom-1 right-1 p-2.5 bg-[#1a5d2e] text-white rounded-full border-4 border-white shadow-xl hover:scale-110 active:scale-95 transition-all">
                       <Camera size={18} />
                    </button>
                 </div>
                 <div className="space-y-3">
                    <h2 className="text-[44px] font-black text-slate-950 italic tracking-tighter leading-none">{user?.name}</h2>
                    <p className="text-slate-400 font-bold italic tracking-wide">{user?.phone || '+91 98765 43210'}</p>
                    <div className="flex gap-4 pt-2">
                       <span className="bg-[#e3f2e3] text-[#1a5d2e] text-[10px] font-black px-4 py-1.5 rounded-full border border-white uppercase tracking-widest italic shadow-sm">Gold Member</span>
                       <span className="bg-slate-50 text-slate-400 text-[10px] font-black px-4 py-1.5 rounded-full border border-slate-100 uppercase tracking-widest italic shadow-sm">{orders.length} Orders</span>
                    </div>
                 </div>
              </div>
              
              <button className="px-10 py-5 bg-[#e3eae3]/50 text-slate-600 rounded-[28px] font-black text-[12px] uppercase tracking-[3px] italic hover:bg-white hover:shadow-2xl transition-all border border-white group-hover:-translate-x-2 relative z-10 flex items-center gap-3">
                 <Edit2 size={16} /> Edit Profile
              </button>
           </section>

           {/* Personal Details & Preferences */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <section className="space-y-8">
                 <h3 className="text-[20px] font-black text-slate-950 italic tracking-tight px-2">Personal Details</h3>
                 <div className="space-y-4">
                    {[
                      { label: 'Full Name', val: user?.name, icon: User },
                      { label: 'Email Address', val: user?.email, icon: Mail },
                      { label: 'Birthday', val: 'March 14, 1994', icon: Cake },
                    ].map((item, i) => (
                      <div key={i} className="bg-white p-6 px-8 rounded-[32px] border border-white shadow-sm flex items-center gap-6 group hover:translate-x-2 transition-transform cursor-pointer">
                         <div className="p-3 bg-[#f2f7f2] rounded-2xl text-[#1a5d2e] group-hover:bg-[#1a5d2e] group-hover:text-white transition-colors">
                            <item.icon size={20} />
                         </div>
                         <div>
                            <p className="text-[9px] font-black text-slate-300 uppercase tracking-[2px] mb-1">{item.label}</p>
                            <p className="font-bold text-slate-950 italic">{item.val}</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </section>

              <section className="space-y-8">
                 <h3 className="text-[20px] font-black text-slate-950 italic tracking-tight px-2">Preferences</h3>
                 <div className="bg-white/60 backdrop-blur-md p-10 rounded-[48px] border border-white shadow-sm space-y-10">
                    {[
                      { label: 'Notifications', icon: Bell, active: true },
                      { label: 'Dark Mode', icon: Moon, active: false },
                      { label: 'Marketing Emails', icon: MailQuestion, active: true },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between group cursor-pointer">
                         <div className="flex items-center gap-5">
                            <div className="p-2.5 bg-[#f2f7f2] rounded-xl text-slate-400 group-hover:scale-110 transition-transform">
                               <item.icon size={18} />
                            </div>
                            <span className="font-bold text-slate-950 italic">{item.label}</span>
                         </div>
                         <div className={`w-14 h-7 rounded-full relative transition-all duration-500 ${item.active ? 'bg-[#1a5d2e]' : 'bg-slate-200 shadow-inner'}`}>
                            <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-500 ${item.active ? 'left-8' : 'left-1'}`}></div>
                         </div>
                      </div>
                    ))}
                 </div>
              </section>
           </div>

           {/* Saved Addresses */}
           <section className="space-y-8">
              <div className="flex justify-between items-center px-2">
                 <h3 className="text-[20px] font-black text-slate-950 italic tracking-tight">Saved Addresses</h3>
                 <button className="text-[11px] font-black text-[#1a5d2e] uppercase tracking-[3px] italic hover:underline decoration-2">+ Add New</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {[
                   { label: 'HOME', addr: user?.address || '123 Green Valley Apt, Willow Creek, Bangalore, 560102', icon: MapPin },
                   { label: 'WORK', addr: 'Veridian Tech Park, Suite 405, Indiranagar, Bangalore, 560038', icon: Package },
                 ].map((addr, i) => (
                    <div key={i} className="bg-white p-10 rounded-[48px] border border-white shadow-sm space-y-6 group hover:shadow-2xl transition-all">
                       <div className="flex items-center gap-4 mb-2">
                          <div className={i === 0 ? 'text-[#1a5d2e]' : 'text-[#ff6b21]'}>
                             <addr.icon size={22} fill="currentColor" fillOpacity="0.1" />
                          </div>
                          <span className="text-[11px] font-black italic tracking-[3px]">{addr.label}</span>
                       </div>
                       <p className="text-[13px] text-slate-400 font-bold leading-relaxed pr-10">{addr.addr}</p>
                       <div className="pt-6 border-t border-slate-50 flex gap-6">
                          <button className="text-[10px] font-black text-[#1a5d2e] uppercase tracking-[3px] italic flex items-center gap-2 hover:-translate-y-0.5 transition-transform"><Edit2 size={12}/> Edit</button>
                          <button className="text-[10px] font-black text-red-400 uppercase tracking-[3px] italic flex items-center gap-2 hover:-translate-y-0.5 transition-transform"><Trash2 size={12}/> Delete</button>
                       </div>
                    </div>
                 ))}
              </div>
           </section>

           {/* Recent Orders */}
           <section className="space-y-8">
              <div className="flex justify-between items-center px-2">
                 <h3 className="text-[20px] font-black text-slate-950 italic tracking-tight">Recent Orders</h3>
                 <button className="text-[11px] font-black text-[#1a5d2e] uppercase tracking-[3px] italic hover:underline decoration-2">View All</button>
              </div>
              <div className="space-y-4">
                 {orders.map((o, idx) => (
                   <div key={o._id} onClick={() => navigate(`/tracking/${o._id}`)} className="bg-white p-8 px-10 rounded-[40px] border border-white shadow-sm flex items-center justify-between group hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer">
                      <div className="flex items-center gap-8">
                         <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner transition-colors ${
                           o.status === 'DELIVERED' ? 'bg-[#f2f7f2] text-[#1a5d2e]' : 'bg-[#fff1f1] text-orange-500'
                         }`}>
                           {o.status === 'DELIVERED' ? <CheckCircle2 size={24} /> : <Package size={24} />}
                         </div>
                         <div>
                            <h4 className="font-black text-slate-950 italic tracking-tight">Order #KQ-{o._id.slice(-5).toUpperCase()}</h4>
                            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-[2px] mt-1 italic">
                               {new Date(o.createdAt).toLocaleDateString()} • {o.items?.length} items
                            </p>
                         </div>
                      </div>
                      <div className="text-right space-y-2">
                         <div className={`text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest inline-block ${
                           o.status === 'DELIVERED' ? 'bg-[#e3f2e3] text-[#1a5d2e]' : 'bg-[#fff1f1] text-[#ff6b21]'
                         }`}>
                            {o.status}
                         </div>
                         <div className="text-lg font-black italic text-slate-950">₹{o.totalAmount}</div>
                      </div>
                   </div>
                 ))}
                 {orders.length === 0 && (
                    <div className="py-20 bg-white/40 rounded-[48px] border border-dashed border-slate-200 text-center text-slate-400 font-black italic uppercase tracking-widest">
                       No orders yet
                    </div>
                 )}
              </div>
           </section>

        </div>
      </main>
      
      {/* Interactive Footer Decoration */}
      <div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#1a5d2e] to-transparent opacity-10"></div>
    </div>
  );
}
