
import React, { useState, useEffect } from 'react';
import { StockUnit, Product, Pharmacy, Transaction, StockRequest } from '../types';
import { getReplenishmentForecast } from '../geminiService';

interface WarehouseViewProps {
  products: Product[];
  stock: StockUnit[];
  pharmacies: Pharmacy[];
  transactions: Transaction[];
  requests: StockRequest[];
  onTransfer: (t: Transaction) => void;
  onRestock: (t: Transaction) => void;
  onConfirm: (id: string) => void;
}

const WarehouseView: React.FC<WarehouseViewProps> = ({ products, stock, pharmacies, transactions, requests, onTransfer, onRestock, onConfirm }) => {
  const [activeView, setActiveView] = useState<'inventory' | 'transfers' | 'requests' | 'replenish'>('inventory');
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [forecast, setForecast] = useState<string>("Analyzing enterprise flows...");

  const warehouseStock = stock.filter(s => s.locationId === 'warehouse');
  const pendingTransfers = transactions.filter(t => t.type === 'TRANSFER' && t.status === 'PENDING');
  const openRequests = requests.filter(r => r.status === 'OPEN');

  useEffect(() => {
    if (activeView === 'replenish') {
      const fetchForecast = async () => {
        const result = await getReplenishmentForecast(products, stock, transactions);
        setForecast(result);
      };
      fetchForecast();
    }
  }, [activeView, products, stock, transactions]);

  return (
    <div className="space-y-10 animate-fade-in stagger-entry">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-5xl font-black text-slate-800 dark:text-white tracking-tighter leading-none">Warehouse Hub</h2>
          <p className="text-cyan-500 font-black text-sm mt-3 uppercase tracking-[0.3em]">Logistics & Stock Control</p>
        </div>
        <div className="flex bg-white/40 dark:bg-slate-800/40 p-1.5 rounded-[2rem] border border-white/10 backdrop-blur-md shadow-2xl">
          {[
            { id: 'inventory', label: 'Inventory', icon: '📦' },
            { id: 'transfers', label: 'Outbound', count: pendingTransfers.length, icon: '🚛' },
            { id: 'requests', label: 'Requests', count: openRequests.length, icon: '📝' },
            { id: 'replenish', label: 'Forecast', icon: '🔮' }
          ].map(view => (
            <button 
              key={view.id}
              onClick={() => setActiveView(view.id as any)}
              className={`px-6 py-3.5 rounded-[1.5rem] text-xs font-black transition-all relative flex items-center group ${activeView === view.id ? 'bg-slate-900 text-white shadow-xl scale-105' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
            >
              <span className="mr-2 group-hover:scale-125 transition-transform">{view.icon}</span>
              {view.label}
              {view.count !== undefined && view.count > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-tr from-rose-600 to-pink-500 text-white text-[10px] px-2.5 py-0.5 rounded-full shadow-lg font-black animate-bounce">
                  {view.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-premium overflow-hidden shadow-2xl">
        {activeView === 'inventory' && (
          <div className="p-10 space-y-10">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Global Inventory Manifest</h3>
              <div className="flex space-x-4">
                <button className="bg-gradient-to-tr from-cyan-600 to-blue-500 text-white px-8 py-3.5 rounded-2xl shadow-xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">Receive Stock</button>
                <button className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl shadow-xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">Bulk Transfer</button>
              </div>
            </div>
            
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left min-w-[1000px]">
                <thead className="bg-slate-50/50 dark:bg-slate-900/50 text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.25em] border-b border-white/5">
                  <tr>
                    <th className="px-10 py-6">Medication Entity</th>
                    <th className="px-10 py-6">Batch Analytics</th>
                    <th className="px-10 py-6 text-right">Available Volume</th>
                    <th className="px-10 py-6 text-center">Protocol Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {warehouseStock.map((s, idx) => {
                    const product = products.find(p => p.id === s.productId);
                    const isLow = s.quantity < (product?.lowStockThreshold || 0);
                    return (
                      <tr key={s.id} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-all group">
                        <td className="px-10 py-8">
                          <div className="flex items-center">
                            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-2xl shadow-inner group-hover:rotate-12 transition-transform">💊</div>
                            <div className="ml-5">
                              <p className="font-black text-slate-800 dark:text-white text-lg leading-none mb-1.5">{product?.name}</p>
                              <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest">{product?.category}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-8">
                          <div className="flex items-center space-x-6">
                            <div>
                              <p className="text-[9px] text-slate-400 font-black uppercase mb-1">Batch ID</p>
                              <p className="text-sm font-black text-slate-700 dark:text-slate-300 font-mono">{s.batchNumber}</p>
                            </div>
                            <div className="w-px h-8 bg-slate-200 dark:bg-slate-700"></div>
                            <div>
                              <p className="text-[9px] text-slate-400 font-black uppercase mb-1">Expires</p>
                              <p className="text-sm font-black text-slate-700 dark:text-slate-300">{s.expiryDate}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-8 text-right">
                          <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{s.quantity.toLocaleString()}</span>
                        </td>
                        <td className="px-10 py-8 text-center">
                          <div className={`mx-auto w-fit px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border ${isLow ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'}`}>
                            {isLow ? 'Critical Refill' : 'Optimal'}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeView === 'requests' && (
          <div className="p-12 space-y-12">
            <h3 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">Active Node Requests</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {openRequests.map((req, idx) => {
                const product = products.find(p => p.id === req.productId);
                const ph = pharmacies.find(p => p.id === req.pharmacyId);
                return (
                  <div key={req.id} className="bg-slate-50/50 dark:bg-slate-900/50 p-8 rounded-[2.5rem] border border-white/10 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] hover:-translate-y-2 transition-all group animate-scale-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                    <div className="flex justify-between items-start mb-10">
                      <div>
                        <h4 className="font-black text-slate-800 dark:text-white text-xl leading-tight mb-2">{product?.name}</h4>
                        <div className="flex items-center">
                          <span className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse mr-2"></span>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{ph?.name}</p>
                        </div>
                      </div>
                      <div className="bg-white dark:bg-slate-800 w-16 h-16 rounded-3xl flex items-center justify-center shadow-2xl border border-white/5">
                        <span className="text-2xl font-black text-blue-600">{req.quantity}</span>
                      </div>
                    </div>
                    <button className="w-full py-5 bg-slate-950 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all">
                      Process Dispatch
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeView === 'replenish' && (
          <div className="p-12">
            <div className="bg-gradient-to-tr from-indigo-700 via-blue-800 to-slate-950 rounded-[3rem] p-12 text-white relative overflow-hidden mb-12 shadow-2xl">
              <div className="absolute top-0 right-0 p-12 opacity-10">
                <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>
              </div>
              <div className="relative z-10">
                <h3 className="text-4xl font-black tracking-tighter mb-4">Replenishment Intelligence</h3>
                <p className="text-blue-300 text-xs font-black uppercase tracking-[0.4em] opacity-80">Predictive Node Sync Engine</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {forecast.split('\n').filter(l => l.trim()).map((line, i) => (
                <div key={i} className="flex items-center p-8 bg-white dark:bg-slate-800 rounded-[2rem] border border-white/5 shadow-xl hover:shadow-2xl transition-all group">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform">
                    <span className="text-blue-500 text-xl">✦</span>
                  </div>
                  <p className="text-base font-bold text-slate-600 dark:text-slate-300 leading-relaxed italic">{line.replace(/^\d+\.\s*/, '')}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WarehouseView;
