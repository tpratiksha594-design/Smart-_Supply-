import { Request, Response } from 'express';
import { mockStore } from '../services/mockDataStore';
import { getDbPool, checkIsMySQLConnected } from '../config/db';
import { Product } from '../types';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { category, search, stock_status } = req.query;

    if (checkIsMySQLConnected() && getDbPool()) {
      const pool = getDbPool()!;
      let query = 'SELECT * FROM vw_inventory_overview WHERE 1=1';
      const params: any[] = [];

      if (category && category !== 'ALL') {
        query += ' AND category_name = ?';
        params.push(category);
      }

      if (search) {
        query += ' AND (product_name LIKE ? OR sku LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
      }

      if (stock_status && stock_status !== 'ALL') {
        query += ' AND stock_status = ?';
        params.push(stock_status);
      }

      const [rows] = await pool.query(query, params);
      return res.json({ success: true, count: (rows as any[]).length, data: rows });
    }

    // Mock Store Filter
    let filtered = [...mockStore.products];

    if (category && category !== 'ALL') {
      filtered = filtered.filter(p => p.category_name?.toLowerCase() === (category as string).toLowerCase());
    }

    if (search) {
      const term = (search as string).toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(term) || p.sku.toLowerCase().includes(term));
    }

    if (stock_status && stock_status !== 'ALL') {
      filtered = filtered.filter(p => p.stock_status === stock_status);
    }

    return res.json({ success: true, count: filtered.length, data: filtered });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const product = mockStore.products.find(p => p.product_id === id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Get breakdown across warehouses for this product
    const inventoryBreakdown = mockStore.warehouseInventory
      .filter(wi => wi.product_id === id)
      .map(wi => {
        const wh = mockStore.warehouses.find(w => w.warehouse_id === wi.warehouse_id);
        return {
          ...wi,
          warehouse_name: wh?.name || `Warehouse #${wi.warehouse_id}`
        };
      });

    return res.json({ success: true, data: { ...product, inventoryBreakdown } });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, sku, category_id, unit, price, cost_price, reorder_level, target_stock, image_url } = req.body;

    if (!name || !sku || !category_id) {
      return res.status(400).json({ success: false, message: 'Name, SKU, and Category ID are required' });
    }

    const cat = mockStore.categories.find(c => c.category_id === Number(category_id));

    const newProduct: Product = {
      product_id: mockStore.products.length + 1,
      name,
      sku: sku.toUpperCase(),
      category_id: Number(category_id),
      category_name: cat?.name || 'General Hardware',
      unit: unit || 'pcs',
      price: Number(price) || 0,
      cost_price: Number(cost_price) || 0,
      reorder_level: Number(reorder_level) || 10,
      target_stock: Number(target_stock) || 100,
      image_url: image_url || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=300',
      status: 'ACTIVE',
      total_quantity: 0,
      stock_status: 'HEALTHY'
    };

    mockStore.products.unshift(newProduct);

    // Initialise 0 stock in Pune warehouse
    mockStore.warehouseInventory.push({
      warehouse_id: 1,
      product_id: newProduct.product_id,
      quantity: 0,
      reserved_quantity: 0,
      available_quantity: 0,
      zone_location: 'Zone A-01'
    });

    return res.status(201).json({ success: true, data: newProduct });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const index = mockStore.products.findIndex(p => p.product_id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const current = mockStore.products[index];
    const updated = { ...current, ...req.body };
    mockStore.products[index] = updated;

    return res.json({ success: true, data: updated });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const index = mockStore.products.findIndex(p => p.product_id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    mockStore.products.splice(index, 1);
    return res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    return res.json({ success: true, data: mockStore.categories });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
