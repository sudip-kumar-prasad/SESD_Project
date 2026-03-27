import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, MessageSquare, Phone, Bell, Bike, CheckCircle2, 
  Package, Home, Loader2, Heart, Share2, Info, MapPin, 
  Clock, Star, Navigation
} from 'lucide-react';
import { io } from 'socket.io-client';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function LiveTracking() {
  const { id } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}`);
        setOrder(res.data);
      } catch (err) {
        console.error('Failed to fetch order tracking:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();

    // Socket Setup for Real-time Updates
    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5001');
    if (user) {
      socket.emit('join', { userId: user._id });
    }

    socket.on('order_status_update', (data) => {
      if (data.orderId === id) {
        setOrder((prev: any) => ({ ...prev, status: data.status }));
      }
    });

    socket.on('driver_assigned', (data) => {
        if (data.orderId === id) {
           fetchOrder(); // Refetch to get partner details
        }
    });

    return () => {
      socket.disconnect();
    };
  }, [id, user]);

  const steps = [
    { name: 'Ordered', icon: CheckCircle2, completed: true },
    { name: 'Packed', icon: Package, completed: ['ACCEPTED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(order?.status) },
    { name: 'On the Way', icon: Bike, active: order?.status === 'OUT_FOR_DELIVERY', completed: order?.status === 'DELIVERED' },
    { name: 'Delivered', icon: Home, active: order?.status === 'DELIVERED' }
  ];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f2f7f2]">
      <Loader2 className="animate-spin text-primary-600" size={48} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f2f7f2] text-slate-900 pb-24 font-sans overflow-x-hidden">
      {/* Header - Matching All Pages */}
      <nav className="px-12 py-6 flex items-center justify-between sticky top-0 bg-[#f2f7f2]/90 backdrop-blur-xl z-[100]">
        <div className="flex items-center gap-10">
           <button onClick={() => navigate(-1)} className="p-2 hover:bg-white rounded-full transition-all">
              <ChevronLeft size={24} className="text-[#1a5d2e]" />
           </button>
           <Link to="/" className="text-[22px] font-black text-[#1a5d2e] tracking-tight">KiranaQuick</Link>
           <div className="flex items-center gap-8 text-[12px] font-bold text-slate-500">
              <Link to="/" className="text-[#1a5d2e] border-b-2 border-[#1a5d2e] pb-1">Home</Link>
              <Link to="/explore" className="hover:text-[#1a5d2e] transition-all">Explore</Link>
              <Link to="/checkout" className="hover:text-[#1a5d2e] transition-all">Cart</Link>
           </div>
        </div>

        <div className="flex items-center gap-8">
           <div className="p-2 cursor-pointer hover:bg-white rounded-full transition-all">
              <Bell size={22} className="text-slate-400" />
           </div>
           <div className="w-10 h-10 rounded-full border-2 border-white shadow-lg overflow-hidden flex items-center justify-center bg-white">
              <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100" className="w-full h-full object-cover" alt="User" />
           </div>
        </div>
      </nav>

      <main className="max-w-[1500px] mx-auto px-12 py-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
         {/* Left Side: Order Status & Map */}
         <div className="lg:col-span-8 space-y-10">
            {/* Status Header Card */}
            <section className="bg-white p-10 rounded-[48px] shadow-sm flex items-center justify-between relative overflow-hidden border border-slate-50">
               <div className="space-y-3 relative z-10">
                  <div className="flex items-center gap-3">
                     <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></div>
                     <h2 className="text-[44px] font-black text-slate-900 tracking-tighter leading-tight italic">
                        {order?.status === 'DELIVERED' ? 'Arrived Safely' : 'Arriving in 8 mins'}
                     </h2>
                  </div>
                  <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest italic pl-1">
                     {order?.status === 'OUT_FOR_DELIVERY' ? `${order?.deliveryPartner?.name || 'Partner'} is at the store picking up your order` : 'Order processed and ready for pickup'}
                  </p>
               </div>
               <div className="bg-orange-50 text-[#ff6b00] text-[10px] font-black px-5 py-2.5 rounded-2xl border border-orange-100 uppercase tracking-widest italic decoration-orange-200 shadow-sm z-10">
                  ORDER #KQ-{id?.slice(-4).toUpperCase()}
               </div>
               
               {/* Subtle gradient accent */}
               <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-emerald-50/10 to-transparent pointer-events-none"></div>
            </section>

            {/* Stepper Card */}
            <section className="bg-white p-12 rounded-[48px] shadow-sm border border-slate-50 relative">
               <div className="relative flex items-center justify-between px-16">
                  {/* Progress Line */}
                  <div className="absolute top-1/2 left-24 right-24 h-[3px] bg-slate-100 -translate-y-1/2 z-0">
                     <div 
                        className="h-full bg-[#1a5d2e] transition-all duration-1000 shadow-[0_0_15px_#1a5d2e55]" 
                        style={{ width: order?.status === 'DELIVERED' ? '100%' : order?.status === 'OUT_FOR_DELIVERY' ? '66%' : '33%' }}
                     ></div>
                  </div>

                  {steps.map((step, idx) => (
                    <div key={idx} className="relative z-10 flex flex-col items-center gap-5">
                       <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 border-white shadow-2xl transition-all duration-500 ${
                         step.active ? 'bg-[#1a5d2e] text-white scale-125' : 
                         step.completed ? 'bg-emerald-500 text-white' : 'bg-[#f8faf8] text-slate-300'
                       }`}>
                          <step.icon size={28} strokeWidth={2.5} />
                       </div>
                       <span className={`text-[11px] font-black uppercase tracking-widest italic ${
                         step.active || step.completed ? 'text-slate-900' : 'text-slate-300'
                       }`}>
                          {step.name}
                       </span>
                    </div>
                  ))}
               </div>
            </section>

            {/* Map Card */}
            <section className="bg-white rounded-[56px] shadow-xl border border-slate-50 overflow-hidden relative h-[500px] group">
               <img src="https://images.unsplash.com/photo-1524660988544-1429dd47405b?w=1600" className="w-full h-full object-cover opacity-60 contrast-125 saturate-150 grayscale hue-rotate-90" alt="Map" />
               <div className="absolute inset-0 bg-[#1a5d2e]/5 pointer-events-none"></div>

               {/* Live Tracking Label */}
               <div className="absolute top-12 left-12 p-8 bg-white/80 backdrop-blur-xl rounded-[40px] border border-white shadow-2xl space-y-2 group-hover:-translate-y-1 transition-transform">
                  <div className="text-[10px] text-[#1a5d2e] font-black uppercase tracking-[3px] italic">LIVE TRACKING</div>
                  <div className="text-3xl font-black italic tracking-tighter text-slate-900 flex items-center gap-3">
                     Speed: 22 km/h
                     <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping"></div>
                  </div>
               </div>

               {/* Delivery Marker */}
               <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform">
                  <div className="relative p-7 bg-[#1a5d2e] rounded-full shadow-[0_20px_50px_rgba(26,93,46,0.4)] border-4 border-white animate-bounce-slow">
                     <Bike size={36} className="text-white" />
                     <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-black px-4 py-2 rounded-2xl uppercase tracking-widest shadow-2xl whitespace-nowrap">{order?.deliveryPartner?.name || 'Partner'} is here</div>
                  </div>
               </div>

               {/* Destination Marker */}
               <div className="absolute bottom-1/4 right-1/4 w-14 h-14 bg-white rounded-full border-4 border-[#ff6b00] flex items-center justify-center p-3 shadow-2xl">
                    <Home size={28} className="text-[#ff6b00]" />
               </div>
            </section>
         </div>

         {/* Right Side: Partner & Summary */}
         <div className="lg:col-span-4 space-y-10">
            {/* Delivery Partner */}
            <section className="bg-white p-10 rounded-[48px] shadow-sm border border-slate-50 group">
               <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[3px] mb-10 italic">Your Delivery Partner</h3>
               <div className="flex items-center gap-8 mb-10">
                  <div className="w-24 h-24 rounded-[36px] overflow-hidden border-4 border-white shadow-2xl rotate-[-4deg] group-hover:rotate-0 transition-all duration-700">
                     <img src="https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=400" className="w-full h-full object-cover" />
                  </div>
                  <div>
                     <h4 className="text-2xl font-black text-slate-900 italic tracking-tight mb-2">{order?.deliveryPartner?.name || 'Searching...'}</h4>
                     <div className="flex flex-col gap-2">
                        <span className="inline-flex w-fit items-center gap-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-black px-3 py-1.5 rounded-xl border border-emerald-100 shadow-sm">
                           4.9 <Star size={12} className="fill-emerald-600" />
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold italic tracking-wide">Delivered 1,200+ orders</span>
                     </div>
                  </div>
               </div>
               <div className="flex gap-4">
                  <button className="flex-1 py-5 bg-[#f8faf8] text-slate-600 rounded-3xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-100 transition-all border border-slate-100 italic">
                     <MessageSquare size={18}/> Message
                  </button>
                  <button className="flex-1 py-5 bg-[#1a5d2e] text-white rounded-3xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-[#1a5d2e]/20 hover:bg-[#123e1e] transition-all italic">
                     <Phone size={18}/> Call
                  </button>
               </div>
            </section>

            {/* Order Items */}
            <section className="bg-[#e3f2e3] p-12 rounded-[56px] shadow-sm border border-white flex flex-col min-h-[400px]">
               <div className="flex items-center justify-between mb-12">
                  <h3 className="text-[13px] font-black text-slate-950 uppercase italic tracking-[4px]">Order Items</h3>
                  <span className="text-[#1a5d2e] text-[11px] font-black uppercase tracking-widest">{order?.items?.length || 3} Items</span>
               </div>
               
               <div className="space-y-8 flex-1 overflow-y-auto no-scrollbar pr-2 mb-10">
                  {order?.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between group">
                       <div className="flex items-center gap-5">
                          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center p-3 border border-white group-hover:scale-110 transition-transform shadow-sm">
                             {item.productName?.toLowerCase().includes('milk') ? '🥛' : '🥚'}
                          </div>
                          <div>
                             <h5 className="text-[14px] font-bold text-slate-900 tracking-tight leading-tight">{item.productName}</h5>
                             <p className="text-[10px] text-slate-400 font-black uppercase tracking-[2px] mt-1">Qty: {item.quantity}</p>
                          </div>
                       </div>
                       <span className="text-[14px] font-black text-slate-950 italic tracking-tighter">₹{item.priceAtTime * item.quantity}</span>
                    </div>
                  )) || (
                    <>
                      <div className="flex items-center justify-between group">
                         <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center p-3 shadow-sm">🥚</div>
                            <div>
                               <h5 className="text-[14px] font-bold text-slate-900 tracking-tight">Farm Fresh Eggs (12 pcs)</h5>
                               <p className="text-[10px] text-slate-400 font-black uppercase tracking-[2px] mt-1">Qty: 1</p>
                            </div>
                         </div>
                         <span className="text-[14px] font-black text-slate-950 italic">₹85</span>
                      </div>
                      <div className="flex items-center justify-between group">
                         <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center p-3 shadow-sm">🥛</div>
                            <div>
                               <h5 className="text-[14px] font-bold text-slate-900 tracking-tight">Organic Milk (1L)</h5>
                               <p className="text-[10px] text-slate-400 font-black uppercase tracking-[2px] mt-1">Qty: 2</p>
                            </div>
                         </div>
                         <span className="text-[14px] font-black text-slate-950 italic">₹140</span>
                      </div>
                    </>
                  )}
               </div>

               <div className="pt-10 border-t-2 border-dashed border-[#1a5d2e]/10">
                  <div className="flex justify-between items-baseline mb-10">
                     <span className="text-[11px] font-black text-slate-400 uppercase tracking-[4px] italic">Total Paid</span>
                     <span className="text-[44px] font-black text-[#1a5d2e] tracking-tighter italic leading-none">₹{order?.totalAmount || '225'}</span>
                  </div>
                  
                  <div className="bg-white/60 backdrop-blur-md p-8 rounded-[40px] border border-white space-y-4 shadow-sm group hover:bg-white transition-all cursor-pointer">
                     <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-[20px] bg-[#ff6b00] flex items-center justify-center text-white shadow-xl shadow-orange-500/20">
                           <Info size={24} />
                        </div>
                        <div className="space-y-1">
                           <h5 className="text-[12px] font-black italic text-slate-900">Need help with this order?</h5>
                           <p className="text-[10px] text-slate-400 font-bold leading-relaxed opacity-80">Our support is available 24/7 for you.</p>
                        </div>
                     </div>
                     <button className="w-full text-[10px] font-black text-[#ff6b00] uppercase tracking-[3px] pt-2 text-left hover:underline">CONTACT SUPPORT</button>
                  </div>
               </div>
            </section>

            <button className="w-full py-6 bg-[#0a110a] text-white rounded-[40px] font-black text-[13px] uppercase tracking-[5px] shadow-2xl shadow-black/20 hover:scale-[1.03] active:scale-95 transition-all flex items-center justify-center gap-4 group">
               <Heart size={20} className="text-[#ff6b00] group-hover:scale-125 transition-transform" /> 
               Tip {order?.deliveryPartner?.name || 'Partner'}
            </button>
         </div>
      </main>

      {/* Footer Decoration */}
      <div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#1a5d2e] to-transparent opacity-10"></div>
    </div>
  );
}
