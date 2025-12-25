
import React from 'react';
import { Transaction, Product } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';

interface AnalyticsViewProps {
  transactions: Transaction[];
  products: Product[];
}

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ transactions, products }) => {
  const chartData = [
    { name: 'Mon', sales: 4000 },
    { name: 'Tue', sales: 3000 },
    { name: 'Wed', sales: 2000 },
    { name: 'Thu', sales: 2780 },
    { name: 'Fri', sales: 1890 },
    { name: 'Sat', sales: 2390 },
    { name: 'Sun', sales: 3490 },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
       <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Deep Intelligence</h2>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Enterprise Performance & Growth Trends</p>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
           <div className="flex justify-between items-center mb-10">
              <h3 className="text-xl font-black text-slate-800">Sales Velocity (Weekly)</h3>
              <div className="flex space-x-2">
                <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-3 py-1 rounded-full">+12% vs LW</span>
              </div>
           </div>
           <div className="h-[400px]">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                  <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px rgba(0,0,0,0.1)'}} />
                  <Area type="monotone" dataKey="sales" stroke="#0ea5e9" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" />
               </AreaChart>
             </ResponsiveContainer>
           </div>
         </div>

         <div className="bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl text-white">
            <h3 className="text-xl font-black tracking-tight mb-2">Category Performance</h3>
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-10">Market Dominance</p>
            
            <div className="space-y-8">
              {[
                { label: 'Antibiotics', pct: 45, color: '#0ea5e9' },
                { label: 'Analgesics', pct: 30, color: '#10b981' },
                { label: 'General', pct: 25, color: '#f59e0b' },
              ].map(cat => (
                <div key={cat.label}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold">{cat.label}</span>
                    <span className="text-sm font-black text-white/60">{cat.pct}%</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${cat.pct}%`, backgroundColor: cat.color }}></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 p-6 bg-white/5 rounded-3xl border border-white/5">
              <h4 className="text-sm font-black mb-1">AI Recommendation</h4>
              <p className="text-xs text-white/40 leading-relaxed">Increase stock for "Analgesics" by 15% due to rising seasonal demand in the North branch.</p>
            </div>
         </div>
       </div>
    </div>
  );
};

export default AnalyticsView;
