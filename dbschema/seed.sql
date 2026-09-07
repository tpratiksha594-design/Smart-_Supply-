-- ====================================================================
-- SUPPLYSYNC SAMPLE DATA SEED SCRIPT
-- Realistic enterprise data for 25+ Products, 10 Suppliers, 5 Warehouses,
-- 50 Customers, Purchase Orders, Sales Orders & Stock Movements
-- ====================================================================

USE supplysync_db;

SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE supplier_performance;
TRUNCATE TABLE low_stock_alerts;
TRUNCATE TABLE transfer_items;
TRUNCATE TABLE inventory_transfers;
TRUNCATE TABLE stock_movements;
TRUNCATE TABLE sales_order_items;
TRUNCATE TABLE sales_orders;
TRUNCATE TABLE purchase_order_items;
TRUNCATE TABLE purchase_orders;
TRUNCATE TABLE customers;
TRUNCATE TABLE warehouse_inventory;
TRUNCATE TABLE warehouses;
TRUNCATE TABLE supplier_products;
TRUNCATE TABLE suppliers;
TRUNCATE TABLE products;
TRUNCATE TABLE categories;
TRUNCATE TABLE users;
TRUNCATE TABLE roles;

SET FOREIGN_KEY_CHECKS = 1;

-- --------------------------------------------------------------------
-- 1. SEED ROLES
-- --------------------------------------------------------------------
INSERT INTO roles (role_id, name, description) VALUES
(1, 'ADMIN', 'Full system access and security administration'),
(2, 'WAREHOUSE_MANAGER', 'Warehouse inventory, stock movements, transfers'),
(3, 'PROCUREMENT_MANAGER', 'Supplier negotiations, purchase orders, reordering'),
(4, 'SALES_MANAGER', 'Sales order processing, customer relations'),
(5, 'VIEWER', 'Read-only access to analytics and reporting dashboards');

-- --------------------------------------------------------------------
-- 2. SEED USERS (Password for all demo accounts: "Password123!")
-- bcrypt hash for "Password123!": $2a$10$e8W/Z8V21N9Nf9h7XyV5xe.5t/0kYF5P5M0rY9.1g0g9uGZ5b7t/m
-- --------------------------------------------------------------------
INSERT INTO users (user_id, name, email, password_hash, role_id, status) VALUES
(1, 'Super Admin', 'admin@supplysync.com', '$2a$10$e8W/Z8V21N9Nf9h7XyV5xe.5t/0kYF5P5M0rY9.1g0g9uGZ5b7t/m', 1, 'ACTIVE'),
(2, 'Rajesh Kumar', 'rajesh.wh@supplysync.com', '$2a$10$e8W/Z8V21N9Nf9h7XyV5xe.5t/0kYF5P5M0rY9.1g0g9uGZ5b7t/m', 2, 'ACTIVE'),
(3, 'Priya Sharma', 'priya.proc@supplysync.com', '$2a$10$e8W/Z8V21N9Nf9h7XyV5xe.5t/0kYF5P5M0rY9.1g0g9uGZ5b7t/m', 3, 'ACTIVE'),
(4, 'Amit Patel', 'amit.sales@supplysync.com', '$2a$10$e8W/Z8V21N9Nf9h7XyV5xe.5t/0kYF5P5M0rY9.1g0g9uGZ5b7t/m', 4, 'ACTIVE'),
(5, 'Executive Viewer', 'viewer@supplysync.com', '$2a$10$e8W/Z8V21N9Nf9h7XyV5xe.5t/0kYF5P5M0rY9.1g0g9uGZ5b7t/m', 5, 'ACTIVE');

-- --------------------------------------------------------------------
-- 3. SEED CATEGORIES
-- --------------------------------------------------------------------
INSERT INTO categories (category_id, name, slug, description) VALUES
(1, 'Electronics & Chips', 'electronics-chips', 'Semiconductors, processors, integrated circuits'),
(2, 'Industrial Hardware', 'industrial-hardware', 'Motors, pumps, valves, and precision tools'),
(3, 'Computer Peripherals', 'computer-peripherals', 'Displays, keyboards, docks, and wireless accessories'),
(4, 'Packaging & Logistics', 'packaging-logistics', 'Corrugated boxes, pallets, bubble wraps, and straps'),
(5, 'Power Supplies & Batteries', 'power-batteries', 'Lithium ion cells, UPS systems, solar inverters');

