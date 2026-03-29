import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  LogOut, Package, ShoppingBag, IndianRupee, TrendingUp, 
  AlertTriangle, Search, Bell, Settings, Plus, LayoutDashboard, 
  Wallet, ChevronRight, Store, CreditCard, Info, Clock, Loader2
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

export default function ShopOwnerDashboard() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          api.get('/orders/shop/stats'),
          api.get('/orders/shop')
        ]);
        setStats(statsRes.data);
        setOrders(ordersRes.data);
      } catch (err) {
        console.error('Failed to fetch shop data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUpdateStatus = async (orderId: string, status: 'accept' | 'reject') => {
     try {
        await api.put(`/orders/${orderId}/${status}`);
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: status === 'accept' ? 'ACCEPTED' : 'REJECTED' } : o));
        // Refetch stats to update active count
        const statsRes = await api.get('/orders/shop/stats');
        setStats(statsRes.data);
     } catch (err) {
        alert('Failed to update order status');
     }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#f2f7f2]"><Loader2 className="animate-spin text-[#1a5d2e]" size={48} /></div>;


  const inventoryAlerts = [
    { name: 'Amul Gold Milk 500ml', remaining: 4, total: 50, color: 'bg-red-500' },
    { name: 'Atta Whole Wheat 5kg', remaining: 12, total: 40, color: 'bg-orange-500' },
    { name: 'Refined Sunflower Oil 1L', remaining: 2, total: 30, color: 'bg-red-600' }
  ];

  return (
    <div className="min-h-screen bg-[#f2f7f2] flex font-sans">
      {/* Sidebar - Precision Matching */}
      <aside className="w-[320px] bg-white border-r border-[#e3eae3] p-10 flex flex-col sticky top-0 h-screen">
         <div className="flex items-center gap-3 mb-16">
            <h1 className="text-[20px] font-black text-[#1a5d2e] tracking-tighter italic">KiranaQuick <span className="text-slate-900 not-italic">Biz</span></h1>
         </div>
         
         <div onClick={() => navigate('/shop-profile')} className="flex items-center gap-5 mb-14 p-5 bg-[#f8faf8] rounded-[32px] border border-[#f0f4f0] group hover:bg-white hover:shadow-xl transition-all duration-500 cursor-pointer">
            <div className="relative">
               <img src="https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=100" className="w-12 h-12 rounded-[18px] object-cover border-2 border-white shadow-md group-hover:rotate-6 transition-transform" />
               <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="overflow-hidden">
               <h4 className="font-black text-slate-950 text-[13px] tracking-tight truncate leading-tight">Store Manager</h4>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 opacity-60">KIRANAQUICK BIZ</p>
            </div>
         </div>

         <nav className="flex-1 space-y-3">
           {[
             { id: 'Dashboard', icon: LayoutDashboard },
             { id: 'Orders', icon: Package },
             { id: 'Inventory', icon: ShoppingBag },
             { id: 'Payouts', icon: Wallet },
             { id: 'Settings', icon: Settings }
           ].map(item => (
             <button 
               key={item.id} 
               onClick={() => {
                  setActiveTab(item.id);
                  if (item.id === 'Inventory') navigate('/inventory');
               }}
               className={`w-full flex items-center justify-between p-4.5 px-6 rounded-[22px] transition-all group ${
                 activeTab === item.id ? 'bg-[#e3f2e3] text-[#1a5d2e] shadow-sm' : 'text-slate-500 hover:bg-[#f8faf8]'
               }`}
             >
               <div className="flex items-center gap-5">
                  <item.icon size={20} className={activeTab === item.id ? 'text-[#1a5d2e]' : 'text-slate-400 group-hover:text-slate-900'} />
                  <span className={`text-[13px] font-black italic tracking-tight ${activeTab === item.id ? 'text-[#1a5d2e]' : 'group-hover:text-slate-900'}`}>{item.id}</span>
               </div>
               {activeTab === item.id && <ChevronRight size={14} />}
             </button>
           ))}
         </nav>

         <div className="mt-auto">
            <button 
               onClick={() => navigate('/inventory')}
               className="w-full flex items-center justify-center gap-4 py-6 bg-[#1a5d2e] text-white rounded-[28px] font-black text-[12px] uppercase tracking-[3px] shadow-2xl shadow-[#1a5d2e]/20 hover:scale-[1.02] active:scale-95 transition-all group overflow-hidden relative"
            >
               <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform"></div>
               <Plus size={18} /> Add Product
            </button>
         </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-14 overflow-y-auto max-h-screen">
         <header className="flex flex-col xl:flex-row xl:items-center justify-between gap-10 mb-16">
            <div>
               <h2 className="text-[44px] font-black text-slate-950 italic tracking-tighter leading-none mb-3">Dashboard Overview</h2>
               <p className="text-[12px] font-bold text-slate-400 uppercase tracking-[4px] italic">Live store performance and insights</p>
            </div>

            <div className="flex items-center gap-10">
               <div className="relative">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                     type="text" 
                     placeholder="Search orders, items..." 
                     className="bg-[#e3eae3]/70 border-none rounded-full py-5 pl-16 pr-32 text-[13px] font-bold outline-none focus:bg-white focus:ring-4 focus:ring-[#1a5d2e]/5 transition-all w-[380px] shadow-sm placeholder:text-slate-400" 
                  />
               </div>
               <div className="flex items-center gap-8">
                  <div className="relative cursor-pointer hover:scale-110 transition-transform">
                     <Bell size={24} className="text-slate-900" />
                     <div className="absolute top-0.5 right-0.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div className="p-3 bg-white rounded-2xl shadow-xl border border-slate-50 cursor-pointer hover:rotate-6 transition-all hover:bg-emerald-50">
                     <ShoppingBag size={24} className="text-[#1a5d2e]" />
                  </div>
               </div>
            </div>
         </header>

         {/* Stats Row */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-16">
            <div className="lg:col-span-4 bg-white p-12 rounded-[56px] shadow-sm border border-[#f0f4f0] relative group overflow-hidden h-[240px] flex flex-col justify-between">
               <div className="flex items-center justify-between relative z-10">
                  <div className="w-16 h-16 bg-[#f2f7f2] text-[#1a5d2e] rounded-[24px] flex items-center justify-center border border-[#e3f2e3] shadow-inner">
                     <IndianRupee size={32} />
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#e3f2e3] text-[#1a5d2e] font-black text-[10px] px-3 py-2 rounded-xl border border-[#d7ecd7] shadow-sm uppercase tracking-widest">
                     <TrendingUp size={14} /> +12.5%
                  </div>
                           <div className="space-y-1 relative z-10">
                  <div className="text-[10px] font-black uppercase tracking-[3px] text-slate-400 italic">Today's Revenue</div>
                  <div className="text-[38px] font-black text-slate-950 tracking-tighter italic">₹{stats?.revenue?.toLocaleString()}.00</div>
               </div>
            </div>

            <div className="lg:col-span-4 bg-[#ff6b21] p-12 rounded-[56px] shadow-[0_24px_48px_rgba(255,107,33,0.15)] relative overflow-hidden text-white group cursor-pointer active:scale-95 transition-all h-[240px] flex flex-col justify-between">
               <div className="absolute top-0 right-0 w-44 h-44 bg-white/10 -mr-16 -mt-16 rounded-full blur-3xl"></div>
               <div className="flex items-center justify-between relative z-10">
                  <div className="w-16 h-16 bg-white/20 text-white rounded-[24px] flex items-center justify-center backdrop-blur-md border border-white/20 shadow-xl">
                     <Package size={32} strokeWidth={2.5} />
                  </div>
                  <div className="flex -space-x-4">
                    {['JD', 'AM'].map((id, i) => (
                      <div key={id} className={`w-11 h-11 rounded-full bg-white/20 border-2 border-[#ff6b21] flex items-center justify-center text-[9px] font-black relative z-[${20-i}] shadow-lg`}>{id}</div>
                    ))}
                  </div>
               </div>
               <div className="space-y-1 relative z-10">
                  <div className="text-[10px] font-black uppercase tracking-[3px] text-white/50 italic">Active Orders</div>
                  <div className="text-[44px] font-black tracking-tighter italic">{stats?.activeOrders}</div>
               </div>
            </div>

            <div className="lg:col-span-4 bg-[#fcfcf0] p-12 rounded-[56px] shadow-sm border border-[#f0f0e0] flex flex-col justify-between h-[240px]">
               <div className="w-16 h-16 bg-red-50 text-red-500 rounded-[24px] flex items-center justify-center border border-red-100 shadow-inner">
                  <AlertTriangle size={32} />
               </div>
               <div className="space-y-1">
                  <div className="text-[10px] font-black uppercase tracking-[3px] text-slate-400 italic">Low Stock Items</div>
                  <div className="text-[44px] font-black text-red-500 tracking-tighter italic leading-none">{stats?.lowStockCount?.toString().padStart(2, '0')}</div>
               </div>
            </div>
         </div>       </div>

         {/* Content Grid */}
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Col: Recent Orders */}
            <div className="lg:col-span-8 space-y-10">
               <div className="flex items-center justify-between px-4">
                  <div>
                     <h3 className="text-[28px] font-black text-slate-950 italic tracking-tighter leading-none">Recent Orders</h3>
                     <p className="text-[11px] text-slate-400 font-bold italic tracking-widest mt-2 uppercase opacity-60">Incoming requests from local customers</p>
                  </div>
                  <button className="text-[10px] font-black text-[#1a5d2e] uppercase tracking-[3px] italic hover:underline decoration-2">View All History</button>
                          <div className="space-y-5">
                  {orders.map(o => (
                    <div key={o._id} className="bg-white p-6 rounded-[40px] border border-[#f0f4f0] shadow-sm flex items-center justify-between gap-10 group hover:shadow-2xl hover:-translate-y-1 transition-all h-[110px] cursor-pointer">
                       <div className="flex items-center gap-8 px-4">
                          <div className="w-16 h-16 bg-[#f8faf8] flex items-center justify-center rounded-[24px] text-3xl shadow-inner group-hover:bg-[#e3f2e3] transition-colors border border-[#f0f4f0] overflow-hidden">
                             <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=100" className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all" />
                          </div>
                          <div>
                             <div className="flex items-center gap-3">
                                <h4 className="font-black text-slate-950 text-base italic tracking-tight leading-none">Order #KK-{o._id.slice(-4).toUpperCase()}</h4>
                                {o.status === 'PENDING' && <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>}
                             </div>
                             <p className="text-[11px] text-slate-400 font-bold uppercase tracking-[2px] italic mt-2 opacity-70">
                                {o.customer?.name} • {o.items?.length} items • Status: {o.status}
                             </p>
                          </div>
                       </div>
                       <div className="flex items-center gap-12">
                          <span className="text-[22px] font-black text-slate-950 tracking-tighter italic">₹{o.totalAmount.toLocaleString()}.00</span>
                          {o.status === 'PENDING' && (
                            <div className="flex gap-3">
                               <button onClick={() => handleUpdateStatus(o._id, 'accept')} className="px-10 py-3.5 bg-[#1a5d2e] text-white rounded-2xl text-[11px] font-black uppercase tracking-widest italic shadow-xl shadow-[#1a5d2e]/20 hover:bg-[#123e1e] active:scale-95 transition-all">Accept</button>
                               <button onClick={() => handleUpdateStatus(o._id, 'reject')} className="px-10 py-3.5 bg-[#f8faf8] text-slate-400 border border-[#f0f4f0] rounded-2xl text-[11px] font-black uppercase tracking-widest italic hover:text-red-500 hover:bg-red-50 transition-all">Reject</button>
                            </div>
                          )}
                          {o.status !== 'PENDING' && (
                            <div className="bg-[#f0f4f0] text-slate-400 px-6 py-2 rounded-xl text-[10px] font-black italic uppercase tracking-widest">{o.status}</div>
                          )}
                       </div>
                    </div>
                  ))}
                  {orders.length === 0 && <div className="py-20 text-center text-slate-300 font-black italic uppercase tracking-widest">No orders yet</div>}
               </div>             </div>
            </div>

            {/* Right Col: Alerts & Payout */}
            <aside className="lg:col-span-4 space-y-10">
               <section className="bg-white p-12 rounded-[56px] shadow-sm border border-[#f0f4f0] relative h-fit">
                  <div className="flex items-center gap-3 mb-10">
                     <TrendingUp className="text-[#ff6b21]" size={20} />
                     <h4 className="text-[11px] font-black uppercase tracking-[3px] text-slate-950 italic leading-none">Restock Suggestions</h4>
                  </div>
                  
                  <div className="space-y-6 mb-12">
                     {inventoryAlerts.map((item, i) => (
                       <div key={i} className="space-y-3 p-6 bg-[#f8faf8] rounded-[32px] border border-[#f0f4f0] group hover:bg-white hover:shadow-lg transition-all">
                          <div className="flex justify-between items-center mb-1">
                             <span className="text-[12px] font-black text-slate-950 italic tracking-tight">{item.name}</span>
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{item.remaining} units left</span>
                          </div>
                          <div className="w-full h-2.5 bg-slate-200/50 rounded-full overflow-hidden flex shadow-inner">
                             <div className={`h-full ${item.color} rounded-full shadow-[0_0_8px_rgba(0,0,0,0.1)]`} style={{ width: `${(item.remaining / item.total) * 100}%` }}></div>
                          </div>
                       </div>
                     ))}
                  </div>
                  
                  <button className="w-full p-6 bg-[#ff6b21] text-white rounded-[32px] font-black text-[12px] uppercase tracking-[4px] shadow-2xl shadow-[#ff6b21]/20 hover:bg-[#eb5d16] active:scale-95 transition-all mb-12 italic">
                     Quick Restock All
                  </button>

                  <div className="bg-[#1e231e] p-10 rounded-[44px] text-white relative group overflow-hidden shadow-2xl shadow-black/20">
                     <div className="absolute top-0 right-0 w-44 h-44 bg-white/5 -mr-16 -mt-16 rounded-full blur-3xl group-hover:bg-white/10 transition-colors"></div>
                     <div className="flex items-center justify-between mb-8">
                        <div className="text-[11px] font-black uppercase tracking-[4px] text-white/50 italic leading-none">Next Payout</div>
                        <Info size={16} className="text-white/20" />
                     </div>
                     <div className="text-[38px] font-black italic tracking-tighter leading-none mb-6">₹12,400.00</div>
                     <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold uppercase tracking-widest italic opacity-60">
                        <Clock size={12} /> Expected: Friday, 24 Oct
                     </div>
                  </div>
               </section>
            </aside>
         </div>
      </main>
    </div>
  );
}
