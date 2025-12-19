
import { Product, Pharmacy, UserRole, StockUnit, Customer } from './types';

export const TAX_RATE = 0.07; // 7% VAT/Sales Tax

export const INITIAL_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Amoxicillin 500mg', category: 'Antibiotics', unitPrice: 12.50, unitCost: 8.00, lowStockThreshold: 100 },
  { id: 'p2', name: 'Paracetamol 500mg', category: 'Analgesics', unitPrice: 5.00, unitCost: 2.50, lowStockThreshold: 500 },
  { id: 'p3', name: 'Metformin 850mg', category: 'Diabetes', unitPrice: 8.75, unitCost: 4.20, lowStockThreshold: 200 },
  { id: 'p4', name: 'Atorvastatin 20mg', category: 'Cholesterol', unitPrice: 15.20, unitCost: 9.50, lowStockThreshold: 150 },
  { id: 'p5', name: 'Ibuprofen 400mg', category: 'NSAID', unitPrice: 6.30, unitCost: 3.10, lowStockThreshold: 300 },
];

export const INITIAL_PHARMACIES: Pharmacy[] = [
  { id: 'ph1', name: 'Downtown Branch', location: 'Main Street' },
  { id: 'ph2', name: 'Uptown Branch', location: 'Northern Ave' },
];

export const INITIAL_CUSTOMERS: Customer[] = [
  { id: 'c1', name: 'John Doe', phone: '555-0101', email: 'john@example.com', loyaltyPoints: 150, history: [] },
  { id: 'c2', name: 'Jane Smith', phone: '555-0202', email: 'jane@example.com', loyaltyPoints: 45, history: [] },
];

export const INITIAL_WAREHOUSE_STOCK: StockUnit[] = [
  { id: 's1', productId: 'p1', batchNumber: 'BAT-001', expiryDate: '2025-12-31', quantity: 1000, locationId: 'warehouse' },
  { id: 's2', productId: 'p2', batchNumber: 'BAT-002', expiryDate: '2024-05-15', quantity: 5000, locationId: 'warehouse' },
  { id: 's3', productId: 'p3', batchNumber: 'BAT-003', expiryDate: '2026-01-20', quantity: 800, locationId: 'warehouse' },
];

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  [UserRole.ADMIN]: ['dashboard', 'warehouse', 'pharmacy', 'pos', 'reports', 'settings'],
  [UserRole.WAREHOUSE_MANAGER]: ['dashboard', 'warehouse', 'reports'],
  [UserRole.PHARMACY_MANAGER]: ['dashboard', 'pharmacy', 'pos', 'reports'],
  [UserRole.CASHIER]: ['pos'],
};
