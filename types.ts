
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
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  category: string;
  rating: number;
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  items: { productId: string; quantity: number; cost: number }[];
  status: 'DRAFT' | 'SENT' | 'RECEIVED' | 'CANCELLED';
  date: string;
  total: number;
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

export interface Patient {
  id: string;
  name: string;
  phone: string;
  medicalHistory: string;
  lastVisit: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  phone: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  medications: { productId: string; instructions: string }[];
  date: string;
  status: 'PENDING' | 'FILLED' | 'VOID';
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
  receivedBy?: string;
  notes?: string;
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
