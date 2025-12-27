
import React from 'react';
import { AuditLog, Product } from '../types';

interface ComplianceViewProps {
  auditLogs: AuditLog[];
  products: Product[];
}

const ComplianceView: React.FC<ComplianceViewProps> = ({ auditLogs, products }) => {
  return (
    <div className="space-y-8 animate-fade-in">
       <div className="flex justify-between items-end">
          <div>
             <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-none">Compliance Hub</h2>
             <p className="text-slate-400 font-bold text-sm mt-2 uppercase tracking-widest">Regulatory Vigilance & Audit Matrix</p>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 glass-card p-10 overflow-hidden">
             <div className="flex justify-between items-center mb-10">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">System Audit Trail</h3>
                <div className="flex space-x-2">
                   <button className="px-4 py-1.5 bg-slate-50 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-widest border border-slate-100">Filter Modules</button>
                </div>
             </div>
             <div className="space-y-4">
                {auditLogs.length === 0 ? (
                  <div className="py-20 text-center text-slate-400">
                     <p className="text-xs font-black uppercase tracking-widest opacity-30">No log entries found for this cycle</p>
                  </div>
                ) : (
                  auditLogs.map(log => (
                    <div key={log.id} className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100 hover:bg-white transition-all group flex items-start">
                       <div className={`w-3 h-3 mt-1.5 rounded-full flex-shrink-0 ${log.severity === 'CRITICAL' ? 'bg-rose-500' : log.severity === 'WARNING' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                       <div className="ml-6 flex-1">
                          <div className="flex justify-between items-start">
                             <h4 className="font-extrabold text-slate-800 leading-none mb-1.5">{log.action.replace('_', ' ')}</h4>
                             <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{new Date(log.timestamp).toLocaleTimeString()}</span>
                          </div>
                          <p className="text-xs text-slate-500 font-medium">{log.details}</p>
                          <div className="mt-3 flex items-center space-x-3">
                             <span className="text-[9px] font-black text-sky-600 bg-sky-50 px-2 py-0.5 rounded tracking-widest uppercase">{log.module}</span>
                             <span className="text-[9px] font-bold text-slate-400 uppercase">Operator ID: {log.userId}</span>
                          </div>
                       </div>
                    </div>
                  ))
                )}
             </div>
          </div>
          
          <div className="space-y-8">
             <div className="glass-card p-8 border-t-4 border-t-rose-500">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Expiry Alerts</h4>
                <div className="space-y-4">
                   <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100">
                      <p className="text-xs font-black text-rose-700 leading-tight">Paracetamol 500mg</p>
                      <p className="text-[10px] text-rose-600 font-bold mt-1">Batch BAT-002: Oct 15 Expiring</p>
                   </div>
                </div>
                <button className="w-full mt-8 py-3.5 bg-rose-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-rose-500/20 active:scale-95 transition-all">
                   Initiate Removal
                </button>
             </div>
             
             <div className="glass-card p-8">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Pipeline Health</h4>
                <div className="flex items-center justify-center p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                   <div className="text-center">
                      <p className="text-3xl font-black text-slate-800 tracking-tighter">98.4</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Compliance Score</p>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default ComplianceView;
