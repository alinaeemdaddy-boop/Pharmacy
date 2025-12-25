
import React from 'react';
import { Customer, Transaction } from '../types';

interface CustomersViewProps {
  customers: Customer[];
  transactions: Transaction[];
}

const CustomersView: React.FC<CustomersViewProps> = ({ customers, transactions }) => {
  return (
    <div className="space-y-8 animate-fade-in">
       <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">CRM & Loyalty</h2>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Patient Relationships & Rewards Program</p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {customers.map((c, idx) => {
           const customerSales = transactions.filter(t => t.customerId === c.id);
           const totalSpent = customerSales.reduce((sum, t) => sum + ((t.unitPrice || 0) * t.quantity), 0);
           
           return (
             <div key={c.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 card-hover animate-scale-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="flex justify-between items-start mb-6">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl font-black text-slate-300 border border-slate-100">
                    {c.name[0]}
                  </div>
                  <div className="text-right">
                    <span className="bg-cyan-50 text-cyan-600 text-[10px] font-black px-3 py-1 rounded-full uppercase">Loyalty Tier 1</span>
                    <p className="text-2xl font-black text-slate-800 mt-2">{c.loyaltyPoints} Pts</p>
                  </div>
                </div>
                <h4 className="text-xl font-black text-slate-800 mb-1">{c.name}</h4>
                <p className="text-xs text-slate-400 font-bold mb-6">{c.phone} • {c.email}</p>
                
                <div className="grid grid-cols-2 gap-4 border-t border-slate-50 pt-6">
                   <div>
                     <p className="text-[10px] font-black text-slate-400 uppercase mb-0.5 tracking-widest">Net Revenue</p>
                     <p className="text-sm font-black text-slate-800">${totalSpent.toLocaleString()}</p>
                   </div>
                   <div>
                     <p className="text-[10px] font-black text-slate-400 uppercase mb-0.5 tracking-widest">Total Visits</p>
                     <p className="text-sm font-black text-slate-800">{customerSales.length} Times</p>
                   </div>
                </div>
                <button className="w-full mt-8 py-3 bg-slate-50 text-slate-600 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-900 hover:text-white transition-all">
                  View Profile & History
                </button>
             </div>
           );
         })}
       </div>
    </div>
  );
};

export default CustomersView;
