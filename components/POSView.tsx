
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
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [checkoutStep, setCheckoutStep] = useState<'CART' | 'PAYMENT' | 'RECEIPT'>('CART');
  const [lastOrder, setLastOrder] = useState<any>(null);

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
  };

  const resetPOS = () => {
    setCart([]);
    setAppliedDiscount(0);
    setDiscountCode('');
    setSelectedCustomerId(null);
    setCheckoutStep('CART');
    setLastOrder(null);
  };

  const applyPromo = () => {
    if (discountCode.toUpperCase() === 'RENEW10') {
      setAppliedDiscount(cartTotals.subtotal * 0.1);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-full animate-fade-in">
      {/* Left Area */}
      <div className="lg:col-span-3 flex flex-col space-y-6">
        <div className="flex justify-between items-center bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100">
          <div className="flex space-x-3 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
            <button onClick={() => setPosMode('SALE')} className={`px-6 py-3 rounded-xl text-xs font-black transition-all ${posMode === 'SALE' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-500 hover:text-slate-800'}`}>NEW SALE</button>
            <button onClick={() => setPosMode('RETURN')} className={`px-6 py-3 rounded-xl text-xs font-black transition-all ${posMode === 'RETURN' ? 'bg-red-500 text-white shadow-xl' : 'text-slate-500 hover:text-slate-800'}`}>REFUNDS</button>
          </div>
          <div className="flex-1 max-w-lg mx-8 relative group">
             <svg className="absolute left-6 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-cyan-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
             <input 
              type="text" 
              placeholder="Search medications..." 
              className="w-full pl-16 pr-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-cyan-500/10 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
             />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredStock.map((s, idx) => {
              const product = products.find(p => p.id === s.productId);
              const inCart = cart.find(i => i.stockId === s.id);
              const remaining = s.quantity - (inCart?.quantity || 0);
              
              return (
                <button 
                  key={s.id}
                  disabled={remaining === 0}
                  onClick={() => addToCart(s.id)}
                  className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col items-start hover:shadow-2xl hover:-translate-y-1 transition-all text-left group animate-scale-up"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <div className="w-full flex justify-between items-start mb-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full">{product?.category}</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${remaining < 10 ? 'text-red-500' : 'text-emerald-500'}`}>{remaining} Units</span>
                  </div>
                  <h4 className="font-black text-slate-800 text-lg leading-tight group-hover:text-cyan-600 transition-colors">{product?.name}</h4>
                  <div className="mt-6 flex justify-between items-end w-full">
                     <p className="text-3xl font-black text-slate-900 tracking-tighter">${product?.unitPrice.toFixed(2)}</p>
                     <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center group-hover:bg-cyan-600 group-hover:text-white transition-all shadow-sm">
                       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
                     </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Checkout Panel */}
      <div className="lg:col-span-1 bg-white rounded-[3rem] shadow-2xl flex flex-col overflow-hidden h-[calc(100vh-140px)] border border-slate-100">
        {checkoutStep === 'CART' && (
          <>
            <div className="p-8 bg-slate-50/50 border-b border-slate-100">
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">Checkout</h3>
              <div className="mt-6">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Customer Profile</p>
                <select 
                  className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-xs font-black text-slate-700 shadow-sm outline-none focus:ring-4 focus:ring-cyan-500/10"
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  value={selectedCustomerId || ''}
                >
                  <option value="">Guest Checkout</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.loyaltyPoints} pts)</option>)}
                </select>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.map(item => {
                const sUnit = stock.find(s => s.id === item.stockId);
                const product = products.find(p => p.id === sUnit?.productId);
                return (
                  <div key={item.stockId} className="flex justify-between items-center bg-white p-5 rounded-2xl border border-slate-50 group hover:shadow-lg transition-all animate-slide-in">
                     <div className="flex-1 min-w-0">
                       <p className="text-sm font-black text-slate-800 truncate">{product?.name}</p>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.quantity} Units</p>
                     </div>
                     <div className="flex items-center space-x-3 ml-4">
                       <span className="font-black text-slate-800">${(item.quantity * (product?.unitPrice || 0)).toFixed(2)}</span>
                       <button onClick={() => removeFromCart(item.stockId)} className="text-slate-300 hover:text-red-500 transition-colors">
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
                       </button>
                     </div>
                  </div>
                );
              })}
              {cart.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center py-20 opacity-20">
                  <span className="text-6xl mb-4">🛒</span>
                  <p className="font-black uppercase tracking-widest text-[10px]">Cart Empty</p>
                </div>
              )}
            </div>

            <div className="p-8 bg-slate-50 border-t border-slate-100 space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase text-slate-400"><span>Net Items</span><span className="text-slate-800">${cartTotals.subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-400">
                  <span>Promo Applied</span>
                  <span className="text-emerald-500">-${cartTotals.discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[10px] font-black uppercase text-slate-400"><span>Service Tax</span><span className="text-slate-800">${cartTotals.tax.toFixed(2)}</span></div>
              </div>
              <div className="flex justify-between items-end border-t border-slate-200 pt-6">
                 <span className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Total Payable</span>
                 <span className="text-4xl font-black text-slate-900 tracking-tighter">${cartTotals.total.toFixed(2)}</span>
              </div>
              <button 
                disabled={cart.length === 0}
                onClick={() => setCheckoutStep('PAYMENT')}
                className="w-full py-5 bg-cyan-500 text-white rounded-[1.5rem] font-black text-lg shadow-2xl shadow-cyan-500/30 hover:bg-cyan-600 transition-all disabled:opacity-30 active:scale-95"
              >
                Proceed to Pay
              </button>
            </div>
          </>
        )}

        {checkoutStep === 'PAYMENT' && (
          <div className="p-8 flex flex-col h-full animate-fade-in">
             <button onClick={() => setCheckoutStep('CART')} className="text-slate-400 text-[10px] font-black uppercase tracking-widest flex items-center mb-10 hover:text-slate-800 transition-colors">
               <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"/></svg>
               Back to Basket
             </button>
             <h3 className="text-2xl font-black text-slate-800 mb-8 tracking-tight">Payment Method</h3>
             <div className="grid grid-cols-2 gap-4 flex-1">
                {([['CASH', '💵'], ['CARD', '💳'], ['WALLET', '📱'], ['VOUCHER', '🎫']] as [PaymentMethod, string][]).map(([method, icon]) => (
                  <button 
                    key={method}
                    onClick={() => handleCheckout(method)}
                    className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-[2rem] border border-slate-100 hover:bg-white hover:shadow-2xl hover:border-cyan-500 transition-all group"
                  >
                    <span className="text-3xl mb-3">{icon}</span>
                    <span className="text-[10px] font-black text-slate-400 group-hover:text-slate-800 uppercase tracking-widest">{method}</span>
                  </button>
                ))}
             </div>
             <div className="mt-8 p-6 bg-slate-900 rounded-[2rem] text-white">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 text-center">Final Amount</p>
                <p className="text-3xl font-black text-cyan-400 text-center">${cartTotals.total.toFixed(2)}</p>
             </div>
          </div>
        )}

        {checkoutStep === 'RECEIPT' && lastOrder && (
          <div className="p-8 flex flex-col h-full animate-scale-up">
             <div className="bg-slate-50 rounded-[2rem] p-8 relative shadow-inner flex-1 flex flex-col">
                <div className="text-center mb-8 border-b border-dashed border-slate-300 pb-8">
                  <div className="w-16 h-16 bg-cyan-500 text-white rounded-[1.5rem] flex items-center justify-center mx-auto mb-4 shadow-xl">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  </div>
                  <h3 className="text-xl font-black text-slate-800">Payment Verified</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Receipt ID: #{lastOrder.orderId}</p>
                </div>
                
                <div className="flex-1 space-y-4">
                  {lastOrder.items.map((it: any, i: number) => (
                    <div key={i} className="flex justify-between text-xs font-bold text-slate-600">
                      <span>{it.qty} x {it.name}</span>
                      <span>${(it.qty * it.price).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-dashed border-slate-300 space-y-2">
                   <div className="flex justify-between text-xl font-black text-slate-800">
                     <span>Paid via {lastOrder.paymentMethod}</span>
                     <span className="text-cyan-600">${lastOrder.totals.total.toFixed(2)}</span>
                   </div>
                   <p className="text-center text-[8px] font-black text-slate-300 uppercase tracking-[0.3em] mt-6">Auth: RENEW-OFFICIAL</p>
                </div>
             </div>
             <button 
                onClick={resetPOS}
                className="mt-8 w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-lg shadow-xl active:scale-95 transition-all"
             >
                New Transaction
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default POSView;
