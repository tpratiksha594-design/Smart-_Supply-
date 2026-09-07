import { Request, Response } from 'express';
import { mockStore } from '../services/mockDataStore';
import { AIInsight } from '../types';

export const getAIInsights = async (req: Request, res: Response) => {
  try {
    // Generate dynamic rule-based insights based on real store state
    const dynamicInsights: AIInsight[] = [];

    // Rule 1: Check low stock critical items
    const criticals = mockStore.warehouseInventory.filter(
      wi => wi.quantity <= (mockStore.products.find(p => p.product_id === wi.product_id)?.reorder_level || 10) / 2
    );

    if (criticals.length > 0) {
      const p = mockStore.products.find(prod => prod.product_id === criticals[0].product_id);
      dynamicInsights.push({
        id: `ins-crit-${Date.now()}`,
        title: `Critical Stock Out Risk: ${p?.name || 'Item'}`,
        description: `Current available stock is down to ${criticals[0].quantity} units. Stockout risk high within 48h.`,
        category: 'INVENTORY',
        severity: 'HIGH',
        recommended_action: `Issue express PO to top-rated supplier immediately.`,
        timestamp: 'Just now'
      });
    }

    // Rule 2: High capacity warehouse
    const highCapWh = mockStore.warehouses.find(w => w.current_utilization_pct >= 80);
    if (highCapWh) {
      dynamicInsights.push({
        id: `ins-wh-${highCapWh.warehouse_id}`,
        title: `Warehouse Capacity Warning: ${highCapWh.name}`,
        description: `Facility is running at ${highCapWh.current_utilization_pct}% capacity. Re-allocation recommended.`,
        category: 'CAPACITY',
        severity: 'MEDIUM',
        recommended_action: `Schedule inventory transfer to under-utilized facilities (e.g. Ahmedabad Hub at 52%).`,
        timestamp: '5 mins ago'
      });
    }

    // Rule 3: Top supplier recognition
    const topSupplier = mockStore.suppliers.find(s => s.rating >= 4.9);
    if (topSupplier) {
      dynamicInsights.push({
        id: `ins-sup-${topSupplier.supplier_id}`,
        title: `Top Supplier Performance: ${topSupplier.name}`,
        description: `Supplier maintains ${topSupplier.on_time_delivery_rate}% on-time delivery rate with quality score of ${topSupplier.quality_score}/100.`,
        category: 'SUPPLIER',
        severity: 'LOW',
        recommended_action: `Consider negotiating annual volume discount agreement.`,
        timestamp: '15 mins ago'
      });
    }

    // Add baseline insights
    const allInsights = [...dynamicInsights, ...mockStore.aiInsights];

    return res.json({
      success: true,
      engine: 'SupplySync Intelligence (Rule-Based Automated Engine)',
      count: allInsights.length,
      data: allInsights
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
