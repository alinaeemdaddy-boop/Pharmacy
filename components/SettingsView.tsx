
import React from 'react';

const SettingsView: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
       <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Enterprise Config</h2>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">System Preferences & Regional Defaults</p>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { title: 'Taxation & Compliance', desc: 'Manage GST/VAT rates and regulatory reporting periods.' },
            { title: 'Payment Gateways', desc: 'Configure Card, Wallet, and Voucher integrations.' },
            { title: 'Branch Hierarchy', desc: 'Organize your clinic network into regions and clusters.' },
            { title: 'API & Integrations', desc: 'Manage connections to external accounting or courier software.' },
          ].map(set => (
            <div key={set.title} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all cursor-pointer group">
              <h4 className="text-lg font-black text-slate-800 mb-2 group-hover:text-cyan-600 transition-colors">{set.title}</h4>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">{set.desc}</p>
              <div className="mt-6 flex justify-end">
                <svg className="w-5 h-5 text-slate-300 group-hover:text-cyan-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              </div>
            </div>
          ))}
       </div>
    </div>
  );
};

export default SettingsView;
