import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutGrid, Navigation, PieChart, Activity, 
  Settings, Bell, Search, LogOut, HelpCircle,
  Zap, Package, MapPin, Clock, ArrowRight,
  TrendingUp, CloudRain, CheckCircle2, Headphones
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

  const getEarning = (amount: number) => Math.floor(amount * 0.15 + 30);

  // Helper to render the Earnings & Analytics view
  const renderEarningsView = () => (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-700">
      {/* Stats Cards Row */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-10 rounded-[44px] shadow-sm border border-slate-50 group hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#1a5d2e]/5 -mr-10 -mt-10 rounded-full blur-3xl"></div>
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4 italic">Total Earnings</p>
          <h3 className="text-[44px] font-black text-slate-900 tracking-tighter leading-tight italic">₹42,850.00</h3>
          <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black italic">
            <TrendingUp size={12} /> +12.5% this month
          </div>
        </div>

        <div className="bg-white p-10 rounded-[44px] shadow-sm border border-slate-50 group hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4 italic">Deliveries Completed</p>
          <h3 className="text-[44px] font-black text-slate-900 tracking-tighter leading-tight italic">1,284</h3>
          <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 text-slate-400 rounded-xl text-[10px] font-black italic">
            <CheckCircle2 size={12} /> 99.2% success rate
          </div>
        </div>

        <div className="bg-white p-10 rounded-[44px] shadow-sm border border-slate-50 group hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4 italic">Customer Rating</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-[44px] font-black text-slate-900 tracking-tighter leading-tight italic">4.92</h3>
            <span className="text-xl font-black text-slate-300">/5</span>
          </div>
          <div className="mt-6 flex items-center gap-1">
            {[...Array(5)].map((_, i) => <Zap key={i} size={12} className="fill-[#1a5d2e] text-[#1a5d2e]" />)}
            <span className="ml-2 text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Top Partner</span>
          </div>
        </div>
      </section>

      {/* Middle Row: Weekly Chart & Performance */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white p-12 rounded-[56px] shadow-sm border border-slate-50 flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h4 className="text-2xl font-black text-slate-900 italic tracking-tight">Weekly Earnings</h4>
              <p className="text-[10px] text-slate-400 font-bold italic tracking-widest uppercase mt-1">Oct 16 - Oct 22, 2023</p>
            </div>
            <select className="bg-[#f8faf8] border-none text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-2xl outline-none cursor-pointer">
              <option>Last 7 Days</option>
            </select>
          </div>
          
          <div className="flex-1 flex items-end justify-between px-4 pb-4 gap-4 min-h-[220px]">
             {[40, 65, 45, 80, 55, 95, 70].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-4 group cursor-pointer">
                   <div 
                    className={`w-full rounded-2xl transition-all duration-700 ${i === 5 ? 'bg-[#1a5d2e] shadow-xl shadow-[#1a5d2e]/30 scale-110' : 'bg-[#eef5ee] group-hover:bg-[#d5e8d5]'}`}
                    style={{ height: `${h}%` }}
                   ></div>
                   <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'][i]}</span>
                </div>
             ))}
          </div>
        </div>

        <div className="lg:col-span-4 bg-[#0f2d1a] p-12 rounded-[56px] text-white space-y-10 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 -mr-16 -mt-16 rounded-full blur-3xl"></div>
          <div className="space-y-4 relative z-10">
             <div className="flex items-center gap-3">
                <Zap size={16} className="text-emerald-400 fill-emerald-400" />
                <span className="text-[9px] font-black uppercase tracking-[4px] italic text-emerald-400">EFFICIENCY INDEX</span>
             </div>
             <h4 className="text-3xl font-black italic tracking-tighter leading-tight">Performance Boost</h4>
             <p className="text-[11px] font-medium leading-relaxed text-white/50 italic pr-4">Your delivery speed is 14% faster than the district average.</p>
          </div>
          <div className="space-y-4 relative z-10">
             <div className="flex justify-between text-[9px] font-black uppercase tracking-[2px] italic px-1">
                <span>Monthly Goal (₹50k)</span>
                <span>85%</span>
             </div>
             <div className="h-2 bg-white/10 rounded-full overflow-hidden border border-white/5 shadow-inner">
                <div className="h-full bg-emerald-400 shadow-[0_0_12px_#34d399]" style={{ width: '85%' }}></div>
             </div>
          </div>
          <div className="grid grid-cols-2 gap-4 relative z-10 pt-4">
             <div className="space-y-1 text-center border-r border-white/10">
                <p className="text-xl font-black italic tracking-tight leading-none">24m</p>
                <p className="text-[8px] font-black uppercase tracking-[2px] text-white/30 italic">AVG. TIME</p>
             </div>
             <div className="space-y-1 text-center">
                <p className="text-xl font-black italic tracking-tight leading-none">98%</p>
                <p className="text-[8px] font-black uppercase tracking-[2px] text-white/30 italic">ON TIME</p>
             </div>
          </div>
        </div>
      </section>

      {/* Payout History Table */}
      <section className="bg-white p-12 rounded-[56px] shadow-sm border border-slate-50 space-y-10">
         <div className="flex items-center justify-between px-4">
            <div className="space-y-1">
               <h4 className="text-2xl font-black text-slate-900 italic tracking-tight">Recent Payouts</h4>
               <p className="text-[10px] text-slate-400 font-bold italic tracking-widest uppercase">Last 5 transaction cycles</p>
            </div>
            <button className="flex items-center gap-3 px-8 py-4 bg-[#f8faf8] border border-slate-100 rounded-3xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all italic">
               <ArrowRight size={14} className="rotate-90" /> Export Statement
            </button>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full">
               <thead>
                  <tr className="text-left py-4 border-b border-slate-50">
                     <th className="pb-8 pl-4 text-[10px] font-black text-slate-300 uppercase tracking-widest italic">Payout Date</th>
                     <th className="pb-8 text-[10px] font-black text-slate-300 uppercase tracking-widest italic">Reference ID</th>
                     <th className="pb-8 text-[10px] font-black text-slate-300 uppercase tracking-widest italic">Status</th>
                     <th className="pb-8 pr-4 text-right text-[10px] font-black text-slate-300 uppercase tracking-widest italic">Amount</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {[
                    { date: 'Oct 20, 2023', ref: 'TXN_99210482', status: 'Completed', color: 'text-emerald-500 bg-emerald-50', amount: '8,420.00' },
                    { date: 'Oct 13, 2023', ref: 'TXN_99209531', status: 'Completed', color: 'text-emerald-500 bg-emerald-50', amount: '7,150.50' },
                    { date: 'Oct 06, 2023', ref: 'TXN_99208772', status: 'In Review', color: 'text-slate-400 bg-slate-50', amount: '6,880.00' },
                    { date: 'Sep 29, 2023', ref: 'TXN_99207211', status: 'Completed', color: 'text-emerald-500 bg-emerald-50', amount: '9,120.00' },
                  ].map((row, i) => (
                    <tr key={i} className="group hover:bg-[#f8faf8] transition-colors">
                       <td className="py-8 pl-4 text-sm font-black text-slate-900 italic tracking-tight">{row.date}</td>
                       <td className="py-8 text-[11px] font-bold text-slate-400 tracking-widest">{row.ref}</td>
                       <td className="py-8">
                          <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest italic ${row.color}`}>
                             {row.status}
                          </span>
                       </td>
                       <td className="py-8 pr-4 text-right text-base font-black text-slate-900 italic tracking-tight">₹{row.amount}</td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </section>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#f2f7f2] font-sans selection:bg-[#1a5d2e] selection:text-white overflow-hidden">
      
      {/* Sidebar - Consistent Theme */}
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
            <button onClick={logout} className="flex items-center gap-4 text-[11px] font-black text-white/40 uppercase tracking-widest hover:text-red-400 transition-colors italic">
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="px-12 py-8 flex items-center justify-between bg-white/50 backdrop-blur-xl border-b border-white/20">
          <div className="flex items-center gap-3">
             <span className="text-2xl font-black text-[#1a5d2e] tracking-tighter italic">KiranaQuick</span>
             <span className="bg-[#e3f2e3] text-[#1a5d2e] text-[9px] px-3 py-1 rounded-md font-black uppercase tracking-widest border border-emerald-100">PARTNER PORTAL</span>
          </div>
          <div className="flex-1 max-w-xl mx-20">
             <div className="relative group">
                <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#1a5d2e] transition-colors" />
                <input 
                  type="text" 
                  placeholder={activeTab === 'Earnings Analytics' ? "Search transactions..." : "Search orders..."}
                  className="w-full bg-white/80 border border-slate-100 px-14 py-4 rounded-3xl text-[12px] font-bold outline-none focus:ring-4 focus:ring-[#1a5d2e]/10 transition-all shadow-sm"
                />
             </div>
          </div>
          <div className="flex items-center gap-6">
             <button className="p-3 bg-white rounded-2xl text-slate-400 hover:text-[#1a5d2e] transition-all shadow-sm border border-slate-50 relative"><Bell size={20} /></button>
             <button className="p-3 bg-white rounded-2xl text-slate-400 hover:text-[#1a5d2e] transition-all shadow-sm border border-slate-50"><Settings size={20} /></button>
             <div className="flex items-center gap-4 p-1.5 px-4 bg-white rounded-2xl border border-slate-50 shadow-sm">
                <p className="text-[12px] font-black italic">{user?.name || 'Partner'}</p>
                <div className="w-8 h-8 rounded-xl bg-[#1a5d2e] text-white flex items-center justify-center text-[10px] font-black uppercase tracking-tighter">{user?.name?.slice(0, 2) || 'RM'}</div>
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto no-scrollbar p-12 lg:p-14 space-y-12">
          {activeTab === 'Available Orders' ? (
            <>
              <section className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h2 className="text-[48px] font-black text-slate-900 tracking-tighter leading-tight italic">Available Orders</h2>
                    <p className="text-[12px] font-bold text-slate-400 italic">Current active demand in <span className="text-slate-900 font-black">HSR Layout, Bangalore</span>.</p>
                </div>
                <div className="bg-[#e3f2e3] px-6 py-3 rounded-full border border-emerald-100 flex items-center gap-3 shadow-sm">
                    <Zap size={16} className="text-[#1a5d2e] fill-[#1a5d2e]" />
                    <span className="text-[10px] font-black uppercase tracking-[3px] text-[#1a5d2e] italic">Demand: High</span>
                </div>
              </section>
              <section className="flex flex-wrap gap-4">
                {filters.map((f) => (
                    <button key={f.name} className="px-6 py-4 bg-white border border-slate-100 rounded-3xl flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:border-[#1a5d2e] hover:text-[#1a5d2e] transition-all shadow-sm italic group">
                      <f.icon size={16} className="group-hover:scale-110 transition-transform" /> {f.name}
                    </button>
                ))}
              </section>
              <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {availableTasks.length > 0 ? (
                    availableTasks.map((task) => (
                      <div key={task._id} className="bg-white p-10 rounded-[44px] shadow-sm border border-slate-50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group flex flex-col justify-between min-h-[460px]">
                        <div className="space-y-10">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-[#1a5d2e] rounded-xl border border-emerald-100">
                                  <Zap size={12} className="fill-[#1a5d2e]" /> <span className="text-[9px] font-black uppercase tracking-widest italic">Express</span>
                              </div>
                              <div className="text-right">
                                  <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1 italic">Est. Earning</p>
                                  <p className="text-3xl font-black text-slate-900 tracking-tighter italic">₹{getEarning(task.totalAmount)}.00</p>
                              </div>
                            </div>
                            <div className="relative space-y-10 pl-4 before:content-[''] before:absolute before:left-[21px] before:top-4 before:bottom-4 before:w-[2px] before:border-l-2 before:border-dashed before:border-slate-100">
                              <div className="flex items-center gap-6 relative z-10">
                                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border-4 border-[#f2f7f2] shadow-xl group-hover:rotate-6 transition-all text-slate-400"><Package size={24} /></div>
                                  <div><p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1 italic">Pickup</p><h4 className="text-[17px] font-black text-slate-900 italic tracking-tight leading-none truncate max-w-[180px]">{task.shop?.shopName}</h4></div>
                              </div>
                              <div className="flex items-center gap-6 relative z-10">
                                  <div className="w-12 h-12 bg-[#1a5d2e] rounded-2xl flex items-center justify-center border-4 border-white shadow-xl shadow-[#1a5d2e]/20"><MapPin size={24} className="text-white" /></div>
                                  <div><p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1 italic">Drop-off</p><h4 className="text-[17px] font-black text-slate-900 italic tracking-tight leading-none truncate max-w-[180px]">{task.deliveryAddress?.slice(0, 20)}...</h4></div>
                              </div>
                            </div>
                        </div>
                        <button onClick={() => handleAcceptTask(task._id)} className="w-full mt-10 py-6 bg-[#1a2b1f] text-white rounded-[32px] font-black text-[11px] uppercase tracking-[4px] italic flex items-center justify-center gap-3 shadow-xl group-hover:bg-[#1a5d2e] active:scale-95 transition-all">Accept Express Task <ArrowRight size={18} /></button>
                      </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center space-y-6">
                      <Package size={64} className="mx-auto text-slate-200" />
                      <p className="text-slate-400 font-black italic uppercase tracking-[5px] text-sm">Searching for new orders...</p>
                    </div>
                )}
              </section>
            </>
          ) : activeTab === 'Earnings Analytics' ? (
            renderEarningsView()
          ) : (
            <div className="py-20 text-center text-slate-300 font-black italic uppercase tracking-widest">View under construction...</div>
          )}
        </div>
      </main>

      {activeTask && (
        <div className="fixed bottom-12 right-12 bg-[#1a5d2e] text-white p-8 rounded-[40px] shadow-[0_30px_60px_-15px_rgba(26,93,46,0.5)] z-[200] flex items-center gap-10 border-4 border-white animate-in zoom-in slide-in-from-bottom-12 duration-700">
           <div className="space-y-1">
              <p className="text-[8px] font-black text-white/50 uppercase tracking-[3px] italic">CURRENT ACTIVE TASK</p>
              <h5 className="text-xl font-black italic tracking-tight">Order #KQ-{activeTask._id.slice(-4).toUpperCase()}</h5>
           </div>
           <button onClick={() => setActiveTab('Active Deliveries')} className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center hover:bg-white hover:text-[#1a5d2e] transition-all"><ArrowRight size={24} /></button>
        </div>
      )}
    </div>
  );
}
