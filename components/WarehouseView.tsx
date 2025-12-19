
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
  const [showRestockModal, setShowRestockModal] = useState(false);
  
  const [selectedStockId, setSelectedStockId] = useState('');
  const [destPharmacyId, setDestPharmacyId] = useState(pharmacies[0].id);
  const [transferQty, setTransferQty] = useState(1);

  const [restockProduct, setRestockProduct] = useState(products[0].id);
  const [restockQty, setRestockQty] = useState(100);
  const [restockBatch, setRestockBatch] = useState(`BAT-${Date.now().toString().slice(-4)}`);
  
  const [forecast, setForecast] = useState<string>("Analyzing trends...");

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

  const handleTransfer = () => {
    const sUnit = stock.find(s => s.id === selectedStockId);
    if (!sUnit || transferQty > sUnit.quantity) return;

    onTransfer({
      id: `trx-${Date.now()}`,
      type: 'TRANSFER',
      productId: sUnit.productId,
      quantity: transferQty,
      fromId: 'warehouse',
      toId: destPharmacyId,
      date: new Date().toISOString(),
      batchNumber: sUnit.batchNumber,
      status: 'PENDING'
    });
    setShowTransferModal(false);
  };

  const handleFulfillRequest = (req: StockRequest) => {
    const matchingStock = warehouseStock.find(s => s.productId === req.productId && s.quantity >= req.quantity);
    if (!matchingStock) {
      alert("Insufficient stock in warehouse for this request.");
      return;
    }
    
    onTransfer({
      id: `trx-req-${Date.now()}`,
      type: 'TRANSFER',
      productId: req.productId,
      quantity: req.quantity,
      fromId: 'warehouse',
      toId: req.pharmacyId,
      date: new Date().toISOString(),
      batchNumber: matchingStock.batchNumber,
      status: 'PENDING'
    });
    
    req.status = 'FULFILLED';
    alert("Request fulfilled! Shipment initiated.");
  };

  const handleRestock = () => {
    onRestock({
      id: `trx-${Date.now()}`,
      type: 'RESTOCK',
      productId: restockProduct,
      quantity: restockQty,
      fromId: 'supplier',
      toId: 'warehouse',
      date: new Date().toISOString(),
      batchNumber: restockBatch,
      status: 'PENDING'
    });
    setShowRestockModal(false);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Warehouse Logistics</h2>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Inventory Management System</p>
        </div>
        <div className="flex space-x-2 bg-white/80 p-1.5 rounded-2xl shadow-sm border border-slate-100 backdrop-blur-md">
          {[
            { id: 'inventory', label: 'Stock', icon: '📦' },
            { id: 'transfers', label: 'Outbound', count: pendingTransfers.length, icon: '🚛' },
            { id: 'requests', label: 'Requests', count: openRequests.length, icon: '📝' },
            { id: 'replenish', label: 'Replenish', icon: '🔮' }
          ].map(view => (
            <button 
              key={view.id}
              onClick={() => setActiveView(view.id as any)}
              className={`px-5 py-3 rounded-xl text-xs font-black transition-all relative flex items-center group ${activeView === view.id ? 'bg-slate-900 text-white shadow-xl scale-105' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
            >
              <span className="mr-2 group-hover:scale-125 transition-transform">{view.icon}</span>
              {view.label}
              {view.count !== undefined && view.count > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] px-2 py-0.5 rounded-full ring-4 ring-slate-50 font-black animate-bounce">
                  {view.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden card-hover animate-scale-up">
        {activeView === 'inventory' && (
          <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-800 tracking-tight">Central Inventory</h3>
              <div className="flex space-x-3">
                <button 
                  onClick={() => setShowRestockModal(true)} 
                  className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-2xl shadow-lg shadow-cyan-500/20 text-xs font-black flex items-center transition-all hover:-translate-y-1 active:scale-95"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"/></svg>
                  Receive Shipment
                </button>
                <button 
                  disabled={warehouseStock.length === 0}
                  onClick={() => {
                    if(warehouseStock.length > 0) {
                      setSelectedStockId(warehouseStock[0].id);
                      setShowTransferModal(true);
                    }
                  }}
                  className="bg-slate-50 border border-slate-200 text-slate-700 px-6 py-3 rounded-2xl shadow-sm text-xs font-black flex items-center hover:bg-white hover:border-slate-300 transition-all disabled:opacity-50"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
                  Quick Transfer
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  <tr>
                    <th className="px-8 py-5">Product Details</th>
                    <th className="px-8 py-5">Logistics Info</th>
                    <th className="px-8 py-5 text-right">Available Qty</th>
                    <th className="px-8 py-5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {warehouseStock.map((s, idx) => {
                    const product = products.find(p => p.id === s.productId);
                    const isLow = s.quantity < (product?.lowStockThreshold || 0);
                    return (
                      <tr key={s.id} className="hover:bg-slate-50/50 transition-colors group animate-slide-in" style={{ animationDelay: `${idx * 0.05}s` }}>
                        <td className="px-8 py-6">
                          <p className="font-extrabold text-slate-800 text-base">{product?.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider">{product?.category}</p>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center space-x-4">
                            <div>
                              <p className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">Batch</p>
                              <p className="text-xs font-black text-slate-600 font-mono tracking-tighter">{s.batchNumber}</p>
                            </div>
                            <div className="w-px h-6 bg-slate-100"></div>
                            <div>
                              <p className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">Expires</p>
                              <p className="text-xs font-black text-slate-600">{s.expiryDate}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <span className="text-xl font-black text-slate-800">{s.quantity.toLocaleString()}</span>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${isLow ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                            {isLow ? 'Refill Now' : 'Healthy'}
                          </span>
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
          <div className="p-8 space-y-8">
            <h3 className="text-xl font-black text-slate-800 tracking-tight">Active Pharmacy Requests</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {openRequests.map((req, idx) => {
                const product = products.find(p => p.id === req.productId);
                const ph = pharmacies.find(p => p.id === req.pharmacyId);
                return (
                  <div key={req.id} className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all group animate-scale-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h4 className="font-black text-slate-800 text-lg leading-tight">{product?.name}</h4>
                        <div className="flex items-center mt-2 space-x-2">
                          <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{ph?.name}</p>
                        </div>
                      </div>
                      <div className="bg-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm border border-slate-100">
                        <span className="text-xl font-black text-indigo-600">{req.quantity}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleFulfillRequest(req)}
                      className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs hover:bg-indigo-600 shadow-xl transition-all active:scale-95"
                    >
                      Process Fulfillment
                    </button>
                  </div>
                );
              })}
              {openRequests.length === 0 && (
                <div className="col-span-full p-20 text-center">
                   <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                     <svg className="w-10 h-10 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                   </div>
                   <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">All requests handled</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Similar styling updates for other views inside Warehouse */}
        {activeView === 'replenish' && (
          <div className="p-8">
            <div className="bg-indigo-600 rounded-[2rem] p-8 text-white relative overflow-hidden mb-8">
              <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
              <h3 className="text-2xl font-black tracking-tight mb-2">Replenishment Engine</h3>
              <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest opacity-80">AI-DRIVEN CAPACITY PLANNING</p>
            </div>
            <div className="space-y-4">
              {forecast.split('\n').map((line, i) => (
                <div key={i} className="flex items-center p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-md transition-all">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full mr-4 flex-shrink-0"></span>
                  <p className="text-sm font-bold text-slate-600 leading-relaxed">{line}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modern Refined Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-md p-10 animate-scale-up border border-white/20">
            <h3 className="text-2xl font-black text-slate-800 mb-8 tracking-tight">Initiate Transfer</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Select Product Batch</label>
                <select className="w-full p-5 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-cyan-500/10 transition-all" value={selectedStockId} onChange={(e) => setSelectedStockId(e.target.value)}>
                  {warehouseStock.map(s => <option key={s.id} value={s.id}>{products.find(p => p.id === s.productId)?.name} ({s.batchNumber})</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Target Branch</label>
                   <select className="w-full p-5 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-cyan-500/10 transition-all" value={destPharmacyId} onChange={(e) => setDestPharmacyId(e.target.value)}>
                     {pharmacies.map(ph => <option key={ph.id} value={ph.id}>{ph.name}</option>)}
                   </select>
                </div>
                <div>
                   <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Quantity</label>
                   <input type="number" className="w-full p-5 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-cyan-500/10 transition-all" value={transferQty} onChange={(e) => setTransferQty(Number(e.target.value))} />
                </div>
              </div>
            </div>
            <div className="flex space-x-4 mt-10">
              <button onClick={() => setShowTransferModal(false)} className="flex-1 py-4 text-slate-400 font-black uppercase text-xs hover:text-slate-600 transition-colors">Abort</button>
              <button onClick={handleTransfer} className="flex-1 py-4 bg-cyan-500 text-white rounded-[1.5rem] font-black shadow-xl shadow-cyan-500/30 hover:bg-cyan-600 transition-all active:scale-95">Verify & Ship</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WarehouseView;
