# 📦 SUPPLYSYNC
### Smart Supply Chain & Inventory Intelligence Platform

SupplySync is an enterprise-grade, full-stack logistics and inventory intelligence SaaS platform designed to deliver real-time operational visibility across products, warehouses, suppliers, purchase orders, sales orders, stock movements, and inter-facility inventory transfers.

---

## 🎨 Color Palette & Aesthetic Identity
- **Primary**: Deep Navy Blue (`#0F172A`)
- **Secondary**: Electric Indigo (`#6366F1`)
- **Accent**: Bright Cyan (`#06B6D4`)
- **Success**: Emerald Green (`#10B981`)
- **Warning**: Amber (`#F59E0B`)
- **Danger**: Coral Red (`#F43F5E`)
- **Background**: Soft Light Gray (`#F8FAFC`)

---

## 🚀 Key Features

### 🧊 1. Interactive 3D Logistics & Supply Chain Visualizers
- **Landing Page 3D Hero**: Three.js / React Three Fiber interactive scene with rotating warehouse hub, floating product packages, orbiting nodes, and dynamic mouse rotation controls.
- **Dashboard 3D Process Map**: Interactive 2.5D/3D supply chain map (Supplier → Warehouse → Distribution → Customer) featuring live animated package trajectory particles and node inspection tooltips.
- **Isometric Warehouse Zone Grid**: Interactive 3D/2.5D visual facility layout depicting storage zones A, B, C, D, E with real-time occupancy indicators.

### 🤖 2. SupplySync Intelligence (Rule-Based AI Engine)
- Automated rule engine monitoring stockout risks, facility capacity thresholds, supplier performance benchmarks, and demand surge alerts with conversational action recommendations.

### 📦 3. Comprehensive Inventory & Product Catalog Management
- Search, filter by category/warehouse/stock status.
- Grid & Table View toggle with animated stock health bars (🟢 Healthy, 🟡 Low Stock, 🔴 Critical).
- Manual stock level adjustment drawer with transaction audit logs.

### 🚚 4. Supplier Intelligence & Leaderboard
- Automated Health Score calculation (`(Rating/5 * 40) + (OnTime/100 * 30) + (Quality/100 * 30)`).
- Top Suppliers Leaderboard with 🥇 🥈 🥉 ranking.

### 🛒 5. Purchase & Sales Order Lifecycle
- Timeline status tracking (Pending → Approved → Shipped → Delivered → Cancelled).
- Automatic warehouse inventory update trigger when purchase orders reach **DELIVERED** status.

### 🔄 6. Inter-Warehouse Inventory Transfers
- FROM Warehouse -> Product -> Quantity -> TO Warehouse transfer workflow.
- Animated Framer Motion package movement visualizer.
- Transaction safety ensuring stock balance integrity.

### ⚠ 7. Intelligent Low Stock Alert Center
- Database triggers automatically emitting critical and warning alerts when available quantity drops below product reorder level.
- Quick action "Create Purchase Order" button to resolve low stock alerts in one click.

---

## 🗄️ Database Architecture (MySQL 3NF)

Contains 18 Normalized Tables, 5 Views, 5 Stored Procedures, and Database Triggers:

### Tables:
1. `roles`
2. `users`
3. `categories`
4. `products`
5. `suppliers`
6. `supplier_products`
7. `warehouses`
8. `warehouse_inventory`
9. `customers`
10. `purchase_orders`
11. `purchase_order_items`
12. `sales_orders`
13. `sales_order_items`
14. `stock_movements`
15. `inventory_transfers`
16. `transfer_items`
17. `low_stock_alerts`
18. `supplier_performance`

### Stored Procedures & Triggers:
- `sp_transfer_inventory`: Executes atomic stock shift across warehouses.
- `sp_create_purchase_order`: Generates PO headers and line items.
- `sp_calculate_supplier_score`: Calculates dynamic supplier health score.
- `trg_check_low_stock_after_update`: Automatically inserts `low_stock_alerts` when inventory drops below reorder point.

---

## 🛠️ Tech Stack

### Frontend:
- **React 18** + **Vite** + **TypeScript**
- **Tailwind CSS** (Custom supply chain palette)
- **Framer Motion** (Micro animations & package transfer trajectory)
- **Three.js** / **React Three Fiber** / **React Three Drei** (3D logistics scene)
- **Recharts** (BI Sales trends, category breakdown, utilization bars)
- **Lucide React Icons**

### Backend:
- **Node.js** + **Express.js** + **TypeScript**
- **JWT** (JSON Web Tokens authentication)
- **bcryptjs** (Password hashing)
- **mysql2/promise** (MySQL connection pool & transactions)
- **Stateful In-Memory Fallback Store**: Auto-activates if MySQL server is unreachable, ensuring full execution out of the box.

---

## 💻 Quick Start & Installation

### Prerequisites
- Node.js v18+ & npm
- (Optional) MySQL Server 8.0+

### Setup Instructions

1. **Install Server Dependencies**:
   ```bash
   cd server
   npm install
   ```

2. **Install Client Dependencies**:
   ```bash
   cd ../client
   npm install
   ```

3. **Database Import (Optional for Live MySQL)**:
   - Execute `dbschema/schema.sql` to build tables, views, triggers & procedures.
   - Execute `dbschema/seed.sql` to populate sample data.

4. **Run Server & Client**:
   - In root folder:
     ```bash
     # Run Server
     npm run dev:server

     # In another terminal window:
     npm run dev:client
     ```
   - Open browser at `http://localhost:3000`

---

## 🔐 Demo Credentials
- **Admin User**: `admin@supplysync.com` / `Password123!`
- **Warehouse Manager**: `rajesh.wh@supplysync.com` / `Password123!`
- **Procurement Manager**: `priya.proc@supplysync.com` / `Password123!`
