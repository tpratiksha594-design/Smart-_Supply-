import axios from 'axios';
import {
  User, Product, Supplier, Warehouse, WarehouseInventory,
  PurchaseOrder, SalesOrder, InventoryTransfer, LowStockAlert,
  AIInsight, DashboardSummary
} from '../types';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('supplysync_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (email: string, password: string) => {
    const res = await api.post<{ success: boolean; token: string; user: User }>('/auth/login', { email, password });
    if (res.data.token) {
      localStorage.setItem('supplysync_token', res.data.token);
      localStorage.setItem('supplysync_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },
  register: async (name: string, email: string, password: string, role_id?: number) => {
    const res = await api.post<{ success: boolean; token: string; user: User }>('/auth/register', { name, email, password, role_id });
    if (res.data.token) {
      localStorage.setItem('supplysync_token', res.data.token);
      localStorage.setItem('supplysync_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },
  logout: () => {
    localStorage.removeItem('supplysync_token');
    localStorage.removeItem('supplysync_user');
  },
  getCurrentUser: (): User | null => {
    const u = localStorage.getItem('supplysync_user');
    return u ? JSON.parse(u) : null;
  }
};

export const productService = {
  getProducts: async (category?: string, search?: string, stock_status?: string) => {
    const res = await api.get<{ success: boolean; count: number; data: Product[] }>('/products', {
      params: { category, search, stock_status }
    });
    return res.data.data;
  },
  getProductById: async (id: number) => {
    const res = await api.get<{ success: boolean; data: Product }>('/products/' + id);
    return res.data.data;
  },
  createProduct: async (productData: Partial<Product>) => {
    const res = await api.post<{ success: boolean; data: Product }>('/products', productData);
    return res.data.data;
  },
  updateProduct: async (id: number, productData: Partial<Product>) => {
    const res = await api.put<{ success: boolean; data: Product }>('/products/' + id, productData);
    return res.data.data;
  },
  deleteProduct: async (id: number) => {
    const res = await api.delete('/products/' + id);
    return res.data;
  },
  getCategories: async () => {
    const res = await api.get<{ success: boolean; data: { category_id: number; name: string; slug: string }[] }>('/categories');
    return res.data.data;
  }
};

export const inventoryService = {
  getInventory: async (warehouse_id?: number | string, category?: string, stock_status?: string) => {
    const res = await api.get<{ success: boolean; count: number; data: WarehouseInventory[] }>('/inventory', {
      params: { warehouse_id, category, stock_status }
    });
    return res.data.data;
  },
  getLowStockInventory: async () => {
    const res = await api.get<{ success: boolean; count: number; data: any[] }>('/inventory/low-stock');
    return res.data.data;
  },
  adjustStock: async (warehouse_id: number, product_id: number, adjustment_qty: number, notes?: string) => {
    const res = await api.post('/inventory/adjust', { warehouse_id, product_id, adjustment_qty, notes });
    return res.data;
  }
};

export const warehouseService = {
  getWarehouses: async () => {
    const res = await api.get<{ success: boolean; count: number; data: Warehouse[] }>('/warehouses');
    return res.data.data;
  },
  getWarehouseById: async (id: number) => {
    const res = await api.get<{ success: boolean; data: Warehouse }>('/warehouses/' + id);
    return res.data.data;
  },
  createWarehouse: async (whData: Partial<Warehouse>) => {
    const res = await api.post<{ success: boolean; data: Warehouse }>('/warehouses', whData);
    return res.data.data;
  }
};

export const supplierService = {
  getSuppliers: async () => {
    const res = await api.get<{ success: boolean; count: number; data: Supplier[] }>('/suppliers');
    return res.data.data;
  },
  getLeaderboard: async () => {
    const res = await api.get<{ success: boolean; data: Supplier[] }>('/suppliers/leaderboard');
    return res.data.data;
  },
  createSupplier: async (supplierData: Partial<Supplier>) => {
    const res = await api.post<{ success: boolean; data: Supplier }>('/suppliers', supplierData);
    return res.data.data;
  }
};

export const orderService = {
  getPurchaseOrders: async () => {
    const res = await api.get<{ success: boolean; count: number; data: PurchaseOrder[] }>('/purchase-orders');
    return res.data.data;
  },
  createPurchaseOrder: async (poData: { supplier_id: number; warehouse_id: number; product_id: number; quantity: number; unit_cost?: number }) => {
    const res = await api.post<{ success: boolean; data: PurchaseOrder }>('/purchase-orders', poData);
    return res.data.data;
  },
  updatePOStatus: async (id: number, status: string) => {
    const res = await api.put<{ success: boolean; data: PurchaseOrder }>(`/purchase-orders/${id}/status`, { status });
    return res.data.data;
  },
  getSalesOrders: async () => {
    const res = await api.get<{ success: boolean; count: number; data: SalesOrder[] }>('/sales-orders');
    return res.data.data;
  },
  createSalesOrder: async (soData: { customer_id: number; warehouse_id: number; product_id: number; quantity: number }) => {
    const res = await api.post<{ success: boolean; data: SalesOrder }>('/sales-orders', soData);
    return res.data.data;
  }
};

export const transferService = {
  getTransfers: async () => {
    const res = await api.get<{ success: boolean; count: number; data: InventoryTransfer[] }>('/transfers');
    return res.data.data;
  },
  createTransfer: async (trfData: { source_warehouse_id: number; destination_warehouse_id: number; product_id: number; quantity: number; notes?: string }) => {
    const res = await api.post<{ success: boolean; data: InventoryTransfer }>('/transfers', trfData);
    return res.data.data;
  }
};

export const analyticsService = {
  getDashboardSummary: async () => {
    const res = await api.get<{ success: boolean; data: DashboardSummary }>('/analytics/dashboard');
    return res.data.data;
  },
  getSalesAnalytics: async () => {
    const res = await api.get<{ success: boolean; data: any }>('/analytics/sales');
    return res.data.data;
  },
  getInventoryAnalytics: async () => {
    const res = await api.get<{ success: boolean; data: any }>('/analytics/inventory');
    return res.data.data;
  }
};

export const aiService = {
  getAIInsights: async () => {
    const res = await api.get<{ success: boolean; engine: string; data: AIInsight[] }>('/ai/insights');
    return res.data.data;
  }
};

export const alertService = {
  getAlerts: async () => {
    const res = await api.get<{ success: boolean; count: number; data: LowStockAlert[] }>('/alerts');
    return res.data.data;
  },
  acknowledgeAlert: async (id: number) => {
    const res = await api.put<{ success: boolean; data: LowStockAlert }>(`/alerts/${id}/acknowledge`);
    return res.data.data;
  }
};
