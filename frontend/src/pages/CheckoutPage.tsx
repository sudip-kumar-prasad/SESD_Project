import { useState } from 'react';
import { ShoppingBag, MapPin, CreditCard, Wallet, Plus, Minus, Tag, ShieldCheck, Loader2, Bell, Home, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api';

export default function CheckoutPage() {
  const [promo, setPromo] = useState('');
  const [isPlacing, setIsPlacing] = useState(false);
  const { cart, totalItems, totalPrice, updateQuantity, clearCart, cartShopId } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    if (!user) {
      alert('Please login to place an order');
      navigate('/login');
      return;
    }

    if (!cartShopId) {
       alert('Invalid shop data. Please try again.');
       return;
    }

    setIsPlacing(true);
    try {
      const orderData = {
        shopId: cartShopId, 
        items: cart.map(item => ({
          productId: item._id,
          quantity: item.quantity
        })),
        deliveryAddress: "402, Green Valley Apartments, Sector 12, Kharghar, Navi Mumbai - 410210" // Example address
      };

      const res = await api.post('/orders', orderData);
      clearCart();
      navigate(`/tracking/${res.data._id}`);
    } catch (err: any) {
      console.error('Failed to place order:', err);
      alert(err.response?.data?.message || 'Order failed. Please try again.');
    } finally {
      setIsPlacing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f2f7f2] text-slate-900 pb-24 font-sans">
      {/* Header - Matching Reference Precisely */}
      <nav className="px-12 py-6 flex items-center justify-between sticky top-0 bg-[#f2f7f2]/90 backdrop-blur-xl z-[100]">
        <div className="flex items-center gap-10">
           <Link to="/" className="text-[22px] font-black text-[#1a5d2e] tracking-tight">KiranaQuick</Link>
           <div className="flex items-center gap-10 text-[12px] font-bold text-slate-500">
              <Link to="/" className="hover:text-[#1a5d2e] transition-all">Home</Link>
              <Link to="/explore" className="hover:text-[#1a5d2e] transition-all">Explore</Link>
              <span className="text-[#1a5d2e] border-b-2 border-[#1a5d2e] pb-1">Cart</span>
              <Link to="/orders" className="hover:text-[#1a5d2e] transition-all">Orders</Link>
           </div>
        </div>

        <div className="flex items-center gap-8">
           <div className="p-2 cursor-pointer hover:bg-white rounded-full transition-all">
              <Bell size={22} className="text-slate-400" />
           </div>
           <div className="w-10 h-10 rounded-full border-2 border-white shadow-lg overflow-hidden flex items-center justify-center bg-white cursor-pointer" onClick={() => navigate('/profile')}>
              <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100" className="w-full h-full object-cover" alt="User" />
           </div>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Delivery & Cart */}
          <div className="lg:col-span-8 space-y-12">
             <section>
                <div className="flex items-center justify-between mb-8 px-2">
                   <h3 className="text-2xl font-black text-slate-900 tracking-tight italic">Delivery to:</h3>
                   <button className="text-[11px] font-black text-[#1a5d2e] uppercase tracking-widest hover:underline">Change</button>
                </div>
                
                <div className="flex flex-col md:flex-row gap-8 items-center bg-white p-8 rounded-[40px] shadow-sm border border-slate-50">
                   <div className="w-56 h-36 bg-[#e3eae3] rounded-[28px] overflow-hidden relative border-4 border-white shadow-xl">
                      <img src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=400" className="w-full h-full object-cover opacity-60 grayscale contrast-125 hover:scale-110 transition-transform duration-1000" />
                      <div className="absolute inset-0 bg-emerald-500/10"></div>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                         <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-2xl">
                            <MapPin size={18} className="text-[#1a5d2e]" />
                         </div>
                      </div>
                   </div>
                   <div className="flex-1 space-y-4">
                      <div className="space-y-1">
                         <div className="flex items-center gap-2">
                            <Home size={18} className="text-[#1a5d2e]" />
                            <span className="text-lg font-black italic">Home</span>
                         </div>
                         <p className="text-[12px] text-slate-400 font-bold leading-relaxed max-w-sm">402, Green Valley Apartments, Sector 12, Kharghar, Navi Mumbai - 410210</p>
                      </div>
                      <div className="inline-flex items-center gap-2 px-6 py-2 bg-[#d7ecd7] text-[#1a5d2e] text-[10px] font-black rounded-full border border-white/50 uppercase tracking-widest italic">
                         <div className="w-1.5 h-1.5 bg-[#1a5d2e] rounded-full animate-pulse"></div>
                         Delivery in 12 mins
                      </div>
                   </div>
                </div>
             </section>

             <section>
                <div className="flex items-center justify-between mb-8 px-2">
                   <h3 className="text-2xl font-black text-slate-900 tracking-tight italic">Your Cart ({totalItems} items)</h3>
                   <span className="text-[11px] text-slate-400 font-bold italic uppercase tracking-widest">Subtotal: ₹{totalPrice.toFixed(2)}</span>
                </div>

                <div className="space-y-4">
                   {cart.length > 0 ? cart.map((item, idx) => (
                      <div key={idx} className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-50 flex items-center justify-between group hover:shadow-xl transition-all">
                         <div className="flex items-center gap-8">
                            <div className="w-24 h-24 bg-[#f8faf8] rounded-[24px] flex items-center justify-center p-5 border border-slate-50 transition-all">
                               <img src={item.imageUrl} className="max-h-full drop-shadow-2xl group-hover:scale-110 transition-transform duration-500" alt={item.name} />
                            </div>
                            <div className="space-y-1">
                               <h4 className="font-black text-slate-950 text-lg tracking-tight">{item.name}</h4>
                               <p className="text-[11px] text-slate-400 font-bold mb-2 uppercase opacity-60">{item.unit || item.vol || 'Pcs'}</p>
                               <div className="text-[20px] font-black text-[#1a5d2e] tracking-tighter italic">₹{item.price.toFixed(2)}</div>
                            </div>
                         </div>
                         
                         <div className="flex items-center gap-5 bg-[#e3eae3] p-2.5 px-6 rounded-full border border-white shadow-sm transition-all group-hover:-translate-x-2">
                            <button onClick={() => updateQuantity(item._id, -1)} className="text-slate-500 hover:text-[#1a5d2e] p-1"><Minus size={16} strokeWidth={3}/></button>
                            <span className="text-sm font-black text-slate-950 min-w-[20px] text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item._id, 1)} className="bg-[#1a5d2e] text-white p-1 rounded-md shadow-lg"><Plus size={16} strokeWidth={3}/></button>
                         </div>
                      </div>
                   )) : (
                      <div className="py-24 text-center space-y-6 bg-white rounded-[48px] border border-dashed border-slate-200">
                         <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
                            <ShoppingBag size={48} />
                         </div>
                         <div className="space-y-2">
                           <p className="text-slate-950 font-black italic text-lg tracking-tight">Your basket is feeling light...</p>
                           <p className="text-slate-400 text-sm font-medium">Add some fresh essentials to your cart.</p>
                         </div>
                         <Link to="/" className="inline-block bg-[#1a5d2e] text-white font-black text-[12px] uppercase tracking-[3px] px-10 py-5 rounded-2xl hover:bg-[#123e1e] transition-all shadow-xl shadow-[#1a5d2e]/20">Go Shopping</Link>
                      </div>
                   )}
                </div>
             </section>
          </div>

          {/* Right Column: Payment & Bill */}
          <div className="lg:col-span-4 space-y-10">
             <section className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-50">
                <div className="relative">
                   <Tag className="absolute left-6 top-1/2 -translate-y-1/2 text-[#cc5500]" size={20} />
                   <input 
                     type="text" 
                     placeholder="Enter Promo Code" 
                     value={promo}
                     onChange={(e) => setPromo(e.target.value)}
                     className="w-full bg-[#f2f7f2] border-none rounded-2xl py-5 pl-14 pr-24 outline-none focus:bg-white focus:ring-2 focus:ring-[#1a5d2e]/10 transition-all font-bold text-[13px] placeholder:text-slate-300" 
                   />
                   <button className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-black text-[#cc5500] uppercase tracking-widest px-6 py-2.5 hover:bg-orange-50 rounded-xl transition-all">Apply</button>
                </div>
             </section>

             <section className="bg-white p-10 rounded-[48px] shadow-sm border border-slate-50">
                <h3 className="text-xl font-black text-slate-900 tracking-tight italic mb-10">Payment Method</h3>
                <div className="space-y-3">
                   {[
                     { id: 'upi', label: 'UPI (GPay, PhonePe)', icon: CreditCard, active: true },
                     { id: 'card', label: 'Credit / Debit Card', icon: ShoppingBag, active: false },
                     { id: 'cod', label: 'Cash on Delivery', icon: Wallet, active: false }
                   ].map(method => (
                     <div key={method.id} className={`p-6 rounded-3xl border-2 flex items-center justify-between cursor-pointer transition-all ${method.active ? 'border-[#1a5d2e] bg-[#f2f7f2]/50' : 'border-slate-50 hover:bg-slate-50/50'}`}>
                        <div className="flex items-center gap-5">
                           <method.icon size={20} className={method.active ? 'text-[#1a5d2e]' : 'text-slate-300'} />
                           <span className={`text-[12px] font-bold ${method.active ? 'text-slate-900' : 'text-slate-500'}`}>{method.label}</span>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${method.active ? 'border-[#1a5d2e]' : 'border-slate-200'}`}>
                           {method.active && <div className="w-3 h-3 bg-[#1a5d2e] rounded-full"></div>}
                        </div>
                     </div>
                   ))}
                </div>
             </section>

             <section className="bg-[#e3f2e3] p-10 rounded-[48px] shadow-xl shadow-[#1a5d2e]/5 border border-white/50">
                <h3 className="text-xl font-black text-slate-900 tracking-tight italic mb-10">Bill Details</h3>
                <div className="space-y-5 text-[11px] font-bold uppercase tracking-widest text-slate-500">
                   <div className="flex justify-between"><span>Item Total</span><span className="text-slate-950 font-black">₹{totalPrice.toFixed(2)}</span></div>
                   <div className="flex justify-between"><span>Delivery Fee</span><span className="text-[#1a5d2e] font-black">FREE</span></div>
                   <div className="flex justify-between pb-8"><span>Handling Charge</span><span className="text-slate-950 font-black">₹5.00</span></div>
                   
                   <div className="pt-8 border-t border-[#1a5d2e]/10 flex justify-between items-baseline">
                      <span className="text-slate-950 font-black text-sm">Total Pay</span>
                      <span className="text-[36px] font-black text-slate-950 tracking-tighter italic">₹{(totalPrice > 0 ? totalPrice + 5 : 0).toFixed(2)}</span>
                   </div>
                </div>
                
                <button 
                 onClick={handlePlaceOrder}
                 disabled={isPlacing || cart.length === 0}
                 className="w-full mt-12 p-6 bg-[#1a5d2e] text-white rounded-[32px] font-black text-[13px] uppercase tracking-[4px] shadow-2xl shadow-[#1a5d2e]/30 text-center hover:bg-[#123e1e] active:scale-95 transition-all flex items-center justify-center gap-4 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                   {isPlacing ? <Loader2 className="animate-spin" size={24} /> : (
                     <div className="flex items-center gap-4">
                        Place Order 
                        <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                     </div>
                   )}
                </button>
                
                <div className="mt-10 flex flex-col items-center gap-2 text-[9px] text-slate-400 font-bold uppercase tracking-[2px] opacity-60">
                   <div className="flex items-center gap-2">
                      <ShieldCheck size={16} className="text-[#1a5d2e]" /> Secure checkout powered by KiranaQuick Pay
                   </div>
                </div>
             </section>
          </div>
        </div>
      </main>
    </div>
  );
}
