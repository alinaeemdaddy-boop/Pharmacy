
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
  const [auditQuantities, setAuditQuantities] = useState<Record<string, number>>({});

  const pharmacyStock = stock.filter(s => s.locationId === selectedPharmacyId);
  const pendingInbound = transactions.filter(t => t.toId === selectedPharmacyId && t.status === 'PENDING');
  
  useEffect(() => {
    const fetch = async () => {
      const result = await getPharmacySuggestions(selectedPharmacyId, products, stock, transactions);
      setSuggestions(result);
    };
    fetch();
  }, [selectedPharmacyId, products, stock, transactions]);

  const handleRequest = (productId: string, quantity: number) => {
    onAddRequest({
      id: `req-${Date.now()}`,
      pharmacyId: selectedPharmacyId,
      productId,
      quantity,
      status: 'OPEN',
      date: new Date().toISOString()
    });
    alert("Request dispatched to Central Warehouse");
  };

  const handleScanSimulation = (trxId: string) => {
    setIsScanning(true);
    setTimeout(() => {
      onConfirmReceipt(trxId);
      setIsScanning(false);
      alert("Verification successful. Stock integrated.");
    }, 1200);
  };

  const submitAudit = (sUnit: StockUnit) => {
    const actual = auditQuantities[sUnit.id];
    if (actual === undefined) return;
    
    onAdjustStock({
      id: `adj-${Date.now()}`,
      type: 'ADJUSTMENT',
      productId: sUnit.productId,
      quantity: actual,
      fromId: selectedPharmacyId,
      toId: 'system-adjustment',
      date: new Date().toISOString(),
      batchNumber: sUnit.batchNumber,
      status: 'PENDING',
      notes: `Periodic Audit: Reconciliation complete.`
    });
    alert("Audit log created. Stock adjusted.");
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Pharmacy Ops</h2>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Branch Level Administration</p>
        </div>
        <div className="flex items-center space-x-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3">Location:</label>
          <select 
            className="px-6 py-2.5 bg-slate-900 border-none rounded-xl font-bold text-white text-xs shadow-xl outline-none focus:ring-4 focus:ring-slate-900/10 cursor-pointer"
            value={selectedPharmacyId}
            onChange={(e) => setSelectedPharmacyId(e.target.value)}
          >
            {pharmacies.map(ph => <option key={ph.id} value={ph.id}>{ph.name}</option>)}
          </select>
        </div>
      </div>

      <div className="flex space-x-3 bg-white/50 backdrop-blur-md p-1.5 rounded-2xl w-fit shadow-sm border border-white">
        {[
          { id: 'inventory', label: 'In Stock', icon: '💎' },
          { id: 'requests', label: 'Order Stock', icon: '📝' },
          { id: 'receiving', label: 'Verify Shipments', icon: '📥' },
          { id: 'audit', label: 'Compliance Audit', icon: '⚖️' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-5 py-3 rounded-xl text-xs font-black transition-all flex items-center group ${
              activeTab === tab.id ? 'bg-cyan-500 shadow-lg text-white scale-105' : 'text-slate-500 hover:text-slate-800 hover:bg-white'
            }`}
          >
            <span className="mr-2 group-hover:scale-125 transition-transform">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'inventory' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pharmacyStock.map((s, idx) => {
            const product = products.find(p => p.id === s.productId);
            const isLow = s.quantity < (product?.lowStockThreshold || 0);
            return (
              <div key={s.id} className={`bg-white p-8 rounded-[2.5rem] shadow-sm border ${isLow ? 'border-red-100 bg-red-50/10' : 'border-slate-100'} card-hover animate-scale-up`} style={{ animationDelay: `${idx * 0.05}s` }}>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="font-black text-slate-800 text-lg leading-tight group-hover:text-cyan-600 transition-colors">{product?.name}</h4>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 inline-block">{product?.category}</span>
                  </div>
                  <div className="text-right">
                    <p className={`text-4xl font-black tracking-tighter ${isLow ? 'text-red-500' : 'text-slate-800'}`}>{s.quantity.toLocaleString()}</p>
                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Available</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-100">
                   <div>
                     <p className="text-[9px] font-black text-slate-400 uppercase mb-1 tracking-widest">Serial #</p>
                     <p className="text-xs font-black text-slate-600 font-mono">{s.batchNumber}</p>
                   </div>
                   <div>
                     <p className="text-[9px] font-black text-slate-400 uppercase mb-1 tracking-widest">Expiration</p>
                     <p className={`text-xs font-black ${new Date(s.expiryDate) < new Date() ? 'text-red-500' : 'text-slate-600'}`}>{s.expiryDate}</p>
                   </div>
                </div>
                {isLow && (
                  <button 
                    onClick={() => handleRequest(s.productId, (product?.lowStockThreshold || 100) * 2)}
                    className="mt-8 w-full py-4 bg-red-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-red-600 shadow-xl shadow-red-500/20 transition-all active:scale-95"
                  >
                    Quick Restock
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'requests' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 animate-scale-up">
            <h3 className="text-2xl font-black text-slate-800 mb-8 tracking-tight">Order Inventory</h3>
            <div className="space-y-6">
               <div>
                 <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Product Catalog</label>
                 <select id="reqProduct" className="w-full p-5 bg-slate-50 border-none rounded-[1.5rem] font-black text-slate-700 outline-none focus:ring-4 focus:ring-cyan-500/10 transition-all">
                    {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                 </select>
               </div>
               <div>
                 <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Order Quantity</label>
                 <input id="reqQty" type="number" defaultValue="50" className="w-full p-5 bg-slate-50 border-none rounded-[1.5rem] font-black text-slate-700 outline-none focus:ring-4 focus:ring-cyan-500/10 transition-all" />
               </div>
               <button 
                 onClick={() => {
                   const pid = (document.getElementById('reqProduct') as HTMLSelectElement).value;
                   const qty = Number((document.getElementById('reqQty') as HTMLInputElement).value);
                   handleRequest(pid, qty);
                 }}
                 className="w-full py-5 bg-cyan-500 text-white rounded-[1.5rem] font-black text-lg shadow-2xl shadow-cyan-500/20 hover:bg-cyan-600 transition-all hover:-translate-y-1 active:scale-95"
               >
                 Submit Request
               </button>
            </div>
          </div>
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-10 rounded-[3rem] text-white shadow-2xl flex flex-col justify-between relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:scale-110 transition-transform"></div>
             <div>
               <div className="flex items-center mb-8 relative z-10">
                 <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-3xl backdrop-blur-md">✨</div>
                 <div className="ml-4">
                   <h3 className="text-2xl font-black tracking-tight">AI Demand Predictor</h3>
                   <p className="text-indigo-200 text-[10px] font-black uppercase tracking-[0.2em] mt-0.5">Renew-Flash-Engine</p>
                 </div>
               </div>
               <div className="space-y-4 relative z-10">
                 {suggestions.split('\n').map((line, i) => (
                   <div key={i} className="flex items-start bg-white/10 p-4 rounded-2xl border border-white/5 backdrop-blur-sm transition-all hover:bg-white/15">
                     <span className="text-indigo-300 mr-3 text-lg">✦</span>
                     <p className="text-sm font-medium text-indigo-50 leading-relaxed">{line}</p>
                   </div>
                 ))}
               </div>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'receiving' && (
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 animate-scale-up">
           <h3 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">Shipment Verification</h3>
           <p className="text-slate-400 text-sm mb-10">Secure scan-based receipt confirmation for inbound clinic transfers.</p>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {pendingInbound.map((t, idx) => {
               const product = products.find(p => p.id === t.productId);
               return (
                 <div key={t.id} className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 group hover:shadow-xl transition-all animate-slide-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                    <div className="flex items-center mb-8">
                      <div className="w-16 h-16 bg-white rounded-3xl shadow-sm flex items-center justify-center text-3xl mr-5 border border-slate-100">
                        📦
                      </div>
                      <div>
                        <p className="font-black text-slate-800 text-lg leading-tight">{product?.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">Qty: <span className="text-slate-700">{t.quantity}</span> | Batch: <span className="text-slate-700">{t.batchNumber}</span></p>
                      </div>
                    </div>
                    <button 
                      disabled={isScanning}
                      onClick={() => handleScanSimulation(t.id)}
                      className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center transition-all shadow-lg ${
                        isScanning ? 'bg-slate-200 text-slate-400' : 'bg-white text-cyan-600 hover:bg-cyan-600 hover:text-white border border-cyan-100'
                      }`}
                    >
                      {isScanning ? (
                        <div className="flex items-center">
                          <svg className="animate-spin h-4 w-4 mr-3" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                          Verifying...
                        </div>
                      ) : 'Confirm Receipt'}
                    </button>
                 </div>
               );
             })}
             {pendingInbound.length === 0 && (
               <div className="col-span-full py-20 text-center opacity-40">
                  <p className="font-black uppercase tracking-widest text-xs">No pending transfers</p>
               </div>
             )}
           </div>
        </div>
      )}
    </div>
  );
};

export default PharmacyView;
