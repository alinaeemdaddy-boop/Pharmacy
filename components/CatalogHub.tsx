
import React, { useState, useMemo } from 'react';
import { Product, StockUnit } from '../types';

interface CatalogHubProps {
  products: Product[];
  stock: StockUnit[];
  onAdd: (p: Product) => void;
}

const CatalogHub: React.FC<CatalogHubProps> = ({ products, stock, onAdd }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const categories = useMemo(() => ['ALL', ...new Set(products.map(p => p.category))], [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.brand.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = filterCategory === 'ALL' || p.category === filterCategory;
      return matchesSearch && matchesCat;
    });
  }, [products, searchQuery, filterCategory]);

  return (
    <div className="space-y-6 md:space-y-10 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-800 dark:text-white tracking-tighter leading-none">Catalog Hub</h2>
          <p className="text-blue-500 font-black text-[10px] md:text-sm mt-3 uppercase tracking-[0.3em]">Master Pharmacopoeia Control</p>
        </div>
        <div className="flex flex-col sm:flex-row w-full md:w-auto items-stretch md:items-center gap-4">
          <div className="relative group flex-1">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <input 
              type="text" 
              placeholder="Search global matrix..." 
              className="w-full md:w-80 pl-11 pr-4 py-3 bg-white dark:bg-slate-800 border-none rounded-xl md:rounded-[1.5rem] text-sm font-bold shadow-lg focus:ring-4 focus:ring-blue-500/20 transition-all outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-tr from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl md:rounded-[1.5rem] text-[10px] md:text-xs font-black uppercase tracking-widest shadow-xl flex items-center justify-center"
          >
            Register Entity
          </button>
        </div>
      </div>

      <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-2 px-1">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-6 py-2 rounded-xl text-[8px] md:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filterCategory === cat ? 'bg-blue-600 text-white shadow-lg' : 'bg-white dark:bg-slate-800 text-slate-400'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="glass-premium overflow-hidden shadow-2xl relative">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left min-w-[800px] md:min-w-0">
            <thead className="bg-slate-50/50 dark:bg-slate-900/50 text-slate-400 text-[8px] md:text-[10px] font-black uppercase tracking-widest border-b border-white/5">
              <tr>
                <th className="px-4 md:px-10 py-4 md:py-8">Medication</th>
                <th className="px-4 md:px-10 py-4 md:py-8">Stock</th>
                <th className="px-4 md:px-10 py-4 md:py-8">Economics</th>
                <th className="px-4 md:px-10 py-4 md:py-8 text-right">Ops</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredProducts.map((p, idx) => {
                const globalQty = stock.filter(s => s.productId === p.id).reduce((acc, curr) => acc + curr.quantity, 0);
                const isExpanded = expandedRow === p.id;
                const isCritical = globalQty < p.lowStockThreshold;

                return (
                  <React.Fragment key={p.id}>
                    <tr className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 cursor-pointer" onClick={() => setExpandedRow(isExpanded ? null : p.id)}>
                      <td className="px-4 md:px-10 py-6">
                        <div className="flex items-center">
                          <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-xl md:text-2xl shadow-lg ${isCritical ? 'bg-rose-100' : 'bg-slate-100 dark:bg-slate-800'}`}>💊</div>
                          <div className="ml-3 md:ml-6">
                            <p className="font-black text-slate-800 dark:text-white text-sm md:text-base leading-none mb-1">{p.name}</p>
                            <span className="text-[8px] md:text-[10px] text-blue-500 font-black uppercase">{p.brand}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 md:px-10 py-6">
                        <div className="flex flex-col">
                          <span className={`text-base md:text-xl font-black ${isCritical ? 'text-rose-500' : 'text-slate-800 dark:text-white'}`}>{globalQty.toLocaleString()}</span>
                          <span className="text-[8px] md:text-[10px] text-slate-400 uppercase">Min: {p.lowStockThreshold}</span>
                        </div>
                      </td>
                      <td className="px-4 md:px-10 py-6">
                         <span className="text-sm md:text-lg font-black text-slate-900 dark:text-white">${p.unitPrice.toFixed(2)}</span>
                      </td>
                      <td className="px-4 md:px-10 py-6 text-right">
                        <button className={`p-2 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"/></svg>
                        </button>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="bg-slate-50/50 dark:bg-slate-900/50">
                        <td colSpan={4} className="px-4 md:px-16 py-8 md:py-12 animate-slide-in">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12">
                            <div className="space-y-4">
                              <h4 className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Network Data</h4>
                              {stock.filter(s => s.productId === p.id).map(s => (
                                <div key={s.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-white/5 flex justify-between items-center shadow-md">
                                  <span className="text-[10px] font-black uppercase text-slate-500">Node: {s.locationId}</span>
                                  <span className="text-sm font-black text-blue-600">{s.quantity}</span>
                                </div>
                              ))}
                            </div>
                            <div className="p-6 bg-gradient-to-tr from-slate-900 to-blue-900 rounded-[2rem] text-white shadow-xl">
                               <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest mb-4">Economics</p>
                               <div className="flex justify-between items-end">
                                  <p className="text-2xl font-black tracking-tighter">${(globalQty * p.unitCost).toLocaleString()}</p>
                                  <span className="text-[10px] font-black text-emerald-400">Net Value</span>
                               </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
          <div className="md:hidden absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white/20 to-transparent pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
};

export default CatalogHub;
