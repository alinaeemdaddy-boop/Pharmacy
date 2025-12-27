
import React from 'react';
import { AuditLog, Product } from '../types';

interface ComplianceViewProps {
  auditLogs: AuditLog[];
  products: Product[];
}

const ComplianceView: React.FC<ComplianceViewProps> = ({ auditLogs, products }) => {
  return (
    <div className="space-y-12 animate-fade-in stagger-entry pb-10">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div>
             <h2 className="text-5xl font-black text-slate-800 dark:text-white tracking-tighter leading-none">Compliance Center</h2>
             <p className="text-rose-500 font-black text-sm mt-3 uppercase tracking-[0.4em]">Regulatory Oversight & Data Integrity</p>
          </div>
          <button className="px-10 py-4 bg-white dark:bg-slate-800 rounded-[1.5rem] shadow-2xl font-black text-[10px] uppercase tracking-[0.2em] border border-white/5 hover:-translate-y-2 transition-all">Download Audit Manifesto</button>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 glass-premium p-12 shadow-2xl overflow-hidden relative">
             <div className="absolute top-[-5%] left-[-5%] w-64 h-64 bg-blue-500/5 rounded-full blur-[100px]"></div>
             <div className="flex justify-between items-center mb-16 relative z-10">
                <h3 className="text-3xl font-black text-slate-800 dark:text-white tracking-tighter leading-none">System Audit Timeline</h3>
                <div className="flex bg-slate-100/50 dark:bg-slate-900/50 p-1.5 rounded-2xl border border-white/5 shadow-inner">
                   <button className="px-5 py-2 bg-white dark:bg-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl text-blue-600">All Layers</button>
                   <button className="px-5 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">Critical Only</button>
                </div>
             </div>
             
             <div className="space-y-10 relative z-10">
                {auditLogs.length === 0 ? (
                  <div className="py-40 text-center opacity-30">
                     <span className="text-9xl mb-8 block">📋</span>
                     <p className="text-xs font-black uppercase tracking-[0.5em]">Log Ledger Purged</p>
                  </div>
                ) : (
                  auditLogs.map((log, idx) => (
                    <div key={log.id} className="group relative flex items-start animate-slide-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                       <div className="absolute left-6 top-16 bottom-0 w-1 bg-gradient-to-b from-blue-500/20 to-transparent -translate-x-1/2"></div>
                       <div className={`w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center text-2xl shadow-2xl z-10 border border-white/10 transition-all group-hover:scale-125 group-hover:rotate-12 ${
                         log.severity === 'CRITICAL' ? 'bg-gradient-to-tr from-rose-600 to-pink-500 shadow-rose-500/20' : 
                         log.severity === 'WARNING' ? 'bg-gradient-to-tr from-amber-500 to-orange-400 shadow-amber-500/20' : 
                         'bg-gradient-to-tr from-blue-600 to-cyan-500 shadow-blue-500/20'
                       }`}>
                         {log.severity === 'CRITICAL' ? '🚨' : log.severity === 'WARNING' ? '⚠️' : '✅'}
                       </div>
                       <div className="ml-10 flex-1 glass-premium p-8 shadow-xl hover:shadow-2xl transition-all border-white/5 group-hover:translate-x-4">
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                             <h4 className="text-xl font-black text-slate-800 dark:text-white tracking-tight leading-none uppercase">{log.action.replace('_', ' ')}</h4>
                             <span className="text-[10px] text-blue-500 font-black uppercase tracking-[0.3em] bg-blue-500/5 px-4 py-1.5 rounded-full">{new Date(log.timestamp).toLocaleTimeString()} • ID: {log.id.slice(-6)}</span>
                          </div>
                          <p className="text-base text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-6 italic">"{log.details}"</p>
                          <div className="flex flex-wrap items-center gap-4">
                             <span className="text-[10px] font-black text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-700 px-4 py-1.5 rounded-xl uppercase tracking-widest">Target: {log.module}</span>
                             <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-[10px] font-black text-white">OP</div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Authority: {log.userId}</span>
                             </div>
                          </div>
                       </div>
                    </div>
                  ))
                )}
             </div>
          </div>

          <div className="space-y-10">
             <div className="glass-premium p-10 bg-slate-900 text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                   <h4 className="text-xl font-black tracking-tight mb-4">Integrity Status</h4>
                   <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.4em] mb-8">Renew Logic Core</p>
                   <div className="space-y-4">
                      <div className="flex justify-between items-center text-xs font-bold border-b border-white/5 pb-4">
                         <span className="text-white/40 uppercase">Audit Pass</span>
                         <span className="text-emerald-400">99.9%</span>
                      </div>
                      <div className="flex justify-between items-center text-xs font-bold">
                         <span className="text-white/40 uppercase">Certifications</span>
                         <span className="text-blue-400">Active</span>
                      </div>
                   </div>
                </div>
                <div className="absolute bottom-[-10%] right-[-10%] w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>
             </div>
             
             <div className="glass-premium p-10 shadow-xl">
                <h4 className="text-lg font-black text-slate-800 dark:text-white mb-6 uppercase tracking-tight">Active Protocols</h4>
                <div className="space-y-4">
                   {['Health Level 7', 'HIPAA 2024', 'ISO 27001'].map(proto => (
                      <div key={proto} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-white/5">
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{proto}</span>
                         <span className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                      </div>
                   ))}
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default ComplianceView;
