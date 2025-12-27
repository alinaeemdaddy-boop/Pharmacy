
import React from 'react';
import { Transaction, Product } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

interface FinanceViewProps {
  transactions: Transaction[];
  products: Product[];
}

const FinanceView: React.FC<FinanceViewProps> = ({ transactions, products }) => {
  const chartData = [
    { name: 'Mon', revenue: 4200, profit: 1200 },
    { name: 'Tue', revenue: 3800, profit: 900 },
    { name: 'Wed', revenue: 5100, profit: 1800 },
    { name: 'Thu', revenue: 4700, profit: 1500 },
    { name: 'Fri', revenue: 6200, profit: 2200 },
    { name: 'Sat', revenue: 3100, profit: 800 },
    { name: 'Sun', revenue: 2800, profit: 600 },
  ];

  const totalRev = transactions.filter(t => t.type === 'SALE').reduce((acc, t) => acc + (t.unitPrice || 0) * t.quantity, 0);

  return (
    <div className="space-y-10 animate-fade-in stagger-entry">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div>
             <h2 className="text-5xl font-black text-slate-800 dark:text-white tracking-tighter leading-none">Financial Intelligence</h2>
             <p className="text-emerald-500 font-black text-sm mt-3 uppercase tracking-[0.4em]">Equity & Profit Matrix</p>
          </div>
          <button className="px-8 py-4 bg-white dark:bg-slate-800 rounded-2xl shadow-xl font-black text-[10px] uppercase tracking-widest border border-white/10 hover:-translate-y-1 transition-all">Export Ledger (PDF)</button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-premium p-10 bg-gradient-to-tr from-blue-600/5 to-cyan-500/5">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">Gross Revenue (Live)</p>
             <h3 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">${totalRev.toLocaleString()}</h3>
             <div className="mt-6 flex items-center space-x-3">
                <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full uppercase tracking-widest">+14.2%</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Velocity Positive</span>
             </div>
          </div>
          <div className="glass-premium p-10 bg-gradient-to-tr from-purple-600/5 to-pink-500/5">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">Net Asset Portfolio</p>
             <h3 className="text-5xl font-black text-blue-600 tracking-tighter">$842.1K</h3>
             <div className="mt-6 flex items-center space-x-3">
                <span className="text-[10px] font-black text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full uppercase tracking-widest">Diversified</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Market Synced</span>
             </div>
          </div>
          <div className="glass-premium p-10 bg-gradient-to-tr from-rose-600/5 to-orange-500/5">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">Projected Liabilities</p>
             <h3 className="text-5xl font-black text-rose-500 tracking-tighter">${(totalRev * 0.17).toLocaleString()}</h3>
             <div className="mt-6 flex items-center space-x-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Q3 Fiscal Obligation
             </div>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 glass-premium p-12">
             <div className="flex justify-between items-center mb-12">
                <div>
                   <h3 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">EBITDA Dynamics</h3>
                   <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Global Profit Curve Analysis</p>
                </div>
             </div>
             <div className="h-[450px]">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="profGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(226, 232, 240, 0.1)" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} />
                      <YAxis hide />
                      <Tooltip 
                        contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 40px 80px -20px rgba(0,0,0,0.4)', background: 'rgba(15, 23, 42, 0.95)', color: 'white'}} 
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={6} fillOpacity={1} fill="url(#revGrad)" animationDuration={3000} />
                      <Area type="monotone" dataKey="profit" stroke="#8b5cf6" strokeWidth={6} fillOpacity={1} fill="url(#profGrad)" animationDuration={2000} />
                   </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>
          
          <div className="glass-premium p-12 flex flex-col justify-between relative overflow-hidden group">
             <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] group-hover:scale-150 transition-transform duration-1000"></div>
             <div>
                <h3 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight mb-12">Margin Performance</h3>
                <div className="space-y-10">
                   {products.slice(0, 4).map((p, i) => (
                     <div key={p.id} className="space-y-3 group/item">
                        <div className="flex justify-between items-end">
                           <p className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-tighter group-hover/item:text-blue-500 transition-colors">{p.name}</p>
                           <p className="text-xl font-black text-emerald-500">{Math.round((p.unitPrice - p.unitCost) / p.unitCost * 100)}%</p>
                        </div>
                        <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                           <div className={`h-full transition-all duration-1000 ${i % 2 === 0 ? 'bg-gradient-to-r from-blue-600 to-indigo-500' : 'bg-gradient-to-r from-emerald-600 to-teal-400'}`} style={{ width: `${Math.round((p.unitPrice - p.unitCost) / p.unitCost * 100)}%` }} />
                        </div>
                     </div>
                   ))}
                </div>
             </div>
             <div className="mt-16 p-8 bg-slate-900 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                   <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em] mb-2">Branch Efficiency</p>
                   <p className="text-3xl font-black tracking-tighter">Peak Alpha</p>
                </div>
                <div className="absolute top-0 right-0 p-6 opacity-20">🚀</div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default FinanceView;
