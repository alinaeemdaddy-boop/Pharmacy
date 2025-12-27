
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
    <div className="space-y-10 animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div>
          <h2 className="text-5xl font-black text-slate-800 dark:text-white tracking-tighter leading-none">Catalog Hub</h2>
          <p className="text-blue-500 font-black text-sm mt-3 uppercase tracking-[0.3em]">Master Pharmacopoeia Control</p>
        </div>
        <div className="flex flex-col sm:flex-row w-full md:w-auto items-stretch md:items-center gap-6">
          <div className="relative group flex-1">
            <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500 group-focus-within:scale-125 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <input 
              type="text" 
              placeholder="Search global matrix..." 
              className="w-full md:w-80 pl-14 pr-6 py-4 bg-white dark:bg-slate-800 border-none rounded-[1.5rem] text-sm font-bold shadow-xl focus:ring-4 focus:ring-blue-500/20 transition-all outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-tr from-blue-600 to-indigo-600 text-white px-10 py-4 rounded-[1.5rem] text-xs font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center whitespace-nowrap"
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"/></svg>
            Register Entity
          </button>
        </div>
      </div>

      <div className="flex space-x-3 overflow-x-auto no-scrollbar pb-4 px-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 whitespace-nowrap ${filterCategory === cat ? 'bg-blue-600 text-white shadow-[0_15px_30px_-5px_rgba(37,99,235,0.4)] scale-110' : 'bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-md hover:-translate-y-1'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="glass-premium overflow-hidden shadow-2xl">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left min-w-[1200px]">
            <thead className="bg-slate-50/50 dark:bg-slate-900/50 text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.25em] border-b border-white/5">
              <tr>
                <th className="px-10 py-8">Identification</th>
                <th className="px-10 py-8">Strategic Data</th>
                <th className="px-10 py-8">Network Capacity</th>
                <th className="px-10 py-8">Economics</th>
                <th className="px-10 py-8">Integrity</th>
                <th className="px-10 py-8 text-right">Ops</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredProducts.map((p, idx) => {
                const globalQty = stock.filter(s => s.productId === p.id).reduce((acc, curr) => acc + curr.quantity, 0);
                const isExpanded = expandedRow === p.id;
                const isCritical = globalQty < p.lowStockThreshold;

                return (
                  <React.Fragment key={p.id}>
                    <tr className={`hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-all duration-500 group cursor-pointer ${isExpanded ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''}`} onClick={() => setExpandedRow(isExpanded ? null : p.id)}>
                      <td className="px-10 py-8">
                        <div className="flex items-center">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-2xl transition-all duration-700 ${isExpanded ? 'rotate-12 scale-125' : 'group-hover:rotate-6'} ${isCritical ? 'bg-rose-100' : 'bg-slate-100 dark:bg-slate-800'}`}>💊</div>
                          <div className="ml-6">
                            <p className="font-black text-slate-800 dark:text-white text-lg leading-none mb-1.5">{p.name}</p>
                            <div className="flex items-center space-x-2">
                               <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                               <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">ID: {p.id.toUpperCase()}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-slate-700 dark:text-slate-300">{p.brand}</span>
                          <span className="text-[10px] text-blue-500 font-black uppercase tracking-widest mt-1">{p.category}</span>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex flex-col space-y-2">
                          <div className="flex justify-between items-end mb-1">
                             <span className={`text-2xl font-black tracking-tighter ${isCritical ? 'text-rose-500' : 'text-slate-800 dark:text-white'}`}>{globalQty.toLocaleString()}</span>
                             <span className="text-[9px] font-black text-slate-400 uppercase">/ {p.lowStockThreshold} Min</span>
                          </div>
                          <div className="h-2 w-48 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                            <div className={`h-full rounded-full transition-all duration-1000 ${isCritical ? 'bg-gradient-to-r from-rose-600 to-pink-500 pulse-glow' : 'bg-gradient-to-r from-blue-600 to-cyan-500'}`} style={{ width: `${Math.min(100, (globalQty / (p.lowStockThreshold * 2)) * 100)}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex flex-col">
                          <span className="text-xl font-black text-slate-900 dark:text-white">${p.unitPrice.toFixed(2)}</span>
                          <span className="text-[10px] text-emerald-500 font-black uppercase tracking-widest mt-1">ROI: +{Math.round((p.unitPrice - p.unitCost) / p.unitCost * 100)}%</span>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border transition-all duration-500 text-center ${
                          p.complianceStatus === 'STABLE' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 
                          p.complianceStatus === 'WARNING' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]' :
                          'bg-rose-500/10 text-rose-500 border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.1)]'
                        }`}>
                          {p.complianceStatus}
                        </div>
                      </td>
                      <td className="px-10 py-8 text-right">
                        <div className="flex justify-end space-x-2">
                           <button className="p-3 bg-white dark:bg-slate-800 rounded-xl text-slate-400 hover:text-blue-500 hover:shadow-xl hover:-translate-y-1 transition-all border border-white/5">
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                           </button>
                           <button className={`p-3 bg-white dark:bg-slate-800 rounded-xl transition-all border border-white/5 ${isExpanded ? 'rotate-180 text-blue-500' : 'text-slate-400'}`}>
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"/></svg>
                           </button>
                        </div>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="bg-slate-50/50 dark:bg-slate-900/50">
                        <td colSpan={6} className="px-16 py-12 animate-scale-up">
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            {/* Stock Movement Visualizer */}
                            <div className="space-y-6">
                              <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">Network Distribution</h4>
                              <div className="space-y-4">
                                {stock.filter(s => s.productId === p.id).map(s => (
                                  <div key={s.id} className="bg-white dark:bg-slate-800 p-5 rounded-[1.5rem] border border-white/10 flex justify-between items-center shadow-xl hover:translate-x-2 transition-transform">
                                    <div>
                                      <p className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-tighter">Loc: {s.locationId.toUpperCase()}</p>
                                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Batch: {s.batchNumber} • EXP: {s.expiryDate}</p>
                                    </div>
                                    <div className="text-right">
                                       <span className="text-xl font-black text-blue-600">{s.quantity}</span>
                                       <p className="text-[8px] text-slate-400 font-black uppercase">Units</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            {/* Compliance Intelligence */}
                            <div className="space-y-6">
                               <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">Regulatory Pipeline</h4>
                               <div className="space-y-4">
                                  {[
                                    { l: 'FDA Market Approval', s: 'Verified', v: true },
                                    { l: 'Controlled Access', s: 'Inactive', v: false },
                                    { l: 'Price Cap Compliance', s: 'Synced', v: true },
                                    { l: 'Cold Chain Registry', s: 'Required', v: true },
                                  ].map(item => (
                                    <div key={item.l} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl border border-white/10 group/item hover:border-blue-500/30 transition-all">
                                      <div className="flex items-center">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${item.v ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}>
                                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                                        </div>
                                        <span className="text-xs font-extrabold text-slate-600 dark:text-slate-400">{item.l}</span>
                                      </div>
                                      <span className={`text-[9px] font-black uppercase tracking-widest ${item.v ? 'text-emerald-500' : 'text-slate-400'}`}>{item.s}</span>
                                    </div>
                                  ))}
                               </div>
                            </div>

                            {/* Economics Deep-Dive */}
                            <div className="bg-gradient-to-tr from-slate-900 to-blue-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group/eco">
                               <div className="absolute top-0 right-0 p-8 opacity-10 group-hover/eco:scale-150 transition-transform duration-1000">
                                  <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.39 2.1-1.39 1.47 0 2.01.59 2.1 1.58h1.89c-.11-1.73-1.27-2.87-2.87-3.22V4.5h-2.22v1.89c-1.91.41-3.11 1.6-3.11 3.29 0 2.04 1.67 3.06 4.13 3.64 2.11.5 2.56 1.25 2.56 2.1 0 1.02-.79 1.6-2.45 1.6-1.61 0-2.31-.74-2.47-1.71H7.74c.17 1.97 1.53 3.03 3.37 3.39v1.9h2.22v-1.89c1.94-.39 3.24-1.46 3.24-3.32 0-2.31-1.89-3.27-4.28-3.86z"/></svg>
                               </div>
                               <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em] mb-8">Financial Analysis</h4>
                               <div className="space-y-6">
                                  <div className="flex justify-between items-end border-b border-white/10 pb-4">
                                     <div>
                                        <p className="text-[10px] text-slate-400 font-black uppercase">Net Asset Value</p>
                                        <p className="text-3xl font-black tracking-tighter">${(globalQty * p.unitCost).toLocaleString()}</p>
                                     </div>
                                     <div className="text-right">
                                        <p className="text-[10px] text-slate-400 font-black uppercase">Margin Delta</p>
                                        <p className="text-xl font-black text-emerald-400">+${(p.unitPrice - p.unitCost).toFixed(2)}</p>
                                     </div>
                                  </div>
                                  <div className="pt-4">
                                     <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                                        <span>Contribution to Branch Rev</span>
                                        <span>12.4%</span>
                                     </div>
                                     <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500" style={{ width: '12.4%' }}></div>
                                     </div>
                                  </div>
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
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xl z-[100] flex items-center justify-center p-6">
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] w-full max-w-3xl p-16 animate-scale-up border border-white/10 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>
             <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]"></div>
             
             <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tighter">Master Entry</h3>
             <p className="text-blue-500 font-black text-[10px] uppercase tracking-[0.4em] mb-12">Pharmacopoeia Registration Protocol</p>
             
             <form onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mb-3 tracking-widest">Nomenclature</label>
                  <input required className="w-full px-8 py-5 bg-slate-100/50 dark:bg-slate-800/50 border-none rounded-[2rem] font-bold text-slate-700 dark:text-white focus:ring-4 focus:ring-blue-500/20 transition-all outline-none text-lg" placeholder="Scientific Name" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">Global Brand</label>
                  <input required className="w-full px-8 py-5 bg-slate-100/50 dark:bg-slate-800/50 border-none rounded-[1.5rem] font-bold text-slate-700 dark:text-white outline-none" placeholder="Manufacturer" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">Category Registry</label>
                  <select className="w-full px-8 py-5 bg-slate-100/50 dark:bg-slate-800/50 border-none rounded-[1.5rem] font-bold text-slate-700 dark:text-white outline-none">
                    {categories.filter(c => c !== 'ALL').map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2 flex justify-end space-x-6 pt-10 border-t border-slate-100 dark:border-slate-800">
                   <button type="button" onClick={() => setIsModalOpen(false)} className="px-10 py-5 text-slate-400 font-black uppercase text-xs tracking-widest hover:text-slate-900 dark:hover:text-white transition-colors">Abort Mission</button>
                   <button type="submit" className="px-14 py-5 bg-slate-950 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all">Establish Record</button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CatalogHub;
