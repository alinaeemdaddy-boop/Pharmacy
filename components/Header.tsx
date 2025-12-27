
import React, { useState } from 'react';
import { UserRole, Alert } from '../types';

interface HeaderProps {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  alerts: Alert[];
  theme: string;
  setTheme: (t: 'light' | 'dark' | 'neon' | 'emerald') => void;
  onOpenMenu: () => void;
  onOpenPalette: () => void;
}

const Header: React.FC<HeaderProps> = ({ userRole, setUserRole, alerts, theme, setTheme, onOpenMenu, onOpenPalette }) => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-24 glass-premium sticky top-0 z-[60] px-8 md:px-12 flex items-center justify-between border-b border-white/10 mx-6 mt-4 backdrop-blur-3xl shadow-2xl transition-all duration-500">
      <div className="flex items-center space-x-8">
        <button 
          onClick={onOpenMenu}
          className="lg:hidden p-3 bg-white/10 rounded-2xl border border-white/10 hover:bg-white/20 transition-all active:scale-90"
        >
          <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
        
        <div className="relative group hidden md:block" onClick={onOpenPalette}>
           <div className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500 group-hover:scale-125 transition-transform duration-500">
             <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
           </div>
           <input 
             readOnly
             placeholder="Search anything... (Ctrl+K)" 
             className="w-96 pl-14 pr-6 py-4 bg-slate-100/50 dark:bg-slate-800/50 border-none rounded-[1.5rem] text-sm font-bold placeholder:text-slate-400 transition-all focus:ring-4 focus:ring-blue-500/20 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
           />
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <div className="hidden lg:flex items-center space-x-2 bg-slate-100/50 dark:bg-slate-800/50 p-1.5 rounded-2xl border border-white/10">
          {(['light', 'dark', 'neon', 'emerald'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`w-10 h-10 rounded-xl transition-all duration-500 flex items-center justify-center capitalize text-[10px] font-black tracking-tighter ${theme === t ? 'bg-white dark:bg-slate-700 shadow-xl scale-110 text-blue-600' : 'text-slate-400 hover:bg-white/50'}`}
            >
              {t[0]}
            </button>
          ))}
        </div>

        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-14 h-14 bg-white dark:bg-slate-800 border border-white/10 rounded-2xl flex items-center justify-center relative transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 group active:scale-90"
          >
            <svg className="w-7 h-7 text-slate-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            {alerts.length > 0 && (
              <span className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-tr from-rose-600 to-pink-500 text-white text-[10px] font-black flex items-center justify-center rounded-lg shadow-lg border-2 border-white dark:border-slate-900 animate-bounce">
                {alerts.length}
              </span>
            )}
          </button>
          
          {showNotifications && (
            <>
              <div className="fixed inset-0 z-[70]" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 mt-6 w-[400px] bg-white dark:bg-slate-900 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] rounded-[2.5rem] border border-white/10 overflow-hidden animate-scale-up z-[80] transition-all">
                <div className="p-8 bg-gradient-to-r from-blue-600 to-cyan-500 flex justify-between items-center">
                  <h3 className="text-xl font-black text-white tracking-tight">Intelligence Feed</h3>
                  <span className="bg-white/20 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{alerts.length} Updates</span>
                </div>
                <div className="max-h-[450px] overflow-y-auto no-scrollbar">
                  {alerts.map((alert, idx) => (
                    <div key={alert.id} className="p-6 border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all flex items-start group">
                      <div className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center text-xl shadow-inner ${alert.severity === 'high' ? 'bg-rose-50' : 'bg-blue-50'} group-hover:scale-110 transition-transform`}>
                        {alert.type === 'LOW_STOCK' ? '📉' : '⏰'}
                      </div>
                      <div className="ml-5">
                        <p className="text-sm font-black text-slate-800 dark:text-white leading-snug">{alert.message}</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-2">{new Date(alert.timestamp).toLocaleTimeString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full p-6 bg-slate-50 dark:bg-slate-800/50 text-center text-blue-600 font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-colors">Clear All Feed</button>
              </div>
            </>
          )}
        </div>

        <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-500 rounded-2xl shadow-xl cursor-pointer hover:rotate-12 transition-transform duration-500 flex items-center justify-center text-white border border-white/20 ring-4 ring-blue-500/10">
           <span className="text-xl font-black">{userRole[0]}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
