import { Request, Response } from 'express';
import { mockStore } from '../services/mockDataStore';
import { PurchaseOrder, SalesOrder } from '../types';
import { AuthRequest } from '../middleware/auth';

// --------------------------- PURCHASE ORDERS ---------------------------

export const getPurchaseOrders = async (req: Request, res: Response) => {
  try {
    const list = mockStore.purchaseOrders.map(po => {
      const sup = mockStore.suppliers.find(s => s.supplier_id === po.supplier_id);
      const wh = mockStore.warehouses.find(w => w.warehouse_id === po.warehouse_id);
      return {
        ...po,
        supplier_name: sup?.name || 'Unknown Supplier',
        warehouse_name: wh?.name || 'Main Warehouse'
      };
    });

    return res.json({ success: true, count: list.length, data: list });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createPurchaseOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { supplier_id, warehouse_id, product_id, quantity, unit_cost } = req.body;

    if (!supplier_id || !warehouse_id || !product_id || !quantity) {
      return res.status(400).json({ success: false, message: 'supplier_id, warehouse_id, product_id and quantity are required' });
    }

    const prod = mockStore.products.find(p => p.product_id === Number(product_id));
    const cost = Number(unit_cost) || prod?.cost_price || 100;
    const total = Number(quantity) * cost;
    const poNumber = `PO-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const sup = mockStore.suppliers.find(s => s.supplier_id === Number(supplier_id));
    const wh = mockStore.warehouses.find(w => w.warehouse_id === Number(warehouse_id));

    const newPo: PurchaseOrder = {
      po_id: mockStore.purchaseOrders.length + 1,
      po_number: poNumber,
      supplier_id: Number(supplier_id),
      supplier_name: sup?.name,
      warehouse_id: Number(warehouse_id),
      warehouse_name: wh?.name,
      status: 'APPROVED',
      total_amount: total,
      order_date: new Date().toISOString().split('T')[0],
      expected_delivery_date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      created_by: req.user?.user_id || 1,
      items: [
        {
          item_id: 1,
          po_id: mockStore.purchaseOrders.length + 1,
          product_id: Number(product_id),
          product_name: prod?.name,
          sku: prod?.sku,
          quantity_ordered: Number(quantity),
          quantity_received: 0,
          unit_cost: cost,
          subtotal: total
        }
      ]
    };

    mockStore.purchaseOrders.unshift(newPo);
    return res.status(201).json({ success: true, data: newPo });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePOStatus = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { status } = req.body;

    const po = mockStore.purchaseOrders.find(p => p.po_id === id);
    if (!po) {
      return res.status(404).json({ success: false, message: 'Purchase order not found' });
    }

    po.status = status;

    // Trigger: When PO becomes DELIVERED, automatically add inventory stock to warehouse
    if (status === 'DELIVERED') {
      po.items?.forEach(item => {
        const inv = mockStore.warehouseInventory.find(
          wi => wi.warehouse_id === po.warehouse_id && wi.product_id === item.product_id
        );
        if (inv) {
          inv.quantity += item.quantity_ordered;
          inv.available_quantity += item.quantity_ordered;
        } else {
          mockStore.warehouseInventory.push({
            warehouse_id: po.warehouse_id,
            product_id: item.product_id,
            quantity: item.quantity_ordered,
            reserved_quantity: 0,
            available_quantity: item.quantity_ordered,
            zone_location: 'Zone A-01'
          });
        }

        // Log Inbound Movement
        mockStore.stockMovements.unshift({
          movement_id: mockStore.stockMovements.length + 1,
          product_id: item.product_id,
          product_name: item.product_name || 'Product',
          warehouse_id: po.warehouse_id,
          warehouse_name: po.warehouse_name,
          movement_type: 'INBOUND',
          quantity: item.quantity_ordered,
          reference_type: 'PO',
          reference_id: po.po_number,
          performed_by: req.user?.user_id || 1,
          notes: `Delivered PO ${po.po_number}`,
          timestamp: new Date().toISOString()
        });
      });
    }

    return res.json({ success: true, data: po });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// --------------------------- SALES ORDERS ---------------------------

export const getSalesOrders = async (req: Request, res: Response) => {
  try {
    const list = mockStore.salesOrders.map(so => {
      const wh = mockStore.warehouses.find(w => w.warehouse_id === so.warehouse_id);
      return {
        ...so,
        warehouse_name: wh?.name || 'Main Warehouse'
      };
    });

    return res.json({ success: true, count: list.length, data: list });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createSalesOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { customer_id, warehouse_id, product_id, quantity } = req.body;

    if (!customer_id || !warehouse_id || !product_id || !quantity) {
      return res.status(400).json({ success: false, message: 'customer_id, warehouse_id, product_id and quantity are required' });
    }

    const prod = mockStore.products.find(p => p.product_id === Number(product_id));
    const price = prod?.price || 150;
    const total = Number(quantity) * price;
    const orderNum = `SO-2026-${Math.floor(8000 + Math.random() * 1000)}`;

    const newSo: SalesOrder = {
      so_id: mockStore.salesOrders.length + 1,
      order_number: orderNum,
      customer_id: Number(customer_id),
      customer_name: 'Customer #' + customer_id,
      warehouse_id: Number(warehouse_id),
      status: 'PROCESSING',
      total_amount: total,
      order_date: new Date().toISOString().split('T')[0],
      items: [
        {
          item_id: 1,
          so_id: mockStore.salesOrders.length + 1,
          product_id: Number(product_id),
          product_name: prod?.name,
          quantity: Number(quantity),
          unit_price: price,
          subtotal: total
        }
      ]
    };

    mockStore.salesOrders.unshift(newSo);
    return res.status(201).json({ success: true, data: newSo });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
