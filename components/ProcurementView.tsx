
import React, { useState } from 'react';
import { Supplier, Product, PurchaseOrder } from '../types';

interface ProcurementViewProps {
  suppliers: Supplier[];
  products: Product[];
  onPurchase: (po: PurchaseOrder) => void;
}

const ProcurementView: React.FC<ProcurementViewProps> = ({ suppliers, products, onPurchase }) => {
  const [activeTab, setActiveTab] = useState<'POS' | 'SUPPLIERS'>('POS');

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-none">Procurement</h2>
          <p className="text-slate-400 font-bold text-sm mt-2 uppercase tracking-widest">Strategic Sourcing & Vendor Matrix</p>
        </div>
        <div className="flex space-x-2 bg-white/80 p-1.5 rounded-2xl shadow-sm border border-slate-100">
           <button onClick={() => setActiveTab('POS')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'POS' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900'}`}>Orders</button>
           <button onClick={() => setActiveTab('SUPPLIERS')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'SUPPLIERS' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900'}`}>Suppliers</button>
        </div>
      </div>

      {activeTab === 'SUPPLIERS' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {suppliers.map((s, idx) => (
             <div key={s.id} className="glass-card p-8 group stagger-1">
                <div className="flex justify-between items-start mb-6">
                   <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl font-black text-slate-300 border border-slate-100 transition-transform group-hover:scale-110">
                     {s.name[0]}
                   </div>
                   <div className="text-right">
                      <div className="flex items-center space-x-1.5 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Score: {s.performanceScore}%</span>
                      </div>
                   </div>
                </div>
                <h4 className="text-xl font-black text-slate-800 mb-1">{s.name}</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-8">{s.category}</p>
                
                <div className="space-y-6">
                   <div>
                     <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase mb-2">
                        <span>Reliability Score</span>
                        <span>{s.rating} / 5.0</span>
                     </div>
                     <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-sky-500 transition-all duration-1000" style={{ width: `${s.performanceScore}%` }} />
                     </div>
                   </div>
                   <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
                      <span className="text-[10px] font-black text-slate-400 uppercase">Active Contracts</span>
                      <span className="text-sm font-black text-slate-800">{s.contracts.length} Units</span>
                   </div>
                </div>
                <button className="w-full mt-8 py-4 bg-slate-50 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all active:scale-95 shadow-sm">
                   Vendor Ledger
                </button>
             </div>
           ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 space-y-8">
              <div className="glass-card p-10 overflow-hidden">
                 <h3 className="text-xl font-black text-slate-900 mb-8 tracking-tight">Purchase Manifests</h3>
                 <div className="overflow-x-auto no-scrollbar">
                   <table className="w-full text-left">
                     <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                       <tr>
                         <th className="px-6 py-4">PO Identifier</th>
                         <th className="px-6 py-4">Sourcing Vendor</th>
                         <th className="px-6 py-4">Valuation</th>
                         <th className="px-6 py-4 text-right">Progress</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                        <tr className="hover:bg-slate-50/50 transition-colors">
                           <td className="px-6 py-6">
                              <p className="font-bold text-slate-800">PO-2024-0012</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase">Jun 14, 2024</p>
                           </td>
                           <td className="px-6 py-6 font-black text-slate-600 text-sm">{suppliers[0].name}</td>
                           <td className="px-6 py-6 font-black text-slate-900">$14,200.00</td>
                           <td className="px-6 py-6 text-right">
                              <span className="px-3 py-1.5 bg-sky-50 text-sky-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-sky-100">In Transit</span>
                           </td>
                        </tr>
                     </tbody>
                   </table>
                 </div>
              </div>
           </div>
           
           <div className="glass-card p-10 bg-slate-900 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
              </div>
              <div>
                <h3 className="text-2xl font-black tracking-tight mb-2">Rapid Procurement</h3>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-10">AI-Assisted PO Engine</p>
                <div className="space-y-6">
                   <div>
                     <label className="block text-[10px] font-black text-slate-500 uppercase mb-2">Target Supplier</label>
                     <select className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs font-bold outline-none focus:ring-2 focus:ring-sky-500">
                        {suppliers.map(s => <option key={s.id} className="bg-slate-900">{s.name}</option>)}
                     </select>
                   </div>
                   <div>
                     <label className="block text-[10px] font-black text-slate-500 uppercase mb-2">Consignment Items</label>
                     <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-3">
                        <div className="flex justify-between items-center text-xs font-bold">
                           <span className="text-slate-300">Amoxicillin 500mg</span>
                           <span className="text-sky-400">1,200 Units</span>
                        </div>
                     </div>
                   </div>
                </div>
              </div>
              <button className="mt-12 w-full py-5 bg-sky-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-sky-400 transition-all active:scale-95">
                 Execute Order
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default ProcurementView;
