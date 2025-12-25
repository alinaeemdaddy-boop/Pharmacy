
import React, { useState, useEffect } from 'react';
import { UserRole, Product, StockUnit, Transaction, Pharmacy, Alert, StockRequest, Customer, Supplier, PurchaseOrder, Doctor, Patient, Prescription } from './types';
import { INITIAL_PRODUCTS, INITIAL_PHARMACIES, INITIAL_WAREHOUSE_STOCK, ROLE_PERMISSIONS, INITIAL_CUSTOMERS, INITIAL_SUPPLIERS, INITIAL_DOCTORS, INITIAL_PATIENTS } from './constants';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import WarehouseView from './components/WarehouseView';
import PharmacyView from './components/PharmacyView';
import POSView from './components/POSView';
import ReportsView from './components/ReportsView';
import PurchasesView from './components/PurchasesView';
import LogisticsView from './components/LogisticsView';
import AnalyticsView from './components/AnalyticsView';
import CustomersView from './components/CustomersView';
import UsersView from './components/UsersView';
import SettingsView from './components/SettingsView';
import InventoryView from './components/InventoryView';

const App: React.FC = () => {
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>(UserRole.ADMIN);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [pharmacies] = useState<Pharmacy[]>(INITIAL_PHARMACIES);
  const [stock, setStock] = useState<StockUnit[]>(INITIAL_WAREHOUSE_STOCK);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [suppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [doctors] = useState<Doctor[]>(INITIAL_DOCTORS);
  const [patients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [requests, setRequests] = useState<StockRequest[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedPharmacyId, setSelectedPharmacyId] = useState<string>(INITIAL_PHARMACIES[0].id);

  useEffect(() => {
    const allowed = ROLE_PERMISSIONS[currentUserRole];
    if (!allowed.includes(activeTab)) {
      setActiveTab(allowed[0]);
    }
  }, [currentUserRole]);

  useEffect(() => {
    const newAlerts: Alert[] = [];
    products.forEach(p => {
      const totalQuantity = stock
        .filter(s => s.productId === p.id)
        .reduce((sum, curr) => sum + curr.quantity, 0);
      
      if (totalQuantity < p.lowStockThreshold) {
        newAlerts.push({
          id: `low-${p.id}`,
          type: 'LOW_STOCK',
          severity: 'high',
          message: `Stock Shortage: ${p.name} at ${totalQuantity} units`,
          timestamp: new Date().toISOString()
        });
      }
    });

    stock.forEach(s => {
      const expiry = new Date(s.expiryDate);
      const today = new Date();
      if (expiry < new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000)) {
        const product = products.find(p => p.id === s.productId);
        newAlerts.push({
          id: `exp-${s.id}`,
          type: 'EXPIRY',
          severity: expiry < today ? 'high' : 'medium',
          message: `${product?.name} (Batch ${s.batchNumber}) nearing expiry`,
          timestamp: new Date().toISOString()
        });
      }
    });
    setAlerts(newAlerts);
  }, [stock, products]);

  const addTransaction = (t: Transaction) => {
    setTransactions(prev => [t, ...prev]);
    if (['RESTOCK', 'SALE', 'ADJUSTMENT', 'RETURN', 'PURCHASE'].includes(t.type)) {
      confirmTransaction(t.id);
    }
    if (t.type === 'SALE' && t.customerId) {
      setCustomers(prev => prev.map(c => {
        if (c.id === t.customerId) {
          return { ...c, loyaltyPoints: c.loyaltyPoints + Math.floor((t.unitPrice || 0) * t.quantity / 10) };
        }
        return c;
      }));
    }
  };

  const addRequest = (req: StockRequest) => setRequests(prev => [...prev, req]);

  const confirmTransaction = (transactionId: string) => {
    setTransactions(prev => {
      const trxIdx = prev.findIndex(t => t.id === transactionId);
      if (trxIdx === -1 || (prev[trxIdx].status !== 'PENDING' && prev[trxIdx].status !== 'IN_TRANSIT')) return prev;

      const updatedTrx = { ...prev[trxIdx], status: 'CONFIRMED' as const, confirmedAt: new Date().toISOString() };
      const newTransactions = [...prev];
      newTransactions[trxIdx] = updatedTrx;

      setStock(prevStock => {
        let newStock = [...prevStock];
        const t = updatedTrx;
        
        if (t.type === 'TRANSFER') {
          const idx = newStock.findIndex(s => s.productId === t.productId && s.batchNumber === t.batchNumber && s.locationId === t.fromId);
          if (idx > -1) {
            newStock[idx] = { ...newStock[idx], quantity: newStock[idx].quantity - t.quantity };
            const destIdx = newStock.findIndex(s => s.productId === t.productId && s.batchNumber === t.batchNumber && s.locationId === t.toId);
            if (destIdx > -1) {
              newStock[destIdx] = { ...newStock[destIdx], quantity: newStock[destIdx].quantity + t.quantity };
            } else {
              newStock.push({ id: `s-${Date.now()}`, productId: t.productId, batchNumber: t.batchNumber, expiryDate: '2026-01-01', quantity: t.quantity, locationId: t.toId });
            }
          }
        } else if (t.type === 'SALE') {
          const idx = newStock.findIndex(s => s.productId === t.productId && s.batchNumber === t.batchNumber && s.locationId === t.fromId);
          if (idx > -1) newStock[idx] = { ...newStock[idx], quantity: newStock[idx].quantity - t.quantity };
        } else if (t.type === 'RESTOCK' || t.type === 'PURCHASE') {
           const existingIdx = newStock.findIndex(s => s.productId === t.productId && s.batchNumber === t.batchNumber && s.locationId === t.toId);
           if (existingIdx > -1) {
             newStock[existingIdx] = { ...newStock[existingIdx], quantity: newStock[existingIdx].quantity + t.quantity };
           } else {
             newStock.push({ id: `s-${Date.now()}`, productId: t.productId, batchNumber: t.batchNumber, expiryDate: '2026-12-31', quantity: t.quantity, locationId: t.toId });
           }
        }
        return newStock.filter(s => s.quantity >= 0);
      });
      return newTransactions;
    });
  };

  const handleAddProduct = (p: Product) => {
    setProducts(prev => [...prev, p]);
  };

  const handleUpdateProduct = (p: Product) => {
    setProducts(prev => prev.map(prod => prod.id === p.id ? p : prod));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard products={products} stock={stock} transactions={transactions} alerts={alerts} />;
      case 'pos': return <POSView products={products} stock={stock.filter(s => s.locationId === selectedPharmacyId)} pharmacyId={selectedPharmacyId} customers={customers} onSale={addTransaction} transactions={transactions} />;
      case 'inventory': return <InventoryView products={products} stock={stock} onAddProduct={handleAddProduct} onUpdateProduct={handleUpdateProduct} />;
      case 'warehouse': return <WarehouseView products={products} stock={stock} pharmacies={pharmacies} transactions={transactions} requests={requests} onTransfer={addTransaction} onRestock={addTransaction} onConfirm={confirmTransaction} />;
      case 'pharmacies': return <PharmacyView products={products} pharmacies={pharmacies} stock={stock} transactions={transactions} selectedPharmacyId={selectedPharmacyId} setSelectedPharmacyId={setSelectedPharmacyId} onAddRequest={addRequest} onConfirmReceipt={confirmTransaction} onAdjustStock={addTransaction} />;
      case 'purchases': return <PurchasesView suppliers={suppliers} products={products} onPurchase={addTransaction} />;
      case 'logistics': return <LogisticsView requests={requests} onTransfer={addTransaction} />;
      case 'reports': return <ReportsView transactions={transactions} products={products} pharmacies={pharmacies} stock={stock} />;
      case 'analytics': return <AnalyticsView transactions={transactions} products={products} />;
      case 'customers': return <CustomersView customers={customers} transactions={transactions} />;
      case 'users': return <UsersView />;
      case 'settings': return <SettingsView />;
      default: return <Dashboard products={products} stock={stock} transactions={transactions} alerts={alerts} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} userRole={currentUserRole} />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header userRole={currentUserRole} setUserRole={setCurrentUserRole} alerts={alerts} />
        <main className="flex-1 overflow-y-auto p-6">{renderContent()}</main>
      </div>
    </div>
  );
};

export default App;
