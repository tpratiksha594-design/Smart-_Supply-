import { Request, Response } from 'express';
import { mockStore } from '../services/mockDataStore';
import { Warehouse } from '../types';

export const getWarehouses = async (req: Request, res: Response) => {
  try {
    const list = mockStore.warehouses.map(w => {
      const inv = mockStore.warehouseInventory.filter(wi => wi.warehouse_id === w.warehouse_id);
      const uniqueSkus = new Set(inv.map(i => i.product_id)).size;
      const totalUnits = inv.reduce((acc, curr) => acc + curr.quantity, 0);

      const calculatedValue = inv.reduce((acc, curr) => {
        const prod = mockStore.products.find(p => p.product_id === curr.product_id);
        return acc + (curr.quantity * (prod?.cost_price || 0));
      }, 0);

      const utilization = Math.min(100, Number(((totalUnits / w.total_capacity) * 100).toFixed(1)));

      return {
        ...w,
        current_utilization_pct: utilization,
        inventory_value: calculatedValue || w.inventory_value,
        unique_sku_count: uniqueSkus,
        stored_units: totalUnits
      };
    });

    return res.json({ success: true, count: list.length, data: list });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getWarehouseById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const wh = mockStore.warehouses.find(w => w.warehouse_id === id);

    if (!wh) {
      return res.status(404).json({ success: false, message: 'Warehouse not found' });
    }

    const inventory = mockStore.warehouseInventory
      .filter(wi => wi.warehouse_id === id)
      .map(wi => {
        const p = mockStore.products.find(prod => prod.product_id === wi.product_id);
        return {
          ...wi,
          product_name: p?.name,
          sku: p?.sku,
          category_name: p?.category_name,
          unit_cost: p?.cost_price,
          total_value: wi.quantity * (p?.cost_price || 0)
        };
      });

    // Mock Isometric Zone Grid Breakdown (Zone A, B, C, D, E)
    const zones = [
      { zone_name: 'Zone A', type: 'Electronics & High Value', occupied_pct: 85, items: inventory.filter(i => i.zone_location.startsWith('Zone A')) },
      { zone_name: 'Zone B', type: 'Industrial Motors & Heavy Machinery', occupied_pct: 72, items: inventory.filter(i => i.zone_location.startsWith('Zone B')) },
      { zone_name: 'Zone C', type: 'Peripherals & Displays', occupied_pct: 64, items: inventory.filter(i => i.zone_location.startsWith('Zone C')) },
      { zone_name: 'Zone D', type: 'Packaging & Bulk Storage', occupied_pct: 90, items: inventory.filter(i => i.zone_location.startsWith('Zone D')) },
      { zone_name: 'Zone E', type: 'Hazardous / Batteries & UPS', occupied_pct: 45, items: inventory.filter(i => i.zone_location.startsWith('Zone E')) }
    ];

    return res.json({
      success: true,
      data: {
        ...wh,
        inventory,
        zones
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createWarehouse = async (req: Request, res: Response) => {
  try {
    const { name, code, location, total_capacity } = req.body;

    if (!name || !code || !location) {
      return res.status(400).json({ success: false, message: 'Name, code, and location are required' });
    }

    const newWh: Warehouse = {
      warehouse_id: mockStore.warehouses.length + 1,
      name,
      code: code.toUpperCase(),
      location,
      total_capacity: Number(total_capacity) || 10000,
      current_utilization_pct: 0,
      inventory_value: 0,
      status: 'OPERATIONAL',
      unique_sku_count: 0,
      stored_units: 0
    };

    mockStore.warehouses.push(newWh);
    return res.status(201).json({ success: true, data: newWh });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
