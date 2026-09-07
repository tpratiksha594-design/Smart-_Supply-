import { Router } from 'express';
import * as authController from '../controllers/authController';
import * as productController from '../controllers/productController';
import * as inventoryController from '../controllers/inventoryController';
import * as warehouseController from '../controllers/warehouseController';
import * as supplierController from '../controllers/supplierController';
import * as orderController from '../controllers/orderController';
import * as transferController from '../controllers/transferController';
import * as analyticsController from '../controllers/analyticsController';
import * as aiController from '../controllers/aiController';
import * as alertController from '../controllers/alertController';
import { authenticateToken } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';

const router = Router();

// ---------------- AUTH ROUTES ----------------
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/profile', authenticateToken, authController.getProfile);

// ---------------- PRODUCTS & CATEGORIES ----------------
router.get('/products', productController.getProducts);
router.get('/products/:id', productController.getProductById);
router.post('/products', authenticateToken, requireRole(['ADMIN', 'WAREHOUSE_MANAGER', 'PROCUREMENT_MANAGER']), productController.createProduct);
router.put('/products/:id', authenticateToken, requireRole(['ADMIN', 'WAREHOUSE_MANAGER', 'PROCUREMENT_MANAGER']), productController.updateProduct);
router.delete('/products/:id', authenticateToken, requireRole(['ADMIN']), productController.deleteProduct);
router.get('/categories', productController.getCategories);

// ---------------- INVENTORY ----------------
router.get('/inventory', inventoryController.getInventory);
router.get('/inventory/low-stock', inventoryController.getLowStockInventory);
router.post('/inventory/adjust', authenticateToken, requireRole(['ADMIN', 'WAREHOUSE_MANAGER']), inventoryController.adjustStock);

// ---------------- WAREHOUSES ----------------
router.get('/warehouses', warehouseController.getWarehouses);
router.get('/warehouses/:id', warehouseController.getWarehouseById);
router.post('/warehouses', authenticateToken, requireRole(['ADMIN']), warehouseController.createWarehouse);

// ---------------- SUPPLIERS ----------------
router.get('/suppliers', supplierController.getSuppliers);
router.get('/suppliers/leaderboard', supplierController.getSupplierLeaderboard);
router.post('/suppliers', authenticateToken, requireRole(['ADMIN', 'PROCUREMENT_MANAGER']), supplierController.createSupplier);

// ---------------- PURCHASE & SALES ORDERS ----------------
router.get('/purchase-orders', orderController.getPurchaseOrders);
router.post('/purchase-orders', authenticateToken, requireRole(['ADMIN', 'PROCUREMENT_MANAGER']), orderController.createPurchaseOrder);
router.put('/purchase-orders/:id/status', authenticateToken, requireRole(['ADMIN', 'PROCUREMENT_MANAGER', 'WAREHOUSE_MANAGER']), orderController.updatePOStatus);

router.get('/sales-orders', orderController.getSalesOrders);
router.post('/sales-orders', authenticateToken, requireRole(['ADMIN', 'SALES_MANAGER']), orderController.createSalesOrder);

// ---------------- TRANSFERS ----------------
router.get('/transfers', transferController.getTransfers);
router.post('/transfers', authenticateToken, requireRole(['ADMIN', 'WAREHOUSE_MANAGER']), transferController.createTransfer);

// ---------------- ANALYTICS ----------------
router.get('/analytics/dashboard', analyticsController.getDashboardSummary);
router.get('/analytics/sales', analyticsController.getSalesAnalytics);
router.get('/analytics/inventory', analyticsController.getInventoryAnalytics);

// ---------------- AI INSIGHTS ----------------
router.get('/ai/insights', aiController.getAIInsights);

// ---------------- ALERTS ----------------
router.get('/alerts', alertController.getAlerts);
router.put('/alerts/:id/acknowledge', authenticateToken, alertController.acknowledgeAlert);

export default router;
