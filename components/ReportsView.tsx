
import React, { useState, useMemo } from 'react';
import { Transaction, Product, Pharmacy, StockUnit } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

interface ReportsViewProps {
  transactions: Transaction[];
  products: Product[];
  pharmacies: Pharmacy[];
  stock: StockUnit[];
}

const ReportsView: React.FC<ReportsViewProps> = ({ transactions, products, pharmacies, stock }) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [reportTab, setReportTab] = useState<'AUDIT' | 'SALES'>('AUDIT');

  const filteredTransactions = transactions.filter(t => 
    filterType === 'ALL' || t.type === filterType
  );

  const salesStats = useMemo(() => {
    const confirmedSales = transactions.filter(t => t.type === 'SALE' && t.status === 'CONFIRMED');
    const revenue = confirmedSales.reduce((sum, t) => sum + (t.quantity * (t.unitPrice || 0)), 0);
    const tax = confirmedSales.reduce((sum, t) => sum + (t.taxAmount || 0), 0);
    const count = confirmedSales.length;
    
    // Payments mix
    const payments = confirmedSales.reduce((acc: any, t) => {
      const m = t.paymentMethod || 'CASH';
      acc[m] = (acc[m] || 0) + (t.quantity * (t.unitPrice || 0));
      return acc;
    }, {});
    
    // Best sellers
    const topMedications = products.map(p => {
      const sold = confirmedSales.filter(t => t.productId === p.id).reduce((sum, t) => sum + t.quantity, 0);
      return { name: p.name.split(' ')[0], value: sold };
    }).sort((a, b) => b.value - a.value).slice(0, 5);

    return { revenue, tax, count, payments, topMedications };
  }, [transactions, products]);

  const COLORS = ['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f97316'];

  const getEntityName = (id: string) => {
    if (id === 'warehouse') return 'Warehouse';
    if (id === 'supplier') return 'Supplier';
    if (id === 'customer') return 'Customer';
    return pharmacies.find(p => p.id === id)?.name || id;
  };

  const totalInvValue = stock.reduce((sum, s) => {
    const p = products.find(prod => prod.id === s.productId);
    return sum + (s.quantity * (p?.unitCost || 0));
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Clinic Analytics</h2>
          <p className="text-slate-500">Real-time financial tracking and operational auditing.</p>
        </div>
        <div className="flex space-x-2 bg-slate-100 p-1 rounded-2xl">
          <button onClick={() => setReportTab('AUDIT')} className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${reportTab === 'AUDIT' ? 'bg-white shadow-sm text-cyan-600' : 'text-slate-500'}`}>AUDIT TRAIL</button>
          <button onClick={() => setReportTab('SALES')} className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${reportTab === 'SALES' ? 'bg-white shadow-sm text-cyan-600' : 'text-slate-500'}`}>SALES ANALYSIS</button>
        </div>
      </div>

      {reportTab === 'SALES' ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Revenue</p>
               <h3 className="text-3xl font-black text-slate-900">${salesStats.revenue.toLocaleString()}</h3>
             </div>
             <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Sales Tax</p>
               <h3 className="text-3xl font-black text-cyan-600">${salesStats.tax.toLocaleString()}</h3>
             </div>
             <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Orders</p>
               <h3 className="text-3xl font-black text-indigo-600">{salesStats.count}</h3>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-black text-slate-800 mb-6 uppercase tracking-tight">Best Selling Medications</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesStats.topMedications} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.1)'}} />
                    <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                      {salesStats.topMedications.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-black text-slate-800 mb-6 uppercase tracking-tight">Payment Method Mix</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Pie 
                      data={Object.entries(salesStats.payments).map(([name, value]) => ({ name, value }))} 
                      innerRadius={60} 
                      outerRadius={100} 
                      paddingAngle={8} 
                      dataKey="value"
                    >
                       {Object.entries(salesStats.payments).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                     </Pie>
                     <Tooltip />
                   </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {Object.entries(salesStats.payments).map(([name, value]: any, i) => (
                  <div key={name} className="flex items-center text-[10px] font-black uppercase text-slate-500 bg-slate-50 p-2 rounded-xl">
                    <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    {name}: ${value.toLocaleString()}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl flex items-center shadow-sm w-fit mb-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase mr-3">Est. Inventory Cost Basis</span>
            <span className="text-lg font-black text-cyan-600">${totalInvValue.toLocaleString()}</span>
          </div>

          <div className="flex space-x-2 bg-white p-1.5 rounded-xl border border-slate-200 w-fit mb-6">
            {['ALL', 'RESTOCK', 'TRANSFER', 'SALE', 'RETURN'].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  filterType === type 
                    ? 'bg-slate-900 text-white shadow-lg' 
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            {filteredTransactions.length === 0 ? (
              <div className="p-12 text-center text-slate-400 flex flex-col items-center">
                <svg className="w-12 h-12 mb-3 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                No matching transactions found.
              </div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Transaction Details</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Quantity</th>
                    <th className="px-6 py-4">Logistics Path</th>
                    <th className="px-6 py-4 text-right">Value (Price/Cost)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTransactions.map(t => {
                    const product = products.find(p => p.id === t.productId);
                    const value = t.type === 'SALE' || t.type === 'RETURN' ? (t.quantity * (t.unitPrice || product?.unitPrice || 0)) : (t.quantity * (product?.unitCost || 0));
                    
                    return (
                      <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-800">{product?.name}</p>
                          <p className="text-[10px] font-mono text-slate-400">{new Date(t.date).toLocaleString()} | #{t.id.split('-')[0]}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <span className={`w-fit px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter ${
                              t.type === 'SALE' ? 'bg-emerald-100 text-emerald-600' :
                              t.type === 'RETURN' ? 'bg-red-100 text-red-600' :
                              t.type === 'TRANSFER' ? 'bg-blue-100 text-blue-600' :
                              'bg-purple-100 text-purple-600'
                            }`}>
                              {t.type}
                            </span>
                            <span className={`text-[9px] font-bold ${t.status === 'CONFIRMED' ? 'text-emerald-500' : 'text-orange-400'}`}>
                              {t.status === 'CONFIRMED' ? 'RECOGNIZED' : 'IN-PROGRESS'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-black text-slate-800 text-lg">
                          {t.quantity}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col text-[10px] font-bold">
                            <span className="text-slate-400 uppercase">From: {getEntityName(t.fromId)}</span>
                            <span className="text-slate-600 uppercase">To: {getEntityName(t.toId)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <p className="text-sm font-black text-slate-900">${value.toLocaleString()}</p>
                           {t.taxAmount && <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Incl. ${t.taxAmount.toFixed(2)} Tax</p>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ReportsView;
