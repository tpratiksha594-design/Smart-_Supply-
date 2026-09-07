export interface User {
  user_id: number;
  name: string;
  email: string;
  role_id: number;
  role_name?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  created_at?: string;
}

export interface Role {
  role_id: number;
  name: 'ADMIN' | 'WAREHOUSE_MANAGER' | 'PROCUREMENT_MANAGER' | 'SALES_MANAGER' | 'VIEWER';
  description: string;
}

export interface Category {
  category_id: number;
  name: string;
  slug: string;
  description: string;
}

export interface Product {
  product_id: number;
  name: string;
  sku: string;
  category_id: number;
  category_name?: string;
  unit: string;
  price: number;
  cost_price: number;
  reorder_level: number;
  target_stock: number;
  image_url: string;
  status: 'ACTIVE' | 'DISCONTINUED' | 'OUT_OF_STOCK';
  total_quantity?: number;
  stock_status?: 'HEALTHY' | 'LOW_STOCK' | 'CRITICAL' | 'OUT_OF_STOCK';
  created_at?: string;
}

export interface Supplier {
  supplier_id: number;
  name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  rating: number;
  on_time_delivery_rate: number;
  quality_score: number;
  status: 'ACTIVE' | 'PREFERRED' | 'UNDER_REVIEW' | 'INACTIVE';
  total_orders?: number;
}

export interface Warehouse {
  warehouse_id: number;
  name: string;
  code: string;
  location: string;
  total_capacity: number;
  current_utilization_pct: number;
  inventory_value: number;
  status: 'OPERATIONAL' | 'MAINTENANCE' | 'FULL';
  unique_sku_count?: number;
  stored_units?: number;
}

export interface WarehouseInventory {
  warehouse_id: number;
  product_id: number;
  product_name?: string;
  sku?: string;
  quantity: number;
  reserved_quantity: number;
  available_quantity: number;
  zone_location: string;
}

export interface PurchaseOrder {
  po_id: number;
  po_number: string;
  supplier_id: number;
  supplier_name?: string;
  warehouse_id: number;
  warehouse_name?: string;
  status: 'PENDING' | 'APPROVED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  total_amount: number;
  order_date: string;
  expected_delivery_date: string;
  created_by?: number;
  items?: PurchaseOrderItem[];
}

export interface PurchaseOrderItem {
  item_id: number;
  po_id: number;
  product_id: number;
  product_name?: string;
  sku?: string;
  quantity_ordered: number;
  quantity_received: number;
  unit_cost: number;
  subtotal: number;
}

export interface SalesOrder {
  so_id: number;
  order_number: string;
  customer_id: number;
  customer_name?: string;
  warehouse_id: number;
  warehouse_name?: string;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED';
  total_amount: number;
  order_date: string;
  items?: SalesOrderItem[];
}

export interface SalesOrderItem {
  item_id: number;
  so_id: number;
  product_id: number;
  product_name?: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface InventoryTransfer {
  transfer_id: number;
  transfer_number: string;
  source_warehouse_id: number;
  source_warehouse_name?: string;
  destination_warehouse_id: number;
  destination_warehouse_name?: string;
  status: 'PENDING' | 'IN_TRANSIT' | 'COMPLETED' | 'CANCELLED';
  notes: string;
  created_by?: number;
  created_at: string;
  completed_at?: string;
  items?: TransferItem[];
}

export interface TransferItem {
  item_id: number;
  transfer_id: number;
  product_id: number;
  product_name?: string;
  quantity: number;
}

export interface LowStockAlert {
  alert_id: number;
  product_id: number;
  product_name?: string;
  sku?: string;
  warehouse_id: number;
  warehouse_name?: string;
  current_stock: number;
  reorder_level: number;
  severity: 'CRITICAL' | 'WARNING';
  status: 'ACTIVE' | 'RESOLVED' | 'ACKNOWLEDGED';
  created_at: string;
}

export interface StockMovement {
  movement_id: number;
  product_id: number;
  product_name?: string;
  warehouse_id: number;
  warehouse_name?: string;
  movement_type: 'INBOUND' | 'OUTBOUND' | 'TRANSFER' | 'ADJUSTMENT';
  quantity: number;
  reference_type: string;
  reference_id: string;
  performed_by?: number;
  notes: string;
  timestamp: string;
}

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  category: 'INVENTORY' | 'SUPPLIER' | 'CAPACITY' | 'DEMAND' | 'COST';
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  recommended_action: string;
  timestamp: string;
}
