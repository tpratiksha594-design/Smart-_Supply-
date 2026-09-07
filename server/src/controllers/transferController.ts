import { Request, Response } from 'express';
import { mockStore } from '../services/mockDataStore';
import { InventoryTransfer } from '../types';
import { AuthRequest } from '../middleware/auth';

export const getTransfers = async (req: Request, res: Response) => {
  try {
    const list = mockStore.transfers.map(t => {
      const src = mockStore.warehouses.find(w => w.warehouse_id === t.source_warehouse_id);
      const dest = mockStore.warehouses.find(w => w.warehouse_id === t.destination_warehouse_id);
      return {
        ...t,
        source_warehouse_name: src?.name || `Warehouse #${t.source_warehouse_id}`,
        destination_warehouse_name: dest?.name || `Warehouse #${t.destination_warehouse_id}`
      };
    });

    return res.json({ success: true, count: list.length, data: list });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createTransfer = async (req: AuthRequest, res: Response) => {
  try {
    const { source_warehouse_id, destination_warehouse_id, product_id, quantity, notes } = req.body;

    if (!source_warehouse_id || !destination_warehouse_id || !product_id || !quantity) {
      return res.status(400).json({
        success: false,
        message: 'source_warehouse_id, destination_warehouse_id, product_id, and quantity are required'
      });
    }

    if (Number(source_warehouse_id) === Number(destination_warehouse_id)) {
      return res.status(400).json({
        success: false,
        message: 'Source and Destination warehouses must be different'
      });
    }

    const srcInv = mockStore.warehouseInventory.find(
      wi => wi.warehouse_id === Number(source_warehouse_id) && wi.product_id === Number(product_id)
    );

    if (!srcInv || srcInv.available_quantity < Number(quantity)) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock in source warehouse (Available: ${srcInv?.available_quantity || 0})`
      });
    }

    // Atomic Transaction Simulation:
    // 1. Deduct from source warehouse
    srcInv.quantity -= Number(quantity);
    srcInv.available_quantity = Math.max(0, srcInv.quantity - srcInv.reserved_quantity);

    // 2. Add to destination warehouse
    let destInv = mockStore.warehouseInventory.find(
      wi => wi.warehouse_id === Number(destination_warehouse_id) && wi.product_id === Number(product_id)
    );

    if (destInv) {
      destInv.quantity += Number(quantity);
      destInv.available_quantity = destInv.quantity - destInv.reserved_quantity;
    } else {
      mockStore.warehouseInventory.push({
        warehouse_id: Number(destination_warehouse_id),
        product_id: Number(product_id),
        quantity: Number(quantity),
        reserved_quantity: 0,
        available_quantity: Number(quantity),
        zone_location: 'Zone A-01'
      });
    }

    // 3. Create Transfer record
    const trfNumber = `TRF-2026-${Math.floor(10 + Math.random() * 90)}`;
    const srcWh = mockStore.warehouses.find(w => w.warehouse_id === Number(source_warehouse_id));
    const destWh = mockStore.warehouses.find(w => w.warehouse_id === Number(destination_warehouse_id));
    const prod = mockStore.products.find(p => p.product_id === Number(product_id));

    const newTransfer: InventoryTransfer = {
      transfer_id: mockStore.transfers.length + 1,
      transfer_number: trfNumber,
      source_warehouse_id: Number(source_warehouse_id),
      source_warehouse_name: srcWh?.name,
      destination_warehouse_id: Number(destination_warehouse_id),
      destination_warehouse_name: destWh?.name,
      status: 'COMPLETED',
      notes: notes || `Transferred ${quantity} units of ${prod?.name}`,
      created_by: req.user?.user_id || 1,
      created_at: new Date().toISOString(),
      completed_at: new Date().toISOString(),
      items: [
        {
          item_id: 1,
          transfer_id: mockStore.transfers.length + 1,
          product_id: Number(product_id),
          product_name: prod?.name,
          quantity: Number(quantity)
        }
      ]
    };

    mockStore.transfers.unshift(newTransfer);

    // 4. Log Stock Movements for both warehouses
    mockStore.stockMovements.unshift(
      {
        movement_id: mockStore.stockMovements.length + 1,
        product_id: Number(product_id),
        product_name: prod?.name,
        warehouse_id: Number(source_warehouse_id),
        warehouse_name: srcWh?.name,
        movement_type: 'TRANSFER',
        quantity: -Number(quantity),
        reference_type: 'TRANSFER',
        reference_id: trfNumber,
        performed_by: req.user?.user_id || 1,
        notes: `Transfer out to ${destWh?.name}`,
        timestamp: new Date().toISOString()
      },
      {
        movement_id: mockStore.stockMovements.length + 2,
        product_id: Number(product_id),
        product_name: prod?.name,
        warehouse_id: Number(destination_warehouse_id),
        warehouse_name: destWh?.name,
        movement_type: 'TRANSFER',
        quantity: Number(quantity),
        reference_type: 'TRANSFER',
        reference_id: trfNumber,
        performed_by: req.user?.user_id || 1,
        notes: `Transfer in from ${srcWh?.name}`,
        timestamp: new Date().toISOString()
      }
    );

    return res.status(201).json({ success: true, data: newTransfer });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
