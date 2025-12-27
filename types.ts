
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
  brand: string;
  unitPrice: number;
  unitCost: number;
  lowStockThreshold: number;
  complianceStatus: 'STABLE' | 'WARNING' | 'CRITICAL';
  batchInfo?: Batch[];
}

export interface Batch {
  number: string;
  expiryDate: string;
  quantity: number;
  receivedDate: string;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  category: string;
  rating: number;
  performanceScore: number; // 0-100
  contracts: string[];
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  items: { productId: string; quantity: number; cost: number }[];
  status: 'DRAFT' | 'SENT' | 'RECEIVED' | 'CANCELLED';
  date: string;
  total: number;
  trackingNumber?: string;
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
  efficiencyScore: number;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  action: string;
  module: string;
  details: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
}

export type TransactionType = 'RESTOCK' | 'TRANSFER' | 'SALE' | 'ADJUSTMENT' | 'REQUEST' | 'RETURN' | 'PURCHASE';
export type TransactionStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'IN_TRANSIT';
export type PaymentMethod = 'CASH' | 'CARD' | 'WALLET' | 'VOUCHER';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  loyaltyPoints: number;
  history: string[]; 
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
  type: 'LOW_STOCK' | 'EXPIRY' | 'DISCREPANCY' | 'REQUEST' | 'LOGISTICS';
  severity: 'high' | 'medium' | 'low';
  message: string;
  timestamp: string;
}
