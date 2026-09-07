import { Request, Response } from 'express';
import { mockStore } from '../services/mockDataStore';

export const getDashboardSummary = async (req: Request, res: Response) => {
  try {
    const totalInventoryValue = mockStore.products.reduce((acc, p) => acc + (p.total_quantity || 0) * p.cost_price, 0) || 2458900;
    const totalProducts = mockStore.products.length;
    const lowStockCount = mockStore.alerts.filter(a => a.status === 'ACTIVE').length;
    const activeSuppliers = mockStore.suppliers.filter(s => s.status !== 'INACTIVE').length;
    const activeWarehouses = mockStore.warehouses.length;
    const monthlyRevenue = 1845000;

    return res.json({
      success: true,
      data: {
        totalInventoryValue,
        totalProducts,
        lowStockCount,
        activeSuppliers,
        activeWarehouses,
        monthlyRevenue,
        valueGrowthPct: 12.5,
        productGrowthPct: 8.2,
        newSuppliersThisMonth: 5,
        revenueGrowthPct: 18.4
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getSalesAnalytics = async (req: Request, res: Response) => {
  try {
    const monthlySalesTrend = [
      { month: 'Jan', revenue: 1240000, orders: 840, avgOrderValue: 14761 },
      { month: 'Feb', revenue: 1380000, orders: 920, avgOrderValue: 15000 },
      { month: 'Mar', revenue: 1520000, orders: 1010, avgOrderValue: 15049 },
      { month: 'Apr', revenue: 1460000, orders: 980, avgOrderValue: 14897 },
      { month: 'May', revenue: 1680000, orders: 1120, avgOrderValue: 15000 },
      { month: 'Jun', revenue: 1750000, orders: 1180, avgOrderValue: 14830 },
      { month: 'Jul', revenue: 1845000, orders: 1248, avgOrderValue: 14784 }
    ];

    const categoryBreakdown = [
      { category: 'Electronics & Chips', value: 920000, percentage: 40 },
      { category: 'Power & Batteries', value: 460000, percentage: 25 },
      { category: 'Industrial Hardware', value: 275000, percentage: 15 },
      { category: 'Computer Peripherals', value: 110000, percentage: 12 },
      { category: 'Packaging & Logistics', value: 80000, percentage: 8 }
    ];

    return res.json({
      success: true,
      data: {
        totalRevenue: 1845000,
        growthRate: 18.4,
        totalOrders: 1248,
        avgOrderValue: 14784,
        monthlySalesTrend,
        categoryBreakdown
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getInventoryAnalytics = async (req: Request, res: Response) => {
  try {
    const warehouseUtilization = mockStore.warehouses.map(w => ({
      name: w.name.split(' ')[0],
      utilization: w.current_utilization_pct,
      capacity: w.total_capacity
    }));

    const stockHealthDistribution = [
      { status: 'Healthy', count: mockStore.products.filter(p => p.stock_status === 'HEALTHY').length || 20 },
      { status: 'Low Stock', count: mockStore.products.filter(p => p.stock_status === 'LOW_STOCK').length || 4 },
      { status: 'Critical', count: mockStore.products.filter(p => p.stock_status === 'CRITICAL').length || 1 }
    ];

    return res.json({
      success: true,
      data: {
        warehouseUtilization,
        stockHealthDistribution
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
