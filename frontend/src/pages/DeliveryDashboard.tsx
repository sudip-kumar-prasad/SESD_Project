import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutGrid, Navigation, PieChart, Activity, 
  Settings, Bell, Search, LogOut, HelpCircle,
  Zap, Package, MapPin, Clock, ArrowRight,
  TrendingUp, CloudRain, Info, CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function DeliveryDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Available Orders');
  const [availableTasks, setAvailableTasks] = useState<any[]>([]);
  const [activeTask, setActiveTask] = useState<any>(null);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [availableRes, activeRes] = await Promise.all([
          api.get('/orders/available'),
          api.get('/orders/active-delivery')
        ]);
        setAvailableTasks(availableRes.data);
        setActiveTask(activeRes.data);
      } catch (err) {
        console.error('Failed to fetch delivery data:', err);
      }
    };
    fetchData();
  }, []);

  const handleAcceptTask = async (orderId: string) => {
    try {
      await api.put(`/orders/${orderId}/accept-delivery`);
      const activeRes = await api.get('/orders/active-delivery');
      setActiveTask(activeRes.data);
      setAvailableTasks(prev => prev.filter(t => t._id !== orderId));
    } catch (err) {
      alert('Failed to accept task');
    }
  };

  const menuItems = [
    { name: 'Available Orders', icon: LayoutGrid },
    { name: 'Active Deliveries', icon: Navigation },
    { name: 'Earnings Analytics', icon: PieChart },
    { name: 'Performance', icon: Activity },
  ];

  const filters = [
    { name: 'Distance: < 5km', icon: MapPin },
    { name: 'Earning: > ₹60', icon: TrendingUp },
    { name: 'Time: Immediate', icon: Clock },
    { name: 'Express Only', icon: Zap },
  ];

  // Helper to get estimated earnings (Mocked for UI feel)
  const getEarning = (amount: number) => Math.floor(amount * 0.15 + 30);

  return (
    <div className="flex min-h-screen bg-[#f2f7f2] font-sans selection:bg-[#1a5d2e] selection:text-white overflow-hidden">
      
      {/* Sidebar - Precise Match */}
      <aside className="w-[320px] bg-[#0a1f10] text-white flex flex-col p-8 transition-all duration-500">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl">
            <img 
              src={`https://ui-avatars.com/api/?name=${user?.name || 'Partner'}&background=1a5d2e&color=fff`} 
              alt="Partner" 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="text-sm font-black italic tracking-tight">Partner Portal</h3>
            <p className="text-[10px] text-white/50 font-bold tracking-widest uppercase">Delivery Agent ID: #8821</p>
          </div>
        </div>

        <nav className="space-y-3 flex-1">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[12px] font-black uppercase tracking-[2px] transition-all duration-300 italic ${
                activeTab === item.name 
                  ? 'bg-[#1a5d2e] text-white shadow-xl shadow-[#1a5d2e]/20 translate-x-2' 
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon size={20} strokeWidth={activeTab === item.name ? 3 : 2} />
              {item.name}
            </button>
          ))}
        </nav>

        <div className="pt-8 border-t border-white/10 space-y-6">
          <button 
            onClick={() => setIsOnline(!isOnline)}
            className={`w-full py-5 rounded-[24px] font-black text-[11px] uppercase tracking-[4px] italic flex items-center justify-center gap-3 transition-all ${
              isOnline ? 'bg-[#1a5d2e] text-white shadow-xl shadow-[#1a5d2e]/30' : 'bg-red-500/10 text-red-500 border border-red-500/20'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-red-500'}`}></div>
            {isOnline ? 'Go Offline' : 'Go Online'}
          </button>
          
          <div className="space-y-4 px-6">
            <button className="flex items-center gap-4 text-[11px] font-black text-white/40 uppercase tracking-widest hover:text-white transition-colors italic">
              <HelpCircle size={18} /> Help Center
            </button>
            <button 
              onClick={logout}
              className="flex items-center gap-4 text-[11px] font-black text-white/40 uppercase tracking-widest hover:text-red-400 transition-colors italic"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Header - Matching Image */}
        <header className="px-12 py-8 flex items-center justify-between bg-white/50 backdrop-blur-xl border-b border-white/20">
          <div className="flex items-center gap-3">
             <span className="text-2xl font-black text-[#1a5d2e] tracking-tighter italic">KiranaQuick</span>
             <span className="bg-[#e3f2e3] text-[#1a5d2e] text-[9px] px-3 py-1 rounded-md font-black uppercase tracking-widest border border-emerald-100">PARTNER</span>
          </div>

          <div className="flex-1 max-w-xl mx-20">
             <div className="relative group">
                <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#1a5d2e] transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search orders..." 
                  className="w-full bg-white/80 border border-slate-100 px-14 py-4 rounded-3xl text-[12px] font-bold outline-none focus:ring-4 focus:ring-[#1a5d2e]/10 transition-all shadow-sm"
                />
             </div>
          </div>

          <div className="flex items-center gap-6">
             <button className="p-3 bg-white rounded-2xl text-slate-400 hover:text-[#1a5d2e] transition-all shadow-sm border border-slate-50 relative">
                <Bell size={20} />
                <div className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>
             </button>
             <button className="p-3 bg-white rounded-2xl text-slate-400 hover:text-[#1a5d2e] transition-all shadow-sm border border-slate-50">
                <Settings size={20} />
             </button>
          </div>
        </header>

        {/* Scrollable View Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-12 lg:p-14 space-y-12">
          
          {/* Dashboard Intro */}
          <section className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
             <div className="space-y-1">
                <h2 className="text-[48px] font-black text-slate-900 tracking-tighter leading-tight italic">Available Orders</h2>
                <div className="flex items-center gap-3 text-[12px] font-bold text-slate-400 italic font-medium">
                  Current active demand in <span className="text-slate-900 font-black">HSR Layout, Bangalore</span>. Real-time updates active.
                </div>
             </div>
             <div className="bg-[#e3f2e3] px-6 py-3 rounded-full border border-emerald-100 flex items-center gap-3 shadow-sm">
                <Zap size={16} className="text-[#1a5d2e] fill-[#1a5d2e]" />
                <span className="text-[10px] font-black uppercase tracking-[3px] text-[#1a5d2e] italic">Demand: High</span>
             </div>
          </section>

          {/* Filter Bar */}
          <section className="flex flex-wrap gap-4">
             {filters.map((f) => (
                <button key={f.name} className="px-6 py-4 bg-white border border-slate-100 rounded-3xl flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:border-[#1a5d2e] hover:text-[#1a5d2e] transition-all shadow-sm italic group">
                   <f.icon size={16} className="group-hover:scale-110 transition-transform" />
                   {f.name}
                </button>
             ))}
          </section>

          {/* Order Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
             {availableTasks.length > 0 ? (
                availableTasks.map((task) => (
                  <div key={task._id} className="bg-white p-10 rounded-[44px] shadow-sm border border-slate-50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group flex flex-col justify-between min-h-[460px]">
                     <div className="space-y-10">
                        <div className="flex items-start justify-between">
                           <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-[#1a5d2e] rounded-xl border border-emerald-100">
                              <Zap size={12} className="fill-[#1a5d2e]" />
                              <span className="text-[9px] font-black uppercase tracking-widest italic">Express</span>
                           </div>
                           <div className="text-right">
                              <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1 italic">Est. Earning</p>
                              <p className="text-3xl font-black text-slate-900 tracking-tighter italic">₹{getEarning(task.totalAmount)}.00</p>
                           </div>
                        </div>

                        <div className="relative space-y-10 pl-4 before:content-[''] before:absolute before:left-[21px] before:top-4 before:bottom-4 before:w-[2px] before:border-l-2 before:border-dashed before:border-slate-100">
                           <div className="flex items-center gap-6 relative z-10">
                              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border-4 border-[#f2f7f2] shadow-xl group-hover:rotate-6 transition-all text-slate-400">
                                 <Package size={24} />
                              </div>
                              <div>
                                 <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1 italic">Pickup</p>
                                 <h4 className="text-[17px] font-black text-slate-900 italic tracking-tight leading-none truncate max-w-[180px]">{task.shop?.shopName}</h4>
                              </div>
                           </div>
                           <div className="flex items-center gap-6 relative z-10">
                              <div className="w-12 h-12 bg-[#1a5d2e] rounded-2xl flex items-center justify-center border-4 border-white shadow-xl shadow-[#1a5d2e]/20">
                                 <MapPin size={24} className="text-white" />
                              </div>
                              <div>
                                 <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1 italic">Drop-off</p>
                                 <h4 className="text-[17px] font-black text-slate-900 italic tracking-tight leading-none truncate max-w-[180px]">{task.deliveryAddress?.slice(0, 20)}...</h4>
                              </div>
                           </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 bg-[#f8faf8] p-5 rounded-[32px] border border-slate-50">
                           <div>
                              <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest italic mb-1">Distance</p>
                              <p className="text-sm font-black text-slate-900 flex items-center gap-2 italic">1.2 km</p>
                           </div>
                           <div>
                              <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest italic mb-1">Items</p>
                              <p className="text-sm font-black text-slate-900 flex items-center gap-2 italic">{task.items?.length} Units</p>
                           </div>
                        </div>
                     </div>

                     <button 
                       onClick={() => handleAcceptTask(task._id)}
                       className="w-full mt-10 py-6 bg-[#1a2b1f] text-white rounded-[32px] font-black text-[11px] uppercase tracking-[4px] italic flex items-center justify-center gap-3 shadow-xl group-hover:bg-[#1a5d2e] active:scale-95 transition-all"
                     >
                        Accept Express Task <ArrowRight size={18} />
                     </button>
                  </div>
                ))
             ) : (
                <div className="col-span-full py-20 text-center space-y-6">
                   <div className="text-[200px] font-black text-slate-200/20 italic absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none tracking-tighter">KQ</div>
                   <Package size={64} className="mx-auto text-slate-200" />
                   <p className="text-slate-400 font-black italic uppercase tracking-[5px] text-sm">Searching for new orders...</p>
                   <button 
                    onClick={() => window.location.reload()}
                    className="px-10 py-4 bg-white border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest italic hover:bg-slate-50 transition-all shadow-sm"
                   >
                    Refresh Feed
                   </button>
                </div>
             )}
          </section>

          {/* Banner Section - Rain Surge */}
          <section className="bg-[#0f2d1a] p-12 lg:p-14 rounded-[64px] relative overflow-hidden text-white group cursor-default">
             {/* Abstract Clouds/Rain using lucide icons and containers */}
             <div className="absolute right-20 top-0 bottom-0 flex items-center gap-10 opacity-10 group-hover:opacity-20 transition-all duration-1000 rotate-12">
                <CloudRain size={120} strokeWidth={1}/>
                <CloudRain size={180} strokeWidth={1} className="mt-20 translate-x-12"/>
                <CloudRain size={120} strokeWidth={1} className="-mt-12"/>
             </div>

             <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                <div className="space-y-8 max-w-xl text-center lg:text-left">
                   <h3 className="text-4xl md:text-5xl font-black italic tracking-tighter leading-[0.9]">Rain Surge: <span className="text-emerald-400 underline decoration-white/20 underline-offset-8">1.5x Earnings</span> Active</h3>
                   <p className="text-[14px] font-bold leading-relaxed text-white/60 italic lg:pr-12">It's raining in your zone. Complete 5 more tasks before 10 PM to unlock a bonus of <span className="text-white font-black text-lg mx-1 tracking-tight italic">₹250</span> on top of your surge earnings.</p>
                   
                   <div className="space-y-4">
                      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[3px] italic px-1">
                         <span>Bonus Progress</span>
                         <span className="text-emerald-400">3/5 Tasks</span>
                      </div>
                      <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden shadow-inner border border-white/5">
                         <div className="h-full bg-white transition-all duration-1000 shadow-[0_0_15px_white]" style={{ width: '60%' }}></div>
                      </div>
                   </div>
                </div>

                <div className="bg-white/95 backdrop-blur-md p-10 rounded-[56px] shadow-2xl flex flex-col items-center justify-center text-center space-y-4 border border-white/20 min-w-[320px] hover:scale-105 transition-transform">
                    <div className="w-16 h-16 bg-[#e3f2e3] rounded-3xl flex items-center justify-center text-[#1a5d2e] shadow-inner mb-4">
                       <Headphones size={32} />
                    </div>
                    <h5 className="text-[12px] font-black text-slate-900 uppercase tracking-[4px] italic">SUPPORT ONLINE</h5>
                    <p className="text-[10px] font-bold text-slate-400 italic">Help is a tap away</p>
                    <button className="text-[11px] font-black text-[#1a5d2e] uppercase tracking-[3px] pt-4 italic border-t border-slate-100 w-full mt-4 hover:underline">Chat with Support</button>
                </div>
             </div>
          </section>

        </div>
      </main>

      {/* Floating Active Task Summary (Hidden if no active task) */}
      {activeTask && (
        <div className="fixed bottom-12 right-12 bg-[#1a5d2e] text-white p-8 rounded-[40px] shadow-[0_30px_60px_-15px_rgba(26,93,46,0.5)] z-[200] flex items-center gap-10 border-4 border-white animate-in zoom-in slide-in-from-bottom-12 duration-700">
           <div className="space-y-1">
              <p className="text-[8px] font-black text-white/50 uppercase tracking-[3px] italic">CURRENT ACTIVE TASK</p>
              <h5 className="text-xl font-black italic tracking-tight">Order #KQ-{activeTask._id.slice(-4).toUpperCase()}</h5>
           </div>
           <button 
            onClick={() => navigate('/delivery-dashboard')}
            className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center hover:bg-white hover:text-[#1a5d2e] transition-all"
           >
              <ArrowRight size={24} />
           </button>
        </div>
      )}
    </div>
  );
}

// Headphones icon replacement or other components needed
function Headphones(props: any) {
  return (
    <svg 
      {...props}
      xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
    >
      <path d="M3 14c0-4.4 3.6-8 8-8s8 3.6 8 8v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Z"/><path d="M7 14h.01"/><path d="M17 14h.01"/>
    </svg>
  );
}


