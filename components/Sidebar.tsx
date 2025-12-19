
import React from 'react';
import { UserRole } from '../types';
import { ROLE_PERMISSIONS } from '../constants';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: UserRole;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, userRole }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
    )},
    { id: 'warehouse', label: 'Warehouse', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
    )},
    { id: 'pharmacy', label: 'Pharmacies', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
    )},
    { id: 'pos', label: 'Sales (POS)', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
    )},
    { id: 'reports', label: 'Reports', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
    )},
  ];

  const allowedTabs = ROLE_PERMISSIONS[userRole];

  return (
    <div className="w-72 bg-white border-r border-slate-100 flex flex-col z-40 relative">
      <div className="p-8">
        <div className="flex items-center space-x-3 group cursor-pointer">
          <div className="w-10 h-10 bg-cyan-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 group-hover:rotate-12 transition-transform duration-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">Renew</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] -mt-1">Management</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          if (!allowedTabs.includes(item.id)) return null;
          
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-5 py-4 rounded-2xl transition-all duration-300 group ${
                isActive 
                  ? 'sidebar-active text-white scale-[1.02]' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className={`transition-transform duration-300 ${isActive ? '' : 'group-hover:scale-110'}`}>
                {item.icon}
              </div>
              <span className={`ml-4 font-bold tracking-tight ${isActive ? 'text-white' : 'text-slate-600'}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
              )}
            </button>
          );
        })}
      </nav>
      
      <div className="p-6 mt-auto">
        <div className="bg-slate-50 rounded-3xl p-5 border border-slate-100 flex items-center space-x-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-xl border border-slate-100 font-black text-cyan-600">
              {userRole[0]}
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-slate-50 rounded-full"></div>
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-extrabold text-slate-800 truncate leading-none mb-1">Clinic Admin</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider truncate">{userRole.replace('_', ' ')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
