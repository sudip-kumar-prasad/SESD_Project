import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Star, Clock, Info, Share2, Plus, Minus, Loader2, ChevronLeft, LayoutGrid, ListFilter, ShoppingBag, Leaf, Droplets, Croissant, Package, Snowflake, CupSoda } from 'lucide-react';
import api from '../api';
import { useCart } from '../context/CartContext';

export default function StorePage() {
  const { id } = useParams();
  const [shop, setShop] = useState<any>(null);
  const [productList, setProductList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, updateQuantity, totalItems, totalPrice, cart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        const [shopRes, productsRes] = await Promise.all([
          api.get(`/shops/${id}`),
          api.get(`/products/shop/${id}`)
        ]);
        setShop(shopRes.data);
        setProductList(productsRes.data);
      } catch (err) {
        console.error('Failed to fetch store data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchShopData();
  }, [id]);

  const categories = [
    { name: 'Fresh Produce', icon: <Leaf size={18} /> },
    { name: 'Dairy & Eggs', icon: <Droplets size={18} /> },
    { name: 'Bakery', icon: <Croissant size={18} /> },
    { name: 'Pantry Staples', icon: <Package size={18} /> },
    { name: 'Frozen Foods', icon: <Snowflake size={18} /> },
    { name: 'Beverages', icon: <CupSoda size={18} /> }
  ];
  const [activeCat, setActiveCat] = useState('Fresh Produce');

  const products = productList.length > 0 ? productList : [
    { _id: '1', name: 'Organic Curly Kale', price: 4.50, originalPrice: 5.20, vol: '250g • Local Farm', img: 'https://images.unsplash.com/photo-1524179524662-136263449951?w=400', isAvailable: true, stockQuantity: 10, status: 'In Stock' },
    { _id: '2', name: 'Farm Fresh Carrots', price: 2.90, vol: '500g • Ooty Farm', img: 'https://images.unsplash.com/photo-1590865101275-dc85133664d1?w=400', isAvailable: true, stockQuantity: 3, status: 'Low Stock' },
    { _id: '3', name: 'Queen Pineapple', price: 5.75, vol: '1 Unit • Imported', img: 'https://images.unsplash.com/photo-1550258114-68bd29676752?w=400', isAvailable: true, stockQuantity: 10, status: 'In Stock' },
    { _id: '4', name: 'Red Bell Pepper', price: 3.20, vol: '2 Units • Greenhouse', img: 'https://images.unsplash.com/photo-1558818498-28c3e002b655?w=400', isAvailable: true, stockQuantity: 10, status: 'In Stock' },
    { _id: '5', name: 'Mixed Berry Punnet', price: 6.90, vol: '150g • Seasonal', img: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=400', isAvailable: true, stockQuantity: 2, status: 'Last 3 left' },
    { _id: '6', name: 'Broccoli Florets', price: 3.50, vol: '400g • Local', img: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400', isAvailable: true, stockQuantity: 10, status: 'In Stock' },
  ];

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#f2f7f2]"><Loader2 className="animate-spin text-primary-600" size={48} /></div>;

  const getItemQuantity = (productId: string) => {
    return cart.find(item => item._id === productId)?.quantity || 0;
  };

  return (
    <div className="min-h-screen bg-[#f2f7f2] text-slate-900 pb-36">
      {/* Header - Matching Reference Precisely */}
      <nav className="px-12 py-6 flex items-center justify-between sticky top-0 bg-[#f2f7f2]/90 backdrop-blur-xl z-[100]">
        <div className="flex items-center gap-10">
           <Link to="/" className="text-[22px] font-black text-[#1a5d2e] tracking-tight">KiranaQuick</Link>
           <div className="flex items-center gap-8 text-[12px] font-bold text-slate-500">
              <Link to="/" className="text-[#1a5d2e] border-b-2 border-[#1a5d2e] pb-1">Store</Link>
              <span className="hover:text-[#1a5d2e] cursor-pointer transition-all">Offers</span>
              <span className="hover:text-[#1a5d2e] cursor-pointer transition-all">Support</span>
           </div>
        </div>

        <div className="flex-1 max-w-xl mx-16 relative">
           <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold" size={14} strokeWidth={3} />
           <input type="text" placeholder="Search in store..." className="w-full bg-[#e3eae3] border-none rounded-full py-4 pl-14 pr-6 outline-none focus:bg-white focus:ring-2 focus:ring-[#1a5d2e]/10 transition-all font-bold text-xs" />
        </div>

        <div className="flex items-center gap-6">
           <div className="p-2 cursor-pointer hover:bg-white rounded-full transition-all">
              <ShoppingCart size={22} className="text-[#1a5d2e]" />
           </div>
           <div className="w-10 h-10 rounded-full border-2 border-white shadow-lg overflow-hidden flex items-center justify-center bg-white">
              <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100" className="w-full h-full object-cover" alt="User" />
           </div>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto px-12">
         {/* Store Profile Card - Matching Layout */}
         <section className="bg-white rounded-[48px] p-12 mb-16 flex items-center justify-between shadow-sm relative overflow-hidden group">
            <div className="space-y-6 relative z-10">
               <div className="flex gap-2">
                  <span className="bg-[#123e1e] text-white text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg">PREMIUM PARTNER</span>
                  <span className="bg-[#ff6b00] text-white text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg">ORGANIC CERTIFIED</span>
               </div>
               <h1 className="text-[56px] font-black text-slate-900 tracking-tighter leading-none">{shop?.shopName || 'Organic Fresh Mart'}</h1>
               <div className="flex items-center gap-8 text-[11px] text-slate-500 font-bold uppercase tracking-widest">
                  <div className="flex items-center gap-1.5"><Star size={14} className="fill-[#ffb100] text-[#ffb100]" /> <span className="text-slate-950 font-black">4.8</span> (500+ Ratings)</div>
                  <div className="flex items-center gap-1.5"><Clock size={14} className="text-slate-400" /> 15-20 mins</div>
                  <div className="flex items-center gap-1.5">📍 1.2 km away</div>
               </div>
            </div>
            
            <div className="flex gap-4 relative z-10">
               <button className="bg-[#f2f7f2] px-8 py-4 rounded-2xl text-[10px] font-black uppercase text-slate-600 tracking-widest border border-slate-100 flex items-center gap-2 hover:bg-[#e3eae3] transition-all"><Share2 size={16}/> Share</button>
               <button className="bg-[#f2f7f2] px-8 py-4 rounded-2xl text-[10px] font-black uppercase text-slate-600 tracking-widest border border-slate-100 flex items-center gap-2 hover:bg-[#e3eae3] transition-all"><Info size={16}/> Store Info</button>
            </div>

            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/3 h-full opacity-20 group-hover:opacity-30 transition-opacity">
               <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800" className="w-full h-full object-cover" alt="" />
            </div>
         </section>

         <div className="flex gap-16">
            {/* Categories Sidebar */}
            <aside className="w-72 shrink-0">
               <div className="text-[10px] font-black uppercase tracking-[4px] text-slate-300 mb-8 ml-3">Categories</div>
               <nav className="space-y-3">
                  {categories.map(cat => (
                    <button 
                     key={cat.name} 
                     onClick={() => setActiveCat(cat.name)}
                     className={`w-full flex items-center gap-4 p-5 rounded-[28px] text-[13px] font-bold transition-all ${
                       activeCat === cat.name 
                       ? 'bg-[#1a5d2e] text-white shadow-2xl shadow-[#1a5d2e]/20 px-8' 
                       : 'text-slate-500 hover:bg-white/50'
                     }`}
                    >
                      <span className={`${activeCat === cat.name ? 'text-white' : 'text-slate-400'}`}>{cat.icon}</span>
                      <span className="italic tracking-tight">{cat.name}</span>
                    </button>
                  ))}
               </nav>
            </aside>

            {/* Product Section */}
            <section className="flex-1">
               <div className="flex items-center justify-between mb-12">
                  <h2 className="text-[44px] font-black text-slate-900 tracking-tighter italic">{activeCat}</h2>
                  <div className="flex gap-3">
                     <button className="p-4 bg-[#e3eae3] rounded-2xl text-slate-500 hover:text-slate-900 transition-all shadow-sm"><ListFilter size={18}/></button>
                     <button className="p-4 bg-[#e3eae3] rounded-2xl text-slate-500 hover:text-slate-900 transition-all shadow-sm"><LayoutGrid size={18}/></button>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                  {products.map(p => {
                    const qty = getItemQuantity(p._id);
                    return (
                      <div key={p._id || p.id} className="bg-white rounded-[44px] p-5 shadow-sm group hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500">
                         <div className="h-64 bg-[#f8faf8] rounded-[36px] mb-8 relative overflow-hidden flex items-center justify-center p-12 transition-all">
                            <img src={p.imageUrl || p.img} className="max-h-full drop-shadow-3xl group-hover:scale-110 transition-transform duration-700" alt={p.name} />
                            <div className={`absolute top-5 left-5 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border-2 border-white shadow-xl flex items-center gap-1.5 ${
                               p.status?.includes('Stock') ? 'bg-[#1a5d2e] text-white' : 'bg-[#ff6b00] text-white'
                            }`}>
                               <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                               {p.status}
                            </div>
                         </div>
                         
                         <div className="px-3 space-y-1">
                            <h4 className="font-black text-slate-950 text-[19px] tracking-tight line-clamp-1">{p.name}</h4>
                            <p className="text-[11px] text-slate-400 font-bold opacity-60 pb-6 mb-2 border-b border-slate-50">{p.vol || 'Pcs'}</p>
                            
                            <div className="flex items-center justify-between pt-4">
                               <div>
                                  <div className="flex items-baseline gap-2">
                                     <span className="text-[26px] font-black text-slate-950 tracking-tighter">₹{p.price.toFixed(2)}</span>
                                     {p.originalPrice && <span className="text-[11px] text-slate-300 font-bold line-through">₹{p.originalPrice.toFixed(2)}</span>}
                                  </div>
                               </div>
                               
                               {qty > 0 ? (
                                 <div className="flex items-center gap-5 bg-[#e3eae3] p-2.5 px-5 rounded-full border border-white shadow-sm">
                                    <button onClick={() => updateQuantity(p._id, -1)} className="text-slate-500 hover:text-[#1a5d2e] transition-colors"><Minus size={16} strokeWidth={3}/></button>
                                    <span className="text-sm font-black text-slate-950 min-w-[12px] text-center">{qty}</span>
                                    <button onClick={() => updateQuantity(p._id, 1)} className="text-slate-500 hover:text-[#1a5d2e] transition-colors"><Plus size={16} strokeWidth={3}/></button>
                                 </div>
                               ) : (
                                 <button 
                                    onClick={() => addToCart(p)}
                                    className="w-14 h-14 bg-[#1a5d2e] text-white rounded-full flex items-center justify-center shadow-xl shadow-[#1a5d2e]/20 active:scale-90 transition-all hover:bg-[#123e1e]"
                                 >
                                    <ShoppingBag size={24} strokeWidth={2.5}/>
                                 </button>
                               )}
                            </div>
                         </div>
                      </div>
                    );
                  })}
               </div>
            </section>
         </div>
      </main>

      {/* Floating Mini Cart - EXACT MATCH TO DARK PILL DESIGN */}
      {totalItems > 0 && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 w-full max-w-[900px] px-8 z-[200]">
           <div className="bg-[#121812] text-white p-5 px-8 rounded-[40px] flex items-center justify-between shadow-[0_32px_64px_rgba(0,0,0,0.4)] border border-white/5 relative overflow-hidden group">
              <div className="flex items-center gap-6 relative z-10">
                 <div className="relative">
                    <div className="w-16 h-16 bg-[#1a5d2e] rounded-[24px] flex items-center justify-center shadow-lg border border-white/10 group-hover:scale-110 transition-transform">
                       <ShoppingBag size={28} className="text-white" />
                    </div>
                    <span className="absolute -top-1 -right-1 w-6 h-6 bg-[#ff6b00] rounded-full flex items-center justify-center text-[11px] font-black border-[3px] border-[#121812] shadow-xl">{totalItems}</span>
                 </div>
                 
                 <div>
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-[4px] mb-1 italic opacity-60">{totalItems} items in basket</div>
                    <div className="text-[28px] font-black tracking-tighter italic">₹{totalPrice.toFixed(2)}</div>
                 </div>
              </div>

              <div className="flex items-center gap-10 relative z-10">
                 <div className="hidden lg:flex -space-x-4">
                    {cart.slice(0, 3).map(item => (
                      <div key={item._id} className="w-12 h-12 rounded-full border-[3px] border-[#121812] bg-white overflow-hidden p-1.5 shadow-2xl">
                         <img src={item.imageUrl} className="w-full h-full object-contain" alt="" />
                      </div>
                    ))}
                 </div>
                 
                 <button onClick={() => navigate('/checkout')} className="bg-[#1fcb4f] hover:bg-[#18a03e] px-14 py-5 rounded-[32px] font-black text-[12px] uppercase tracking-[4px] text-[#0d130d] flex items-center gap-4 transition-all active:scale-95 shadow-2xl shadow-[#1fcb4f]/20">
                    Review Cart <ChevronLeft size={20} className="rotate-180" />
                 </button>
              </div>

              {/* Decorative accent */}
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-[#1fcb4f] to-transparent opacity-10"></div>
           </div>
        </div>
      )}
    </div>
  );
}