-- --------------------------------------------------------------------
-- 4. SEED PRODUCTS (25 Products)
-- --------------------------------------------------------------------
INSERT INTO products (product_id, name, sku, category_id, unit, price, cost_price, reorder_level, target_stock, image_url, status) VALUES
(1, 'Arm Pro-X Microcontroller Unit', 'MCU-PRO-X1', 1, 'pcs', 1250.00, 780.00, 50, 300, 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=300', 'ACTIVE'),
(2, 'Octa-Core Embedded Processor 4GHz', 'PROC-OCTA-04', 1, 'pcs', 8900.00, 6200.00, 20, 150, 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=300', 'ACTIVE'),
(3, '512GB NVMe High-Speed SSD Flash', 'SSD-NVME-512', 1, 'pcs', 4500.00, 2900.00, 30, 200, 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=300', 'ACTIVE'),
(4, 'Ultra-Low Latency Wi-Fi 6E Chipset', 'CHIP-WIFI6E', 1, 'pcs', 750.00, 420.00, 100, 500, 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=300', 'ACTIVE'),
(5, 'High-Precision Stepper Motor 24V', 'MOT-STEP-24V', 2, 'pcs', 3200.00, 2100.00, 15, 100, 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300', 'ACTIVE'),
(6, 'Hydraulic Control Valve 3/4 inch', 'VALVE-HYD-075', 2, 'pcs', 5400.00, 3600.00, 10, 80, 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=300', 'ACTIVE'),
(7, 'Industrial Grade Bearing Set Assembly', 'BRG-SET-IND', 2, 'sets', 1850.00, 1150.00, 40, 250, 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300', 'ACTIVE'),
(8, 'Pneumatic Actuator Cylinder 100mm', 'ACT-PNEU-100', 2, 'pcs', 7800.00, 5200.00, 8, 50, 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=300', 'ACTIVE'),
(9, '27-inch 4K UHD IPS Docking Monitor', 'MON-4K-27D', 3, 'pcs', 28900.00, 19500.00, 12, 60, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300', 'ACTIVE'),
(10, 'Ergonomic Wireless Mechanical Keyboard', 'KB-MECH-WRL', 3, 'pcs', 4200.00, 2400.00, 25, 150, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300', 'ACTIVE'),
(11, 'Precision Optical Gaming Mouse 26K DPI', 'MSE-OPT-26K', 3, 'pcs', 2100.00, 1200.00, 35, 200, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300', 'ACTIVE'),
(12, 'Thunderbolt 4 Multi-Port Docking Station', 'DOCK-TB4-MP', 3, 'pcs', 1250.00, 8200.00, 15, 80, 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=300', 'ACTIVE'),
(13, 'Heavy Duty Corrugated Box 50x40x30cm', 'BOX-CORR-HD', 4, 'packs', 450.00, 220.00, 200, 1500, 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=300', 'ACTIVE'),
(14, 'Biodegradable Bubble Cushion Wrap 100m', 'WRAP-BUBB-100', 4, 'rolls', 1200.00, 680.00, 50, 300, 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=300', 'ACTIVE'),
(15, 'Euro Standard Wooden Pallet 120x80cm', 'PALLET-EURO-WD', 4, 'pcs', 1800.00, 950.00, 40, 200, 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=300', 'ACTIVE'),
(16, 'Automatic Polypropylene Strapping Machine', 'MACH-STRAP-PP', 4, 'unit', 45000.00, 31000.00, 2, 10, 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=300', 'ACTIVE'),
(17, '48V 100Ah Lithium Iron Phosphate Battery', 'BAT-LFP-48V', 5, 'unit', 64000.00, 45000.00, 5, 30, 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=300', 'ACTIVE'),
(18, 'Online Double Conversion UPS 10kVA', 'UPS-10KVA-IND', 5, 'unit', 88000.00, 61000.00, 3, 15, 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=300', 'ACTIVE'),
(19, 'Pure Sine Wave Solar Inverter 5kW', 'INV-SOLAR-5KW', 5, 'unit', 38000.00, 26000.00, 8, 40, 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=300', 'ACTIVE'),
(20, 'Industrial Lithium Battery Management System', 'BMS-IND-48V', 5, 'pcs', 6500.00, 4100.00, 20, 100, 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=300', 'ACTIVE'),
(21, 'Smart IoT Temperature & Humidity Sensor', 'SENS-IOT-TH', 1, 'pcs', 1400.00, 850.00, 40, 250, 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=300', 'ACTIVE'),
(22, 'Automated Guided Vehicle (AGV) Wheel Motor', 'AGV-MTR-100W', 2, 'pcs', 14500.00, 9800.00, 6, 25, 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300', 'ACTIVE'),
(23, 'High-Density Barcode Handheld Scanner', 'SCN-BAR-HD', 3, 'pcs', 4900.00, 2900.00, 15, 80, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300', 'ACTIVE'),
(24, 'Thermal Transfer Shipping Label Printer', 'PRNT-LBL-TT', 3, 'pcs', 18500.00, 12400.00, 8, 35, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300', 'ACTIVE'),
(25, 'Smart Logistics GPS Tracking Tag Module', 'TAG-GPS-LOG', 1, 'pcs', 2200.00, 1350.00, 50, 400, 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=300', 'ACTIVE');

-- --------------------------------------------------------------------
-- 5. SEED SUPPLIERS (10 Suppliers)
-- --------------------------------------------------------------------
INSERT INTO suppliers (supplier_id, name, contact_person, email, phone, address, rating, on_time_delivery_rate, quality_score, status) VALUES
(1, 'TechSupply India Pvt Ltd', 'Vikramaditya Roy', 'contact@techsupply.in', '+91 98200 11223', 'Plot 42, Electronic City Phase 1, Bengaluru, Karnataka', 4.90, 98.40, 96, 'PREFERRED'),
(2, 'Global Logistics & Hardware Components', 'Sarah Jenkins', 'orders@globallogistics.com', '+1 408 555 0199', '104 Tech Boulevard, San Jose, CA, USA', 4.75, 94.20, 92, 'PREFERRED'),
(3, 'SmartParts Electronics Ltd', 'Rohan Mehta', 'support@smartparts.co.in', '+91 98111 44556', 'Sector 62, Industrial Area, Noida, UP', 4.60, 91.80, 89, 'ACTIVE'),
(4, 'Nexus Power Systems Inc', 'David Chen', 'sales@nexuspower.com', '+886 2 2700 8899', 'Hsinchu Science Park, Hsinchu, Taiwan', 4.85, 97.50, 95, 'PREFERRED'),
(5, 'Apex Industrial Motors & Automation', 'Sanjay Deshmukh', 'info@apexindustrial.in', '+91 97690 33445', 'MIDC Industrial Zone, Bhosari, Pune, Maharashtra', 4.40, 88.50, 85, 'ACTIVE'),
(6, 'EcoPack Materials & Containers', 'Anita Nair', 'anita@ecopack.in', '+91 94470 66778', 'Industrial Estate, Kalamassery, Kochi, Kerala', 4.70, 96.00, 94, 'ACTIVE'),
(7, 'OmniSens IoT Technologies', 'Marcus Vance', 'mvance@omnisens.de', '+49 89 4110 9900', 'Siemensstrasse 12, Munich, Germany', 4.65, 93.00, 91, 'ACTIVE'),
(8, 'Vanguard Batteries & Energy Corp', 'Kavita Patel', 'sales@vanguardenergy.in', '+91 98980 22334', 'GIDC Estate, Makarpura, Vadodara, Gujarat', 4.80, 95.50, 93, 'PREFERRED'),
(9, 'Precision Hydraulics & Valves', 'Gaurav Joshi', 'gjoshi@precisionhyd.com', '+91 93220 88776', 'Peenya Industrial Area, Bengaluru, Karnataka', 4.30, 86.00, 82, 'UNDER_REVIEW'),
(10, 'Quantum Chipsets & Semiconductor Ltd', 'Kenji Sato', 'sato@quantumchips.jp', '+81 3 5555 1234', 'Akihabara Tech Plaza, Tokyo, Japan', 4.95, 99.10, 98, 'PREFERRED');

-- --------------------------------------------------------------------
-- 6. SEED SUPPLIER_PRODUCTS
-- --------------------------------------------------------------------
INSERT INTO supplier_products (supplier_id, product_id, lead_time_days, supplier_price) VALUES
(1, 1, 4, 780.00), (1, 2, 6, 6200.00), (1, 3, 5, 2900.00), (1, 4, 3, 420.00),
(2, 9, 8, 19500.00), (2, 10, 5, 2400.00), (2, 11, 4, 1200.00), (2, 12, 7, 8200.00),
(3, 21, 3, 850.00), (3, 23, 4, 2900.00), (3, 24, 6, 12400.00), (3, 25, 4, 1350.00),
(4, 17, 10, 45000.00), (4, 18, 12, 61000.00), (4, 19, 9, 26000.00), (4, 20, 6, 4100.00),
(5, 5, 5, 2100.00), (5, 7, 4, 1150.00), (5, 8, 7, 5200.00), (5, 22, 9, 9800.00),
(6, 13, 2, 220.00), (6, 14, 2, 680.00), (6, 15, 3, 950.00), (6, 16, 14, 31000.00),
(7, 21, 5, 870.00), (7, 25, 4, 1380.00),
(8, 17, 7, 44500.00), (8, 19, 6, 25500.00),
(9, 6, 6, 3600.00), (9, 8, 8, 5300.00),
(10, 1, 3, 760.00), (10, 2, 5, 6100.00);

-- --------------------------------------------------------------------
-- 7. SEED WAREHOUSES (5 Warehouses)
-- --------------------------------------------------------------------
INSERT INTO warehouses (warehouse_id, name, code, location, total_capacity, current_utilization_pct, inventory_value, status) VALUES
(1, 'Pune Central Logistics Hub', 'WH-PNE-01', 'Chakan Industrial Hub, Pune, MH', 25000, 82.50, 12450000.00, 'OPERATIONAL'),
(2, 'Bengaluru Tech Fulfillment Center', 'WH-BLR-02', 'Whitefield Industrial Zone, Bengaluru, KA', 20000, 74.00, 9800000.00, 'OPERATIONAL'),
(3, 'Mumbai Sea Port Transit Yard', 'WH-BOM-03', 'Nhava Sheva, Navi Mumbai, MH', 35000, 68.00, 8500000.00, 'OPERATIONAL'),
(4, 'Delhi NCR Northern Gateway Hub', 'WH-DEL-04', 'Gurugram Expressway Zone 4, HR', 18000, 89.20, 6400000.00, 'OPERATIONAL'),
(5, 'Ahmedabad Solar & Energy Logistics', 'WH-AMD-05', 'Sanand Industrial Estate, Ahmedabad, GJ', 15000, 52.00, 3900000.00, 'OPERATIONAL');

-- --------------------------------------------------------------------
-- 8. SEED WAREHOUSE_INVENTORY (Stock Distribution across Warehouses)
-- --------------------------------------------------------------------
INSERT INTO warehouse_inventory (warehouse_id, product_id, quantity, reserved_quantity, zone_location) VALUES
-- Warehouse 1 (Pune)
(1, 1, 240, 20, 'Zone A-01'), (1, 2, 45, 5, 'Zone A-02'), (1, 3, 120, 15, 'Zone A-03'),
(1, 5, 65, 8, 'Zone B-01'), (1, 6, 42, 4, 'Zone B-02'), (1, 9, 25, 2, 'Zone C-01'),
(1, 13, 850, 50, 'Zone D-01'), (1, 17, 12, 1, 'Zone E-01'), (1, 21, 180, 20, 'Zone A-04'),

-- Warehouse 2 (Bengaluru)
(2, 1, 150, 10, 'Zone A-01'), (2, 2, 85, 10, 'Zone A-02'), (2, 4, 320, 30, 'Zone A-03'),
(2, 9, 30, 5, 'Zone B-01'), (2, 10, 95, 12, 'Zone B-02'), (2, 11, 140, 15, 'Zone B-03'),
(2, 12, 40, 6, 'Zone B-04'), (2, 23, 50, 8, 'Zone C-01'), (2, 25, 210, 25, 'Zone A-05'),

-- Warehouse 3 (Mumbai Port)
(3, 3, 90, 10, 'Zone A-01'), (3, 7, 160, 20, 'Zone B-01'), (3, 8, 28, 3, 'Zone B-02'),
(3, 13, 600, 40, 'Zone D-01'), (3, 14, 180, 15, 'Zone D-02'), (3, 15, 120, 10, 'Zone D-03'),
(3, 16, 6, 1, 'Zone D-04'), (3, 22, 14, 2, 'Zone B-03'),

-- Warehouse 4 (Delhi NCR)
(4, 5, 25, 3, 'Zone B-01'), (4, 10, 40, 5, 'Zone C-01'), (4, 11, 55, 6, 'Zone C-02'),
(4, 17, 8, 2, 'Zone E-01'), (4, 18, 5, 1, 'Zone E-02'), (4, 20, 45, 5, 'Zone E-03'),
(4, 24, 18, 2, 'Zone C-03'),

-- Warehouse 5 (Ahmedabad Solar)
(5, 17, 15, 2, 'Zone A-01'), (5, 18, 8, 1, 'Zone A-02'), (5, 19, 22, 3, 'Zone A-03'),
(5, 20, 35, 4, 'Zone A-04'), (5, 15, 60, 5, 'Zone B-01');

-- Low Stock Item specific overrides for testing alert engine
-- (Product 17 Lithium battery in WH 4 is low stock, Product 6 valve in WH 1 is low stock)
INSERT INTO warehouse_inventory (warehouse_id, product_id, quantity, reserved_quantity, zone_location) VALUES
(1, 18, 2, 0, 'Zone E-02'), -- Low stock critical (reorder 3)
(4, 6, 4, 1, 'Zone B-02')   -- Low stock warning (reorder 10)
ON DUPLICATE KEY UPDATE quantity = VALUES(quantity);

-- --------------------------------------------------------------------
-- 9. SEED CUSTOMERS (Sample 10 Customers)
-- --------------------------------------------------------------------
INSERT INTO customers (customer_id, name, email, phone, company, address, city) VALUES
(1, 'Aarav Sharma', 'aarav@relianceind.com', '+91 98220 55443', 'Reliance Logistics Solutions', 'Maker Chambers, Nariman Point', 'Mumbai'),
(2, 'Sneha Reddi', 'sneha@tcs.com', '+91 98450 88990', 'Tata Consultancy Services Hardware Div', 'ITPL Main Road', 'Bengaluru'),
(3, 'Vikram Malhotra', 'vikram@mahindra.com', '+91 97110 33221', 'Mahindra Electric Mobility', 'Kandivali East', 'Mumbai'),
(4, 'Deepak Verma', 'deepak@infosys.com', '+91 94480 77665', 'Infosys Systems Infrastructure', 'Electronic City Phase 1', 'Bengaluru'),
(5, 'Neha Gupta', 'neha@zomato.com', '+91 99100 44332', 'Zomato Dark Store Operations', 'Golf Course Road', 'Gurugram'),
(6, 'Rohan Kapoor', 'rohan@flipkart.com', '+91 98800 11998', 'Flipkart Logistics Network', 'Outer Ring Road', 'Bengaluru'),
(7, 'Ananya Sen', 'ananya@swiggy.in', '+91 98300 22114', 'Instamart Supply Chain', 'Koramangala 4th Block', 'Bengaluru'),
(8, 'Karan Singhania', 'karan@tata-power.com', '+91 98210 66554', 'Tata Power Renewable Microgrids', 'Carnac Bunder', 'Mumbai'),
(9, 'Pooja Hegde', 'pooja@olaelectric.com', '+91 97400 33887', 'Ola Futurefactory Ops', 'Hosur Road', 'Bengaluru'),
(10, 'Siddharth Roy', 'siddharth@havells.com', '+91 98100 99887', 'Havells India Automation', 'Surajkund Road', 'Faridabad');

-- --------------------------------------------------------------------
-- 10. SEED PURCHASE ORDERS (Sample 8 POs)
-- --------------------------------------------------------------------
INSERT INTO purchase_orders (po_id, po_number, supplier_id, warehouse_id, status, total_amount, order_date, expected_delivery_date, created_by) VALUES
(1, 'PO-2026-1001', 1, 1, 'DELIVERED', 234000.00, '2026-08-01', '2026-08-05', 3),
(2, 'PO-2026-1002', 2, 2, 'SHIPPED', 585000.00, '2026-08-25', '2026-09-02', 3),
(3, 'PO-2026-1003', 4, 5, 'APPROVED', 900000.00, '2026-08-28', '2026-09-07', 3),
(4, 'PO-2026-1004', 6, 3, 'PENDING', 110000.00, '2026-09-01', '2026-09-04', 3),
(5, 'PO-2026-1005', 8, 4, 'APPROVED', 445000.00, '2026-09-02', '2026-09-09', 3),
(6, 'PO-2026-1006', 10, 1, 'SHIPPED', 310000.00, '2026-09-03', '2026-09-08', 3),
(7, 'PO-2026-1007', 5, 1, 'DELIVERED', 105000.00, '2026-08-10', '2026-08-15', 3),
(8, 'PO-2026-1008', 3, 2, 'PENDING', 145000.00, '2026-09-05', '2026-09-10', 3);

-- PO Items
INSERT INTO purchase_order_items (po_id, product_id, quantity_ordered, quantity_received, unit_cost) VALUES
(1, 1, 300, 300, 780.00),
(2, 9, 30, 0, 19500.00),
(3, 17, 20, 0, 45000.00),
(4, 13, 500, 0, 220.00),
(5, 17, 10, 0, 44500.00),
(6, 2, 50, 0, 6200.00),
(7, 5, 50, 50, 2100.00),
(8, 23, 50, 0, 2900.00);

-- --------------------------------------------------------------------
-- 11. SEED SALES ORDERS (Sample 8 SOs)
-- --------------------------------------------------------------------
INSERT INTO sales_orders (so_id, order_number, customer_id, warehouse_id, status, total_amount, order_date) VALUES
(1, 'SO-2026-8001', 1, 1, 'COMPLETED', 145000.00, '2026-08-15'),
(2, 'SO-2026-8002', 3, 1, 'PROCESSING', 384000.00, '2026-08-29'),
(3, 'SO-2026-8003', 2, 2, 'SHIPPED', 578000.00, '2026-08-30'),
(4, 'SO-2026-8004', 8, 5, 'COMPLETED', 640000.00, '2026-08-20'),
(5, 'SO-2026-8005', 9, 4, 'PENDING', 256000.00, '2026-09-02'),
(6, 'SO-2026-8006', 6, 2, 'PROCESSING', 184000.00, '2026-09-04'),
(7, 'SO-2026-8007', 4, 2, 'SHIPPED', 295000.00, '2026-09-05'),
(8, 'SO-2026-8008', 5, 3, 'PENDING', 89000.00, '2026-09-06');

-- SO Items
INSERT INTO sales_order_items (so_id, product_id, quantity, unit_price) VALUES
(1, 1, 50, 1250.00), (1, 5, 20, 3200.00),
(2, 2, 20, 8900.00), (2, 5, 30, 3200.00),
(3, 9, 15, 28900.00), (3, 10, 20, 4200.00),
(4, 17, 10, 64000.00),
(5, 17, 4, 64000.00),
(6, 11, 40, 2100.00), (6, 12, 8, 12500.00),
(7, 3, 50, 4500.00), (7, 4, 90, 750.00),
(8, 14, 50, 1200.00), (8, 15, 15, 1800.00);

-- --------------------------------------------------------------------
-- 12. SEED INVENTORY TRANSFERS
-- --------------------------------------------------------------------
INSERT INTO inventory_transfers (transfer_id, transfer_number, source_warehouse_id, destination_warehouse_id, status, notes, created_by, completed_at) VALUES
(1, 'TRF-2026-01', 1, 3, 'COMPLETED', 'Urgent stock balancing for export shipments', 2, '2026-08-22 14:30:00'),
(2, 'TRF-2026-02', 2, 4, 'IN_TRANSIT', 'Re-allocating Wi-Fi chips to Delhi NCR Hub', 2, NULL),
(3, 'TRF-2026-03', 3, 1, 'PENDING', 'Returning unused corrugated packaging boxes', 2, NULL);

INSERT INTO transfer_items (transfer_id, product_id, quantity) VALUES
(1, 3, 50),
(2, 4, 100),
(3, 13, 200);

-- --------------------------------------------------------------------
-- 13. SEED STOCK MOVEMENTS
-- --------------------------------------------------------------------
INSERT INTO stock_movements (product_id, warehouse_id, movement_type, quantity, reference_type, reference_id, performed_by, notes, timestamp) VALUES
(1, 1, 'INBOUND', 300, 'PO', 'PO-2026-1001', 2, 'Received PO delivery from TechSupply', '2026-08-05 10:15:00'),
(1, 1, 'OUTBOUND', -50, 'SO', 'SO-2026-8001', 2, 'Fulfilled SO for Reliance Logistics', '2026-08-15 11:30:00'),
(3, 1, 'TRANSFER', -50, 'TRANSFER', 'TRF-2026-01', 2, 'Transferred to Mumbai Port Yard', '2026-08-22 14:30:00'),
(3, 3, 'TRANSFER', 50, 'TRANSFER', 'TRF-2026-01', 2, 'Received transfer from Pune Central', '2026-08-22 14:30:00'),
(17, 5, 'OUTBOUND', -10, 'SO', 'SO-2026-8004', 2, 'Dispatched solar batteries to Tata Power', '2026-08-20 16:45:00'),
(5, 1, 'INBOUND', 50, 'PO', 'PO-2026-1007', 2, 'Received motors from Apex Industrial', '2026-08-15 09:20:00');

-- --------------------------------------------------------------------
-- 14. SEED LOW STOCK ALERTS
-- --------------------------------------------------------------------
INSERT INTO low_stock_alerts (alert_id, product_id, warehouse_id, current_stock, reorder_level, severity, status, created_at) VALUES
(1, 18, 1, 2, 3, 'CRITICAL', 'ACTIVE', '2026-09-06 18:22:00'),
(2, 6, 4, 4, 10, 'WARNING', 'ACTIVE', '2026-09-07 08:15:00'),
(3, 17, 4, 8, 5, 'WARNING', 'ACKNOWLEDGED', '2026-09-05 14:10:00');

-- --------------------------------------------------------------------
-- 15. SEED SUPPLIER PERFORMANCE
-- --------------------------------------------------------------------
INSERT INTO supplier_performance (perf_id, supplier_id, evaluation_date, health_score, fulfillment_rate, defect_rate, delivery_lead_time_avg, ranking) VALUES
(1, 10, '2026-09-01', 98, 99.10, 0.20, 3.10, 1),
(2, 1, '2026-09-01', 96, 98.40, 0.40, 4.00, 2),
(3, 8, '2026-09-01', 93, 95.50, 0.80, 6.50, 3),
(4, 2, '2026-09-01', 92, 94.20, 1.10, 7.80, 4),
(5, 4, '2026-09-01', 95, 97.50, 0.50, 9.20, 5),
(6, 6, '2026-09-01', 94, 96.00, 0.60, 2.20, 6),
(7, 7, '2026-09-01', 91, 93.00, 1.20, 4.50, 7),
(8, 3, '2026-09-01', 89, 91.80, 1.50, 4.20, 8),
(9, 5, '2026-09-01', 85, 88.50, 2.10, 5.00, 9),
(10, 9, '2026-09-01', 82, 86.00, 2.80, 6.80, 10);
