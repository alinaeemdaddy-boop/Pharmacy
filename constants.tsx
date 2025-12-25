
import { Product, Pharmacy, UserRole, StockUnit, Customer, Supplier, Doctor, Patient } from './types';

export const TAX_RATE = 0.17; // Updated to 17% GST (Pakistan Standard)

export const INITIAL_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Amoxicillin 500mg', category: 'Antibiotics', brand: 'GSK', unitPrice: 12.50, unitCost: 8.00, lowStockThreshold: 100 },
  { id: 'p2', name: 'Paracetamol 500mg', category: 'Analgesics', brand: 'GSK', unitPrice: 5.00, unitCost: 2.50, lowStockThreshold: 500 },
  { id: 'p3', name: 'Metformin 850mg', category: 'Diabetes', brand: 'Merck', unitPrice: 8.75, unitCost: 4.20, lowStockThreshold: 200 },
  { id: 'p4', name: 'Atorvastatin 20mg', category: 'Cholesterol', brand: 'Pfizer', unitPrice: 15.20, unitCost: 9.50, lowStockThreshold: 150 },
  { id: 'p5', name: 'Ibuprofen 400mg', category: 'NSAID', brand: 'Abbott', unitPrice: 6.30, unitCost: 3.10, lowStockThreshold: 300 },
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  { id: 'sup1', name: 'Al-Noor Pharma Distribution', contact: '021-345678', category: 'General Medicines', rating: 4.8 },
  { id: 'sup2', name: 'Global Health Importers', contact: '021-987654', category: 'Surgical Equipment', rating: 4.2 },
];

export const INITIAL_DOCTORS: Doctor[] = [
  { id: 'dr1', name: 'Dr. Ahmad Ali', specialty: 'General Physician', phone: '0300-1234567' },
  { id: 'dr2', name: 'Dr. Sarah Khan', specialty: 'Diabetologist', phone: '0321-7654321' },
];

export const INITIAL_PATIENTS: Patient[] = [
  { id: 'pt1', name: 'Kamran Shah', phone: '0333-1122334', medicalHistory: 'Hypertension', lastVisit: '2024-05-10' },
  { id: 'pt2', name: 'Zoya Fatima', phone: '0345-5566778', medicalHistory: 'Type 2 Diabetes', lastVisit: '2024-05-12' },
];

export const INITIAL_PHARMACIES: Pharmacy[] = [
  { id: 'ph1', name: 'Downtown Branch', location: 'Karachi South' },
  { id: 'ph2', name: 'Uptown Branch', location: 'Karachi North' },
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
  [UserRole.ADMIN]: ['dashboard', 'pos', 'inventory', 'warehouse', 'pharmacies', 'purchases', 'logistics', 'reports', 'analytics', 'customers', 'users', 'settings'],
  [UserRole.WAREHOUSE_MANAGER]: ['dashboard', 'inventory', 'warehouse', 'purchases', 'logistics', 'reports'],
  [UserRole.PHARMACY_MANAGER]: ['dashboard', 'pos', 'pharmacies', 'reports', 'customers'],
  [UserRole.CASHIER]: ['pos', 'customers'],
};
