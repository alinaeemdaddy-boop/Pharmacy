
import React from 'react';
import { UserRole, Alert } from '../types';

interface HeaderProps {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  alerts: Alert[];
}

const Header: React.FC<HeaderProps> = ({ userRole, setUserRole, alerts }) => {
  return (
    <header className="h-20 glass sticky top-0 z-30 px-8 flex items-center justify-between">
      <div>
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-0.5">Renew Portal</h2>
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-black text-slate-800 capitalize">{userRole.toLowerCase().replace('_', ' ')}</span>
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse-soft"></div>
        </div>
      </div>

      <div className="flex items-center space-x-8">
        <div className="flex items-center space-x-3 bg-white/50 p-1.5 rounded-2xl border border-white shadow-sm">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Access Role:</span>
          <select 
            value={userRole}
            onChange={(e) => setUserRole(e.target.value as UserRole)}
            className="text-xs font-black text-slate-700 bg-white border-none rounded-xl px-4 py-2 focus:ring-4 focus:ring-cyan-500/10 cursor-pointer shadow-sm outline-none"
          >
            {Object.values(UserRole).map(role => (
              <option key={role} value={role}>{role.replace('_', ' ')}</option>
            ))}
          </select>
        </div>

        <div className="relative group">
          <button className="w-12 h-12 bg-white text-slate-500 hover:text-cyan-600 hover:scale-105 rounded-2xl flex items-center justify-center relative transition-all duration-300 shadow-sm border border-slate-100 group-hover:shadow-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
            {alerts.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-black flex items-center justify-center rounded-lg shadow-lg border-2 border-white animate-bounce">
                {alerts.length}
              </span>
            )}
          </button>
          
          <div className="absolute right-0 mt-4 w-96 bg-white/95 backdrop-blur-xl shadow-2xl rounded-3xl border border-white/50 overflow-hidden hidden group-hover:block transition-all transform origin-top-right animate-scale-up">
            <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
              <div>
                <span className="block font-black text-slate-800 text-lg leading-none">Notifications</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">System Health Check</span>
              </div>
              <span className="text-[10px] bg-cyan-100 text-cyan-600 px-3 py-1 rounded-full font-black uppercase">{alerts.length} Pending</span>
            </div>
            <div className="max-h-[400px] overflow-y-auto">
              {alerts.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-3.586a1 1 0 00-.707.293l-2.707 2.707a1 1 0 01-.707.293H10.293a1 1 0 01-.707-.293L6.879 13.293A1 1 0 006.172 13H2"/></svg>
                  </div>
                  <p className="text-sm font-bold text-slate-400">Your systems are running smooth</p>
                </div>
              ) : (
                alerts.map(alert => (
                  <div key={alert.id} className="p-5 border-b border-slate-50 hover:bg-slate-50 transition-colors group/item">
                    <div className="flex items-start">
                      <div className={`w-3 h-3 mt-1.5 rounded-full flex-shrink-0 shadow-sm ${
                        alert.severity === 'high' ? 'bg-red-500' : 'bg-orange-400'
                      } group-hover/item:scale-125 transition-transform`} />
                      <div className="ml-4">
                        <p className="text-sm font-bold text-slate-700 leading-snug">{alert.message}</p>
                        <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-tight">{new Date(alert.timestamp).toLocaleTimeString()}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
               <button className="text-[10px] font-black text-cyan-600 uppercase hover:underline">Mark all as seen</button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
