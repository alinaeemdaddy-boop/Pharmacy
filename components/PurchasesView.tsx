
import React, { useState } from 'react';
import { Supplier, Product, Transaction } from '../types';

interface PurchasesViewProps {
  suppliers: Supplier[];
  products: Product[];
  onPurchase: (t: Transaction) => void;
}

const PurchasesView: React.FC<PurchasesViewProps> = ({ suppliers, products, onPurchase }) => {
  const [selectedSupplierId, setSelectedSupplierId] = useState(suppliers[0].id);
  const [selectedProductId, setSelectedProductId] = useState(products[0].id);
  const [qty, setQty] = useState(100);

  const handleCreatePO = () => {
    const p = products.find(prod => prod.id === selectedProductId);
    onPurchase({
      id: `PUR-${Date.now()}`,
      type: 'PURCHASE',
      productId: selectedProductId,
      quantity: qty,
      fromId: 'supplier',
      toId: 'warehouse',
      date: new Date().toISOString(),
      batchNumber: `B-${Date.now().toString().slice(-4)}`,
      status: 'CONFIRMED',
      notes: `Purchase from ${suppliers.find(s => s.id === selectedSupplierId)?.name}`
    });
    alert("Purchase Order (PO) Created & Goods Received (GRN) Updated");
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Purchase & Procurement</h2>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Vendor Relations & Inventory Replenishment</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
          <h3 className="text-xl font-black text-slate-800 mb-8">Active Suppliers</h3>
          <div className="overflow-hidden rounded-3xl border border-slate-50">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                <tr>
                  <th className="px-6 py-4">Supplier Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Rating</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {suppliers.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-5">
                      <p className="font-bold text-slate-800">{s.name}</p>
                      <p className="text-xs text-slate-400">{s.contact}</p>
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-600 font-medium">{s.category}</td>
                    <td className="px-6 py-5">
                       <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-2 py-1 rounded-lg">⭐ {s.rating}</span>
                    </td>
                    <td className="px-6 py-5 text-right">
                       <button className="text-cyan-600 font-bold text-xs hover:underline">View Ledger</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 border-t-4 border-t-cyan-500">
          <h3 className="text-xl font-black text-slate-800 mb-2 tracking-tight">Generate Purchase Order</h3>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-8">Manual Procurement Entry</p>
          
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Supplier</label>
              <select className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none font-bold text-slate-700 shadow-sm" value={selectedSupplierId} onChange={(e) => setSelectedSupplierId(e.target.value)}>
                {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Product</label>
              <select className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none font-bold text-slate-700 shadow-sm" value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)}>
                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Quantity</label>
              <input type="number" className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none font-bold text-slate-700 shadow-sm" value={qty} onChange={(e) => setQty(Number(e.target.value))} />
            </div>
            <button onClick={handleCreatePO} className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-lg hover:bg-slate-800 transition-all shadow-2xl">
              Create & Process PO
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchasesView;
