import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Search, Plus, Filter, AlertTriangle, CheckCircle, Package, 
  MoreVertical, LayoutDashboard, ShoppingBag, Wallet, Settings, 
  LogOut, Loader2, ChevronRight, Store, Trash2, Eye, EyeOff,
  ListFilter
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function InventoryPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Inventory');
  const [activeCat, setActiveCat] = useState('All Items');
  const [shop, setShop] = useState<any>(null);
  const [inventoryList, setInventoryList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    price: '',
    stockQuantity: '',
    category: 'Vegetables',
    unit: '500g',
    imageUrl: 'https://images.unsplash.com/photo-1566385101042-1a000c1268c4?w=400'
  });

  const fetchInventory = async (shopId: string) => {
    try {
      const productsRes = await api.get(`/products/shop/${shopId}`);
      setInventoryList(productsRes.data);
    } catch (err) {
      console.error('Failed to fetch inventory:', err);
    }
  };

  useEffect(() => {
    const fetchOwnerData = async () => {
      try {
        const shopRes = await api.get('/shops/my');
        setShop(shopRes.data);
        await fetchInventory(shopRes.data._id);
      } catch (err) {
        console.error('Failed to fetch initial data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOwnerData();
  }, []);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/products', newItem);
      setIsModalOpen(false);
      setNewItem({ name: '', price: '', stockQuantity: '', category: 'Vegetables', unit: '500g', imageUrl: 'https://images.unsplash.com/photo-1566385101042-1a000c1268c4?w=400' });
      if (shop) await fetchInventory(shop._id);
    } catch (err) {
      console.error('Failed to add item:', err);
    }
  };

  const handleToggleActive = async (productId: string) => {
    try {
      await api.patch(`/products/${productId}/toggle`);
      if (shop) await fetchInventory(shop._id);
    } catch (err) {
      console.error('Failed to toggle visibility:', err);
    }
  };

  const handleDeleteItem = async (productId: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await api.delete(`/products/${productId}`);
      if (shop) await fetchInventory(shop._id);
    } catch (err) {
      console.error('Failed to delete item:', err);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f2f7f2]">
      <Loader2 className="animate-spin text-[#1a5d2e]" size={48} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f2f7f2] flex font-sans selection:bg-[#1a5d2e] selection:text-white">
      {/* Sidebar - Precision Matching Screenshot */}
      <aside className="w-[320px] bg-white border-r border-[#e3eae3] p-10 flex flex-col sticky top-0 h-screen">
         <div className="flex items-center gap-3 mb-16">
            <h1 className="text-[20px] font-black text-[#1a5d2e] tracking-tighter italic">KiranaQuick <span className="text-slate-900 not-italic">Biz</span></h1>
         </div>
         
         <div onClick={() => navigate('/shop-profile')} className="flex items-center gap-5 mb-14 p-5 bg-[#f8faf8] rounded-[32px] border border-[#f0f4f0] group hover:bg-white hover:shadow-xl transition-all duration-500 cursor-pointer">
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
             { id: 'Dashboard', icon: LayoutDashboard, path: '/business-dashboard' },
             { id: 'Orders', icon: Package },
             { id: 'Inventory', icon: ShoppingBag, active: true },
             { id: 'Payouts', icon: Wallet },
             { id: 'Settings', icon: Settings }
           ].map(item => (
             <button 
               key={item.id} 
               onClick={() => {
                  if (item.path) navigate(item.path);
                  setActiveTab(item.id);
               }}
               className={`w-full flex items-center justify-between p-4.5 px-6 rounded-[22px] transition-all group ${
                 item.active ? 'bg-[#e3f2e3] text-[#1a5d2e] shadow-sm' : 'text-slate-500 hover:bg-[#f8faf8]'
               }`}
             >
               <div className="flex items-center gap-5">
                  <item.icon size={20} className={item.active ? 'text-[#1a5d2e]' : 'text-slate-400 group-hover:text-slate-900'} />
                  <span className={`text-[13px] font-black italic tracking-tight ${item.active ? 'text-[#1a5d2e]' : 'group-hover:text-slate-900'}`}>{item.id}</span>
               </div>
               {item.active && <ChevronRight size={14} />}
             </button>
           ))}
         </nav>

         <div className="mt-auto">
            <button 
               onClick={() => setIsModalOpen(true)}
               className="w-full flex items-center justify-center gap-4 py-6 bg-[#1a5d2e] text-white rounded-[28px] font-black text-[12px] uppercase tracking-[3px] shadow-2xl shadow-[#1a5d2e]/20 hover:scale-[1.02] active:scale-95 transition-all group overflow-hidden relative"
            >
               <Plus size={18} /> Add Product
            </button>
         </div>
      </aside>

      <main className="flex-1 p-14 overflow-y-auto max-h-screen">
         <header className="flex flex-col xl:flex-row xl:items-start justify-between gap-10 mb-16">
            <div>
               <div className="text-[10px] font-black text-[#1a5d2e] uppercase tracking-[4px] italic mb-3 leading-none">STOCK OVERVIEW</div>
               <h2 className="text-[56px] font-black text-slate-950 italic tracking-tighter leading-none">Store Inventory</h2>
            </div>

            <div className="flex gap-6">
               <div className="bg-white/60 backdrop-blur-md p-6 px-10 rounded-[32px] shadow-sm border border-[#f0f4f0] flex items-center gap-6 group hover:shadow-xl transition-all h-24">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-100 shadow-inner">
                     <CheckCircle size={24} />
                  </div>
                  <div>
                     <div className="text-xl font-black text-slate-950 italic tracking-tight">1,204</div>
                     <div className="text-[9px] text-slate-400 font-black uppercase tracking-widest leading-none">IN STOCK</div>
                  </div>
               </div>
               <div className="bg-white/60 backdrop-blur-md p-6 px-10 rounded-[32px] shadow-sm border border-[#f0f4f0] flex items-center gap-6 group hover:shadow-xl transition-all h-24">
                  <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center border border-orange-100 shadow-inner">
                     <AlertTriangle size={24} />
                  </div>
                  <div>
                     <div className="text-xl font-black text-slate-950 italic tracking-tight">12</div>
                     <div className="text-[9px] text-slate-400 font-black uppercase tracking-widest leading-none">LOW STOCK</div>
                  </div>
               </div>
            </div>
         </header>

         {/* Toolbar Section - 1:1 Matching Screenshot */}
         <div className="bg-white p-10 rounded-[48px] shadow-sm border border-[#f0f4f0] mb-12 space-y-10 group hover:shadow-2xl transition-all duration-700">
            <div className="flex flex-col lg:flex-row gap-10 lg:items-center justify-between">
               <div className="relative flex-1 max-w-2xl group overflow-hidden">
                  <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
                  <input 
                     type="text" 
                     placeholder="Search product name, SKU or category..." 
                     className="w-full bg-[#f8faf8] border-none rounded-full py-6 pl-20 pr-10 text-[15px] font-bold shadow-inner outline-none focus:bg-white focus:ring-4 focus:ring-[#1a5d2e]/5 transition-all placeholder:italic placeholder:text-slate-300" 
                  />
               </div>
               
               <div className="flex gap-4 p-2.5 bg-[#f8faf8] rounded-[32px] border border-[#f0f4f0] shadow-inner">
                  {['All Items', 'Vegetables', 'Dairy & Eggs', 'Snacks'].map(cat => (
                    <button 
                      key={cat} 
                      onClick={() => setActiveCat(cat)}
                      className={`px-10 py-4 rounded-[22px] text-[12px] font-black transition-all italic tracking-widest uppercase inline-flex items-center justify-center ${activeCat === cat ? 'bg-[#1a5d2e] text-white shadow-xl shadow-[#1a5d2e]/20' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      {cat}
                    </button>
                  ))}
               </div>
            </div>

            <div className="flex items-center justify-between pt-10 border-t border-[#f0f4f0]">
               <div className="flex items-center gap-12">
                  <button className="text-[11px] font-black text-slate-400 hover:text-[#1a5d2e] flex items-center gap-4 transition-colors uppercase tracking-[3px] italic leading-none group/action">
                     <div className="w-8 h-8 rounded-xl bg-[#f8faf8] group-hover/action:bg-[#e3f2e3] flex items-center justify-center border border-[#f0f4f0] transition-colors"><ListFilter size={16}/></div> 
                     Bulk Actions
                  </button>
                  <button className="text-[11px] font-black text-slate-400 hover:text-[#1a5d2e] flex items-center gap-4 transition-colors uppercase tracking-[3px] italic leading-none group/action">
                     <div className="w-8 h-8 rounded-xl bg-[#f8faf8] group-hover/action:bg-[#e3f2e3] flex items-center justify-center border border-[#f0f4f0] transition-colors"><Package size={16}/></div> 
                     Update Prices
                  </button>
               </div>
               <div className="text-[10px] text-slate-300 font-black uppercase tracking-[4px] italic">Showing 48 of 1,216 products</div>
            </div>
         </div>

         {/* Product Grid - 1:1 Matching Card Design */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {inventoryList.map((item, idx) => (
              <div key={item._id} className="bg-white p-6 rounded-[48px] shadow-sm border border-[#f0f4f0] relative h-[280px] flex flex-col group hover:shadow-2xl transition-all overflow-hidden">
                 {/* Card Header Layer */}
                 <div className="flex gap-6 h-[160px] mb-6">
                    <div className="w-[140px] h-[140px] bg-[#f8faf8] rounded-[36px] flex items-center justify-center p-6 border border-[#f0f4f0] group-hover:bg-[#e3f2e3] transition-colors">
                       <img src={item.imageUrl} className="max-h-full drop-shadow-2xl group-hover:scale-110 transition-transform duration-500" alt={item.name} />
                    </div>
                    <div className="flex-1 flex flex-col justify-center relative">
                       <button className="absolute top-0 right-0 p-2 text-slate-300 hover:text-[#1a5d2e]"><MoreVertical size={20}/></button>
                       <div className="space-y-1">
                          <div className="flex items-center gap-3">
                             <span className="text-[8px] font-black bg-[#e3f2e3] text-[#1a5d2e] px-3 py-1 rounded-md uppercase tracking-widest italic">{item.category || 'FRESH PRODUCE'}</span>
                             {item.stockQuantity < 5 && (
                                <span className="text-[8px] font-black bg-[#ff6b21] text-white px-3 py-1 rounded-md uppercase tracking-widest italic shadow-lg shadow-orange-900/10">LOW STOCK</span>
                             )}
                          </div>
                          <h4 className="text-[18px] font-black text-slate-950 italic tracking-tight leading-tight line-clamp-2">{item.name}</h4>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest opacity-60 italic leading-none">SKU: {item.sku || `KK-VEG-00${idx+1}`}</p>
                          <div className="pt-2 flex items-baseline gap-1">
                             <span className="text-xl font-black text-slate-950 tracking-tighter">₹{item.price}</span>
                             <span className="text-[10px] text-slate-300 font-bold italic">/ {item.unit || '500g'}</span>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Card Bottom Layer */}
                 <div className="flex items-center justify-between pt-6 border-t border-[#f0f4f0] mt-auto pb-4 px-2">
                    <div className="space-y-1">
                       <div className="text-[9px] text-slate-300 font-black uppercase tracking-widest italic leading-none tracking-[2px]">STOCK LEVEL</div>
                       <div className={`text-[15px] font-black italic ${item.stockQuantity < 5 ? 'text-red-500' : 'text-slate-950'}`}>
                          {item.stockQuantity} Units {item.stockQuantity < 5 && 'Remaining'}
                       </div>
                    </div>
                    <div className="space-y-1 text-right">
                       <div className="text-[9px] text-slate-300 font-black uppercase tracking-widest italic leading-none tracking-[2px]">AVAILABILITY</div>
                       <div 
                         onClick={() => handleToggleActive(item._id)}
                         className={`w-12 h-6 rounded-full relative transition-all duration-300 cursor-pointer ${item.isAvailable !== false ? 'bg-[#1a5d2e] shadow-lg shadow-[#1a5d2e]/20' : 'bg-slate-200'}`}
                       >
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300 ${item.isAvailable !== false ? 'right-1' : 'left-1'}`}></div>
                       </div>
                    </div>
                 </div>
              </div>
            ))}

            {/* Add New Item Card - 1:1 Matching Design */}
            <div 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#f8faf8] border-2 border-dashed border-[#e3eae3] rounded-[48px] flex flex-col items-center justify-center p-12 space-y-8 hover:bg-[#e3f2e3]/20 hover:border-[#1a5d2e]/50 transition-all cursor-pointer group h-[280px]"
            >
               <div className="w-16 h-16 rounded-[24px] bg-white flex items-center justify-center text-[#e3eae3] group-hover:text-[#1a5d2e] group-hover:rotate-12 transition-all shadow-xl shadow-slate-900/5">
                  <Plus size={32} strokeWidth={3} />
               </div>
               <div className="text-center">
                  <h4 className="text-[20px] font-black text-slate-300 group-hover:text-[#1a5d2e] italic tracking-tight">Add New Item</h4>
                  <p className="text-[10px] text-slate-200 font-black uppercase tracking-[3px] mt-2 italic group-hover:text-[#1a5d2e]/50 leading-tight">List new products in your<br/>inventory</p>
               </div>
            </div>
         </div>
      </main>

      {/* Product Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-8">
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)}></div>
           <div className="relative bg-white w-full max-w-2xl rounded-[56px] shadow-2xl overflow-hidden animate-in zoom-in duration-500 border border-white">
              <div className="p-16">
                 <div className="text-[11px] font-black text-[#1a5d2e] uppercase tracking-[5px] italic mb-3">PRODUCT ENGINE</div>
                 <h2 className="text-[44px] font-black text-slate-950 italic tracking-tighter mb-12">New Product Entry</h2>
                 
                 <form onSubmit={handleAddItem} className="space-y-10">
                    <div className="grid grid-cols-2 gap-10">
                       <div className="col-span-2 space-y-3">
                          <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-6">Product Designation</label>
                          <input required type="text" placeholder="e.g. Organic Roma Tomatoes" className="w-full bg-[#f8faf8] border-none rounded-[32px] py-6 px-8 text-base font-bold outline-none focus:bg-white focus:ring-4 focus:ring-[#1a5d2e]/5 transition-all shadow-inner" value={newItem.name} onChange={(e) => setNewItem({...newItem, name: e.target.value})} />
                       </div>
                       
                       <div className="space-y-3">
                          <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-6">Unit Price (₹)</label>
                          <input required type="number" placeholder="45.00" className="w-full bg-[#f8faf8] border-none rounded-[32px] py-6 px-8 text-base font-bold outline-none focus:bg-white focus:ring-4 focus:ring-[#1a5d2e]/5 transition-all font-mono shadow-inner" value={newItem.price} onChange={(e) => setNewItem({...newItem, price: e.target.value})} />
                       </div>

                       <div className="space-y-3">
                          <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-6">Available Stock</label>
                          <input required type="number" placeholder="50" className="w-full bg-[#f8faf8] border-none rounded-[32px] py-6 px-8 text-base font-bold outline-none focus:bg-white focus:ring-4 focus:ring-[#1a5d2e]/5 transition-all font-mono shadow-inner" value={newItem.stockQuantity} onChange={(e) => setNewItem({...newItem, stockQuantity: e.target.value})} />
                       </div>

                       <div className="space-y-3">
                          <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-6">Category</label>
                          <select className="w-full bg-[#f8faf8] border-none rounded-[32px] py-6 px-8 text-base font-bold outline-none focus:bg-white focus:ring-4 focus:ring-[#1a5d2e]/5 transition-all appearance-none shadow-inner" value={newItem.category} onChange={(e) => setNewItem({...newItem, category: e.target.value})}>
                             <option>Vegetables</option>
                             <option>Fruits</option>
                             <option>Dairy & Eggs</option>
                             <option>Snacks</option>
                             <option>Bakery</option>
                             <option>Beverages</option>
                          </select>
                       </div>

                       <div className="space-y-3">
                          <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-6">Standard Unit</label>
                          <input type="text" placeholder="e.g. 500g" className="w-full bg-[#f8faf8] border-none rounded-[32px] py-6 px-8 text-base font-bold outline-none focus:bg-white focus:ring-4 focus:ring-[#1a5d2e]/5 transition-all shadow-inner" value={newItem.unit} onChange={(e) => setNewItem({...newItem, unit: e.target.value})} />
                       </div>

                       <div className="col-span-2 space-y-3">
                          <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-6">Image Asset URL</label>
                          <input type="text" placeholder="https://unsplash..." className="w-full bg-[#f8faf8] border-none rounded-[32px] py-6 px-8 text-base font-bold outline-none focus:bg-white focus:ring-4 focus:ring-[#1a5d2e]/5 transition-all shadow-inner" value={newItem.imageUrl} onChange={(e) => setNewItem({...newItem, imageUrl: e.target.value})} />
                       </div>
                    </div>

                    <div className="flex gap-6 pt-10">
                       <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-[#f8faf8] text-slate-400 py-6 rounded-[32px] font-black text-[13px] uppercase tracking-widest hover:bg-slate-100 transition-all italic">Discard</button>
                       <button type="submit" className="flex-[2] bg-[#1a5d2e] text-white py-6 rounded-[32px] font-black text-[13px] uppercase tracking-[4px] hover:bg-[#123e1e] transition-all shadow-2xl shadow-[#1a5d2e]/20 active:scale-95 italic">Commit Change</button>
                    </div>
                 </form>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
