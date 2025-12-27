
import React from 'react';
import { UserRole } from '../types';
import { ROLE_PERMISSIONS } from '../constants';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: UserRole;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, userRole, isOpen, onClose }) => {
  const menuGroups = [
    {
      title: 'Navigation',
      items: [
        { id: 'dashboard', label: 'Command Center', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', color: 'text-blue-500' },
        { id: 'catalog', label: 'Medicine Hub', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', color: 'text-cyan-500' },
        { id: 'pos', label: 'Point of Sale', icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z', color: 'text-emerald-500' },
      ]
    },
    {
      title: 'Operations',
      items: [
        { id: 'logistics', label: 'Logistics Matrix', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', color: 'text-orange-500' },
        { id: 'pharmacies', label: 'Branch Matrix', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', color: 'text-indigo-500' },
      ]
    },
    {
      title: 'Intelligence',
      items: [
        { id: 'analytics', label: 'AI Analytics', icon: 'M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z', color: 'text-pink-500' },
        { id: 'finance', label: 'Financials', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 16V7', color: 'text-amber-500' },
        { id: 'compliance', label: 'Compliance', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', color: 'text-rose-500' }
      ]
    }
  ];

  const allowedTabs = ROLE_PERMISSIONS[userRole];

  return (
    <aside className={`fixed inset-y-0 left-0 w-72 md:w-80 bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl border-r border-white/10 flex flex-col z-[100] transition-transform duration-500 ease-out lg:static lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="p-8 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800 dark:text-white leading-none">Renew</h1>
            <p className="text-[8px] text-blue-500 font-black uppercase tracking-widest mt-1">Enterprise</p>
          </div>
        </div>
        <button onClick={onClose} className="lg:hidden p-2 text-slate-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto px-4 space-y-8 pb-10 no-scrollbar">
        {menuGroups.map((group) => {
          const groupAllowed = group.items.filter(it => allowedTabs.includes(it.id));
          if (groupAllowed.length === 0) return null;

          return (
            <div key={group.title}>
              <h3 className="px-4 mb-3 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{group.title}</h3>
              <div className="space-y-1.5">
                {groupAllowed.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => { setActiveTab(item.id); onClose(); }}
                      className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${
                        isActive 
                          ? 'sidebar-active translate-x-1' 
                          : 'text-slate-500 dark:text-slate-400 hover:bg-white/40 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${isActive ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800'}`}>
                        <svg className={`w-4 h-4 ${isActive ? 'text-white' : item.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={item.icon}/>
                        </svg>
                      </div>
                      <span className="text-[11px] font-extrabold tracking-tight">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;
