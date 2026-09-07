-- ====================================================================
-- SUPPLYSYNC DATABASE SCHEMA
-- Smart Supply Chain & Inventory Intelligence Platform
-- Target DBMS: MySQL 8.0+
-- Standard 3NF Compliance with PKs, FKs, Indexes, Triggers, Views & Procedures
-- ====================================================================

CREATE DATABASE IF NOT EXISTS supplysync_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE supplysync_db;

-- Disable Foreign Key Checks during setup
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS supplier_performance;
DROP TABLE IF EXISTS low_stock_alerts;
DROP TABLE IF EXISTS transfer_items;
DROP TABLE IF EXISTS inventory_transfers;
DROP TABLE IF EXISTS stock_movements;
DROP TABLE IF EXISTS sales_order_items;
DROP TABLE IF EXISTS sales_orders;
DROP TABLE IF EXISTS purchase_order_items;
DROP TABLE IF EXISTS purchase_orders;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS warehouse_inventory;
DROP TABLE IF EXISTS warehouses;
DROP TABLE IF EXISTS supplier_products;
DROP TABLE IF EXISTS suppliers;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;

SET FOREIGN_KEY_CHECKS = 1;

-- --------------------------------------------------------------------
-- 1. ROLES TABLE
-- --------------------------------------------------------------------
CREATE TABLE roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- --------------------------------------------------------------------
-- 2. USERS TABLE
-- --------------------------------------------------------------------
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    status ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- --------------------------------------------------------------------
-- 3. CATEGORIES TABLE
-- --------------------------------------------------------------------
CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- --------------------------------------------------------------------
-- 4. PRODUCTS TABLE
-- --------------------------------------------------------------------
CREATE TABLE products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    sku VARCHAR(50) NOT NULL UNIQUE,
    category_id INT NOT NULL,
    unit VARCHAR(20) DEFAULT 'pcs',
    price DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    cost_price DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    reorder_level INT NOT NULL DEFAULT 10,
    target_stock INT NOT NULL DEFAULT 100,
    image_url VARCHAR(500),
    status ENUM('ACTIVE', 'DISCONTINUED', 'OUT_OF_STOCK') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE RESTRICT,
    INDEX idx_products_sku (sku),
    INDEX idx_products_category (category_id)
) ENGINE=InnoDB;

-- --------------------------------------------------------------------
-- 5. SUPPLIERS TABLE
-- --------------------------------------------------------------------
CREATE TABLE suppliers (
    supplier_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    contact_person VARCHAR(100),
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(30),
    address TEXT,
    rating DECIMAL(3, 2) DEFAULT 5.00,
    on_time_delivery_rate DECIMAL(5, 2) DEFAULT 95.00,
    quality_score INT DEFAULT 95,
    status ENUM('ACTIVE', 'PREFERRED', 'UNDER_REVIEW', 'INACTIVE') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_suppliers_rating (rating)
) ENGINE=InnoDB;

