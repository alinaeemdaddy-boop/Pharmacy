
import React from 'react';

const UsersView: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
       <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Identity Management</h2>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Access Control & Staff Oversight</p>
       </div>
       <div className="bg-white p-12 rounded-[3rem] shadow-sm border border-slate-100 text-center">
          <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
          </div>
          <h3 className="text-xl font-black text-slate-800">User Management Interface</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto mt-2">Manage clinic staff, reset passwords, and assign branch-specific roles for your entire enterprise.</p>
          <button className="mt-8 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 shadow-xl transition-all">Add New Staff Member</button>
       </div>
    </div>
  );
};

export default UsersView;
