import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, ShoppingBag, Package, Wallet, Settings, 
  Search, Bell, Users, Bike, Store, Clock, LogOut, Plus,
  TrendingUp, AlertCircle, Map as MapIcon, ChevronRight, Loader2, IndianRupee
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function AdminPortal() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/orders/admin/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#f2f7f2] font-sans"><Loader2 className="animate-spin text-[#1a5d2e]" size={48} /></div>;

  const displayStats = [
    { label: 'TOTAL REVENUE', val: `₹${stats?.totalRevenue?.toLocaleString()}`, badge: '+15%', icon: IndianRupee, color: 'text-[#1a5d2e]' },
    { label: 'ACTIVE SHOPS', val: stats?.totalShops?.toString(), badge: 'LIVE', icon: Store, color: 'text-orange-500' },
    { label: 'DELIVERY FLEET', val: stats?.totalRiders?.toString(), badge: 'ACTIVE', icon: Bike, color: 'text-[#1a5d2e]' },
    { label: 'TOTAL ORDERS', val: stats?.totalOrders?.toString(), badge: '+18%', icon: ShoppingBag, color: 'text-emerald-500' },
  ];


  const disputes = [
    { id: '9021', msg: 'Rider reports closed store, Customer...', time: '2m ago', icon: MapIcon },
    { id: '8944', msg: "Missing item claim: 'Artisan...", time: '12m ago', icon: ShoppingBag },
    { id: '9102', msg: "Delivery exceeded 'Quick' guarantee...", time: '45m ago', icon: Clock }
  ];

  return (
    <div className="min-h-screen bg-[#f2f7f2] flex font-sans selection:bg-[#1a5d2e] selection:text-white">
      {/* Sidebar - Precision Matching KiranaQuick Biz Style */}
      <aside className="w-[320px] bg-white border-r border-[#e3eae3] p-10 flex flex-col sticky top-0 h-screen hidden lg:flex">
         <div className="flex items-center gap-3 mb-16">
            <h1 className="text-[20px] font-black text-[#1a5d2e] tracking-tighter italic">KiranaQuick <span className="text-slate-900 not-italic">Biz</span></h1>
         </div>
         
         <div className="flex items-center gap-5 mb-14 p-5 bg-[#f8faf8] rounded-[32px] border border-[#f0f4f0] group hover:bg-white hover:shadow-xl transition-all duration-500 cursor-pointer">
            <div className="relative">
               <img src="https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=100" className="w-12 h-12 rounded-[18px] object-cover border-2 border-white shadow-md group-hover:rotate-6 transition-transform" />
            </div>
            <div>
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
               onClick={() => setActiveTab(item.id)}
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

         <div className="mt-8">
            <button className="w-full flex items-center justify-center gap-4 py-6 bg-[#1a5d2e] text-white rounded-[28px] font-black text-[12px] uppercase tracking-[3px] shadow-2xl shadow-[#1a5d2e]/20 hover:scale-[1.02] active:scale-95 transition-all group relative overflow-hidden italic">
               <Plus size={18} /> Add Product
            </button>
            <button className="w-full flex items-center gap-4 px-6 py-4 mt-6 text-slate-400 font-black text-[11px] uppercase tracking-widest hover:text-red-500 transition-colors" onClick={logout}>
               <LogOut size={18} /> Logout
            </button>
         </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-14 overflow-y-auto max-h-screen">
         <header className="flex flex-col xl:flex-row xl:items-start justify-between gap-10 mb-16">
            <div className="animate-in fade-in slide-in-from-left-6 duration-700">
               <h2 className="text-[56px] font-black text-[#1a5d2e] italic tracking-tighter leading-none mb-3">SystemPulse</h2>
               <p className="text-[12px] font-bold text-slate-400 uppercase tracking-[4px] italic">Hyper-local operations real-time oversight</p>
            </div>

            <div className="flex items-center gap-10 animate-in fade-in slide-in-from-right-6 duration-700">
               <div className="relative group">
                  <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1a5d2e] transition-colors" size={22} />
                  <input 
                     type="text" 
                     placeholder="Search analytics..." 
                     className="bg-[#e3eae3]/70 border-none rounded-full py-6 pl-20 pr-12 text-[15px] font-bold outline-none focus:bg-white focus:ring-4 focus:ring-[#1a5d2e]/5 transition-all w-[380px] shadow-sm placeholder:text-slate-400" 
                  />
               </div>
               <div className="p-4 bg-white rounded-2xl shadow-xl border border-slate-50 cursor-pointer hover:rotate-6 transition-all group relative overflow-hidden">
                  <Bell size={24} className="text-[#1a5d2e] group-hover:scale-110 transition-transform" />
                  <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></div>
               </div>
            </div>
         </header>

         {/* Stats Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {displayStats.map((s, idx) => (
              <div key={idx} className="bg-white p-12 rounded-[56px] shadow-sm border border-[#f0f4f0] relative group hover:shadow-2xl transition-all h-[240px] flex flex-col justify-between overflow-hidden">
                 <div className="flex items-center justify-between relative z-10">
                    <div className="w-16 h-16 bg-[#f2f7f2] rounded-[24px] flex items-center justify-center border border-[#e3f2e3] shadow-inner">
                       <s.icon size={32} className={s.color} />
                    </div>
                    <div className={`flex items-center gap-1.5 font-black text-[10px] px-3 py-2 rounded-xl border shadow-sm uppercase tracking-widest ${
                      s.badge === 'LIVE' ? 'bg-orange-50 text-orange-500 border-orange-100' : 
                      s.badge === 'Optimized' ? 'bg-emerald-50 text-emerald-500 border-emerald-100' :
                      'bg-[#e3f2e3] text-[#1a5d2e] border-[#d7ecd7]'
                    }`}>
                       {s.badge === '+12%' && <TrendingUp size={14} />} {s.badge}
                    </div>
                 </div>
                 <div className="space-y-1 relative z-10 mt-10">
                    <div className="text-[10px] font-black uppercase tracking-[3px] text-slate-400 italic mb-2 leading-none">{s.label}</div>
                    <div className={`text-[38px] font-black tracking-tighter italic leading-none ${idx === 1 ? 'text-slate-950' : 'text-slate-950'}`}>{s.val}</div>
                 </div>
              </div>
            ))}
         </div>

         {/* Charts Row */}
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16 items-start">
            <section className="lg:col-span-8 bg-white p-12 rounded-[56px] shadow-sm border border-[#f0f4f0] relative group overflow-hidden h-[540px]">
               <div className="flex items-center justify-between mb-12 px-2 relative z-10">
                  <div>
                     <h3 className="text-[28px] font-black text-slate-950 italic tracking-tighter leading-none mb-3">Revenue Growth</h3>
                     <p className="text-[11px] text-slate-400 font-bold italic tracking-widest uppercase opacity-60">Real-time GMV tracking across all zones</p>
                  </div>
                  <div className="flex p-1.5 bg-[#f8faf8] rounded-[22px] border border-[#f0f4f0] shadow-inner">
                     <button className="px-8 py-3 rounded-[18px] text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all italic">Daily</button>
                     <button className="px-8 py-3 bg-[#1a5d2e] text-white rounded-[18px] text-[11px] font-black uppercase tracking-widest shadow-xl shadow-[#1a5d2e]/20 transition-all italic">Weekly</button>
                  </div>
               </div>
               
               <div className="h-64 relative group/chart mt-10 px-4">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 800 200" preserveAspectRatio="none">
                    <defs>
                       <linearGradient id="chartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" style={{ stopColor: '#10b981', stopOpacity: 0.2 }} />
                          <stop offset="100%" style={{ stopColor: '#10b981', stopOpacity: 0.05 }} />
                       </linearGradient>
                    </defs>
                    {/* The specialized sine-wave style curve */}
                    <path 
                      d="M0,150 C150,140 250,180 400,100 C500,50 650,150 800,80 V200 H0 Z" 
                      fill="url(#chartGrad)" 
                      className="animate-in fade-in duration-1000"
                    />
                    <path 
                      d="M0,150 C150,140 250,180 400,100 C500,50 650,150 800,80" 
                      fill="none" 
                      stroke="#10b981" 
                      strokeWidth="10" 
                      strokeLinecap="round" 
                      className="animate-pulse-slow"
                    />
                    {/* Peak Marker */}
                    <circle cx="800" cy="80" r="14" fill="#10b981" stroke="white" strokeWidth="6" className="shadow-2xl" />
                  </svg>
               </div>
               
               <div className="flex justify-between items-center mt-12 px-6 text-[11px] font-black text-slate-300 uppercase tracking-[6px] italic leading-none">
                  {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(day => <span key={day}>{day}</span>)}
               </div>
            </section>

            <section className="lg:col-span-4 bg-white p-12 rounded-[56px] shadow-sm border border-[#f0f4f0] h-[540px] flex flex-col">
               <div className="px-2">
                  <h3 className="text-[28px] font-black text-slate-950 italic tracking-tighter leading-none mb-3">Order Density</h3>
                  <p className="text-[11px] text-slate-400 font-bold italic tracking-widest uppercase opacity-60 mb-12">Hourly peak performance</p>
               </div>
               
               <div className="flex-1 flex items-end justify-between gap-5 relative group/bar-container px-4">
                  {[40, 70, 95, 60, 45, 85, 50].map((h, i) => (
                    <div key={i} className="flex-1 relative group/bar cursor-pointer">
                       {i === 2 && (
                          <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#ff6b21] text-white text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest italic shadow-xl shadow-orange-950/20 z-10 animate-bounce-slow">Peak</div>
                       )}
                       <div className={`w-full rounded-[14px] transition-all duration-700 ${i === 2 ? 'bg-[#ff6b21] shadow-2xl shadow-orange-950/20' : i === 5 ? 'bg-[#10b981] opacity-80' : 'bg-[#e9eee9]'} hover:bg-[#1a5d2e] hover:shadow-2xl`} style={{ height: `${h}%` }}></div>
                    </div>
                  ))}
               </div>
               
               <div className="flex justify-between mt-12 px-6 text-[10px] font-black text-slate-300 italic tracking-[4px] leading-none uppercase">
                  <span>8AM</span><span>12PM</span><span>4PM</span><span>8PM</span>
               </div>
            </section>
         </div>

         {/* Bottom Grid: Heatmap & Disputes */}
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
            <section className="lg:col-span-8 bg-white p-12 rounded-[56px] shadow-sm border border-[#f0f4f0] relative overflow-hidden group h-[540px]">
               <div className="mb-10 px-2">
                  <h3 className="text-[28px] font-black text-slate-950 italic tracking-tighter leading-none mb-3">Live Heatmap</h3>
                  <p className="text-[11px] text-slate-400 font-bold italic tracking-widest uppercase opacity-60">Busiest Zones: South Extension, Sector 5</p>
               </div>
               
               <div className="h-[360px] rounded-[48px] overflow-hidden relative border-8 border-[#f8faf8] shadow-inner group-hover:scale-[1.01] transition-transform duration-700">
                  <img 
                    src="https://images.unsplash.com/photo-1524660988544-1429dd47405b?w=1600" 
                    className="w-full h-full object-cover opacity-50 grayscale contrast-[1.2] invert group-hover:grayscale-0 group-hover:invert-0 transition-all duration-[2s]" 
                    alt="Bengaluru Map"
                  />
                  <div className="absolute inset-0 bg-[#1a5d2e]/5 backdrop-blur-[0.5px]"></div>
                  
                  {/* Map Label Overlay - Screenshot Exact */}
                  <div className="absolute bottom-12 left-12 space-y-3 z-10">
                     <h4 className="text-[44px] font-black text-slate-950 italic tracking-tighter leading-none">Bengaluru</h4>
                     <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest opacity-80 italic leading-none px-1">बेङ्गलूरु</p>
                  </div>
                  
                  {/* Heat Spots */}
                  <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-emerald-500/10 rounded-full blur-[60px] animate-pulse"></div>
                  <div className="absolute bottom-1/4 left-1/2 w-48 h-48 bg-orange-500/10 rounded-full blur-[80px] animate-pulse delay-700"></div>
               </div>
            </section>

            <section className="lg:col-span-4 bg-white p-12 rounded-[56px] shadow-sm border border-[#f0f4f0] h-[540px] flex flex-col relative overflow-hidden">
               <div className="flex items-center justify-between mb-10 px-2">
                  <h3 className="text-[28px] font-black text-slate-950 italic tracking-tighter leading-none">Urgent Disputes</h3>
                  <div className="bg-[#fff1f1] text-red-500 text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest italic border border-red-50 animate-pulse">4 PENDING</div>
               </div>
               
               <div className="space-y-6 flex-1 overflow-y-auto no-scrollbar pr-1">
                  {disputes.map((d, i) => (
                    <div key={i} className="p-8 bg-[#fdfaf8] rounded-[40px] border-l-[6px] border-[#1a5d2e] shadow-sm hover:shadow-2xl hover:bg-white transition-all cursor-pointer relative group/item">
                       <div className="flex items-start gap-6">
                          <div className="w-12 h-12 rounded-2xl bg-white border border-[#f0f4f0] flex items-center justify-center text-slate-300 group-hover/item:text-[#1a5d2e] transition-colors shadow-sm">
                             <d.icon size={22} />
                          </div>
                          <div className="flex-1 space-y-2">
                             <div className="flex items-center justify-between">
                                <h5 className="text-[11px] font-black text-slate-950 uppercase tracking-widest italic leading-none">Order #KK-{d.id}</h5>
                                <span className="text-[10px] text-slate-400 font-bold italic opacity-60 leading-none">{d.time}</span>
                             </div>
                             <p className="text-[12px] text-slate-500 font-bold italic leading-relaxed line-clamp-2 pr-6">{d.msg}</p>
                             <button className="pt-3 text-[10px] font-black uppercase tracking-widest text-[#1a5d2e] italic flex items-center gap-1 group-hover/item:translate-x-1 transition-transform">
                                RESOLVE <ChevronRight size={14} className="mt-0.5" />
                             </button>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
               
               <button className="w-full mt-10 py-6 bg-[#f8faf8] text-slate-400 rounded-[32px] text-[11px] font-black uppercase tracking-[4px] italic border border-[#f0f4f0] hover:text-slate-950 hover:bg-white hover:shadow-xl transition-all">View All Disputes</button>
            </section>
         </div>
      </main>

      {/* Floating Global Branding Pip */}
      <div className="fixed bottom-12 left-10 flex items-center gap-6 z-[200]">
         <button className="w-20 h-20 bg-[#1a5d2e] text-white rounded-[28px] flex items-center justify-center shadow-2xl shadow-[#1a5d2e]/40 hover:scale-110 active:scale-95 transition-all group overflow-hidden" onClick={() => navigate('/inventory')}>
            <Plus size={32} className="group-hover:rotate-90 transition-transform" strokeWidth={3} />
         </button>
         <div className="bg-[#1e231e] px-10 py-4.5 rounded-full text-white font-black text-[13px] uppercase tracking-[4px] shadow-2xl italic shadow-black/20 animate-in slide-in-from-left-2 duration-500">
            SystemPulse
         </div>
      </div>
    </div>
  );
}
