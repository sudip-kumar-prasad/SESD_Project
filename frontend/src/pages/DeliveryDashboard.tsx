import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Navigation, CheckCircle, Wallet, Filter, 
  Bell, Headphones, 
  TrendingUp, Zap, Store, Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function DeliveryDashboard() {
  useAuth();
  useNavigate();
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [availableTasks, setAvailableTasks] = useState<any[]>([]);
  const [activeTask, setActiveTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
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

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      await api.put(`/orders/${orderId}/delivery-status`, { status });
      if (status === 'DELIVERED') {
        setActiveTask(null);
      } else {
        const activeRes = await api.get('/orders/active-delivery');
        setActiveTask(activeRes.data);
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#f2f7f2]"><Loader2 className="animate-spin text-[#1a5d2e]" size={48} /></div>;


  return (
    <div className="min-h-screen bg-[#f2f7f2] text-slate-900 font-sans selection:bg-[#1a5d2e] selection:text-white">
      {/* Precision Header */}
      <nav className="bg-white/80 backdrop-blur-md px-12 py-5 flex items-center justify-between sticky top-0 z-[100] border-b border-[#e9eee9]">
        <div className="flex items-center gap-4">
           <h1 className="text-[20px] font-black text-[#1a5d2e] tracking-tighter italic">KiranaQuick <span className="bg-[#e3f2e3] text-[#1a5d2e] text-[9px] px-3 py-1 rounded-md uppercase font-black not-italic ml-2 tracking-widest border border-white">Partner</span></h1>
        </div>

        <div className="flex items-center gap-14">
           <div className="flex items-center gap-10 text-[12px] font-black uppercase tracking-[3px] text-slate-400 italic">
              <span 
                className={`cursor-pointer transition-all ${activeTab === 'Dashboard' ? 'text-[#1a5d2e] border-b-2 border-[#1a5d2e] pb-1' : 'hover:text-slate-900'}`}
                onClick={() => setActiveTab('Dashboard')}
              >
                Dashboard
              </span>
              <span className="hover:text-slate-900 cursor-pointer">History</span>
              <span className="hover:text-slate-900 cursor-pointer">Earnings</span>
           </div>
           
           <div className="flex items-center gap-6">
              <div className="p-2.5 bg-[#f8faf8] rounded-2xl text-slate-400 cursor-pointer hover:bg-white hover:shadow-lg transition-all border border-slate-50 relative">
                 <Bell size={20} />
                 <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex items-center gap-4 p-2 pl-2 pr-4 bg-[#f8faf8] rounded-full border border-slate-50 group hover:bg-white transition-all cursor-pointer">
                 <img src="https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=100" className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm" />
                 <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
              </div>
           </div>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto p-12 lg:p-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
           
           {/* Left Section: Active Session */}
           <div className="lg:col-span-8 space-y-12 animate-in fade-in slide-in-from-left-6 duration-700">
              <section className="bg-white p-12 rounded-[56px] shadow-sm border border-[#f0f4f0] relative overflow-hidden flex flex-col justify-between min-h-[540px]">
                 <div className="absolute top-0 right-0 w-80 h-80 bg-[#1a5d2e]/5 -mr-20 -mt-20 rounded-full blur-3xl"></div>
                 
                 <div className="relative z-10">
                    <div className="flex items-center justify-between mb-12 px-4">
                       <h2 className="text-[34px] font-black text-slate-950 italic tracking-tighter leading-none">Active Session</h2>
                       <div className="bg-[#e3f2e3] text-[#1a5d2e] text-[10px] font-black px-5 py-2.5 rounded-full border border-white uppercase tracking-[4px] italic flex items-center gap-3 shadow-sm">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]"></div>
                          ONLINE
                       </div>
                    </div>

                     <div className="p-10 bg-[#f8faf8] rounded-[48px] border border-[#f0f4f0] shadow-inner group hover:bg-white hover:shadow-xl transition-all duration-500">
                        {activeTask ? (
                           <>
                              <div className="flex items-start justify-between mb-12">
                                 <div>
                                    <div className="text-[11px] font-black text-orange-500 uppercase tracking-[3px] mb-3 italic opacity-80">CURRENT TASK</div>
                                    <h3 className="text-[38px] font-black text-slate-950 italic tracking-tighter leading-none">Order #KQ-{activeTask._id.slice(-4).toUpperCase()}</h3>
                                 </div>
                                 <div className="text-right">
                                    <div className="text-[38px] font-black text-[#1a5d2e] tracking-tighter leading-none italic">₹{activeTask.totalAmount.toLocaleString()}</div>
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-[3px] italic mt-3 opacity-60">TOTAL VALUE</div>
                                 </div>
                              </div>

                              <div className="space-y-10 relative px-4">
                                 <div className="absolute left-[30px] top-4 bottom-4 w-0.5 border-l-2 border-dashed border-slate-200"></div>
                                 
                                 <div className="flex items-center justify-between relative">
                                    <div className="flex items-center gap-8">
                                       <div className="w-4 h-4 bg-emerald-500 rounded-full border-[3px] border-white shadow-[0_0_12px_rgba(16,185,129,0.3)] z-10"></div>
                                       <div>
                                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-[3px] italic mb-1.5 opacity-60 leading-none">PICKUP</div>
                                          <div className="text-xl font-black text-slate-950 italic tracking-tight leading-none">{activeTask.shop?.shopName}</div>
                                       </div>
                                    </div>
                                 </div>

                                 <div className="flex items-center justify-between relative">
                                    <div className="flex items-center gap-8">
                                       <div className="w-4 h-4 bg-orange-500 rounded-full border-[3px] border-white shadow-[0_0_12px_rgba(249,115,22,0.3)] z-10"></div>
                                       <div>
                                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-[3px] italic mb-1.5 opacity-60 leading-none">DROP</div>
                                          <div className="text-xl font-black text-slate-950 italic tracking-tight leading-none truncate max-w-[300px]">{activeTask.customer?.address || activeTask.deliveryAddress}</div>
                                       </div>
                                    </div>
                                 </div>
                              </div>

                              <div className="flex gap-8 mt-12 px-2 relative z-10">
                                 <button className="flex-1 p-6 bg-[#f8faf8] text-slate-950 border border-slate-100 rounded-[32px] font-black text-[13px] uppercase tracking-[4px] italic flex items-center justify-center gap-4 hover:bg-white hover:shadow-2xl transition-all active:scale-[0.98] group overflow-hidden">
                                    <Navigation size={22} className="rotate-45 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> 
                                    Navigate
                                 </button>
                                 <button 
                                    onClick={() => handleUpdateStatus(activeTask._id, activeTask.status === 'ACCEPTED' ? 'PICKED_UP' : 'DELIVERED')}
                                    className="flex-1 p-6 bg-[#1a5d2e] text-white rounded-[32px] font-black text-[13px] uppercase tracking-[4px] italic flex items-center justify-center gap-4 shadow-2xl shadow-[#1a5d2e]/20 hover:bg-[#123e1e] active:scale-[0.98] transition-all group overflow-hidden"
                                 >
                                    <CheckCircle size={22} className="group-hover:scale-110 transition-transform" /> 
                                    {activeTask.status === 'ACCEPTED' ? 'Confirm Pickup' : 'Mark Delivered'}
                                 </button>
                              </div>
                           </>
                        ) : (
                           <div className="py-20 text-center space-y-4">
                              <Zap className="mx-auto text-slate-200" size={48} />
                              <p className="text-slate-400 font-black italic uppercase tracking-widest leading-none">No active task. Accept one from the sidebar.</p>
                           </div>
                        )}
                     </div>
                  </div>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                 <section className="bg-white p-12 rounded-[56px] shadow-sm border border-[#f0f4f0] group hover:shadow-2xl transition-all duration-500 cursor-pointer">
                    <div className="w-16 h-16 bg-[#f8faf8] text-slate-300 rounded-[28px] flex items-center justify-center mb-10 shadow-inner group-hover:bg-[#e3f2e3] group-hover:text-[#1a5d2e] transition-all border border-[#f0f4f0]">
                       <Wallet size={32} />
                    </div>
                    <div className="text-[52px] font-black text-slate-950 tracking-tighter italic leading-none">₹1,240</div>
                    <div className="text-[11px] text-slate-400 font-black uppercase tracking-[4px] mt-6 italic opacity-60">TODAY'S TOTAL</div>
                 </section>
                 
                 <section className="bg-[#e3f2e3] p-12 rounded-[56px] shadow-sm border border-white group hover:shadow-2xl transition-all duration-500 h-[280px] flex flex-col justify-between cursor-pointer">
                    <div className="flex items-center justify-between">
                       <div className="w-16 h-16 bg-white/60 backdrop-blur-md text-[#1a5d2e] rounded-[28px] flex items-center justify-center shadow-sm group-hover:rotate-12 transition-transform">
                          <TrendingUp size={32} />
                       </div>
                       <div className="bg-[#1a5d2e] text-white text-[10px] font-black px-4 py-2 rounded-xl italic shadow-xl shadow-[#1a5d2e]/20 tracking-widest">98% Score</div>
                    </div>
                    <div>
                       <div className="text-[52px] font-black text-slate-950 tracking-tighter italic leading-none">12</div>
                       <div className="text-[11px] text-slate-400 font-black uppercase tracking-[4px] mt-6 italic opacity-60">DELIVERIES</div>
                    </div>
                 </section>
              </div>
           </div>

           {/* Right Section: Tasks & Goal Dashboard */}
           <div className="lg:col-span-4 space-y-12 animate-in fade-in slide-in-from-right-6 duration-700">
               <section className="bg-white p-12 rounded-[56px] shadow-sm border border-[#f0f4f0] space-y-10">
                  <div className="flex items-center justify-between px-4">
                     <h3 className="text-[26px] font-black text-slate-950 italic tracking-tighter leading-none">Available Tasks ({availableTasks.length})</h3>
                     <button className="w-12 h-12 bg-white rounded-2xl border border-[#f0f4f0] flex items-center justify-center text-slate-400 hover:text-[#1a5d2e] transition-all shadow-sm hover:rotate-6">
                        <Filter size={20}/>
                     </button>
                  </div>

                  <div className="space-y-5">
                    {availableTasks.map((task) => (
                      <div key={task._id} onClick={() => handleAcceptTask(task._id)} className="bg-white p-7 rounded-[40px] border border-[#f0f4f0] shadow-sm flex items-center justify-between group hover:shadow-2xl transition-all cursor-pointer hover:-translate-x-1 duration-500">
                         <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-[#f8faf8] flex items-center justify-center rounded-[24px] border border-[#f0f4f0] group-hover:bg-[#e3f2e3] transition-colors text-2xl shadow-inner">
                               <Store className="text-[#1a5d2e]" size={28} />
                            </div>
                            <div>
                               <h4 className="font-black text-slate-950 italic text-[15px] tracking-tight leading-none">{task.shop?.shopName}</h4>
                               <div className="flex gap-4 mt-3">
                                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[2px] italic leading-none flex items-center gap-2">📍 {task.shop?.address?.slice(0, 15)}...</p>
                                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[2px] italic leading-none flex items-center gap-2">🏁 Pay: ₹45</p>
                               </div>
                            </div>
                         </div>
                         <div className="text-[20px] font-black text-[#1a5d2e] tracking-tighter italic">Accept</div>
                      </div>
                    ))}
                    {availableTasks.length === 0 && <div className="py-10 text-center text-slate-300 font-black italic uppercase tracking-widest">Searching for tasks...</div>}
                  </div>
               </section>

              {/* Weekly Summary - High Fidelity Match */}
              <section className="bg-[#8b4513] p-12 rounded-[56px] shadow-[0_32px_64px_rgba(139,69,19,0.15)] relative overflow-hidden text-white group cursor-pointer active:scale-[0.98] transition-all h-[280px] flex flex-col justify-between">
                 <div className="absolute top-0 right-0 w-44 h-44 bg-white/10 -mr-16 -mt-16 rounded-full blur-3xl group-hover:bg-white/20 transition-all"></div>
                 <div className="absolute bottom-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform">
                    <TrendingUp size={120} strokeWidth={3} />
                 </div>
                 
                 <div className="relative z-10">
                    <div className="text-[10px] font-black uppercase tracking-[5px] text-white/50 mb-10 italic leading-none">WEEKLY SUMMARY</div>
                    <div className="text-[44px] font-black italic tracking-tighter leading-none">₹8,450.00</div>
                 </div>

                 <div className="relative z-10 space-y-4">
                    <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden shadow-inner">
                       <div className="h-full bg-white transition-all duration-1000 shadow-[0_0_15px_white]" style={{ width: '84.5%' }}></div>
                    </div>
                    <p className="text-[11px] text-white/70 font-black italic tracking-widest uppercase leading-none px-1">
                       ₹1,550 more to reach Weekly Goal
                    </p>
                 </div>
              </section>

              {/* Live Map Pip - Rounded Precision */}
              <div className="relative flex items-center justify-center pt-8">
                 <div className="w-[300px] h-[300px] rounded-full border-[10px] border-white shadow-[0_40px_80px_rgba(0,0,0,0.1)] overflow-hidden relative group cursor-pointer">
                    {/* Mock Map Illustative Background */}
                    <div className="absolute inset-0 bg-[#e3f2e3]">
                       <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 gap-4 p-8 opacity-20">
                          {[...Array(16)].map((_, i) => <div key={i} className="border-2 border-[#1a5d2e] rounded-full bg-white"></div>)}
                       </div>
                       <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-[180px] h-[180px] bg-[#1a5d2e]/10 rounded-full border-[40px] border-[#1a5d2e]/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-[3s]">
                             <Home className="text-[#1a5d2e] animate-bounce-slow" size={64} fill="currentColor" opacity="0.3" />
                          </div>
                       </div>
                    </div>
                    
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                       <div className="bg-white/95 backdrop-blur-md px-10 py-4 rounded-[28px] shadow-2xl border border-white group-hover:scale-105 transition-all">
                          <div className="text-[12px] font-black text-[#1a5d2e] uppercase tracking-[4px] leading-none mb-2 italic">LIVE MAP</div>
                          <div className="text-[9px] font-black italic text-slate-400 uppercase tracking-widest opacity-60 leading-none">DELIVERY AREA: HSR SEC-7</div>
                          <div className="text-[10px] font-black text-slate-950 uppercase tracking-[3px] mt-4 leading-none decoration-emerald-500 underline underline-offset-4">Safe Site Work</div>
                       </div>
                    </div>
                    
                    <div className="absolute bottom-10 right-10 w-14 h-14 bg-[#ff6b21] rounded-full flex items-center justify-center text-white shadow-2xl shadow-orange-950/40 hover:scale-110 active:scale-95 transition-all cursor-pointer">
                       <Headphones size={24} strokeWidth={2.5} />
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}

// Simple Home icon for the map marker
function Home(props: any) {
  return (
    <svg 
      {...props}
      xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  );
}


