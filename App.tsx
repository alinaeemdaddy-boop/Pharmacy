
import React, { useState, useEffect } from 'react';
import { UserRole, Product, StockUnit, Transaction, Pharmacy, Alert, Customer, Supplier, AuditLog } from './types';
import { INITIAL_PRODUCTS, INITIAL_PHARMACIES, INITIAL_WAREHOUSE_STOCK, ROLE_PERMISSIONS, INITIAL_CUSTOMERS, INITIAL_SUPPLIERS } from './constants';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import CatalogHub from './components/CatalogHub';
import ProcurementView from './components/ProcurementView';
import LogisticsView from './components/LogisticsView';
import ComplianceView from './components/ComplianceView';
import FinanceView from './components/FinanceView';
import POSView from './components/POSView';
import PharmacyView from './components/PharmacyView';
import CustomersView from './components/CustomersView';
import AnalyticsView from './components/AnalyticsView';
import SettingsView from './components/SettingsView';

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'neon' | 'emerald'>('light');
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>(UserRole.ADMIN);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [stock, setStock] = useState<StockUnit[]>(INITIAL_WAREHOUSE_STOCK);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [customers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [suppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedPharmacyId, setSelectedPharmacyId] = useState<string>(INITIAL_PHARMACIES[0].id);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const addLog = (module: string, action: string, details: string, severity: 'INFO' | 'WARNING' | 'CRITICAL' = 'INFO') => {
    setAuditLogs(prev => [{
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: 'admin-1',
      action,
      module,
      details,
      severity
    }, ...prev]);
  };

  const handleAddProduct = (p: Product) => {
    setProducts(prev => [...prev, p]);
    addLog('Catalog', 'ADD_PRODUCT', `Registered ${p.name}`);
  };

  const renderContent = () => {
    const commonProps = { products, stock, transactions };
    switch (activeTab) {
      case 'dashboard': return <Dashboard {...commonProps} alerts={alerts} />;
      case 'catalog': return <CatalogHub products={products} stock={stock} onAdd={handleAddProduct} />;
      case 'procurement': return <ProcurementView suppliers={suppliers} products={products} onPurchase={() => {}} />;
      case 'logistics': return <LogisticsView products={products} stock={stock} pharmacies={INITIAL_PHARMACIES} onTransfer={() => {}} />;
      case 'compliance': return <ComplianceView auditLogs={auditLogs} products={products} />;
      case 'finance': return <FinanceView transactions={transactions} products={products} />;
      case 'pos': return <POSView products={products} stock={stock.filter(s => s.locationId === selectedPharmacyId)} pharmacyId={selectedPharmacyId} customers={customers} onSale={(t) => setTransactions(prev => [t, ...prev])} transactions={transactions} />;
      case 'pharmacies': return <PharmacyView products={products} pharmacies={INITIAL_PHARMACIES} stock={stock} transactions={transactions} selectedPharmacyId={selectedPharmacyId} setSelectedPharmacyId={setSelectedPharmacyId} onAddRequest={()=>{}} onConfirmReceipt={()=>{}} onAdjustStock={()=>{}} />;
      case 'analytics': return <AnalyticsView transactions={transactions} products={products} />;
      case 'customers': return <CustomersView customers={customers} transactions={transactions} />;
      case 'settings': return <SettingsView />;
      default: return <Dashboard {...commonProps} alerts={alerts} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-transparent safe-area-top">
      {/* Desktop Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(t) => { setActiveTab(t); setIsSidebarOpen(false); }} 
        userRole={currentUserRole} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <div className="flex-1 flex flex-col h-full min-w-0 relative">
        <Header 
          userRole={currentUserRole} 
          setUserRole={setCurrentUserRole} 
          alerts={alerts} 
          theme={theme}
          setTheme={setTheme}
          onOpenMenu={() => setIsSidebarOpen(true)}
          onOpenPalette={() => {}}
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-10 no-scrollbar pb-32 lg:pb-10">
          <div className="max-w-[1400px] mx-auto">
            {renderContent()}
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl border-t border-white/10 z-50 flex items-center justify-around px-4 safe-area-bottom shadow-[0_-10px_30px_rgba(0,0,0,0.1)]">
          <MobileNavItem active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" label="Home" />
          <MobileNavItem active={activeTab === 'catalog'} onClick={() => setActiveTab('catalog')} icon="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" label="Inventory" />
          <div className="relative -top-6">
             <button 
              onClick={() => setActiveTab('pos')}
              className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-90 ${activeTab === 'pos' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-white'}`}
             >
               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
             </button>
          </div>
          <MobileNavItem active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} icon="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18" label="Insights" />
          <MobileNavItem active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" label="Menu" />
        </div>
      </div>

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[60] lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}
    </div>
  );
};

const MobileNavItem = ({ active, onClick, icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center space-y-1 transition-all active:scale-90 ${active ? 'text-blue-600' : 'text-slate-400'}`}
  >
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={icon}/>
    </svg>
    <span className="text-[10px] font-black uppercase tracking-tighter">{label}</span>
  </button>
);

export default App;
