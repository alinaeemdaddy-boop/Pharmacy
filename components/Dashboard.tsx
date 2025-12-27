
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
    <div className="space-y-8 md:space-y-12 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-800 dark:text-white tracking-tighter leading-none">Global Pulse</h2>
          <p className="text-blue-500 font-black text-[10px] md:text-sm mt-3 uppercase tracking-[0.4em]">Enterprise Operations Center</p>
        </div>
        <div className="flex bg-white/40 dark:bg-slate-800/40 p-1 rounded-2xl md:rounded-[2rem] border border-white/10 backdrop-blur-md shadow-lg overflow-x-auto w-full md:w-auto">
           {(['Daily', 'Weekly', 'Monthly'] as const).map(p => (
             <button key={p} className={`flex-1 md:flex-none px-4 md:px-8 py-2 md:py-3.5 rounded-xl md:rounded-[1.5rem] text-[10px] md:text-xs font-black transition-all uppercase tracking-widest ${p === 'Weekly' ? 'bg-gradient-to-tr from-blue-600 to-cyan-500 text-white shadow-xl' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'}`}>
               {p}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        <StatCard title="Valuation" value={`$${totalValuation.toLocaleString()}`} change="+12.4%" icon="💎" gradient="from-blue-600 to-cyan-500" />
        <StatCard title="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} change="+8.2%" icon="📈" gradient="from-emerald-500 to-teal-400" />
        <StatCard title="Network Load" value="94.2%" change="Optimized" icon="⚡" gradient="from-purple-600 to-pink-500" />
        <StatCard title="Active Alerts" value={alerts.length} change="Live Feed" icon="🚨" gradient="from-rose-600 to-orange-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
        <div className="lg:col-span-2 glass-premium p-6 md:p-10 relative overflow-hidden group">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[80px]"></div>
          <h3 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white tracking-tight mb-8">Revenue Dynamics</h3>
          <div className="h-[250px] md:h-[400px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(226, 232, 240, 0.1)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                <YAxis hide />
                <Tooltip contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px rgba(0,0,0,0.1)'}} />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={5} fill="url(#areaGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-950 rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 text-white shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-2xl border border-white/20 shadow-2xl">🤖</div>
              <h3 className="text-lg md:text-xl font-black tracking-tight">AI Forecasting</h3>
            </div>
            <div className="space-y-4">
              {insights.split('\n').filter(l => l.trim()).slice(0, 4).map((line, i) => (
                <div key={i} className="flex items-start bg-white/5 p-4 rounded-2xl border border-white/5 transition-all">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p className="text-xs font-bold text-slate-300 leading-relaxed italic">{line.replace(/^\d+\.\s*/, '')}</p>
                </div>
              ))}
            </div>
          </div>
          <button className="mt-8 w-full py-4 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">Deep Diagnostics</button>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, change, icon, gradient }: any) => (
  <div className="glass-premium p-6 md:p-8 relative overflow-hidden group">
    <div className={`absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-tr ${gradient} opacity-10 rounded-full blur-2xl`}></div>
    <div className="flex justify-between items-start mb-4 md:mb-6">
      <div className="w-12 h-12 md:w-14 md:h-14 bg-slate-100 dark:bg-slate-800 rounded-xl md:rounded-2xl flex items-center justify-center text-2xl md:text-3xl shadow-inner transition-transform group-hover:rotate-12">
        {icon}
      </div>
      <span className="text-[8px] md:text-[10px] font-black text-emerald-500 bg-emerald-50 dark:bg-emerald-900/40 px-2 py-1 rounded-full">{change}</span>
    </div>
    <p className="text-[10px] md:text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{title}</p>
    <h4 className="text-2xl md:text-4xl font-black text-slate-800 dark:text-white tracking-tighter">{value}</h4>
  </div>
);

export default Dashboard;
