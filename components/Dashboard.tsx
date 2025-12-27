
import React, { useState, useEffect } from 'react';
import { Product, StockUnit, Transaction, Alert } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { getInventoryInsights } from '../geminiService';

interface DashboardProps {
  products: Product[];
  stock: StockUnit[];
  transactions: Transaction[];
  alerts: Alert[];
}

const Dashboard: React.FC<DashboardProps> = ({ products, stock, transactions, alerts }) => {
  const [insights, setInsights] = useState<string>("Analyzing enterprise intelligence...");

  useEffect(() => {
    const fetchInsights = async () => {
      const result = await getInventoryInsights(products, stock, transactions);
      setInsights(result);
    };
    fetchInsights();
  }, [products, stock, transactions]);

  const totalValuation = stock.reduce((acc, s) => {
    const product = products.find(p => p.id === s.productId);
    return acc + (s.quantity * (product?.unitCost || 0));
  }, 0);

  const totalRevenue = transactions
    .filter(t => t.type === 'SALE' && t.status === 'CONFIRMED')
    .reduce((acc, t) => acc + (t.quantity * (t.unitPrice || 0)), 0);

  const productStockData = products.map(p => ({
    name: p.name.split(' ')[0],
    quantity: stock.filter(s => s.productId === p.id).reduce((sum, s) => sum + s.quantity, 0)
  })).slice(0, 6);

  const chartData = [
    { name: 'Mon', revenue: 4200, profit: 1200 },
    { name: 'Tue', revenue: 3800, profit: 900 },
    { name: 'Wed', revenue: 5100, profit: 1800 },
    { name: 'Thu', revenue: 4700, profit: 1500 },
    { name: 'Fri', revenue: 6200, profit: 2200 },
    { name: 'Sat', revenue: 3100, profit: 800 },
    { name: 'Sun', revenue: 2800, profit: 600 },
  ];

  return (
    <div className="space-y-12 animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-5xl font-black text-slate-800 dark:text-white tracking-tighter leading-none">Global Pulse</h2>
          <p className="text-blue-500 font-black text-sm mt-3 uppercase tracking-[0.4em]">Enterprise Operations Center</p>
        </div>
        <div className="flex bg-white/40 dark:bg-slate-800/40 p-1.5 rounded-[2rem] border border-white/10 backdrop-blur-md shadow-2xl">
           {(['Daily', 'Weekly', 'Monthly'] as const).map(p => (
             <button key={p} className={`px-8 py-3.5 rounded-[1.5rem] text-xs font-black transition-all uppercase tracking-widest ${p === 'Weekly' ? 'bg-gradient-to-tr from-blue-600 to-cyan-500 text-white shadow-xl scale-110' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'}`}>
               {p}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard title="Valuation" value={`$${totalValuation.toLocaleString()}`} change="+12.4%" icon="💎" gradient="from-blue-600 to-cyan-500" />
        <StatCard title="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} change="+8.2%" icon="📈" gradient="from-emerald-500 to-teal-400" />
        <StatCard title="Network Load" value="94.2%" change="Optimized" icon="⚡" gradient="from-purple-600 to-pink-500" />
        <StatCard title="Active Alerts" value={alerts.length} change="Live Feed" icon="🚨" gradient="from-rose-600 to-orange-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 glass-premium p-10 relative overflow-hidden group">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-1000"></div>
          <div className="flex justify-between items-center mb-12 relative z-10">
            <div>
              <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Revenue Dynamics</h3>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Real-time Performance Matrix</p>
            </div>
          </div>
          <div className="h-[400px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(226, 232, 240, 0.1)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} dx={-10} />
                <Tooltip 
                  cursor={{stroke: '#3b82f6', strokeWidth: 2}} 
                  contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)'}} 
                />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={5} fillOpacity={1} fill="url(#areaGrad)" animationDuration={2000} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-950 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between group">
          <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-blue-600/30 rounded-full blur-[100px] group-hover:scale-150 transition-all duration-1000"></div>
          <div>
            <div className="flex items-center space-x-5 mb-12">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-3xl backdrop-blur-2xl border border-white/20 shadow-2xl animate-pulse">🤖</div>
              <div>
                <h3 className="text-xl font-black tracking-tight">AI Forecasting</h3>
                <p className="text-blue-400 text-[9px] font-black uppercase tracking-[0.2em] mt-1">Predictive Analytics Engine</p>
              </div>
            </div>
            <div className="space-y-6">
              {insights.split('\n').filter(l => l.trim()).slice(0, 4).map((line, i) => (
                <div key={i} className="flex items-start bg-white/5 p-6 rounded-3xl border border-white/5 hover:bg-white/10 transition-all cursor-default group/item hover:translate-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mt-1.5 mr-4 flex-shrink-0 group-hover/item:scale-150 transition-transform"></div>
                  <p className="text-sm font-bold text-slate-300 leading-relaxed italic">{line.replace(/^\d+\.\s*/, '')}</p>
                </div>
              ))}
            </div>
          </div>
          <button className="mt-12 w-full py-5 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-3xl font-black text-xs uppercase tracking-[0.3em] shadow-[0_20px_40px_-10px_rgba(59,130,246,0.5)] hover:scale-105 active:scale-95 transition-all">Deep Diagnostics</button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="glass-premium p-10 overflow-hidden">
           <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Category Distribution</h3>
           </div>
           <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: 'Antibiotics', value: 45 },
                  { name: 'Analgesics', value: 30 },
                  { name: 'Diabetes', value: 15 },
                  { name: 'Vitamins', value: 10 },
                ]}>
                  <XAxis dataKey="name" hide />
                  <YAxis hide />
                  <Tooltip contentStyle={{borderRadius: '20px', border: 'none'}} />
                  <Bar dataKey="value" radius={[12, 12, 12, 12]} barSize={40}>
                    {[0,1,2,3].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#3b82f6' : index === 1 ? '#10b981' : index === 2 ? '#8b5cf6' : '#f59e0b'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
           </div>
        </div>
        
        <div className="bg-gradient-to-br from-indigo-700 via-blue-800 to-slate-950 rounded-[3rem] p-10 text-white shadow-2xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-125 transition-transform duration-1000">
             <svg className="w-56 h-56" fill="currentColor" viewBox="0 0 24 24"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/></svg>
          </div>
          <div>
            <h3 className="text-3xl font-black tracking-tighter mb-6 leading-none">Operational <br/> Velocity: 9.8X</h3>
            <p className="text-blue-100 text-base font-bold opacity-70 leading-relaxed max-w-sm">All pharmacy nodes are synchronizing at peak efficiency. Latency in replenishment has decreased by 14% this week.</p>
          </div>
          <div className="mt-12 flex space-x-4">
             <div className="bg-white/10 backdrop-blur-3xl px-8 py-5 rounded-3xl border border-white/10 flex-1">
               <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-1">Efficiency</p>
               <p className="text-3xl font-black">94%</p>
             </div>
             <div className="bg-white/10 backdrop-blur-3xl px-8 py-5 rounded-3xl border border-white/10 flex-1 text-center">
                <div className="w-8 h-8 bg-emerald-400 rounded-full mx-auto mb-2 animate-pulse shadow-[0_0_20px_#10b981]"></div>
                <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest">Health</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, change, icon, gradient }: any) => (
  <div className="glass-premium p-8 relative overflow-hidden group">
    <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-tr ${gradient} opacity-10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700`}></div>
    <div className="flex justify-between items-start mb-6">
      <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-3xl shadow-inner group-hover:rotate-12 transition-transform duration-500">
        {icon}
      </div>
      <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 dark:bg-emerald-900/40 px-3 py-1.5 rounded-full tracking-widest">{change}</span>
    </div>
    <p className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.25em] mb-2">{title}</p>
    <h4 className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter">{value}</h4>
  </div>
);

export default Dashboard;
