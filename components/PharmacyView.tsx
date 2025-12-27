
import React, { useState, useEffect } from 'react';
import { Pharmacy, StockUnit, Product, Transaction, StockRequest } from '../types';
import { getPharmacySuggestions } from '../geminiService';

interface PharmacyViewProps {
  pharmacies: Pharmacy[];
  stock: StockUnit[];
  products: Product[];
  transactions: Transaction[];
  selectedPharmacyId: string;
  setSelectedPharmacyId: (id: string) => void;
  onAddRequest: (req: StockRequest) => void;
  onConfirmReceipt: (trxId: string) => void;
  onAdjustStock: (t: Transaction) => void;
}

const PharmacyView: React.FC<PharmacyViewProps> = ({ 
  pharmacies, stock, products, transactions, selectedPharmacyId, 
  setSelectedPharmacyId, onAddRequest, onConfirmReceipt, onAdjustStock 
}) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'requests' | 'receiving' | 'audit'>('inventory');
  const [isScanning, setIsScanning] = useState(false);
  const [suggestions, setSuggestions] = useState<string>("Analyzing local clinic demand...");

  const pharmacyStock = stock.filter(s => s.locationId === selectedPharmacyId);
  const pendingInbound = transactions.filter(t => t.toId === selectedPharmacyId && t.status === 'PENDING');
  
  useEffect(() => {
    const fetch = async () => {
      const result = await getPharmacySuggestions(selectedPharmacyId, products, stock, transactions);
      setSuggestions(result);
    };
    fetch();
  }, [selectedPharmacyId, products, stock, transactions]);

  const handleScanSimulation = (trxId: string) => {
    setIsScanning(true);
    setTimeout(() => {
      onConfirmReceipt(trxId);
      setIsScanning(false);
    }, 1500);
  };

  return (
    <div className="space-y-12 animate-fade-in stagger-entry">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div>
          <h2 className="text-5xl font-black text-slate-800 dark:text-white tracking-tighter leading-none">Pharmacy Ops</h2>
          <p className="text-emerald-500 font-black text-sm mt-3 uppercase tracking-[0.4em]">Node Distribution Control</p>
        </div>
        <div className="flex items-center space-x-4 bg-white/40 dark:bg-slate-800/40 p-2.5 rounded-[2rem] border border-white/10 shadow-2xl backdrop-blur-md">
          <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-4">Node Selection:</label>
          <select 
            className="px-8 py-3.5 bg-slate-950 border-none rounded-[1.5rem] font-black text-white text-xs shadow-2xl outline-none focus:ring-4 focus:ring-blue-500/20 cursor-pointer"
            value={selectedPharmacyId}
            onChange={(e) => setSelectedPharmacyId(e.target.value)}
          >
            {pharmacies.map(ph => <option key={ph.id} value={ph.id}>{ph.name}</option>)}
          </select>
        </div>
      </div>

      <div className="flex space-x-3 overflow-x-auto no-scrollbar pb-4 px-2">
        {[
          { id: 'inventory', label: 'In-Store Inventory', icon: '💎' },
          { id: 'requests', label: 'Replenishment', icon: '📝' },
          { id: 'receiving', label: 'Security Verification', icon: '📥' },
          { id: 'audit', label: 'Audit & Compliance', icon: '⚖️' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 whitespace-nowrap ${
              activeTab === tab.id ? 'bg-blue-600 shadow-[0_15px_30px_-5px_rgba(37,99,235,0.4)] text-white scale-110' : 'bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:bg-slate-50 shadow-md hover:-translate-y-1'
            }`}
          >
            <span className="mr-3">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'inventory' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {pharmacyStock.map((s, idx) => {
            const product = products.find(p => p.id === s.productId);
            const isLow = s.quantity < (product?.lowStockThreshold || 0);
            return (
              <div key={s.id} className={`glass-premium p-10 relative overflow-hidden group animate-scale-up ${isLow ? 'border-rose-500/30' : ''}`} style={{ animationDelay: `${idx * 0.05}s` }}>
                <div className={`absolute -top-10 -right-10 w-32 h-32 ${isLow ? 'bg-rose-500' : 'bg-blue-500'} opacity-5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700`}></div>
                <div className="flex justify-between items-start mb-10 relative z-10">
                  <div>
                    <h4 className="font-black text-slate-800 dark:text-white text-xl leading-tight group-hover:text-blue-500 transition-colors">{product?.name}</h4>
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest mt-2 block">{product?.category}</span>
                  </div>
                  <div className="text-right">
                    <p className={`text-5xl font-black tracking-tighter ${isLow ? 'text-rose-500 pulse-glow' : 'text-slate-900 dark:text-white'}`}>{s.quantity.toLocaleString()}</p>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Available Units</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/5 relative z-10">
                   <div>
                     <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase mb-2 tracking-widest">Serial / Batch</p>
                     <p className="text-sm font-black text-slate-700 dark:text-slate-300 font-mono tracking-tighter">{s.batchNumber}</p>
                   </div>
                   <div className="text-right">
                     <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase mb-2 tracking-widest">Shelf Life</p>
                     <p className={`text-sm font-black ${new Date(s.expiryDate) < new Date() ? 'text-rose-500' : 'text-slate-700 dark:text-slate-300'}`}>{s.expiryDate}</p>
                   </div>
                </div>
                {isLow && (
                  <button className="mt-10 w-full py-5 bg-gradient-to-tr from-rose-600 to-pink-500 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all">
                    Initiate Urgent Restock
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'requests' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="glass-premium p-12 shadow-2xl">
            <h3 className="text-3xl font-black text-slate-800 dark:text-white mb-10 tracking-tighter">Inventory Procurement</h3>
            <div className="space-y-10">
               <div>
                 <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mb-4 tracking-widest">Target Medication</label>
                 <select className="w-full p-6 bg-slate-100/50 dark:bg-slate-900/50 border-none rounded-[2rem] font-black text-slate-700 dark:text-white outline-none focus:ring-4 focus:ring-blue-500/20 transition-all text-lg shadow-inner">
                    {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                 </select>
               </div>
               <div>
                 <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mb-4 tracking-widest">Node Capacity Allocation</label>
                 <input type="number" defaultValue="50" className="w-full p-6 bg-slate-100/50 dark:bg-slate-900/50 border-none rounded-[2rem] font-black text-slate-700 dark:text-white outline-none focus:ring-4 focus:ring-blue-500/20 transition-all text-xl shadow-inner" />
               </div>
               <button className="w-full py-6 bg-slate-950 text-white rounded-[2rem] font-black text-lg shadow-2xl hover:scale-105 active:scale-95 transition-all">
                 Verify & Submit Order
               </button>
            </div>
          </div>
          <div className="bg-gradient-to-br from-indigo-700 via-blue-800 to-slate-950 p-12 rounded-[3rem] text-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] flex flex-col justify-between relative overflow-hidden group">
             <div className="absolute top-[-10%] right-[-10%] w-80 h-80 bg-blue-500/20 rounded-full blur-[100px] group-hover:scale-150 transition-all duration-1000"></div>
             <div>
               <div className="flex items-center mb-12 relative z-10">
                 <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center text-4xl backdrop-blur-3xl border border-white/20 shadow-2xl animate-pulse">🤖</div>
                 <div className="ml-6">
                   <h3 className="text-2xl font-black tracking-tight leading-none">AI Market Sync</h3>
                   <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Renew Prediction Matrix</p>
                 </div>
               </div>
               <div className="space-y-6 relative z-10">
                 {suggestions.split('\n').filter(l => l.trim()).map((line, i) => (
                   <div key={i} className="flex items-start bg-white/5 p-6 rounded-[2rem] border border-white/5 backdrop-blur-3xl transition-all hover:bg-white/10 hover:translate-x-2">
                     <span className="text-blue-400 mr-4 text-2xl">✦</span>
                     <p className="text-base font-bold text-blue-100 leading-relaxed italic">{line.replace(/^\d+\.\s*/, '')}</p>
                   </div>
                 ))}
               </div>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'receiving' && (
        <div className="glass-premium p-12 shadow-2xl animate-scale-up">
           <h3 className="text-3xl font-black text-slate-800 dark:text-white mb-4 tracking-tighter">Inbound Logistics Monitor</h3>
           <p className="text-slate-400 dark:text-slate-500 font-bold text-sm mb-12 uppercase tracking-widest">Branch Encryption Verification Protocol</p>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {pendingInbound.map((t, idx) => {
               const product = products.find(p => p.id === t.productId);
               return (
                 <div key={t.id} className="p-10 bg-slate-50/50 dark:bg-slate-900/50 rounded-[2.5rem] border border-white/10 group hover:shadow-2xl transition-all animate-slide-in relative overflow-hidden" style={{ animationDelay: `${idx * 0.1}s` }}>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
                    <div className="flex items-center mb-10 relative z-10">
                      <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-[2rem] shadow-2xl flex items-center justify-center text-4xl mr-6 border border-white/10">
                        🚛
                      </div>
                      <div>
                        <p className="font-black text-slate-800 dark:text-white text-xl leading-tight mb-2">{product?.name}</p>
                        <p className="text-[10px] text-blue-500 font-black uppercase mt-1 tracking-widest">Volume: {t.quantity} Units • Batch: {t.batchNumber}</p>
                      </div>
                    </div>
                    <button 
                      disabled={isScanning}
                      onClick={() => handleScanSimulation(t.id)}
                      className={`w-full py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center transition-all shadow-2xl relative z-10 ${
                        isScanning ? 'bg-slate-200 text-slate-400' : 'bg-slate-950 text-white hover:scale-105 active:scale-95'
                      }`}
                    >
                      {isScanning ? (
                        <div className="flex items-center">
                          <div className="shimmer h-4 w-4 mr-3 bg-slate-300 rounded-full"></div>
                          Verifying Digital Seal...
                        </div>
                      ) : 'Acknowledge & Sync'}
                    </button>
                 </div>
               );
             })}
             {pendingInbound.length === 0 && (
               <div className="col-span-full py-32 text-center opacity-20">
                  <div className="text-8xl mb-8">📡</div>
                  <p className="font-black uppercase tracking-[0.5em] text-xs">No active data streams</p>
               </div>
             )}
           </div>
        </div>
      )}
    </div>
  );
};

export default PharmacyView;
