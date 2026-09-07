import { Request, Response } from 'express';
import { mockStore } from '../services/mockDataStore';

export const getAlerts = async (req: Request, res: Response) => {
  try {
    const list = mockStore.alerts.map(a => {
      const p = mockStore.products.find(prod => prod.product_id === a.product_id);
      const w = mockStore.warehouses.find(wh => wh.warehouse_id === a.warehouse_id);
      return {
        ...a,
        product_name: p?.name || 'Product',
        sku: p?.sku || 'SKU',
        warehouse_name: w?.name || 'Warehouse'
      };
    });

    return res.json({ success: true, count: list.length, data: list });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const acknowledgeAlert = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const alert = mockStore.alerts.find(a => a.alert_id === id);

    if (!alert) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }

    alert.status = 'ACKNOWLEDGED';
    return res.json({ success: true, data: alert });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
