
import { Product, Pharmacy, UserRole, StockUnit, Customer, Supplier } from './types';

export const TAX_RATE = 0.17;

export const INITIAL_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Amoxicillin 500mg', category: 'Antibiotics', brand: 'GSK', unitPrice: 12.50, unitCost: 8.00, lowStockThreshold: 100, complianceStatus: 'STABLE' },
  { id: 'p2', name: 'Paracetamol 500mg', category: 'Analgesics', brand: 'GSK', unitPrice: 5.00, unitCost: 2.50, lowStockThreshold: 500, complianceStatus: 'WARNING' },
  { id: 'p3', name: 'Metformin 850mg', category: 'Diabetes', brand: 'Merck', unitPrice: 8.75, unitCost: 4.20, lowStockThreshold: 200, complianceStatus: 'STABLE' },
  { id: 'p4', name: 'Atorvastatin 20mg', category: 'Cholesterol', brand: 'Pfizer', unitPrice: 15.20, unitCost: 9.50, lowStockThreshold: 150, complianceStatus: 'CRITICAL' },
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  { id: 'sup1', name: 'Al-Noor Pharma Distribution', contact: '021-345678', category: 'General Medicines', rating: 4.8, performanceScore: 92, contracts: ['CON-2024-01'] },
  { id: 'sup2', name: 'Global Health Importers', contact: '021-987654', category: 'Surgical Equipment', rating: 4.2, performanceScore: 78, contracts: ['CON-2024-05'] },
];

export const INITIAL_PHARMACIES: Pharmacy[] = [
  { id: 'ph1', name: 'Downtown Branch', location: 'Karachi South', efficiencyScore: 94 },
  { id: 'ph2', name: 'Uptown Branch', location: 'Karachi North', efficiencyScore: 88 },
];

export const INITIAL_CUSTOMERS: Customer[] = [
  { id: 'c1', name: 'John Doe', phone: '555-0101', email: 'john@example.com', loyaltyPoints: 150, history: [] },
];

export const INITIAL_WAREHOUSE_STOCK: StockUnit[] = [
  { id: 's1', productId: 'p1', batchNumber: 'BAT-001', expiryDate: '2025-12-31', quantity: 1000, locationId: 'warehouse' },
  { id: 's2', productId: 'p2', batchNumber: 'BAT-002', expiryDate: '2024-10-15', quantity: 5000, locationId: 'warehouse' },
];

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  [UserRole.ADMIN]: ['dashboard', 'catalog', 'procurement', 'logistics', 'compliance', 'finance', 'pos', 'pharmacies', 'analytics', 'customers', 'settings'],
  [UserRole.WAREHOUSE_MANAGER]: ['dashboard', 'catalog', 'logistics', 'procurement'],
  [UserRole.PHARMACY_MANAGER]: ['dashboard', 'pos', 'pharmacies', 'analytics'],
  [UserRole.CASHIER]: ['pos', 'customers'],
};