-- --------------------------------------------------------------------
-- 6. SUPPLIER_PRODUCTS (Junction Table)
-- --------------------------------------------------------------------
CREATE TABLE supplier_products (
    supplier_id INT NOT NULL,
    product_id INT NOT NULL,
    lead_time_days INT DEFAULT 5,
    supplier_price DECIMAL(12, 2) NOT NULL,
    PRIMARY KEY (supplier_id, product_id),
    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- --------------------------------------------------------------------
-- 7. WAREHOUSES TABLE
-- --------------------------------------------------------------------
CREATE TABLE warehouses (
    warehouse_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    code VARCHAR(30) NOT NULL UNIQUE,
    location VARCHAR(200) NOT NULL,
    total_capacity INT NOT NULL DEFAULT 10000,
    current_utilization_pct DECIMAL(5, 2) DEFAULT 0.00,
    inventory_value DECIMAL(14, 2) DEFAULT 0.00,
    status ENUM('OPERATIONAL', 'MAINTENANCE', 'FULL') DEFAULT 'OPERATIONAL',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_warehouses_code (code)
) ENGINE=InnoDB;

-- --------------------------------------------------------------------
-- 8. WAREHOUSE_INVENTORY TABLE
-- --------------------------------------------------------------------
CREATE TABLE warehouse_inventory (
    warehouse_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    reserved_quantity INT NOT NULL DEFAULT 0,
    available_quantity INT GENERATED ALWAYS AS (quantity - reserved_quantity) STORED,
    zone_location VARCHAR(50) DEFAULT 'Zone A',
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (warehouse_id, product_id),
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(warehouse_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    INDEX idx_wh_inv_qty (quantity)
) ENGINE=InnoDB;

-- --------------------------------------------------------------------
-- 9. CUSTOMERS TABLE
-- --------------------------------------------------------------------
CREATE TABLE customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(30),
    company VARCHAR(150),
    address TEXT,
    city VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- --------------------------------------------------------------------
-- 10. PURCHASE_ORDERS TABLE
-- --------------------------------------------------------------------
CREATE TABLE purchase_orders (
    po_id INT AUTO_INCREMENT PRIMARY KEY,
    po_number VARCHAR(50) NOT NULL UNIQUE,
    supplier_id INT NOT NULL,
    warehouse_id INT NOT NULL,
    status ENUM('PENDING', 'APPROVED', 'SHIPPED', 'DELIVERED', 'CANCELLED') DEFAULT 'PENDING',
    total_amount DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
    order_date DATE NOT NULL,
    expected_delivery_date DATE,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id) ON DELETE RESTRICT,
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(warehouse_id) ON DELETE RESTRICT,
    FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_po_status (status)
) ENGINE=InnoDB;

-- --------------------------------------------------------------------
-- 11. PURCHASE_ORDER_ITEMS TABLE
-- --------------------------------------------------------------------
CREATE TABLE purchase_order_items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    po_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity_ordered INT NOT NULL,
    quantity_received INT DEFAULT 0,
    unit_cost DECIMAL(12, 2) NOT NULL,
    subtotal DECIMAL(14, 2) GENERATED ALWAYS AS (quantity_ordered * unit_cost) STORED,
    FOREIGN KEY (po_id) REFERENCES purchase_orders(po_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- --------------------------------------------------------------------
-- 12. SALES_ORDERS TABLE
-- --------------------------------------------------------------------
CREATE TABLE sales_orders (
    so_id INT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    customer_id INT NOT NULL,
    warehouse_id INT NOT NULL,
    status ENUM('PENDING', 'PROCESSING', 'SHIPPED', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING',
    total_amount DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
    order_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE RESTRICT,
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(warehouse_id) ON DELETE RESTRICT,
    INDEX idx_so_status (status)
) ENGINE=InnoDB;

-- --------------------------------------------------------------------
-- 13. SALES_ORDER_ITEMS TABLE
-- --------------------------------------------------------------------
CREATE TABLE sales_order_items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    so_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(12, 2) NOT NULL,
    subtotal DECIMAL(14, 2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    FOREIGN KEY (so_id) REFERENCES sales_orders(so_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- --------------------------------------------------------------------
-- 14. STOCK_MOVEMENTS TABLE
-- --------------------------------------------------------------------
CREATE TABLE stock_movements (
    movement_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    warehouse_id INT NOT NULL,
    movement_type ENUM('INBOUND', 'OUTBOUND', 'TRANSFER', 'ADJUSTMENT') NOT NULL,
    quantity INT NOT NULL,
    reference_type VARCHAR(50),
    reference_id VARCHAR(50),
    performed_by INT,
    notes TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(warehouse_id) ON DELETE CASCADE,
    FOREIGN KEY (performed_by) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_stock_mov_product (product_id),
    INDEX idx_stock_mov_time (timestamp)
) ENGINE=InnoDB;

-- --------------------------------------------------------------------
-- 15. INVENTORY_TRANSFERS TABLE
-- --------------------------------------------------------------------
CREATE TABLE inventory_transfers (
    transfer_id INT AUTO_INCREMENT PRIMARY KEY,
    transfer_number VARCHAR(50) NOT NULL UNIQUE,
    source_warehouse_id INT NOT NULL,
    destination_warehouse_id INT NOT NULL,
    status ENUM('PENDING', 'IN_TRANSIT', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING',
    notes TEXT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (source_warehouse_id) REFERENCES warehouses(warehouse_id) ON DELETE RESTRICT,
    FOREIGN KEY (destination_warehouse_id) REFERENCES warehouses(warehouse_id) ON DELETE RESTRICT,
    FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- --------------------------------------------------------------------
-- 16. TRANSFER_ITEMS TABLE
-- --------------------------------------------------------------------
CREATE TABLE transfer_items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    transfer_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    FOREIGN KEY (transfer_id) REFERENCES inventory_transfers(transfer_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- --------------------------------------------------------------------
-- 17. LOW_STOCK_ALERTS TABLE
-- --------------------------------------------------------------------
CREATE TABLE low_stock_alerts (
    alert_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    warehouse_id INT NOT NULL,
    current_stock INT NOT NULL,
    reorder_level INT NOT NULL,
    severity ENUM('CRITICAL', 'WARNING') NOT NULL DEFAULT 'WARNING',
    status ENUM('ACTIVE', 'RESOLVED', 'ACKNOWLEDGED') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(warehouse_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- --------------------------------------------------------------------
-- 18. SUPPLIER_PERFORMANCE TABLE
-- --------------------------------------------------------------------
CREATE TABLE supplier_performance (
    perf_id INT AUTO_INCREMENT PRIMARY KEY,
    supplier_id INT NOT NULL,
    evaluation_date DATE NOT NULL,
    health_score INT NOT NULL DEFAULT 90,
    fulfillment_rate DECIMAL(5, 2) DEFAULT 95.00,
    defect_rate DECIMAL(5, 2) DEFAULT 0.50,
    delivery_lead_time_avg DECIMAL(5, 2) DEFAULT 4.00,
    ranking INT DEFAULT 1,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ====================================================================
-- VIEWS
-- ====================================================================

-- 1. vw_inventory_overview
CREATE OR REPLACE VIEW vw_inventory_overview AS
SELECT 
    p.product_id,
    p.sku,
    p.name AS product_name,
    c.name AS category_name,
    p.price,
    p.cost_price,
    p.reorder_level,
    COALESCE(SUM(wi.quantity), 0) AS total_quantity,
    COALESCE(SUM(wi.reserved_quantity), 0) AS total_reserved,
    COALESCE(SUM(wi.available_quantity), 0) AS total_available,
    COALESCE(SUM(wi.quantity * p.cost_price), 0) AS total_inventory_value,
    CASE 
        WHEN COALESCE(SUM(wi.quantity), 0) = 0 THEN 'OUT_OF_STOCK'
        WHEN COALESCE(SUM(wi.quantity), 0) <= p.reorder_level THEN 'CRITICAL'
        WHEN COALESCE(SUM(wi.quantity), 0) <= (p.reorder_level * 1.5) THEN 'LOW_STOCK'
        ELSE 'HEALTHY'
    END AS stock_status
FROM products p
JOIN categories c ON p.category_id = c.category_id
LEFT JOIN warehouse_inventory wi ON p.product_id = wi.product_id
GROUP BY p.product_id, p.sku, p.name, c.name, p.price, p.cost_price, p.reorder_level;

-- 2. vw_low_stock_products
CREATE OR REPLACE VIEW vw_low_stock_products AS
SELECT 
    p.product_id,
    p.name AS product_name,
    p.sku,
    c.name AS category_name,
    w.warehouse_id,
    w.name AS warehouse_name,
    wi.quantity AS current_stock,
    p.reorder_level,
    p.target_stock,
    (p.target_stock - wi.quantity) AS suggested_reorder_qty,
    CASE 
        WHEN wi.quantity <= (p.reorder_level / 2) THEN 'CRITICAL'
        ELSE 'WARNING'
    END AS severity
FROM warehouse_inventory wi
JOIN products p ON wi.product_id = p.product_id
JOIN categories c ON p.category_id = c.category_id
JOIN warehouses w ON wi.warehouse_id = w.warehouse_id
WHERE wi.quantity <= p.reorder_level;

-- 3. vw_supplier_performance
CREATE OR REPLACE VIEW vw_supplier_performance AS
SELECT 
    s.supplier_id,
    s.name AS supplier_name,
    s.contact_person,
    s.email,
    s.rating,
    s.on_time_delivery_rate,
    s.quality_score,
    COUNT(po.po_id) AS total_purchase_orders,
    COALESCE(SUM(po.total_amount), 0) AS total_business_val,
    RANK() OVER (ORDER BY s.rating DESC, s.quality_score DESC) AS performance_rank
FROM suppliers s
LEFT JOIN purchase_orders po ON s.supplier_id = po.supplier_id
GROUP BY s.supplier_id, s.name, s.contact_person, s.email, s.rating, s.on_time_delivery_rate, s.quality_score;

-- 4. vw_warehouse_summary
CREATE OR REPLACE VIEW vw_warehouse_summary AS
SELECT 
    w.warehouse_id,
    w.name AS warehouse_name,
    w.code,
    w.location,
    w.total_capacity,
    COALESCE(SUM(wi.quantity), 0) AS stored_units,
    ROUND((COALESCE(SUM(wi.quantity), 0) / w.total_capacity) * 100, 2) AS utilization_percentage,
    COALESCE(SUM(wi.quantity * p.cost_price), 0) AS calculated_inventory_val,
    COUNT(DISTINCT wi.product_id) AS unique_sku_count
FROM warehouses w
LEFT JOIN warehouse_inventory wi ON w.warehouse_id = wi.warehouse_id
LEFT JOIN products p ON wi.product_id = p.product_id
GROUP BY w.warehouse_id, w.name, w.code, w.location, w.total_capacity;

-- 5. vw_sales_analytics
CREATE OR REPLACE VIEW vw_sales_analytics AS
SELECT 
    so.so_id,
    so.order_number,
    c.name AS customer_name,
    w.name AS fulfilled_from_warehouse,
    so.total_amount,
    so.status,
    so.order_date
FROM sales_orders so
JOIN customers c ON so.customer_id = c.customer_id
JOIN warehouses w ON so.warehouse_id = w.warehouse_id;

-- ====================================================================
-- STORED PROCEDURES
-- ====================================================================

DELIMITER //

-- Procedure 1: Transfer Inventory with Transaction Safety
CREATE PROCEDURE sp_transfer_inventory(
    IN p_source_warehouse INT,
    IN p_dest_warehouse INT,
    IN p_product_id INT,
    IN p_quantity INT,
    IN p_user_id INT,
    IN p_notes TEXT,
    OUT p_transfer_id INT
)
proc_label: BEGIN
    DECLARE v_available INT;
    DECLARE v_transfer_num VARCHAR(50);
    
    -- Error Handler for Automatic Rollback
    DECLARE EXIT HANDLER FOR SQLEXCEPTIONS
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    -- Check source inventory
    SELECT available_quantity INTO v_available
    FROM warehouse_inventory
    WHERE warehouse_id = p_source_warehouse AND product_id = p_product_id
    FOR UPDATE;

    IF v_available IS NULL OR v_available < p_quantity THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Insufficient stock in source warehouse for transfer';
    END IF;

    -- Generate Transfer Number
    SET v_transfer_num = CONCAT('TRF-', UNIX_TIMESTAMP(), '-', FLOOR(RAND() * 1000));

    -- Create Transfer Header
    INSERT INTO inventory_transfers (transfer_number, source_warehouse_id, destination_warehouse_id, status, notes, created_by, completed_at)
    VALUES (v_transfer_num, p_source_warehouse, p_dest_warehouse, 'COMPLETED', p_notes, p_user_id, NOW());
    
    SET p_transfer_id = LAST_INSERT_ID();

    -- Create Transfer Item
    INSERT INTO transfer_items (transfer_id, product_id, quantity)
    VALUES (p_transfer_id, p_product_id, p_quantity);

    -- Deduct from Source Warehouse
    UPDATE warehouse_inventory
    SET quantity = quantity - p_quantity
    WHERE warehouse_id = p_source_warehouse AND product_id = p_product_id;

    -- Add to Destination Warehouse (Upsert)
    INSERT INTO warehouse_inventory (warehouse_id, product_id, quantity, zone_location)
    VALUES (p_dest_warehouse, p_product_id, p_quantity, 'Zone A')
    ON DUPLICATE KEY UPDATE quantity = quantity + p_quantity;

    -- Log Outbound Movement
    INSERT INTO stock_movements (product_id, warehouse_id, movement_type, quantity, reference_type, reference_id, performed_by, notes)
    VALUES (p_product_id, p_source_warehouse, 'TRANSFER', -p_quantity, 'TRANSFER', v_transfer_num, p_user_id, CONCAT('Transfer to Warehouse ID: ', p_dest_warehouse));

    -- Log Inbound Movement
    INSERT INTO stock_movements (product_id, warehouse_id, movement_type, quantity, reference_type, reference_id, performed_by, notes)
    VALUES (p_product_id, p_dest_warehouse, 'TRANSFER', p_quantity, 'TRANSFER', v_transfer_num, p_user_id, CONCAT('Transfer from Warehouse ID: ', p_source_warehouse));

    COMMIT;
END //

-- Procedure 2: Create Purchase Order
CREATE PROCEDURE sp_create_purchase_order(
    IN p_supplier_id INT,
    IN p_warehouse_id INT,
    IN p_product_id INT,
    IN p_quantity INT,
    IN p_unit_cost DECIMAL(12,2),
    IN p_created_by INT,
    OUT p_po_id INT
)
BEGIN
    DECLARE v_po_num VARCHAR(50);
    DECLARE v_total DECIMAL(14,2);

    SET v_po_num = CONCAT('PO-', YEAR(CURDATE()), '-', FLOOR(1000 + RAND() * 9000));
    SET v_total = p_quantity * p_unit_cost;

    START TRANSACTION;

    INSERT INTO purchase_orders (po_number, supplier_id, warehouse_id, status, total_amount, order_date, expected_delivery_date, created_by)
    VALUES (v_po_num, p_supplier_id, p_warehouse_id, 'APPROVED', v_total, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 7 DAY), p_created_by);

    SET p_po_id = LAST_INSERT_ID();

    INSERT INTO purchase_order_items (po_id, product_id, quantity_ordered, unit_cost)
    VALUES (p_po_id, p_product_id, p_quantity, p_unit_cost);

    COMMIT;
END //

-- Procedure 3: Get Low Stock Products Report
CREATE PROCEDURE sp_get_low_stock_products()
BEGIN
    SELECT * FROM vw_low_stock_products ORDER BY severity DESC, current_stock ASC;
END //

-- Procedure 4: Calculate & Update Supplier Health Score
CREATE PROCEDURE sp_calculate_supplier_score(IN p_supplier_id INT)
BEGIN
    DECLARE v_rating DECIMAL(3,2);
    DECLARE v_on_time DECIMAL(5,2);
    DECLARE v_quality INT;
    DECLARE v_health INT;

    SELECT rating, on_time_delivery_rate, quality_score
    INTO v_rating, v_on_time, v_quality
    FROM suppliers
    WHERE supplier_id = p_supplier_id;

    SET v_health = ROUND((v_rating / 5.0 * 40) + (v_on_time / 100.0 * 30) + (v_quality / 100.0 * 30));

    INSERT INTO supplier_performance (supplier_id, evaluation_date, health_score, fulfillment_rate, defect_rate, delivery_lead_time_avg)
    VALUES (p_supplier_id, CURDATE(), v_health, v_on_time, (100 - v_quality), 4.2)
    ON DUPLICATE KEY UPDATE health_score = v_health, evaluation_date = CURDATE();
END //

-- Procedure 5: Generate Inventory Executive Summary Report
CREATE PROCEDURE sp_generate_inventory_report()
BEGIN
    SELECT 
        (SELECT COUNT(*) FROM products WHERE status = 'ACTIVE') AS total_active_products,
        (SELECT COALESCE(SUM(quantity * p.cost_price), 0) FROM warehouse_inventory wi JOIN products p ON wi.product_id = p.product_id) AS total_valuation,
        (SELECT COUNT(*) FROM vw_low_stock_products) AS low_stock_count,
        (SELECT COUNT(*) FROM warehouses WHERE status = 'OPERATIONAL') AS active_warehouses,
        (SELECT COUNT(*) FROM suppliers WHERE status = 'ACTIVE') AS active_suppliers;
END //

DELIMITER ;

-- ====================================================================
-- TRIGGERS
-- ====================================================================

DELIMITER //

-- Trigger 1: Auto-generate low stock alert when warehouse inventory drops
CREATE TRIGGER trg_check_low_stock_after_update
AFTER UPDATE ON warehouse_inventory
FOR EACH ROW
BEGIN
    DECLARE v_reorder INT;
    DECLARE v_severity VARCHAR(20);

    SELECT reorder_level INTO v_reorder
    FROM products
    WHERE product_id = NEW.product_id;

    IF NEW.quantity <= v_reorder THEN
        IF NEW.quantity <= (v_reorder / 2) THEN
            SET v_severity = 'CRITICAL';
        ELSE
            SET v_severity = 'WARNING';
        END IF;

        INSERT INTO low_stock_alerts (product_id, warehouse_id, current_stock, reorder_level, severity, status)
        VALUES (NEW.product_id, NEW.warehouse_id, NEW.quantity, v_reorder, v_severity, 'ACTIVE')
        ON DUPLICATE KEY UPDATE current_stock = NEW.quantity, severity = v_severity, status = 'ACTIVE';
    END IF;
END //

DELIMITER ;
