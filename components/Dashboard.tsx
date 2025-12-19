
import React, { useState, useEffect } from 'react';
import { Product, StockUnit, Transaction, Alert } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getInventoryInsights } from '../geminiService';

interface DashboardProps {
  products: Product[];
  stock: StockUnit[];
  transactions: Transaction[];
  alerts: Alert[];
}

const Dashboard: React.FC<DashboardProps> = ({ products, stock, transactions, alerts }) => {
  const [insights, setInsights] = useState<string>("Analyzing clinic ecosystems...");

  useEffect(() => {
    const fetchInsights = async () => {
      const result = await getInventoryInsights(products, stock, transactions);
      setInsights(result);
    };
    fetchInsights();
  }, [products, stock, transactions]);

  const totalStockUnits = stock.reduce((acc, curr) => acc + curr.quantity, 0);
  
  const totalValuation = stock.reduce((acc, s) => {
    const product = products.find(p => p.id === s.productId);
    return acc + (s.quantity * (product?.unitCost || 0));
  }, 0);

  const totalRevenue = transactions
    .filter(t => t.type === 'SALE' && t.status === 'CONFIRMED')
    .reduce((acc, t) => {
      const p = products.find(prod => prod.id === t.productId);
      return acc + (t.quantity * (p?.unitPrice || 0));
    }, 0);

  const totalReceived = transactions
    .filter(t => t.type === 'RESTOCK' && t.status === 'CONFIRMED')
    .reduce((sum, t) => sum + t.quantity, 0);
  
  const totalSold = transactions
    .filter(t => t.type === 'SALE' && t.status === 'CONFIRMED')
    .reduce((sum, t) => sum + t.quantity, 0);

  const productStockData = products.map(p => ({
    name: p.name.split(' ')[0],
    quantity: stock.filter(s => s.productId === p.id).reduce((sum, s) => sum + s.quantity, 0)
  }));

  const distributionData = [
    { name: 'Warehouse', value: stock.filter(s => s.locationId === 'warehouse').reduce((sum, s) => sum + s.quantity, 0) },
    { name: 'Pharmacies', value: stock.filter(s => s.locationId !== 'warehouse').reduce((sum, s) => sum + s.quantity, 0) },
  ];

  const COLORS = ['#0ea5e9', '#6366f1', '#a855f7', '#ec4899'];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Inventory Valuation" value={`$${totalValuation.toLocaleString()}`} icon="📈" color="blue" delay="0s" />
        <StatCard title="Revenue Stream" value={`$${totalRevenue.toLocaleString()}`} icon="💎" color="emerald" delay="0.1s" />
        <StatCard title="Total Inventory" value={totalStockUnits.toLocaleString()} icon="📦" color="cyan" delay="0.2s" />
        <StatCard title="System Health" value={`${alerts.length === 0 ? 'Healthy' : alerts.length + ' Issues'}`} icon="🩺" color="rose" delay="0.3s" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 card-hover">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-xl font-black text-slate-800 tracking-tight">Stock Analysis</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Units per Medication</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
              <span className="text-[10px] font-black text-slate-500 uppercase">Live Data</span>
            </div>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productStockData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} dx={-10} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}} 
                  contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)'}} 
                />
                <Bar dataKey="quantity" fill="url(#colorBar)" radius={[12, 12, 0, 0]} isAnimationActive={true}>
                  <defs>
                    <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={1}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0.8}/>
                    </linearGradient>
                  </defs>
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 card-hover flex flex-col h-full">
          <h3 className="text-xl font-black text-slate-800 tracking-tight mb-2">Inventory Mix</h3>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-10">Location Distribution</p>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={distributionData} innerRadius={80} outerRadius={110} paddingAngle={10} dataKey="value" stroke="none">
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{borderRadius: '20px'}} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4 w-full">
               {distributionData.map((d, i) => (
                 <div key={d.name} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                   <div className="flex items-center justify-center mb-1">
                     <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: COLORS[i] }} />
                     <span className="text-[10px] font-black text-slate-500 uppercase">{d.name}</span>
                   </div>
                   <p className="text-lg font-black text-slate-800 leading-none">{d.value.toLocaleString()}</p>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-cyan-600 to-indigo-700 p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl transition-transform duration-700 group-hover:scale-125"></div>
          <div className="flex items-center mb-8 relative z-10">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl mr-4 backdrop-blur-md">🤖</div>
            <div>
              <h3 className="text-2xl font-black tracking-tight">AI Supply Intelligence</h3>
              <p className="text-cyan-100 text-xs font-bold uppercase tracking-widest">Powered by Renew-Gemini</p>
            </div>
          </div>
          <div className="space-y-4 relative z-10">
            {insights.split('\n').map((line, i) => (
              <div key={i} className="flex items-start bg-white/10 p-4 rounded-2xl border border-white/5 backdrop-blur-sm hover:bg-white/20 transition-all cursor-default">
                <div className="w-1.5 h-1.5 bg-cyan-300 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-sm font-medium text-cyan-50 leading-relaxed">{line}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 card-hover">
          <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-2">Check & Balance</h3>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-10">Real-time Stock Reconciliation</p>
          <div className="grid grid-cols-2 gap-6">
            <BalanceCard label="Stock Inbound" value={`+${totalReceived}`} color="emerald" icon="📥" />
            <BalanceCard label="Stock Outbound" value={`-${totalSold}`} color="rose" icon="📤" />
            <div className="col-span-2 p-8 bg-slate-900 rounded-3xl text-white flex justify-between items-center shadow-xl">
               <div>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Net System Balance</p>
                 <h4 className="text-4xl font-black text-cyan-400">{totalStockUnits.toLocaleString()}</h4>
               </div>
               <div className="flex items-center space-x-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-2xl border border-emerald-500/20">
                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                 <span className="text-xs font-black uppercase">Verified</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color, delay }: { title: string, value: string, icon: string, color: string, delay: string }) => (
  <div 
    className="bg-white p-7 rounded-[2.2rem] shadow-sm border border-slate-100 card-hover animate-scale-up"
    style={{ animationDelay: delay }}
  >
    <div className="flex justify-between items-start">
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
        <h4 className="text-2xl font-black text-slate-800 leading-none">{value}</h4>
      </div>
      <div className={`w-12 h-12 rounded-2xl bg-${color}-50 text-${color}-600 flex items-center justify-center text-xl shadow-inner border border-${color}-100`}>
        {icon}
      </div>
    </div>
  </div>
);

const BalanceCard = ({ label, value, color, icon }: { label: string, value: string, color: string, icon: string }) => (
  <div className={`p-6 bg-${color}-50 rounded-3xl border border-${color}-100 transition-transform hover:scale-[1.02]`}>
    <div className="flex items-center mb-2">
      <span className="mr-2 text-lg">{icon}</span>
      <p className={`text-[10px] font-black text-${color}-600 uppercase tracking-widest`}>{label}</p>
    </div>
    <p className={`text-2xl font-black text-${color}-700`}>{value}</p>
  </div>
);

export default Dashboard;
