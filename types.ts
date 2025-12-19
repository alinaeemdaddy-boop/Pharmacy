
export enum UserRole {
  ADMIN = 'ADMIN',
  WAREHOUSE_MANAGER = 'WAREHOUSE_MANAGER',
  PHARMACY_MANAGER = 'PHARMACY_MANAGER',
  CASHIER = 'CASHIER'
}

export interface Product {
  id: string;
  name: string;
  category: string;
  unitPrice: number;
  unitCost: number;
  lowStockThreshold: number;
}

export interface StockUnit {
  id: string;
  productId: string;
  batchNumber: string;
  expiryDate: string;
  quantity: number;
  locationId: string; // 'warehouse' or pharmacyId
}

export interface Pharmacy {
  id: string;
  name: string;
  location: string;
}

export type TransactionType = 'RESTOCK' | 'TRANSFER' | 'SALE' | 'ADJUSTMENT' | 'REQUEST' | 'RETURN';
export type TransactionStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'IN_TRANSIT';
export type PaymentMethod = 'CASH' | 'CARD' | 'WALLET' | 'VOUCHER';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  loyaltyPoints: number;
  history: string[]; // Transaction IDs
}

export interface Transaction {
  id: string;
  type: TransactionType;
  productId: string;
  quantity: number;
  fromId: string;
  toId: string;
  date: string;
  batchNumber: string;
  status: TransactionStatus;
  confirmedAt?: string;
  receivedBy?: string;
  notes?: string;
  
  // POS Specific
  unitPrice?: number;
  taxAmount?: number;
  discountAmount?: number;
  paymentMethod?: PaymentMethod;
  customerId?: string;
}

export interface StockRequest {
  id: string;
  pharmacyId: string;
  productId: string;
  quantity: number;
  status: 'OPEN' | 'FULFILLED' | 'REJECTED';
  date: string;
}

export interface Alert {
  id: string;
  type: 'LOW_STOCK' | 'EXPIRY' | 'DISCREPANCY' | 'REQUEST';
  severity: 'high' | 'medium' | 'low';
  message: string;
  timestamp: string;
}
