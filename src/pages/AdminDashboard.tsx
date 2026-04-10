import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Home, ShoppingBag, Layout, Save, LogOut, CreditCard, Users, Plus, Trash2 } from 'lucide-react';

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [alumni, setAlumni] = useState<any[]>([]);
  const [revenue, setRevenue] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('revenue');

  const [loading, setLoading] = useState(false);
  const [uploadingImageId, setUploadingImageId] = useState<string | null>(null);


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/content');
      setData(res.data);
      
      const token = localStorage.getItem('token');
      const authHeader = { headers: { Authorization: `Bearer ${token}` } };

      const payRes = await axios.get('http://localhost:3001/api/admin/payment', authHeader);
      setPaymentData(payRes.data);

      const transRes = await axios.get('http://localhost:3001/api/admin/transactions', authHeader);
      setTransactions(transRes.data);

      const alumniRes = await axios.get('http://localhost:3001/api/admin/alumni', authHeader);
      setAlumni(alumniRes.data);

      const revRes = await axios.get('http://localhost:3001/api/admin/analytics/revenue', authHeader);
      setRevenue(revRes.data);


    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const authHeader = { headers: { Authorization: `Bearer ${token}` } };
      
      if (activeTab === 'payment') {
        await axios.put('http://localhost:3001/api/admin/payment', paymentData, authHeader);
      } else if (activeTab === 'hero' || activeTab === 'products') {
        await axios.put('http://localhost:3001/api/content', data, authHeader);
      }
      alert('Content saved successfully!');
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Failed to save content');
    }
    setLoading(false);
  };

  const updateFulfillment = async (orderId: string, status: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:3001/api/admin/transactions/${orderId}/fulfillment`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  };

  const updateAlumniStatus = async (id: number, status: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:3001/api/admin/alumni/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Failed to update alumni');
    }
  };



  const addNewProduct = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3001/api/admin/products', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData(); // Reload to get the new product with ID
    } catch (err) {
      console.error(err);
      alert('Failed to add product');
    }
    setLoading(false);
  };

  const deleteProduct = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3001/api/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Failed to delete product');
    }
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number, id: string) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);

    setUploadingImageId(id);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:3001/api/upload', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      
      const newP = [...data.products];
      const resolvedUrl = res.data.url.startsWith('http') ? res.data.url : `http://localhost:3001${res.data.url}`;
      newP[index].image = resolvedUrl;
      setData({...data, products: newP});
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.details || err.response?.data?.error || 'Failed to upload image';
      alert(`Upload Error: ${msg}`);
    }
    setUploadingImageId(null);
  };

  if (!data) return <div className="min-h-screen bg-obsidian flex items-center justify-center text-gem-gold p-10">Loading system...</div>;


  return (
    <div className="bg-obsidian min-h-screen text-slate-300 font-sans flex">
      {/* Sidebar */}
      <div className="w-64 glass-card m-6 p-6 flex flex-col justify-between border-white/5">
        <div>
          <div className="text-xl font-display font-bold text-white mb-10 flex items-center gap-3">
             <div className="w-8 h-8 rounded bg-gem-gold text-obsidian flex items-center justify-center gem-glow-gold font-mono">GE</div>
             GEMICONOTA
          </div>

          <nav className="space-y-4">
            <button 
              onClick={() => setActiveTab('revenue')}
              className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-bold transition-all ${activeTab === 'revenue' ? 'bg-gem-gold/20 text-gem-gold border border-gem-gold/30' : 'text-white/40 hover:text-white'}`}
            >
               <Layout className="w-4 h-4" /> Market Analytics
            </button>
            <button 
              onClick={() => setActiveTab('transactions')}
              className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-bold transition-all ${activeTab === 'transactions' ? 'bg-gem-gold/20 text-gem-gold border border-gem-gold/30' : 'text-white/40 hover:text-white'}`}
            >
               <CreditCard className="w-4 h-4" /> Order Logistics
            </button>
            <button 
              onClick={() => setActiveTab('alumni')}
              className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-bold transition-all ${activeTab === 'alumni' ? 'bg-gem-gold/20 text-gem-gold border border-gem-gold/30' : 'text-white/40 hover:text-white'}`}
            >
               <Users className="w-4 h-4" /> Alumni Network
            </button>
            <button 
              onClick={() => setActiveTab('hero')}
              className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-bold transition-all ${activeTab === 'hero' ? 'bg-gem-gold/10 text-white border border-white/5' : 'text-white/40 hover:text-white'}`}
            >
               <Home className="w-4 h-4" /> System Core
            </button>
            <button 
              onClick={() => setActiveTab('products')}
              className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-bold transition-all ${activeTab === 'products' ? 'bg-gem-gold/10 text-white border border-white/5' : 'text-white/40 hover:text-white'}`}
            >
               <ShoppingBag className="w-4 h-4" /> Product Catalog
            </button>
            <button 
              onClick={() => setActiveTab('payment')}
              className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-bold transition-all ${activeTab === 'payment' ? 'bg-gem-gold/10 text-white border border-white/5' : 'text-white/40 hover:text-white'}`}
            >
               <Save className="w-4 h-4" /> API Settings
            </button>
          </nav>

        </div>
        <button onClick={logout} className="text-white/40 hover:text-red-400 flex items-center gap-2 text-sm font-bold transition-colors">
          <LogOut className="w-4 h-4" /> Terminate Session
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 pl-0 overflow-y-auto">
         <div className="glass-card min-h-full p-10 border-white/5">
           
           <div className="flex justify-between items-center mb-10">
              <div>
                 <h1 className="text-3xl font-display font-bold text-white capitalize">{activeTab} Adjustments</h1>
                 <p className="text-white/40 text-sm mt-1">Modify live content directly.</p>
              </div>
              <button onClick={handleSave} disabled={loading} className="neon-button flex items-center gap-2 py-3 px-6">
                <Save className="w-4 h-4" /> {loading ? 'SAVING...' : 'COMMIT CHANGES'}
              </button>
           </div>

           {activeTab === 'hero' && (
              <div className="space-y-6 max-w-2xl">
                 <div className="space-y-2">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Hero Subtitle</label>
                   <input type="text" value={data.hero.subtitle} onChange={e => setData({...data, hero: {...data.hero, subtitle: e.target.value}})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gem-gold" />
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Hero Title (HTML supported)</label>
                   <textarea rows={3} value={data.hero.title} onChange={e => setData({...data, hero: {...data.hero, title: e.target.value}})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gem-gold" />
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Description</label>
                   <textarea rows={4} value={data.hero.description} onChange={e => setData({...data, hero: {...data.hero, description: e.target.value}})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gem-gold" />

                 </div>
              </div>
           )}

            {activeTab === 'products' && (
               <div className="space-y-8">
                  <div className="flex justify-end">
                    <button onClick={addNewProduct} className="flex items-center gap-2 bg-gem-gold/20 text-gem-gold border border-gem-gold/30 px-5 py-3 rounded-xl font-bold hover:bg-gem-gold hover:text-obsidian transition-all">
                       <Plus className="w-4 h-4" /> ADD NEW MERCHANDISE
                    </button>
                  </div>
                  {data.products.map((p: any, index: number) => (
                     <div key={p.id} className="p-6 bg-white/5 border border-white/10 rounded-2xl flex gap-6 items-start relative">
                        <button 
                          onClick={() => deleteProduct(p.id)}
                          className="absolute top-6 right-6 p-2 text-white/20 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                          title="Delete Product"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                        <img src={p.image} alt="preview" className="w-24 h-24 rounded-lg object-cover bg-black" />
                       <div className="flex-1 space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Product Name</label>
                              <input type="text" value={p.name} onChange={e => {
                                 const newP = [...data.products];
                                 newP[index].name = e.target.value;
                                  setData({...data, products: newP});
                              }} className="w-full bg-obsidian-light/50 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-gem-gold" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Price (Integer IDR)</label>
                              <input type="number" value={p.price} onChange={e => {
                                 const newP = [...data.products];
                                 newP[index].price = parseInt(e.target.value);
                                 setData({...data, products: newP});
                              }} className="w-full bg-obsidian-light/50 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-gem-gold" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Status</label>
                              <select value={p.status} onChange={e => {
                                 const newP = [...data.products];
                                 newP[index].status = e.target.value;
                                 setData({...data, products: newP});
                              }} className="w-full bg-obsidian-light/50 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-gem-gold">
                                 <option value="Available">Available</option>
                                 <option value="Pre-Order">Pre-Order</option>
                              </select>
                            </div>
                            <div className="space-y-2">
                               <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Size Selection</label>
                               <button 
                                 onClick={() => {
                                   const newP = [...data.products];
                                   newP[index].has_sizes = !newP[index].has_sizes;
                                   setData({...data, products: newP});
                                 }}
                                 className={`w-full px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border ${
                                   !!p.has_sizes 
                                     ? 'bg-gem-emerald/20 text-gem-emerald border-gem-emerald/30' 
                                     : 'bg-red-500/10 text-red-400 border-red-500/20 hover:border-red-500/40'
                                 }`}
                               >
                                 {!!p.has_sizes ? '✅ SIZING ENABLED' : '❌ NO SIZE SELECTION'}
                               </button>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Product Image</label>
                              <div className="flex gap-2">
                                <label className="flex-1 cursor-pointer bg-obsidian-light/50 border border-white/10 rounded-xl px-4 py-2 text-white hover:border-gem-gold transition text-center text-sm flex items-center justify-center">
                                  {uploadingImageId === p.id ? 'UPLOADING...' : 'CHOOSE IMAGE'}
                                  <input type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, index, p.id)} disabled={uploadingImageId === p.id} />
                                </label>
                                <input type="text" value={p.image} onChange={e => {
                                   const newP = [...data.products];
                                   newP[index].image = e.target.value;
                                   setData({...data, products: newP});
                                }} className="flex-[2] bg-obsidian-light/50 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-gem-gold text-sm" placeholder="Or enter URL directly" />
                              </div>
                            </div>
                            <div className="col-span-2 space-y-2">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Description</label>
                              <textarea rows={2} value={p.description} onChange={e => {
                                 const newP = [...data.products];
                                 newP[index].description = e.target.value;
                                 setData({...data, products: newP});
                              }} className="w-full bg-obsidian-light/50 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-gem-gold" />

                            </div>
                          </div>
                       </div>
                    </div>
                 ))}
                 <p className="text-xs text-white/30 italic">Note: Adding/Deleting products is skipped for this MVP demo, simply edit the existing items.</p>
              </div>
           )}

            {activeTab === 'revenue' && revenue && (
               <div className="space-y-12">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div className="p-8 glass-card bg-gem-gold/20 border-gem-gold/30">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gem-gold/60 mb-2">Total Revenue (Verified)</p>
                        <h3 className="text-4xl font-display font-bold text-gem-gold">IDR {(revenue.totalRevenue / 1000).toLocaleString()}K</h3>
                     </div>
                     <div className="p-8 glass-card">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-2">Total Orders</p>
                        <h3 className="text-4xl font-display font-bold text-white">{transactions.length}</h3>
                     </div>
                     <div className="p-8 glass-card">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-2">Pending Fulfillment</p>
                        <h3 className="text-4xl font-display font-bold text-white">
                          {transactions.filter((t:any) => t.status === 'success' && t.fulfillment_status === 'processing').length}
                        </h3>
                     </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-3">Monthly Performance</h3>
                    <div className="flex items-end gap-4 h-48 bg-white/5 rounded-2xl p-8 items-end">
                       {revenue.monthlyRevenue.map((m:any) => {
                          const max = Math.max(...revenue.monthlyRevenue.map((r:any) => r.total)) || 1;
                          const height = (m.total / max) * 100;
                          return (
                            <div key={m.month} className="flex-1 group relative flex flex-col items-center">
                               <div className="w-full bg-gem-gold/40 rounded-t-lg transition-all hover:bg-gem-gold" style={{ height: `${height}%` }}>
                                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gem-gold text-obsidian px-3 py-1 rounded text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                    {(m.total / 1000).toLocaleString()}K
                                  </div>
                                </div>
                               <span className="text-[8px] font-bold uppercase tracking-widest text-white/30 mt-4">{m.month}</span>
                            </div>
                          )
                       })}
                    </div>
                  </div>
               </div>
            )}

            {activeTab === 'transactions' && (
               <div className="space-y-6">
                  <div className="overflow-hidden glass-card !rounded-2xl border-white/5">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead className="bg-white/5 text-[10px] font-bold uppercase tracking-widest text-white/40">
                        <tr>
                          <th className="px-6 py-4">Order ID</th>
                          <th className="px-6 py-4">Customer</th>
                          <th className="px-6 py-4">Contact</th>
                          <th className="px-6 py-4">Product</th>
                          <th className="px-6 py-4">Size</th>
                          <th className="px-6 py-4">Total</th>
                          <th className="px-6 py-4">Payment</th>
                          <th className="px-6 py-4">Logistics</th>
                          <th className="px-6 py-4">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {transactions.map((t:any) => (
                          <tr key={t.order_id} className="hover:bg-white/5 transition-colors">
                             <td className="px-6 py-4 font-mono text-xs">{t.order_id}</td>
                             <td className="px-6 py-4">
                               <div className="font-bold text-white">{t.customer_name}</div>
                               <div className="text-[10px] text-white/30">{t.customer_email}</div>
                             </td>
                             <td className="px-6 py-4">
                               <div className="font-mono text-xs text-gem-gold">{t.customer_whatsapp}</div>
                             </td>
                             <td className="px-6 py-4 font-bold text-white/70">{t.product_name}</td>
                             <td className="px-6 py-4">
                               <span className="px-2 py-1 rounded bg-white/5 text-[10px] font-bold text-white/60">
                                 {t.product_size || '-'}
                               </span>
                             </td>
                             <td className="px-6 py-4 font-bold text-gem-gold">IDR {(t.gross_amount / 1000).toLocaleString()}K</td>
                             <td className="px-6 py-4">
                               <span className={`px-2 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                                 t.status === 'success' ? 'bg-gem-emerald/20 text-gem-emerald' : 
                                 t.status === 'pending' ? 'bg-gem-gold/20 text-gem-gold' : 
                                 'bg-red-500/20 text-red-400'
                               }`}>
                                 {t.status}
                               </span>
                             </td>
                             <td className="px-6 py-4">
                               <span className={`px-2 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                                 t.fulfillment_status === 'delivered' ? 'bg-gem-emerald/20 text-gem-emerald' : 
                                 t.fulfillment_status === 'shipped' ? 'bg-blue-500/20 text-blue-400' : 
                                 'bg-white/10 text-white/40'
                               }`}>
                                 {t.fulfillment_status}
                               </span>
                             </td>
                             <td className="px-6 py-4">
                               <select 
                                 value={t.fulfillment_status} 
                                 onChange={(e) => updateFulfillment(t.order_id, e.target.value)}
                                 className="bg-obsidian border border-white/10 rounded px-2 py-1 text-[10px] font-bold text-white/60 focus:border-gem-gold outline-none"
                               >
                                 <option value="processing">Processing</option>
                                 <option value="shipped">Shipped</option>
                                 <option value="delivered">Delivered</option>
                               </select>
                             </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
               </div>
            )}

            {activeTab === 'alumni' && (
               <div className="space-y-6">
                  <header className="flex justify-between items-end mb-6">
                    <div>
                      <h3 className="text-2xl font-display font-bold text-white">Member Directory</h3>
                      <p className="text-white/40 text-xs">Verify and manage the alumni community members.</p>
                    </div>
                  </header>

                  <div className="overflow-hidden glass-card !rounded-2xl border-white/5">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead className="bg-white/5 text-[10px] font-bold uppercase tracking-widest text-white/40">
                        <tr>
                          <th className="px-6 py-4">Full Name</th>
                          <th className="px-6 py-4">Batch</th>
                          <th className="px-6 py-4">Contact (WA)</th>
                          <th className="px-6 py-4">Location</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {alumni.map((a:any) => (
                          <tr key={a.id} className="hover:bg-white/5 transition-colors">
                             <td className="px-6 py-4 font-bold text-white">{a.full_name}</td>
                             <td className="px-6 py-4 font-mono text-gem-gold">{a.batch_year}</td>
                             <td className="px-6 py-4 font-mono text-xs">{a.whatsapp}</td>
                             <td className="px-6 py-4 text-white/60">{a.location || '-'}</td>
                             <td className="px-6 py-4">
                               <span className={`px-2 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                                 a.status === 'approved' ? 'bg-gem-emerald/20 text-gem-emerald' : 'bg-gem-gold/20 text-gem-gold'
                               }`}>
                                 {a.status}
                               </span>
                             </td>
                             <td className="px-6 py-4">
                               <div className="flex gap-2">
                                  {a.status === 'pending' && (
                                    <button 
                                      onClick={() => updateAlumniStatus(a.id, 'approved')}
                                      className="px-3 py-1 bg-gem-emerald/20 text-gem-emerald hover:bg-gem-emerald text-[10px] font-bold rounded transition-colors"
                                    >
                                      APPROVE
                                    </button>
                                  )}
                                  <button 
                                    onClick={() => { if(confirm('Delete member?')) updateAlumniStatus(a.id, 'rejected') }}
                                    className="px-3 py-1 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white text-[10px] font-bold rounded transition-colors"
                                  >
                                    REMOVE
                                  </button>
                               </div>
                             </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
               </div>
            )}

            {activeTab === 'payment' && paymentData && (
              <div className="space-y-6 max-w-2xl">
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Environment Mode</label>
                    <select 
                      value={paymentData.is_production ? 'true' : 'false'} 
                      onChange={e => setPaymentData({...paymentData, is_production: e.target.value === 'true'})} 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gem-gold"
                    >
                       <option value="false">Sandbox (Test Mode)</option>
                       <option value="true">Production (Live)</option>
                    </select>
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Midtrans Client Key</label>
                   <input 
                     type="text" 
                     value={paymentData.client_key} 
                     onChange={e => setPaymentData({...paymentData, client_key: e.target.value})} 
                     className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gem-gold" 
                   />
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Midtrans Server Key</label>
                   <input 
                     type="password" 
                     value={paymentData.server_key} 
                     onChange={e => setPaymentData({...paymentData, server_key: e.target.value})} 
                     className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gem-gold tracking-widest font-mono" 
                     placeholder="SB-Mid-server-..."
                   />
                 </div>
                 <p className="text-xs text-white/40 mt-4 leading-relaxed">
                   <strong>Security Standard:</strong> We are masking the server key as dots for safety against shoulder surfing. Ensure your keys map to the selected Environment Mode. After updating, click COMMIT CHANGES.
                 </p>
              </div>
           )}

         </div>
      </div>
    </div>
  );
}
