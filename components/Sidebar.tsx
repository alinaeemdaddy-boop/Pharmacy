
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
        { id: 'procurement', label: 'Procurement', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z', color: 'text-purple-500' },
        { id: 'logistics', label: 'Global Logistics', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', color: 'text-orange-500' },
        { id: 'pharmacies', label: 'Branch Matrix', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', color: 'text-indigo-500' },
      ]
    },
    {
      title: 'Intelligence',
      items: [
        { id: 'analytics', label: 'AI Analytics', icon: 'M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z', color: 'text-pink-500' },
        { id: 'compliance', label: 'Audit Logs', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', color: 'text-rose-500' },
        { id: 'finance', label: 'Financials', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 16V7', color: 'text-amber-500' },
      ]
    }
  ];

  const allowedTabs = ROLE_PERMISSIONS[userRole];

  return (
    <div className={`fixed inset-y-0 left-0 w-72 lg:w-80 bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl border-r border-white/10 flex flex-col z-50 transition-all duration-700 transform lg:translate-x-0 lg:static ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
      <div className="p-10 flex items-center justify-between">
        <div className="flex items-center space-x-4 group cursor-pointer">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-[0_10px_20px_-5px_rgba(59,130,246,0.6)] transition-all duration-700 group-hover:rotate-[360deg] group-hover:scale-110">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tighter leading-none">Renew</h1>
            <p className="text-[10px] text-blue-500 font-black uppercase tracking-[0.3em] mt-1">Enterprise</p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto px-6 space-y-10 pb-10 no-scrollbar">
        {menuGroups.map((group) => {
          const groupAllowed = group.items.filter(it => allowedTabs.includes(it.id));
          if (groupAllowed.length === 0) return null;

          return (
            <div key={group.title}>
              <h3 className="px-4 mb-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.25em]">{group.title}</h3>
              <div className="space-y-2">
                {groupAllowed.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center px-5 py-4 rounded-2xl transition-all duration-500 group relative overflow-hidden ${
                        isActive 
                          ? 'sidebar-active translate-x-2' 
                          : 'text-slate-500 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-4 transition-all duration-500 ${isActive ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800 group-hover:scale-110 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40'}`}>
                        <svg className={`w-5 h-5 transition-transform duration-500 ${isActive ? 'scale-110' : `group-hover:scale-110 ${item.color}`}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d={item.icon}/>
                        </svg>
                      </div>
                      <span className={`text-sm font-extrabold tracking-tight ${isActive ? 'text-white' : 'group-hover:translate-x-1 transition-transform'}`}>
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
      
      <div className="p-8 border-t border-white/5 mt-auto">
        <div className="bg-gradient-to-tr from-slate-100 to-white dark:from-slate-800 dark:to-slate-700 rounded-2xl p-4 flex items-center space-x-3 border border-white/10 group cursor-pointer transition-all hover:shadow-2xl hover:-translate-y-2">
          <div className="relative">
             <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-cyan-400 shadow-lg flex items-center justify-center text-xl border border-white/20 font-black text-white">
                {userRole[0]}
             </div>
             <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-800 pulse-glow"></div>
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-black text-slate-800 dark:text-white truncate leading-none mb-1">Global Admin</p>
            <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest truncate">{userRole.replace('_', ' ')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
