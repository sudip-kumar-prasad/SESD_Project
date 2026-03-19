import { useState, useEffect } from 'react';
import { 
  Search, MapPin, ChevronRight, ShoppingCart, Star, Clock, ChevronLeft, 
  Menu, Zap, AlertCircle, ShoppingBag, LayoutDashboard
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { useCart } from '../context/CartContext';

export default function Dashboard() {
  const [shops, setShops] = useState<any[]>([]);
  const [productList, setProductList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, totalItems } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [shopsRes, productsRes] = await Promise.all([
          api.get('/shops'),
          api.get('/products')
        ]);
        setShops(shopsRes.data);
        setProductList(productsRes.data.slice(0, 5));
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const categories = [
    { name: 'Fresh Fruits', sub: 'Picked this morning', img: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400', color: 'bg-emerald-50' },
    { name: 'Crispy Snacks', sub: 'Local favorites', img: 'https://images.unsplash.com/photo-1599490659223-e1539e7694cf?w=400', color: 'bg-orange-50' },
    { name: 'Dairy & Eggs', sub: 'Daily fresh stock', img: 'https://images.unsplash.com/photo-1550583724-1277f2bc2764?w=400', color: 'bg-blue-50' },
    { name: 'Bakery Delights', sub: 'Freshly baked in HSR', img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400', color: 'bg-yellow-50' },
    { name: 'Fresh Vegetables', sub: 'Organic & Clean', img: 'https://images.unsplash.com/photo-1566385101042-1a000c1268c4?w=400', color: 'bg-red-50' }
  ];

  const quickPicks = productList.length > 0 ? productList : [
    { name: 'Organic Whole Milk', vol: '1 Liter', price: 68, img: 'https://images.unsplash.com/photo-1550583724-1277f2bc2764?w=300', time: '15 MINS' },
    { name: 'Artisan Sourdough', vol: '400g', price: 120, img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300', time: '20 MINS' },
    { name: 'Ripe Hass Avocados', vol: '2 Pieces', price: 249, img: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=300', time: '10 MINS' },
    { name: 'Cherry Tomatoes', vol: '250g', price: 45, img: 'https://images.unsplash.com/photo-1566385101042-1a000c1268c4?w=300', time: '12 MINS' },
    { name: 'Valencia Orange Juice', vol: '500ml', price: 145, img: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=300', time: '15 MINS' }
  ];

  return (
    <div className="min-h-screen bg-[#f2f7f2] text-slate-900 pb-24">
      {/* Header - REFINED FOR CONSISTENCY */}
      <nav className="px-12 py-6 flex items-center justify-between sticky top-0 bg-[#f2f7f2]/90 backdrop-blur-xl z-[100]">
        <div className="flex items-center gap-10">
           <Link to="/" className="text-[22px] font-black text-[#1a5d2e] tracking-tight">KiranaQuick</Link>
           <div className="flex items-center gap-8 text-[12px] font-bold text-slate-500">
              <Link to="/" className="text-[#1a5d2e] border-b-2 border-[#1a5d2e] pb-1">Home</Link>
              <Link to="/explore" className="hover:text-[#1a5d2e] transition-colors">Explore</Link>
              <Link to="/orders" className="hover:text-[#1a5d2e] transition-colors">Orders</Link>
           </div>
        </div>

        <div className="flex items-center gap-2 px-6 py-3 bg-[#e3eae3] rounded-full border border-white/50 cursor-pointer text-[10px] font-bold group shadow-sm">
           <MapPin size={14} className="text-[#1a5d2e]" />
           <div className="flex items-baseline gap-1">
              <span className="text-slate-400 font-extrabold uppercase tracking-widest text-[8px]">Deliver to</span>
              <span className="text-slate-900 italic font-black">HSR Layout, Sector 7</span>
           </div>
           <ChevronRight size={14} className="text-slate-300 group-hover:translate-x-0.5 transition-transform" />
        </div>

        <div className="flex items-center gap-6">
           <div className="p-2 cursor-pointer hover:bg-white rounded-full transition-all">
              <Search size={22} className="text-[#1a5d2e]" />
           </div>
           <div className="relative cursor-pointer" onClick={() => navigate('/checkout')}>
              <ShoppingCart size={22} className="text-[#1a5d2e]" />
              <span className="absolute -top-2 -right-2 bg-[#ff6b00] text-white text-[8px] w-5 h-5 rounded-full flex items-center justify-center font-black border-2 border-[#f2f7f2] shadow-lg">{totalItems}</span>
           </div>
           <div className="flex items-center gap-8 border-l border-slate-200 pl-8">
              <Link to="/profile" className="w-10 h-10 rounded-full border-2 border-white shadow-lg overflow-hidden flex items-center justify-center bg-white cursor-pointer hover:rotate-6 transition-all">
                 <img src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=1a5d2e&color=fff`} className="w-full h-full object-cover" alt="User" />
              </Link>
           </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 mt-8 space-y-16">
        {/* HERO - EXACT REPLICATION */}
        <section className="relative h-[480px] rounded-[56px] overflow-hidden group shadow-2xl">
           <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[4s]" alt="Market" />
           <div className="absolute inset-0 bg-gradient-to-r from-slate-900/60 via-slate-900/10 to-transparent flex flex-col justify-center p-20">
              <h2 className="text-6xl md:text-7xl font-black text-white leading-[0.9] tracking-tighter mb-10 drop-shadow-2xl">
                Freshness <span className="text-primary-400">delivered</span> <br/>
                <span className="italic">in 15 minutes.</span>
              </h2>
              
              <div className="relative max-w-2xl bg-white rounded-full p-2 shadow-2xl flex items-center group/search border-4 border-white/20">
                 <Search className="ml-6 text-slate-300 group-focus-within/search:text-primary-600 transition-colors" size={24} />
                 <input type="text" placeholder="Search for milk, bread, or local stores" className="flex-1 bg-transparent px-6 py-4 outline-none text-md font-bold text-slate-900 placeholder:text-slate-300" />
                 <button className="bg-primary-600 text-white px-10 py-5 rounded-full font-black text-sm uppercase tracking-widest hover:bg-primary-700 transition-all active:scale-95 shadow-xl shadow-primary-900/20">Search</button>
              </div>
              
              <div className="mt-8 flex gap-4 text-[10px] text-white/80 font-black uppercase tracking-widest italic items-baseline">
                 <span className="text-primary-400">Trending:</span>
                 {['Organic Milk', 'Sourdough', 'Avocados'].map(t => <span key={t} className="hover:text-white cursor-pointer transition-colors underline underline-offset-4 decoration-primary-400">{t}</span>)}
              </div>
           </div>
        </section>

        {/* QUICK PICKS - EXACT REPLICATION */}
        <section>
           <div className="flex items-center justify-between mb-8">
              <div className="space-y-1">
                 <div className="text-[9px] text-primary-600 font-black uppercase tracking-[3px] italic">Top Essentials</div>
                 <h3 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter decoration-primary-200 underline underline-offset-8">Quick Picks</h3>
              </div>
              <div className="flex gap-2">
                 <button className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 hover:text-slate-900 transition-all border border-slate-100"><ChevronLeft size={20}/></button>
                 <button className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 hover:text-slate-900 transition-all border border-slate-100"><ChevronRight size={20}/></button>
              </div>
           </div>
           
           <div className="flex gap-10 overflow-x-auto no-scrollbar pb-8 -mx-4 px-4">
              {quickPicks.map((p, i) => (
                <div key={i} className="min-w-[200px] flex flex-col group cursor-pointer">
                   <div className="h-44 bg-[#f8f5f0] rounded-[40px] mb-4 relative overflow-hidden flex items-center justify-center p-6 border-b-4 border-slate-100 shadow-sm transition-all group-hover:-translate-y-2 group-hover:shadow-xl">
                      <img src={p.imageUrl || p.img} className="max-h-full drop-shadow-2xl group-hover:scale-110 transition-transform duration-500" alt={p.name} />
                      <div className="absolute top-4 left-4 bg-orange-500 text-white text-[7px] font-black px-2 py-1 rounded-md italic shadow-lg">{p.time || '15 MINS'}</div>
                   </div>
                   <h4 className="font-bold text-slate-900 text-sm italic mb-1 line-clamp-1">{p.name}</h4>
                   <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-4 opacity-70">{p.unit || p.vol}</p>
                   <div className="flex items-center justify-between">
                      <span className="text-lg font-black text-slate-900 tracking-tighter">₹{p.price}</span>
                      <button 
                        onClick={(e) => { e.preventDefault(); addToCart(p); }}
                        className="bg-primary-600 text-white px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-primary-900/10 active:scale-95"
                      >
                        Add +
                      </button>
                   </div>
                </div>
              ))}
           </div>
        </section>

        {/* CATEGORIES - EXACT REPLICATION */}
        <section>
           <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter mb-10">Browse Categories</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {categories.map((cat, idx) => (
                <div key={idx} className={`${cat.color} p-6 rounded-[32px] flex items-center justify-between h-40 group cursor-pointer hover:shadow-xl transition-all border border-white relative overflow-hidden`}>
                   <div className="z-10 relative">
                      <h4 className="text-lg font-black text-slate-900 leading-tight italic">{cat.name.split(' ')[0]} <br/> <span className="opacity-60">{cat.name.split(' ')[1]}</span></h4>
                      <p className="text-[8px] text-slate-400 font-black italic tracking-widest mt-2 uppercase opacity-60 line-clamp-1">{cat.sub}</p>
                   </div>
                   <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                       <img src={cat.img} className="max-h-full drop-shadow-2xl group-hover:scale-125 transition-transform duration-500 rounded-2xl rotate-6 group-hover:rotate-0" alt={cat.name} />
                   </div>
                </div>
              ))}
           </div>
        </section>

        {/* STORES - EXACT REPLICATION */}
        <section>
           <div className="flex items-center justify-between mb-10">
              <h3 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Stores Near You</h3>
              <button className="text-primary-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:underline">View all stores <ChevronRight size={14}/></button>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {(shops.length > 0 ? shops : [
                { name: 'Daily Needs Supermarket', tags: 'Fruits, Vegetables, Dairy', rate: 4.8, dist: '0.8 km', img: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=800' },
                { name: 'Green Valley Organics', tags: 'Organic, Health Foods', rate: 4.5, dist: '1.2 km', img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800' },
                { name: 'Fresh & Fast Kirana', tags: 'Essentials, Bakery', rate: 4.7, dist: '0.5 km', img: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800' }
              ]).map((shop, idx) => (
                <Link to={`/shop/${shop._id || idx}`} key={idx} className="group cursor-pointer">
                   <div className="h-56 bg-white rounded-[48px] relative overflow-hidden mb-6 border-4 border-white shadow-xl group-hover:shadow-2xl transition-all">
                      <img src={shop.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-90" alt={shop.name} />
                      <div className="absolute top-6 left-6 flex gap-2">
                         <span className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-black flex items-center gap-1.5 shadow-xl"><Star size={12} className="fill-yellow-400 text-yellow-400 border-none" /> {shop.rating || shop.rate}</span>
                         <span className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-black shadow-xl">{shop.dist || '1.0 km'}</span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                   </div>
                   <div className="px-4">
                      <h4 className="text-xl font-black text-slate-900 mb-2 italic tracking-tight">{shop.shopName || shop.name}</h4>
                      <div className="flex items-center gap-6 text-[10px] text-slate-400 font-black italic tracking-widest uppercase">
                         <div className="flex items-center gap-2"><Clock size={14} className="text-primary-600" /> 10-15 mins</div>
                         <div className="flex items-center gap-2 line-clamp-1 truncate items-center">🧺 {shop.category || shop.tags}</div>
                      </div>
                   </div>
                </Link>
              ))}
           </div>
        </section>
      </main>

      {/* FOOTER - EXACT REPLICATION */}
      <footer className="mt-32 pt-24 pb-12 border-t border-slate-100 bg-slate-50/50">
         <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-20">
            <div className="space-y-8">
               <h2 className="text-2xl font-black text-primary-600 tracking-tighter">KiranaQuick</h2>
               <p className="text-[12px] text-slate-400 font-bold leading-relaxed italic pr-10">Your local market, delivered at the speed of life. Freshness guaranteed or your money back.</p>
            </div>
            
            <div className="space-y-8">
               <h5 className="text-[10px] font-black uppercase tracking-[3px] text-slate-900">Quick Links</h5>
               <div className="flex flex-col gap-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  <span className="hover:text-primary-600 cursor-pointer transition-colors">Our Story</span>
                  <span className="hover:text-primary-600 cursor-pointer transition-colors">Store Partner Program</span>
                  <span className="hover:text-primary-600 cursor-pointer transition-colors">Delivery Fleet</span>
                  <span className="hover:text-primary-600 cursor-pointer transition-colors">Contact Us</span>
               </div>
            </div>

            <div className="space-y-8">
               <h5 className="text-[10px] font-black uppercase tracking-[3px] text-slate-900">Categories</h5>
               <div className="flex flex-col gap-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  <span className="hover:text-primary-600 cursor-pointer transition-colors">Fruits & Vegetables</span>
                  <span className="hover:text-primary-600 cursor-pointer transition-colors">Dairy & Breakfast</span>
                  <span className="hover:text-primary-600 cursor-pointer transition-colors">Snacks & Beverages</span>
                  <span className="hover:text-primary-600 cursor-pointer transition-colors">Home Essentials</span>
               </div>
            </div>

            <div className="space-y-10">
               <h5 className="text-[10px] font-black uppercase tracking-[3px] text-slate-900">Download App</h5>
               <div className="space-y-4">
                  <div className="bg-slate-900 p-4 rounded-2xl flex items-center justify-center text-white border border-white/10 shadow-2xl group cursor-pointer active:scale-95 transition-all overflow-hidden relative">
                     <div className="text-[12px] font-black tracking-[4px] italic relative z-10 uppercase">PLAY_@_INSTA</div>
                     <div className="absolute inset-x-0 bottom-0 h-1 bg-primary-600 -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                  </div>
                  <div className="bg-white p-4 rounded-2xl flex items-center justify-center text-slate-900 border border-slate-200 shadow-sm group cursor-pointer active:scale-95 transition-all overflow-hidden relative">
                     <span className="mr-3 text-2xl font-black"></span>
                     <div className="text-[9px] font-black uppercase tracking-widest text-left leading-tight">
                        <div className="text-[7px] opacity-60">Download on the</div>
                        App Store
                     </div>
                  </div>
               </div>
            </div>
         </div>
         
         <div className="max-w-7xl mx-auto px-8 mt-24 pt-8 border-t border-slate-100 flex justify-between items-center">
            <p className="text-[10px] text-slate-300 font-black uppercase tracking-widest italic">© 2026 KiranaQuick. All rights reserved.</p>
            <div className="flex gap-4">
               <button onClick={() => navigate('/checkout')} className="w-12 h-12 bg-primary-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-primary-900/20 hover:scale-110 active:scale-90 transition-all">
                  <ShoppingCart size={20} />
               </button>
            </div>
         </div>
      </footer>
    </div>
  );
}
// Customer dashboard v1.0
