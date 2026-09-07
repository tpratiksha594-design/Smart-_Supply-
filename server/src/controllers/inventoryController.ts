import { Request, Response } from 'express';
import { mockStore } from '../services/mockDataStore';
import { AuthRequest } from '../middleware/auth';

export const getInventory = async (req: Request, res: Response) => {
  try {
    const { warehouse_id, category, stock_status } = req.query;

    let items = mockStore.warehouseInventory.map(wi => {
      const p = mockStore.products.find(prod => prod.product_id === wi.product_id);
      const w = mockStore.warehouses.find(wh => wh.warehouse_id === wi.warehouse_id);
      return {
        ...wi,
        product_name: p?.name || 'Unknown Product',
        sku: p?.sku || 'N/A',
        category_name: p?.category_name || 'General',
        reorder_level: p?.reorder_level || 10,
        unit_cost: p?.cost_price || 0,
        total_value: wi.quantity * (p?.cost_price || 0),
        warehouse_name: w?.name || 'Main Warehouse',
        stock_status: wi.quantity <= (p?.reorder_level || 10) / 2 ? 'CRITICAL' : (wi.quantity <= (p?.reorder_level || 10) ? 'LOW_STOCK' : 'HEALTHY')
      };
    });

    if (warehouse_id && warehouse_id !== 'ALL') {
      items = items.filter(i => i.warehouse_id === Number(warehouse_id));
    }

    if (category && category !== 'ALL') {
      items = items.filter(i => i.category_name.toLowerCase() === (category as string).toLowerCase());
    }

    if (stock_status && stock_status !== 'ALL') {
      items = items.filter(i => i.stock_status === stock_status);
    }

    return res.json({ success: true, count: items.length, data: items });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getLowStockInventory = async (req: Request, res: Response) => {
  try {
    const lowStockItems = mockStore.warehouseInventory
      .map(wi => {
        const p = mockStore.products.find(prod => prod.product_id === wi.product_id);
        const w = mockStore.warehouses.find(wh => wh.warehouse_id === wi.warehouse_id);
        return {
          product_id: wi.product_id,
          product_name: p?.name,
          sku: p?.sku,
          warehouse_id: wi.warehouse_id,
          warehouse_name: w?.name,
          current_stock: wi.quantity,
          reorder_level: p?.reorder_level || 10,
          target_stock: p?.target_stock || 100,
          suggested_reorder_qty: (p?.target_stock || 100) - wi.quantity,
          severity: wi.quantity <= ((p?.reorder_level || 10) / 2) ? 'CRITICAL' : 'WARNING'
        };
      })
      .filter(i => i.current_stock <= i.reorder_level);

    return res.json({ success: true, count: lowStockItems.length, data: lowStockItems });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const adjustStock = async (req: AuthRequest, res: Response) => {
  try {
    const { warehouse_id, product_id, adjustment_qty, notes } = req.body;

    if (!warehouse_id || !product_id || adjustment_qty === undefined) {
      return res.status(400).json({ success: false, message: 'warehouse_id, product_id and adjustment_qty are required' });
    }

    const item = mockStore.warehouseInventory.find(
      wi => wi.warehouse_id === Number(warehouse_id) && wi.product_id === Number(product_id)
    );

    if (!item) {
      // Add initial record
      const newRec = {
        warehouse_id: Number(warehouse_id),
        product_id: Number(product_id),
        quantity: Math.max(0, Number(adjustment_qty)),
        reserved_quantity: 0,
        available_quantity: Math.max(0, Number(adjustment_qty)),
        zone_location: 'Zone A-01'
      };
      mockStore.warehouseInventory.push(newRec);
    } else {
      item.quantity = Math.max(0, item.quantity + Number(adjustment_qty));
      item.available_quantity = Math.max(0, item.quantity - item.reserved_quantity);
    }

    // Log Stock Movement
    const p = mockStore.products.find(prod => prod.product_id === Number(product_id));
    const w = mockStore.warehouses.find(wh => wh.warehouse_id === Number(warehouse_id));

    mockStore.stockMovements.unshift({
      movement_id: mockStore.stockMovements.length + 1,
      product_id: Number(product_id),
      product_name: p?.name,
      warehouse_id: Number(warehouse_id),
      warehouse_name: w?.name,
      movement_type: 'ADJUSTMENT',
      quantity: Number(adjustment_qty),
      reference_type: 'MANUAL',
      reference_id: `ADJ-${Date.now()}`,
      performed_by: req.user?.user_id || 1,
      notes: notes || 'Manual stock adjustment',
      timestamp: new Date().toISOString()
    });

    return res.json({ success: true, message: 'Stock adjusted successfully' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
