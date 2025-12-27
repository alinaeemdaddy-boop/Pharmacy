
import React, { useState } from 'react';
import { Product, StockUnit, Pharmacy, Transaction } from '../types';

interface LogisticsViewProps {
  products: Product[];
  stock: StockUnit[];
  pharmacies: Pharmacy[];
  onTransfer: (t: Transaction) => void;
}

const LogisticsView: React.FC<LogisticsViewProps> = ({ products, stock, pharmacies, onTransfer }) => {
  const [activeTab, setActiveTab] = useState<'TRANSFERS' | 'MATRIX'>('MATRIX');

  return (
    <div className="space-y-8 animate-fade-in">
       <div className="flex justify-between items-end">
          <div>
             <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-none">Logistics Hub</h2>
             <p className="text-slate-400 font-bold text-sm mt-2 uppercase tracking-widest">Multi-Branch Matrix & Global Fulfillment</p>
          </div>
          <div className="flex space-x-2 bg-white/80 p-1.5 rounded-2xl shadow-sm border border-slate-100">
             <button onClick={() => setActiveTab('MATRIX')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'MATRIX' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900'}`}>Branches</button>
             <button onClick={() => setActiveTab('TRANSFERS')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'TRANSFERS' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900'}`}>Transfers</button>
          </div>
       </div>

       {activeTab === 'MATRIX' ? (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pharmacies.map((ph, idx) => (
              <div key={ph.id} className="glass-card p-10 group stagger-1">
                 <div className="flex justify-between items-start mb-8">
                    <div>
                       <h3 className="text-2xl font-black text-slate-800 tracking-tight">{ph.name}</h3>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{ph.location}</p>
                    </div>
                    <div className="w-16 h-16 bg-slate-900 text-white rounded-3xl flex items-center justify-center text-xl font-black shadow-xl">
                       {ph.efficiencyScore}%
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-6 mb-10">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Stock Items</p>
                       <p className="text-lg font-black text-slate-800">{stock.filter(s => s.locationId === ph.id).length} Units</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Today Sales</p>
                       <p className="text-lg font-black text-emerald-600">84 Orders</p>
                    </div>
                 </div>
                 <button className="w-full py-4.5 bg-slate-50 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-sky-500 hover:text-white transition-all shadow-sm active:scale-95">
                    Branch Logistics Dashboard
                 </button>
              </div>
            ))}
         </div>
       ) : (
         <div className="glass-card p-10">
            <h3 className="text-xl font-black text-slate-900 mb-8 tracking-tight">Active Consignments</h3>
            <div className="space-y-4">
               <div className="p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100 flex justify-between items-center group hover:bg-white hover:shadow-xl transition-all">
                  <div className="flex items-center">
                     <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-2xl mr-6 border border-slate-100 transition-transform group-hover:scale-110">🚛</div>
                     <div>
                        <p className="text-sm font-black text-slate-800">Warehouse → Downtown Branch</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Manifest: #M-8422 • 420 Units</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <span className="px-4 py-2 bg-amber-50 text-amber-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-amber-100">In Transit</span>
                  </div>
               </div>
            </div>
         </div>
       )}
    </div>
  );
};

export default LogisticsView;
