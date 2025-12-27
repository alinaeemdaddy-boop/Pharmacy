
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
    <header className="h-20 md:h-24 glass-premium sticky top-0 z-[60] px-4 md:px-12 flex items-center justify-between border-b border-white/10 mx-4 md:mx-6 mt-4 backdrop-blur-3xl shadow-2xl transition-all duration-500">
      <div className="flex items-center space-x-4 md:space-x-8">
        <button 
          onClick={onOpenMenu}
          className="lg:hidden p-2.5 bg-white/10 rounded-xl border border-white/10 hover:bg-white/20 active:scale-90"
        >
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
        
        <div className="relative group hidden sm:block" onClick={onOpenPalette}>
           <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500">
             <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
           </div>
           <input 
             readOnly
             placeholder="Search... (Ctrl+K)" 
             className="w-48 lg:w-96 pl-11 pr-4 py-3 bg-slate-100/50 dark:bg-slate-800/50 border-none rounded-xl text-xs font-bold placeholder:text-slate-400 cursor-pointer"
           />
        </div>
      </div>

      <div className="flex items-center space-x-3 md:space-x-6">
        <div className="hidden lg:flex items-center space-x-2 bg-slate-100/50 dark:bg-slate-800/50 p-1 rounded-xl border border-white/10">
          {(['light', 'dark', 'neon', 'emerald'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`w-8 h-8 rounded-lg transition-all flex items-center justify-center capitalize text-[8px] font-black ${theme === t ? 'bg-white dark:bg-slate-700 shadow-lg text-blue-600' : 'text-slate-400'}`}
            >
              {t[0]}
            </button>
          ))}
        </div>

        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-10 h-10 md:w-14 md:h-14 bg-white dark:bg-slate-800 border border-white/10 rounded-xl md:rounded-2xl flex items-center justify-center relative active:scale-90"
          >
            <svg className="w-5 h-5 md:w-7 md:h-7 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            {alerts.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 md:w-6 md:h-6 bg-rose-600 text-white text-[8px] md:text-[10px] font-black flex items-center justify-center rounded-lg shadow-lg border-2 border-white animate-bounce">
                {alerts.length}
              </span>
            )}
          </button>
          
          {showNotifications && (
            <>
              <div className="fixed inset-0 z-[70]" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 mt-4 w-screen max-w-[320px] md:max-w-[400px] bg-white dark:bg-slate-900 shadow-2xl rounded-2xl md:rounded-[2.5rem] border border-white/10 overflow-hidden animate-scale-up z-[80]">
                <div className="p-6 bg-gradient-to-r from-blue-600 to-cyan-500">
                  <h3 className="text-lg font-black text-white tracking-tight">Intelligence Feed</h3>
                </div>
                <div className="max-h-[350px] overflow-y-auto no-scrollbar">
                  {alerts.length === 0 ? (
                    <div className="p-10 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Feed Empty</div>
                  ) : alerts.map(alert => (
                    <div key={alert.id} className="p-4 border-b border-slate-50 dark:border-slate-800 flex items-start">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex-shrink-0 flex items-center justify-center text-lg">📉</div>
                      <div className="ml-4">
                        <p className="text-xs font-black text-slate-800 dark:text-white leading-snug">{alert.message}</p>
                        <p className="text-[8px] text-slate-400 font-bold uppercase mt-1">{new Date(alert.timestamp).toLocaleTimeString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-tr from-blue-600 to-purple-500 rounded-xl md:rounded-2xl shadow-lg flex items-center justify-center text-white border border-white/20 active:scale-95">
           <span className="text-base md:text-xl font-black">{userRole[0]}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
