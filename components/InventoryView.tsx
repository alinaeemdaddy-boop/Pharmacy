
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
    // Fix: add complianceStatus property to satisfy Product interface requirements
    const productData: Product = {
      id: editingProduct?.id || `p-${Date.now()}`,
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      brand: formData.get('brand') as string,
      unitPrice: Number(formData.get('unitPrice')),
      unitCost: Number(formData.get('unitCost')),
      lowStockThreshold: Number(formData.get('lowStockThreshold')),
      complianceStatus: editingProduct?.complianceStatus || 'STABLE',
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
    <div className="space-y-6 md:space-y-10 animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight leading-none">Catalog Hub</h2>
          <p className="text-slate-400 font-bold text-xs md:text-sm mt-2 uppercase tracking-widest">Global pharmacopoeia standard</p>
        </div>
        <div className="flex flex-col sm:flex-row w-full md:w-auto items-stretch md:items-center gap-4">
          <div className="relative group flex-1">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-sky-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <input 
              type="text" 
              placeholder="Filter master list..." 
              className="w-full md:w-64 pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:ring-4 focus:ring-sky-500/10 transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            onClick={() => openModal()}
            className="btn-primary text-white px-8 py-3.5 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest shadow-lg flex items-center justify-center whitespace-nowrap active:scale-95"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"/></svg>
            Add Medicine
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden card-premium group/table">
        <div className="overflow-x-auto custom-scrollbar relative">
          <table className="w-full text-left min-w-[800px] md:min-w-0">
            <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
              <tr>
                <th className="px-6 md:px-10 py-6">Identity</th>
                <th className="px-6 md:px-10 py-6">Network Stock</th>
                <th className="px-6 md:px-10 py-6">Economics</th>
                <th className="px-6 md:px-10 py-6">Compliance</th>
                <th className="px-6 md:px-10 py-6 text-right">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/60">
              {filteredProducts.map((p, idx) => {
                const globalQty = stock.filter(s => s.productId === p.id).reduce((acc, curr) => acc + curr.quantity, 0);
                const isCritical = globalQty < p.lowStockThreshold;

                return (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group animate-slide-in" style={{ animationDelay: `${idx * 0.04}s` }}>
                    <td className="px-6 md:px-10 py-6 md:py-8">
                      <div className="flex items-center">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-100 rounded-xl md:rounded-2xl flex items-center justify-center text-xl md:text-2xl mr-4 md:mr-5 border border-slate-100">💊</div>
                        <div>
                          <p className="font-extrabold text-slate-800 text-sm md:text-base leading-none mb-1.5">{p.name}</p>
                          <div className="flex items-center space-x-2">
                             <span className="text-[9px] font-black text-sky-600 bg-sky-50 px-2 py-0.5 rounded tracking-wide">{p.brand}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 md:px-10 py-6 md:py-8">
                      <div className="flex flex-col space-y-2">
                        <div className="flex justify-between items-end mb-1">
                           <span className={`text-lg md:text-xl font-black tracking-tighter ${isCritical ? 'text-rose-500' : 'text-slate-800'}`}>
                             {globalQty.toLocaleString()}
                           </span>
                        </div>
                        <div className="h-1.5 w-24 md:w-32 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ${isCritical ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.3)]' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]'}`} 
                            style={{ width: `${Math.min(100, (globalQty / p.lowStockThreshold) * 70)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 md:px-10 py-6 md:py-8">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-800">${p.unitPrice.toFixed(2)}</span>
                        <span className="text-[9px] font-bold text-emerald-600 uppercase mt-0.5">Margin +{Math.round((p.unitPrice - p.unitCost) / p.unitCost * 100)}%</span>
                      </div>
                    </td>
                    <td className="px-6 md:px-10 py-6 md:py-8">
                      <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-colors ${
                        isCritical 
                          ? 'bg-rose-50 text-rose-500 border-rose-100' 
                          : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                      }`}>
                        {isCritical ? 'Refill' : 'Stable'}
                      </span>
                    </td>
                    <td className="px-6 md:px-10 py-6 md:py-8 text-right">
                      <button 
                        onClick={() => openModal(p)}
                        className="w-9 h-9 md:w-10 md:h-10 bg-white border border-slate-200 text-slate-400 rounded-xl flex items-center justify-center hover:text-sky-600 hover:border-sky-300 transition-all active:scale-90"
                      >
                        <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="md:hidden absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white/80 to-transparent pointer-events-none"></div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] md:rounded-[3rem] shadow-2xl w-full max-w-2xl p-6 md:p-12 lg:p-14 animate-scale-in border border-white/20 relative overflow-y-auto max-h-[90vh] custom-scrollbar">
            <div className="absolute top-0 left-0 w-full h-1.5 btn-primary"></div>
            <h3 className="text-2xl md:text-3xl font-black text-slate-800 mb-2 tracking-tight">
              {editingProduct ? 'Update Entity' : 'Master Registration'}
            </h3>
            <p className="text-slate-400 text-xs md:text-sm font-medium mb-8 md:mb-10">Commit pharmaceutical standards to the global ledger.</p>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 lg:gap-x-8 gap-y-6 md:gap-y-10">
              <div className="md:col-span-2">
                <label className="block text-[10px] md:text-[11px] font-black text-slate-400 uppercase mb-2 md:mb-3 tracking-widest">Scientific Nomenclature</label>
                <input required name="name" defaultValue={editingProduct?.name} className="w-full px-5 md:px-6 py-3.5 md:py-4 input-premium rounded-xl md:rounded-2xl font-bold text-slate-700 text-sm" placeholder="e.g. Paracetamol USP 500" />
              </div>
              <div>
                <label className="block text-[10px] md:text-[11px] font-black text-slate-400 uppercase mb-2 md:mb-3 tracking-widest">Therapeutic Class</label>
                <input required name="category" defaultValue={editingProduct?.category} className="w-full px-5 md:px-6 py-3.5 md:py-4 input-premium rounded-xl md:rounded-2xl font-bold text-slate-700 text-sm" placeholder="e.g. Analgesic" />
              </div>
              <div>
                <label className="block text-[10px] md:text-[11px] font-black text-slate-400 uppercase mb-2 md:mb-3 tracking-widest">Manufacture Brand</label>
                <input required name="brand" defaultValue={editingProduct?.brand} className="w-full px-5 md:px-6 py-3.5 md:py-4 input-premium rounded-xl md:rounded-2xl font-bold text-slate-700 text-sm" placeholder="e.g. Pfizer" />
              </div>
              <div>
                <label className="block text-[10px] md:text-[11px] font-black text-slate-400 uppercase mb-2 md:mb-3 tracking-widest">Sell Unit ($)</label>
                <input required name="unitPrice" type="number" step="0.01" defaultValue={editingProduct?.unitPrice} className="w-full px-5 md:px-6 py-3.5 md:py-4 input-premium rounded-xl md:rounded-2xl font-bold text-slate-700 text-sm" />
              </div>
              <div>
                <label className="block text-[10px] md:text-[11px] font-black text-slate-400 uppercase mb-2 md:mb-3 tracking-widest">Cost Unit ($)</label>
                <input required name="unitCost" type="number" step="0.01" defaultValue={editingProduct?.unitCost} className="w-full px-5 md:px-6 py-3.5 md:py-4 input-premium rounded-xl md:rounded-2xl font-bold text-slate-700 text-sm" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] md:text-[11px] font-black text-slate-400 uppercase mb-2 md:mb-3 tracking-widest">Critical Alert Threshold</label>
                <input required name="lowStockThreshold" type="number" defaultValue={editingProduct?.lowStockThreshold || 100} className="w-full px-5 md:px-6 py-3.5 md:py-4 input-premium rounded-xl md:rounded-2xl font-bold text-slate-700 text-sm" />
              </div>
              <div className="md:col-span-2 flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-6 pt-6 border-t border-slate-100">
                <button type="button" onClick={closeModal} className="w-full md:flex-1 py-4 text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-slate-600 order-2 md:order-1 transition-colors">Discard</button>
                <button type="submit" className="w-full md:flex-[2] py-4 btn-primary text-white rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-[0.2em] shadow-xl order-1 md:order-2 active:scale-95">
                  {editingProduct ? 'Commit Updates' : 'Establish Entry'}
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
