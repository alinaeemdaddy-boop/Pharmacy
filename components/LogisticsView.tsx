
import React from 'react';
import { StockRequest, Transaction } from '../types';

interface LogisticsViewProps {
  requests: StockRequest[];
  onTransfer: (t: Transaction) => void;
}

const LogisticsView: React.FC<LogisticsViewProps> = ({ requests, onTransfer }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Logistics & Operations</h2>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Inter-Branch Requests & Fleet Management</p>
        </div>
        <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm flex items-center space-x-4">
           <div className="text-right">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Fleet Status</p>
             <p className="text-sm font-black text-emerald-500">2 Active Vans</p>
           </div>
           <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">🚛</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
           <h3 className="text-xl font-black text-slate-800 mb-8">Inter-Branch Transfer Requests</h3>
           <div className="space-y-4">
             {requests.filter(r => r.status === 'OPEN').map(req => (
               <div key={req.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:shadow-lg transition-all">
                 <div className="flex items-center">
                   <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-2xl mr-5">📦</div>
                   <div>
                     <p className="font-black text-slate-800 leading-tight">Request #{req.id.slice(-4)}</p>
                     <p className="text-xs text-slate-400 font-medium">Quantity: <span className="text-slate-700 font-bold">{req.quantity} units</span></p>
                   </div>
                 </div>
                 <div className="text-right flex items-center space-x-4">
                   <div className="text-right">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Pharmacy</p>
                     <p className="text-sm font-black text-slate-700">Branch {req.pharmacyId}</p>
                   </div>
                   <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-xs font-black hover:bg-cyan-600 transition-all shadow-xl">
                     Assign Driver
                   </button>
                 </div>
               </div>
             ))}
             {requests.length === 0 && (
               <div className="py-20 text-center opacity-30">
                 <p className="font-black uppercase tracking-widest text-xs">No active logistics requests</p>
               </div>
             )}
           </div>
        </div>

        <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl text-white">
          <h3 className="text-lg font-black tracking-tight mb-2">Live Fleet View</h3>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-8">Real-time Tracker</p>
          
          <div className="space-y-8 relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-white/5"></div>
            {[
              { label: 'Central Warehouse', time: '10:00 AM', status: 'COMPLETED' },
              { label: 'Down-Town Branch', time: '11:15 AM', status: 'CURRENT' },
              { label: 'Up-Town Branch', time: '12:30 PM', status: 'PENDING' },
            ].map((stop, i) => (
              <div key={i} className="flex items-start relative pl-10">
                <div className={`absolute left-2.5 top-1 w-3 h-3 rounded-full z-10 ${stop.status === 'COMPLETED' ? 'bg-cyan-500' : stop.status === 'CURRENT' ? 'bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] animate-pulse' : 'bg-white/10'}`}></div>
                <div>
                  <p className={`text-sm font-black ${stop.status === 'PENDING' ? 'text-white/30' : 'text-white'}`}>{stop.label}</p>
                  <p className="text-[10px] font-bold text-white/40">{stop.time}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-white/5 p-5 rounded-2xl border border-white/5">
             <p className="text-xs font-bold text-white/50 mb-1">Fuel Efficiency</p>
             <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
               <div className="bg-cyan-500 h-full w-3/4"></div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogisticsView;
