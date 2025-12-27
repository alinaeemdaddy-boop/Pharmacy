
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
  const [appliedDiscount, setAppliedDiscount] = useState(0);
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
    
    const discount = appliedDiscount;
    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = taxableAmount * TAX_RATE;
    const total = taxableAmount + tax;
    
    return { subtotal, discount, tax, total };
  }, [cart, stock, products, appliedDiscount]);

  const handleCheckout = (paymentMethod: PaymentMethod) => {
    const orderId = `INV-${Date.now().toString().slice(-6)}`;
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

    setLastOrder({ 
      orderId, 
      date: new Date().toLocaleString(),
      items: lineItems, 
      totals: cartTotals, 
      paymentMethod,
      customer: customers.find(c => c.id === selectedCustomerId)
    });
    setCheckoutStep('RECEIPT');
    setShowMobileCart(false);
  };

  const resetPOS = () => {
    setCart([]);
    setAppliedDiscount(0);
    setSelectedCustomerId(null);
    setCheckoutStep('CART');
    setLastOrder(null);
  };

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-4 gap-6 md:gap-8 h-full min-h-[calc(100vh-160px)] animate-fade-in relative">
      {/* Left Area - Product Browser */}
      <div className="lg:col-span-3 flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center bg-white p-4 md:p-6 rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-slate-100 gap-4">
          <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100 shrink-0">
            <button onClick={() => setPosMode('SALE')} className={`flex-1 md:flex-none px-4 md:px-6 py-2.5 rounded-xl text-[10px] md:text-xs font-black transition-all uppercase tracking-widest ${posMode === 'SALE' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-500 hover:text-slate-800'}`}>NEW SALE</button>
            <button onClick={() => setPosMode('RETURN')} className={`flex-1 md:flex-none px-4 md:px-6 py-2.5 rounded-xl text-[10px] md:text-xs font-black transition-all uppercase tracking-widest ${posMode === 'RETURN' ? 'bg-rose-500 text-white shadow-xl' : 'text-slate-500 hover:text-slate-800'}`}>REFUND</button>
          </div>
          <div className="flex-1 relative group">
             <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-sky-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
             <input 
              type="text" 
              placeholder="Search catalog..." 
              className="w-full pl-12 pr-6 py-3.5 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-sky-500/10 transition-all text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
             />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-1 pb-20 lg:pb-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {filteredStock.map((s, idx) => {
              const product = products.find(p => p.id === s.productId);
              const inCart = cart.find(i => i.stockId === s.id);
              const remaining = s.quantity - (inCart?.quantity || 0);
              
              return (
                <button 
                  key={s.id}
                  disabled={remaining === 0}
                  onClick={() => addToCart(s.id)}
                  className="bg-white p-5 md:p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col items-start hover:shadow-2xl hover:-translate-y-1 transition-all text-left group animate-scale-in relative overflow-hidden"
                  style={{ animationDelay: `${idx * 0.04}s` }}
                >
                  {inCart && (
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-sky-500"></div>
                  )}
                  <div className="w-full flex justify-between items-start mb-4">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2.5 py-1 rounded-lg">{product?.category}</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${remaining < 10 ? 'text-rose-500' : 'text-emerald-500'}`}>{remaining} In Stock</span>
                  </div>
                  <h4 className="font-black text-slate-800 text-lg leading-tight mb-2 group-hover:text-sky-600 transition-colors">{product?.name}</h4>
                  <div className="mt-auto pt-6 flex justify-between items-end w-full">
                     <div>
                       <p className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter leading-none">${product?.unitPrice.toFixed(2)}</p>
                       {inCart && <p className="text-[10px] font-black text-sky-500 uppercase mt-1.5">{inCart.quantity} in basket</p>}
                     </div>
                     <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-sm ${inCart ? 'bg-sky-500 text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-sky-600 group-hover:text-white'}`}>
                       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
                     </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Cart Drawer Overlay for Mobile */}
      <div className={`fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl z-40 lg:static lg:block lg:col-span-1 lg:h-full lg:rounded-[2.5rem] lg:border lg:border-slate-100 transition-transform duration-500 transform ${showMobileCart || checkoutStep !== 'CART' ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
        <div className="h-full flex flex-col relative">
          <button 
            onClick={() => setShowMobileCart(false)} 
            className="lg:hidden absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>

          {checkoutStep === 'CART' && (
            <>
              <div className="p-8 bg-slate-50/50 border-b border-slate-100">
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Basket</h3>
                <div className="mt-6">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Customer Profile</p>
                  <select 
                    className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-xs font-black text-slate-700 shadow-sm outline-none focus:ring-4 focus:ring-sky-500/10"
                    onChange={(e) => setSelectedCustomerId(e.target.value)}
                    value={selectedCustomerId || ''}
                  >
                    <option value="">Guest Checkout</option>
                    {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.loyaltyPoints} pts)</option>)}
                  </select>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                {cart.map(item => {
                  const sUnit = stock.find(s => s.id === item.stockId);
                  const product = products.find(p => p.id === sUnit?.productId);
                  return (
                    <div key={item.stockId} className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-50 hover:shadow-lg transition-all animate-slide-in">
                       <div className="flex-1 min-w-0">
                         <p className="text-sm font-black text-slate-800 truncate">{product?.name}</p>
                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.quantity} Units @ ${product?.unitPrice.toFixed(2)}</p>
                       </div>
                       <div className="flex items-center space-x-3 ml-4">
                         <span className="font-black text-slate-800">${(item.quantity * (product?.unitPrice || 0)).toFixed(2)}</span>
                         <button onClick={() => removeFromCart(item.stockId)} className="text-slate-300 hover:text-rose-500 transition-colors">
                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
                         </button>
                       </div>
                    </div>
                  );
                })}
                {cart.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center py-20 opacity-20">
                    <span className="text-6xl mb-4">🛒</span>
                    <p className="font-black uppercase tracking-widest text-[10px]">Basket Empty</p>
                  </div>
                )}
              </div>

              <div className="p-8 bg-slate-50 border-t border-slate-100 space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase text-slate-400"><span>Subtotal</span><span className="text-slate-800">${cartTotals.subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between text-[10px] font-black uppercase text-slate-400"><span>Service Tax</span><span className="text-slate-800">${cartTotals.tax.toFixed(2)}</span></div>
                </div>
                <div className="flex justify-between items-end border-t border-slate-200 pt-4">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Grand Total</span>
                   <span className="text-3xl font-black text-slate-900 tracking-tighter leading-none">${cartTotals.total.toFixed(2)}</span>
                </div>
                <button 
                  disabled={cart.length === 0}
                  onClick={() => setCheckoutStep('PAYMENT')}
                  className="w-full py-4.5 bg-sky-500 text-white rounded-[1.5rem] font-black text-base shadow-xl shadow-sky-500/30 hover:bg-sky-600 transition-all disabled:opacity-30 active:scale-95"
                >
                  Checkout Items
                </button>
              </div>
            </>
          )}

          {checkoutStep === 'PAYMENT' && (
            <div className="p-8 flex flex-col h-full animate-fade-in">
               <button onClick={() => setCheckoutStep('CART')} className="text-slate-400 text-[10px] font-black uppercase tracking-widest flex items-center mb-10 hover:text-slate-800 transition-colors">
                 <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"/></svg>
                 Return to Basket
               </button>
               <h3 className="text-2xl font-black text-slate-800 mb-8 tracking-tight">Select Tender</h3>
               <div className="grid grid-cols-2 gap-4 flex-1">
                  {([['CASH', '💵'], ['CARD', '💳'], ['WALLET', '📱'], ['VOUCHER', '🎫']] as [PaymentMethod, string][]).map(([method, icon]) => (
                    <button 
                      key={method}
                      onClick={() => handleCheckout(method)}
                      className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-[2rem] border border-slate-100 hover:bg-white hover:shadow-2xl hover:border-sky-500 transition-all group active:scale-95"
                    >
                      <span className="text-3xl mb-3">{icon}</span>
                      <span className="text-[10px] font-black text-slate-400 group-hover:text-slate-800 uppercase tracking-widest">{method}</span>
                    </button>
                  ))}
               </div>
               <div className="mt-8 p-6 bg-slate-900 rounded-[2rem] text-white shadow-xl">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 text-center">Total Balance Due</p>
                  <p className="text-3xl font-black text-sky-400 text-center tracking-tighter">${cartTotals.total.toFixed(2)}</p>
               </div>
            </div>
          )}

          {checkoutStep === 'RECEIPT' && lastOrder && (
            <div className="p-8 flex flex-col h-full animate-scale-in">
               <div className="bg-slate-50 rounded-[2.5rem] p-8 relative shadow-inner flex-1 flex flex-col border border-slate-100">
                  <div className="text-center mb-8 border-b border-dashed border-slate-300 pb-8">
                    <div className="w-16 h-16 bg-emerald-500 text-white rounded-[1.5rem] flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    </div>
                    <h3 className="text-xl font-black text-slate-800">Paid & Verified</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1.5">ID: #{lastOrder.orderId}</p>
                  </div>
                  
                  <div className="flex-1 space-y-4 overflow-y-auto max-h-[200px] custom-scrollbar">
                    {lastOrder.items.map((it: any, i: number) => (
                      <div key={i} className="flex justify-between text-[11px] font-bold text-slate-600">
                        <span>{it.qty}x {it.name}</span>
                        <span>${(it.qty * it.price).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-6 border-t border-dashed border-slate-300 mt-auto">
                     <div className="flex justify-between text-xl font-black text-slate-800">
                       <span className="text-sm text-slate-400 uppercase tracking-widest leading-none mt-2">Paid via {lastOrder.paymentMethod}</span>
                       <span className="text-sky-600 tracking-tighter">${lastOrder.totals.total.toFixed(2)}</span>
                     </div>
                  </div>
               </div>
               <button 
                  onClick={resetPOS}
                  className="mt-8 w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-xl active:scale-95 transition-all"
               >
                  Next Customer
               </button>
            </div>
          )}
        </div>
      </div>

      {/* Floating Cart Button for Mobile */}
      {cart.length > 0 && checkoutStep === 'CART' && !showMobileCart && (
        <button 
          onClick={() => setShowMobileCart(true)}
          className="lg:hidden fixed bottom-6 right-6 w-16 h-16 bg-sky-500 text-white rounded-2xl shadow-2xl flex items-center justify-center z-30 animate-bounce shadow-sky-500/40"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
          <span className="absolute -top-1 -right-1 bg-white text-sky-500 w-6 h-6 rounded-full text-[10px] font-black flex items-center justify-center shadow-lg border border-sky-100">{cart.length}</span>
        </button>
      )}
    </div>
  );
};

export default POSView;
