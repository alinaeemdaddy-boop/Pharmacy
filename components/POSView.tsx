
import React, { useState, useMemo } from 'react';
import { Product, StockUnit, Transaction, Customer, PaymentMethod } from '../types';
import { TAX_RATE } from '../constants';

interface POSViewProps {
  products: Product[];
  stock: StockUnit[];
  pharmacyId: string;
  customers: Customer[];
  transactions: Transaction[];
  onSale: (t: Transaction) => void;
}

const POSView: React.FC<POSViewProps> = ({ products, stock, pharmacyId, customers, transactions, onSale }) => {
  const [posMode, setPosMode] = useState<'SALE' | 'RETURN'>('SALE');
  const [cart, setCart] = useState<{stockId: string, quantity: number}[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<'CART' | 'PAYMENT' | 'RECEIPT'>('CART');
  const [lastOrder, setLastOrder] = useState<any>(null);
  const [showMobileCart, setShowMobileCart] = useState(false);

  const filteredStock = useMemo(() => {
    return stock.filter(s => {
      const p = products.find(prod => prod.id === s.productId);
      return p?.name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [stock, products, searchQuery]);

  const addToCart = (stockId: string) => {
    const itemInStock = stock.find(s => s.id === stockId);
    if (!itemInStock) return;
    setCart(prev => {
      const existing = prev.find(i => i.stockId === stockId);
      if (existing) {
        if (existing.quantity < itemInStock.quantity) {
          return prev.map(i => i.stockId === stockId ? { ...i, quantity: i.quantity + 1 } : i);
        }
        return prev;
      }
      return [...prev, { stockId, quantity: 1 }];
    });
  };

  const removeFromCart = (stockId: string) => {
    setCart(prev => prev.filter(i => i.stockId !== stockId));
  };

  const cartTotals = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => {
      const sUnit = stock.find(s => s.id === item.stockId);
      const product = products.find(p => p.id === sUnit?.productId);
      return sum + (item.quantity * (product?.unitPrice || 0));
    }, 0);
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;
    return { subtotal, tax, total };
  }, [cart, stock, products]);

  const handleCheckout = (paymentMethod: PaymentMethod) => {
    const orderId = `TX-${Date.now().toString().slice(-6)}`;
    const lineItems: any[] = [];
    cart.forEach(item => {
      const sUnit = stock.find(s => s.id === item.stockId);
      const product = products.find(p => p.id === sUnit?.productId);
      if (sUnit && product) {
        onSale({
          id: `${orderId}-${sUnit.id}`,
          type: posMode === 'SALE' ? 'SALE' : 'RETURN',
          productId: sUnit.productId,
          quantity: item.quantity,
          fromId: posMode === 'SALE' ? pharmacyId : 'customer',
          toId: posMode === 'SALE' ? 'customer' : pharmacyId,
          date: new Date().toISOString(),
          batchNumber: sUnit.batchNumber,
          status: 'PENDING',
          unitPrice: product.unitPrice,
          taxAmount: (product.unitPrice * item.quantity) * TAX_RATE,
          paymentMethod,
          customerId: selectedCustomerId || undefined
        });
        lineItems.push({ name: product.name, qty: item.quantity, price: product.unitPrice });
      }
    });
    setLastOrder({ orderId, date: new Date().toLocaleString(), items: lineItems, totals: cartTotals, paymentMethod });
    setCheckoutStep('RECEIPT');
  };

  return (
    <div className="flex flex-col h-full animate-fade-in lg:grid lg:grid-cols-4 lg:gap-8">
      <div className="lg:col-span-3 space-y-6">
        <div className="flex items-center space-x-3 overflow-x-auto no-scrollbar pb-2">
          <button onClick={() => setPosMode('SALE')} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${posMode === 'SALE' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-white dark:bg-slate-800 text-slate-500'}`}>Sale</button>
          <button onClick={() => setPosMode('RETURN')} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${posMode === 'RETURN' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30' : 'bg-white dark:bg-slate-800 text-slate-500'}`}>Refund</button>
        </div>

        <div className="relative group">
          <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input 
            type="text" 
            placeholder="Search medications..." 
            className="w-full pl-12 pr-6 py-4 bg-white dark:bg-slate-800 border-none rounded-2xl shadow-xl outline-none focus:ring-4 focus:ring-blue-500/20 text-sm font-bold"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStock.map(s => {
            const product = products.find(p => p.id === s.productId);
            const inCart = cart.find(i => i.stockId === s.id);
            const remaining = s.quantity - (inCart?.quantity || 0);
            
            return (
              <button 
                key={s.id}
                disabled={remaining === 0}
                onClick={() => addToCart(s.id)}
                className={`glass-premium p-6 flex flex-col text-left transition-all touch-ripple relative overflow-hidden ${inCart ? 'ring-2 ring-blue-500 shadow-blue-500/10' : ''}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[8px] font-black text-blue-500 bg-blue-50 dark:bg-blue-900/40 px-2 py-0.5 rounded-full uppercase">{product?.category}</span>
                  <span className={`text-[8px] font-black uppercase ${remaining < 20 ? 'text-rose-500' : 'text-emerald-500'}`}>{remaining} units</span>
                </div>
                <h4 className="font-black text-slate-800 dark:text-white text-base leading-tight mb-4">{product?.name}</h4>
                <div className="mt-auto flex justify-between items-center">
                   <p className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">${product?.unitPrice.toFixed(2)}</p>
                   {inCart ? (
                     <div className="flex items-center bg-blue-600 text-white rounded-xl px-3 py-1 animate-scale-up">
                        <span className="text-[10px] font-black">{inCart.quantity}</span>
                     </div>
                   ) : (
                     <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 text-slate-400 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"/></svg>
                     </div>
                   )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Floating Cart Button for Mobile */}
      <button 
        onClick={() => setShowMobileCart(true)}
        className="lg:hidden fixed bottom-24 left-6 right-6 h-16 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl flex items-center justify-between px-8 z-40 touch-ripple"
      >
        <span className="flex items-center">
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
          {cart.length} items
        </span>
        <span>${cartTotals.total.toFixed(2)}</span>
      </button>

      {/* Mobile Checkout Drawer */}
      <div className={`fixed inset-0 z-[100] lg:static lg:block transition-all duration-500 ${showMobileCart || checkoutStep !== 'CART' ? 'visible' : 'invisible lg:visible'}`}>
        <div className={`fixed inset-0 bg-slate-950/60 backdrop-blur-sm lg:hidden transition-opacity ${showMobileCart ? 'opacity-100' : 'opacity-0'}`} onClick={() => setShowMobileCart(false)} />
        <div className={`absolute bottom-0 left-0 right-0 lg:static h-[92vh] lg:h-full bg-white dark:bg-slate-950 lg:rounded-3xl mobile-drawer overflow-hidden flex flex-col ${showMobileCart || checkoutStep !== 'CART' ? 'translate-y-0' : 'translate-y-full lg:translate-y-0'}`}>
          <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mt-4 lg:hidden" />
          
          {checkoutStep === 'CART' && (
            <>
              <div className="p-8 border-b border-white/5 flex justify-between items-center">
                <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tighter">My Basket</h3>
                <button onClick={() => setShowMobileCart(false)} className="lg:hidden w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center">
                   <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"/></svg>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
                {cart.map(item => {
                  const sUnit = stock.find(s => s.id === item.stockId);
                  const product = products.find(p => p.id === sUnit?.productId);
                  return (
                    <div key={item.stockId} className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl">
                       <div className="min-w-0 pr-4">
                         <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{product?.name}</p>
                         <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest">{item.quantity} units</p>
                       </div>
                       <div className="flex items-center space-x-3">
                         <span className="text-lg font-black text-slate-900 dark:text-white tracking-tighter">${(item.quantity * (product?.unitPrice || 0)).toFixed(2)}</span>
                         <button onClick={() => removeFromCart(item.stockId)} className="w-8 h-8 flex items-center justify-center text-rose-500 bg-rose-50 dark:bg-rose-900/20 rounded-lg">
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg>
                         </button>
                       </div>
                    </div>
                  );
                })}
              </div>
              <div className="p-8 bg-slate-50 dark:bg-slate-900/40 border-t border-white/5 space-y-6 pb-12 lg:pb-8">
                <div className="flex justify-between items-end">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Value</span>
                   <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">${cartTotals.total.toFixed(2)}</span>
                </div>
                <button 
                  disabled={cart.length === 0}
                  onClick={() => setCheckoutStep('PAYMENT')}
                  className="w-full py-5 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-2xl font-black text-base shadow-xl active:scale-95 disabled:opacity-20 transition-all"
                >
                  Pay Now
                </button>
              </div>
            </>
          )}

          {checkoutStep === 'PAYMENT' && (
            <div className="p-8 flex flex-col h-full">
               <button onClick={() => setCheckoutStep('CART')} className="text-slate-400 text-[10px] font-black uppercase flex items-center mb-10">
                 <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"/></svg>
                 Back to Cart
               </button>
               <h3 className="text-3xl font-black text-slate-800 dark:text-white mb-8 tracking-tighter">Payment Methods</h3>
               <div className="grid grid-cols-2 gap-4 flex-1">
                  {([['CASH', '💵'], ['CARD', '💳'], ['WALLET', '📱'], ['VOUCHER', '🎫']] as [PaymentMethod, string][]).map(([method, icon]) => (
                    <button 
                      key={method}
                      onClick={() => handleCheckout(method)}
                      className="flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-white/5 touch-ripple transition-all active:bg-blue-600 active:text-white"
                    >
                      <span className="text-4xl mb-4">{icon}</span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{method}</span>
                    </button>
                  ))}
               </div>
            </div>
          )}

          {checkoutStep === 'RECEIPT' && lastOrder && (
            <div className="p-8 flex flex-col h-full animate-scale-up">
               <div className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-8 flex-1 border border-white/5 overflow-y-auto no-scrollbar shadow-inner">
                  <div className="text-center mb-8 border-b border-dashed border-slate-300 dark:border-slate-800 pb-8">
                    <div className="w-20 h-20 bg-emerald-500 text-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"/></svg>
                    </div>
                    <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tighter leading-none">Sale Confirmed</h3>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-2">ID: {lastOrder.orderId}</p>
                  </div>
                  <div className="space-y-4 mb-8">
                    {lastOrder.items.map((it: any, i: number) => (
                      <div key={i} className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
                        <span className="truncate pr-4">{it.qty}x {it.name}</span>
                        <span className="text-slate-900 dark:text-white font-black">${(it.qty * it.price).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-6 border-t border-dashed border-slate-300 dark:border-slate-800 flex justify-between items-end">
                     <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Aggregate Total</span>
                     <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">${lastOrder.totals.total.toFixed(2)}</span>
                  </div>
               </div>
               <button 
                  onClick={() => { setCart([]); setCheckoutStep('CART'); setLastOrder(null); setShowMobileCart(false); }}
                  className="mt-6 w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl touch-ripple"
               >
                  New Transaction
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default POSView;
