
import React, { useState, useEffect } from 'react';
import { UserRole, Product, StockUnit, Transaction, Pharmacy, Alert, StockRequest, Customer, Supplier, PurchaseOrder, AuditLog } from './types';
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
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  
  // Enterprise State
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [pharmacies] = useState<Pharmacy[]>(INITIAL_PHARMACIES);
  const [stock, setStock] = useState<StockUnit[]>(INITIAL_WAREHOUSE_STOCK);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedPharmacyId, setSelectedPharmacyId] = useState<string>(INITIAL_PHARMACIES[0].id);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Command Palette listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
    return (
      <div className="animate-fade-in stagger-entry">
        {(() => {
          switch (activeTab) {
            case 'dashboard': return <Dashboard products={products} stock={stock} transactions={transactions} alerts={alerts} />;
            case 'catalog': return <CatalogHub products={products} stock={stock} onAdd={handleAddProduct} />;
            case 'procurement': return <ProcurementView suppliers={suppliers} products={products} onPurchase={(po) => setPurchaseOrders(prev => [...prev, po])} />;
            case 'logistics': return <LogisticsView products={products} stock={stock} pharmacies={pharmacies} onTransfer={(t) => setTransactions(prev => [t, ...prev])} />;
            case 'compliance': return <ComplianceView auditLogs={auditLogs} products={products} />;
            case 'finance': return <FinanceView transactions={transactions} products={products} />;
            case 'pos': return <POSView products={products} stock={stock.filter(s => s.locationId === selectedPharmacyId)} pharmacyId={selectedPharmacyId} customers={customers} onSale={(t) => setTransactions(prev => [t, ...prev])} transactions={transactions} />;
            case 'pharmacies': return <PharmacyView products={products} pharmacies={pharmacies} stock={stock} transactions={transactions} selectedPharmacyId={selectedPharmacyId} setSelectedPharmacyId={setSelectedPharmacyId} />;
            case 'analytics': return <AnalyticsView transactions={transactions} products={products} />;
            case 'customers': return <CustomersView customers={customers} transactions={transactions} />;
            case 'settings': return <SettingsView />;
            default: return <Dashboard products={products} stock={stock} transactions={transactions} alerts={alerts} />;
          }
        })()}
      </div>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden bg-transparent">
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
          onOpenPalette={() => setIsCommandPaletteOpen(true)}
        />
        
        <main className="flex-1 overflow-y-auto p-6 lg:p-10 no-scrollbar">
          <div className="max-w-[1600px] mx-auto space-y-10">
            {renderContent()}
          </div>
        </main>

        {/* Floating Quick Action */}
        <button 
          onClick={() => setActiveTab('catalog')}
          className="fixed bottom-10 right-10 w-16 h-16 bg-gradient-to-tr from-blue-600 to-cyan-400 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40 group pulse-glow"
          style={{ animation: 'float 3s infinite ease-in-out' }}
        >
          <svg className="w-8 h-8 group-hover:rotate-90 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"/></svg>
        </button>
      </div>

      {/* Command Palette Modal */}
      {isCommandPaletteOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[100] flex items-center justify-center p-6" onClick={() => setIsCommandPaletteOpen(false)}>
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-white/20 animate-scale-up" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center">
              <svg className="w-6 h-6 text-blue-500 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              <input 
                autoFocus
                placeholder="Search anything... (Medicines, Suppliers, Invoices)" 
                className="flex-1 bg-transparent border-none outline-none text-xl font-bold dark:text-white"
              />
            </div>
            <div className="p-4 max-h-[400px] overflow-y-auto no-scrollbar">
              <div className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Quick Actions</div>
              {[
                { label: 'Add New Medicine', icon: '💊', tab: 'catalog' },
                { label: 'Create Purchase Order', icon: '📝', tab: 'procurement' },
                { label: 'Transfer Stock', icon: '🚛', tab: 'logistics' },
                { label: 'View Analytics', icon: '📊', tab: 'analytics' }
              ].map(action => (
                <button 
                  key={action.label}
                  onClick={() => { setActiveTab(action.tab); setIsCommandPaletteOpen(false); }}
                  className="w-full flex items-center p-4 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-2xl transition-all group"
                >
                  <span className="text-2xl mr-4 group-hover:scale-125 transition-transform">{action.icon}</span>
                  <span className="font-bold text-slate-700 dark:text-slate-200">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-30 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}
    </div>
  );
};

export default App;
