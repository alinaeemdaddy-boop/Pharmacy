
import React, { useState, useMemo } from 'react';
import { Product, StockUnit } from '../types';

interface InventoryViewProps {
  products: Product[];
  stock: StockUnit[];
  onAddProduct: (p: Product) => void;
  onUpdateProduct: (p: Product) => void;
}

const InventoryView: React.FC<InventoryViewProps> = ({ products, stock, onAddProduct, onUpdateProduct }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const productData: Product = {
      id: editingProduct?.id || `p-${Date.now()}`,
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      brand: formData.get('brand') as string,
      unitPrice: Number(formData.get('unitPrice')),
      unitCost: Number(formData.get('unitCost')),
      lowStockThreshold: Number(formData.get('lowStockThreshold')),
    };

    if (editingProduct) {
      onUpdateProduct(productData);
    } else {
      onAddProduct(productData);
    }
    closeModal();
  };

  const openModal = (p?: Product) => {
    setEditingProduct(p || null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Medication Catalog</h2>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Global Inventory Repository</p>
        </div>
        <div className="flex space-x-4">
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <input 
              type="text" 
              placeholder="Filter catalog..." 
              className="pl-10 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-xs font-bold outline-none focus:ring-4 focus:ring-cyan-500/10 transition-all w-64 shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            onClick={() => openModal()}
            className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-cyan-600 transition-all shadow-xl shadow-slate-900/10 flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"/></svg>
            Register Medicine
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden card-hover">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
              <tr>
                <th className="px-8 py-5">Product Identity</th>
                <th className="px-8 py-5">Global Stock</th>
                <th className="px-8 py-5">Unit Economics</th>
                <th className="px-8 py-5 text-center">Alerting</th>
                <th className="px-8 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((p, idx) => {
                const globalQty = stock.filter(s => s.productId === p.id).reduce((acc, curr) => acc + curr.quantity, 0);
                const isCritical = globalQty < p.lowStockThreshold;

                return (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group animate-slide-in" style={{ animationDelay: `${idx * 0.05}s` }}>
                    <td className="px-8 py-6">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-lg mr-4 border border-slate-100">💊</div>
                        <div>
                          <p className="font-extrabold text-slate-800 text-base">{p.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5 tracking-wider">{p.brand} • {p.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-3">
                        <span className={`text-xl font-black ${isCritical ? 'text-red-500' : 'text-slate-800'}`}>
                          {globalQty.toLocaleString()}
                        </span>
                        <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${isCritical ? 'bg-red-500' : 'bg-cyan-500'}`} 
                            style={{ width: `${Math.min(100, (globalQty / p.lowStockThreshold) * 50)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-slate-800">Sell: ${p.unitPrice.toFixed(2)}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Cost: ${p.unitCost.toFixed(2)}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${isCritical ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                        {isCritical ? 'Low Level' : 'Optimized'}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button 
                        onClick={() => openModal(p)}
                        className="p-3 bg-white border border-slate-200 text-slate-400 rounded-2xl hover:text-cyan-600 hover:border-cyan-200 transition-all shadow-sm group-hover:shadow-md"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl p-12 animate-scale-up border border-white/20">
            <h3 className="text-3xl font-black text-slate-800 mb-8 tracking-tight">
              {editingProduct ? 'Update Medication' : 'Register New Medicine'}
            </h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-8">
              <div className="col-span-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Product Name</label>
                <input required name="name" defaultValue={editingProduct?.name} className="w-full p-5 bg-slate-50 border-none rounded-[1.5rem] font-bold text-slate-700 outline-none focus:ring-4 focus:ring-cyan-500/10 transition-all" placeholder="e.g. Panadol 500mg" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Category</label>
                <input required name="category" defaultValue={editingProduct?.category} className="w-full p-5 bg-slate-50 border-none rounded-[1.5rem] font-bold text-slate-700 outline-none focus:ring-4 focus:ring-cyan-500/10 transition-all" placeholder="e.g. Analgesics" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Brand</label>
                <input required name="brand" defaultValue={editingProduct?.brand} className="w-full p-5 bg-slate-50 border-none rounded-[1.5rem] font-bold text-slate-700 outline-none focus:ring-4 focus:ring-cyan-500/10 transition-all" placeholder="e.g. GSK" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Unit Sell Price ($)</label>
                <input required name="unitPrice" type="number" step="0.01" defaultValue={editingProduct?.unitPrice} className="w-full p-5 bg-slate-50 border-none rounded-[1.5rem] font-bold text-slate-700 outline-none focus:ring-4 focus:ring-cyan-500/10 transition-all" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Unit Cost ($)</label>
                <input required name="unitCost" type="number" step="0.01" defaultValue={editingProduct?.unitCost} className="w-full p-5 bg-slate-50 border-none rounded-[1.5rem] font-bold text-slate-700 outline-none focus:ring-4 focus:ring-cyan-500/10 transition-all" />
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Low Stock Alert Threshold</label>
                <input required name="lowStockThreshold" type="number" defaultValue={editingProduct?.lowStockThreshold || 100} className="w-full p-5 bg-slate-50 border-none rounded-[1.5rem] font-bold text-slate-700 outline-none focus:ring-4 focus:ring-cyan-500/10 transition-all" />
              </div>
              <div className="col-span-2 flex space-x-6 mt-4">
                <button type="button" onClick={closeModal} className="flex-1 py-5 text-slate-400 font-black uppercase text-xs hover:text-slate-600 transition-colors">Discard</button>
                <button type="submit" className="flex-[2] py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-cyan-600 transition-all active:scale-95">
                  {editingProduct ? 'Apply Changes' : 'Register Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryView;
