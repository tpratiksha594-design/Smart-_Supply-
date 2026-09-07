import {
  Product, Supplier, Warehouse, WarehouseInventory, Category,
  PurchaseOrder, SalesOrder, InventoryTransfer, LowStockAlert,
  StockMovement, AIInsight, User, Role
} from '../types';

export class MockDataStore {
  public roles: Role[] = [
    { role_id: 1, name: 'ADMIN', description: 'Full system administration' },
    { role_id: 2, name: 'WAREHOUSE_MANAGER', description: 'Stock, inventory and transfer control' },
    { role_id: 3, name: 'PROCUREMENT_MANAGER', description: 'Suppliers and purchase orders' },
    { role_id: 4, name: 'SALES_MANAGER', description: 'Customer orders and fulfillment' },
    { role_id: 5, name: 'VIEWER', description: 'Read-only analytics and reports' }
  ];

  public users: (User & { password_hash: string })[] = [
    {
      user_id: 1,
      name: 'Super Admin',
      email: 'admin@supplysync.com',
      password_hash: '$2a$10$e8W/Z8V21N9Nf9h7XyV5xe.5t/0kYF5P5M0rY9.1g0g9uGZ5b7t/m', // Password123!
      role_id: 1,
      role_name: 'ADMIN',
      status: 'ACTIVE'
    },
    {
      user_id: 2,
      name: 'Rajesh Kumar',
      email: 'rajesh.wh@supplysync.com',
      password_hash: '$2a$10$e8W/Z8V21N9Nf9h7XyV5xe.5t/0kYF5P5M0rY9.1g0g9uGZ5b7t/m',
      role_id: 2,
      role_name: 'WAREHOUSE_MANAGER',
      status: 'ACTIVE'
    },
    {
      user_id: 3,
      name: 'Priya Sharma',
      email: 'priya.proc@supplysync.com',
      password_hash: '$2a$10$e8W/Z8V21N9Nf9h7XyV5xe.5t/0kYF5P5M0rY9.1g0g9uGZ5b7t/m',
      role_id: 3,
      role_name: 'PROCUREMENT_MANAGER',
      status: 'ACTIVE'
    }
  ];

  public categories: Category[] = [
    { category_id: 1, name: 'Electronics & Chips', slug: 'electronics-chips', description: 'Semiconductors & processors' },
    { category_id: 2, name: 'Industrial Hardware', slug: 'industrial-hardware', description: 'Motors, valves & heavy tooling' },
    { category_id: 3, name: 'Computer Peripherals', slug: 'computer-peripherals', description: 'Monitors, docks, peripherals' },
    { category_id: 4, name: 'Packaging & Logistics', slug: 'packaging-logistics', description: 'Boxes, bubble wrap, pallets' },
    { category_id: 5, name: 'Power Supplies & Batteries', slug: 'power-batteries', description: 'Li-ion, UPS, solar inverters' }
  ];

  public products: Product[] = [
    { product_id: 1, name: 'Arm Pro-X Microcontroller Unit', sku: 'MCU-PRO-X1', category_id: 1, category_name: 'Electronics & Chips', unit: 'pcs', price: 1250, cost_price: 780, reorder_level: 50, target_stock: 300, image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=300', status: 'ACTIVE', total_quantity: 390, stock_status: 'HEALTHY' },
    { product_id: 2, name: 'Octa-Core Embedded Processor 4GHz', sku: 'PROC-OCTA-04', category_id: 1, category_name: 'Electronics & Chips', unit: 'pcs', price: 8900, cost_price: 6200, reorder_level: 20, target_stock: 150, image_url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=300', status: 'ACTIVE', total_quantity: 130, stock_status: 'HEALTHY' },
    { product_id: 3, name: '512GB NVMe High-Speed SSD Flash', sku: 'SSD-NVME-512', category_id: 1, category_name: 'Electronics & Chips', unit: 'pcs', price: 4500, cost_price: 2900, reorder_level: 30, target_stock: 200, image_url: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=300', status: 'ACTIVE', total_quantity: 210, stock_status: 'HEALTHY' },
    { product_id: 4, name: 'Ultra-Low Latency Wi-Fi 6E Chipset', sku: 'CHIP-WIFI6E', category_id: 1, category_name: 'Electronics & Chips', unit: 'pcs', price: 750, cost_price: 420, reorder_level: 100, target_stock: 500, image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=300', status: 'ACTIVE', total_quantity: 320, stock_status: 'HEALTHY' },
    { product_id: 5, name: 'High-Precision Stepper Motor 24V', sku: 'MOT-STEP-24V', category_id: 2, category_name: 'Industrial Hardware', unit: 'pcs', price: 3200, cost_price: 2100, reorder_level: 15, target_stock: 100, image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300', status: 'ACTIVE', total_quantity: 90, stock_status: 'HEALTHY' },
    { product_id: 6, name: 'Hydraulic Control Valve 3/4 inch', sku: 'VALVE-HYD-075', category_id: 2, category_name: 'Industrial Hardware', unit: 'pcs', price: 5400, cost_price: 3600, reorder_level: 10, target_stock: 80, image_url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=300', status: 'ACTIVE', total_quantity: 46, stock_status: 'HEALTHY' },
    { product_id: 7, name: 'Industrial Grade Bearing Set Assembly', sku: 'BRG-SET-IND', category_id: 2, category_name: 'Industrial Hardware', unit: 'sets', price: 1850, cost_price: 1150, reorder_level: 40, target_stock: 250, image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300', status: 'ACTIVE', total_quantity: 160, stock_status: 'HEALTHY' },
    { product_id: 8, name: 'Pneumatic Actuator Cylinder 100mm', sku: 'ACT-PNEU-100', category_id: 2, category_name: 'Industrial Hardware', unit: 'pcs', price: 7800, cost_price: 5200, reorder_level: 8, target_stock: 50, image_url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=300', status: 'ACTIVE', total_quantity: 28, stock_status: 'HEALTHY' },
    { product_id: 9, name: '27-inch 4K UHD IPS Docking Monitor', sku: 'MON-4K-27D', category_id: 3, category_name: 'Computer Peripherals', unit: 'pcs', price: 28900, cost_price: 19500, reorder_level: 12, target_stock: 60, image_url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300', status: 'ACTIVE', total_quantity: 55, stock_status: 'HEALTHY' },
    { product_id: 10, name: 'Ergonomic Wireless Mechanical Keyboard', sku: 'KB-MECH-WRL', category_id: 3, category_name: 'Computer Peripherals', unit: 'pcs', price: 4200, cost_price: 2400, reorder_level: 25, target_stock: 150, image_url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300', status: 'ACTIVE', total_quantity: 135, stock_status: 'HEALTHY' },
    { product_id: 11, name: 'Precision Optical Gaming Mouse 26K DPI', sku: 'MSE-OPT-26K', category_id: 3, category_name: 'Computer Peripherals', unit: 'pcs', price: 2100, cost_price: 1200, reorder_level: 35, target_stock: 200, image_url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300', status: 'ACTIVE', total_quantity: 195, stock_status: 'HEALTHY' },
    { product_id: 12, name: 'Thunderbolt 4 Multi-Port Docking Station', sku: 'DOCK-TB4-MP', category_id: 3, category_name: 'Computer Peripherals', unit: 'pcs', price: 12500, cost_price: 8200, reorder_level: 15, target_stock: 80, image_url: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=300', status: 'ACTIVE', total_quantity: 40, stock_status: 'HEALTHY' },
    { product_id: 13, name: 'Heavy Duty Corrugated Box 50x40x30cm', sku: 'BOX-CORR-HD', category_id: 4, category_name: 'Packaging & Logistics', unit: 'packs', price: 450, cost_price: 220, reorder_level: 200, target_stock: 1500, image_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=300', status: 'ACTIVE', total_quantity: 1450, stock_status: 'HEALTHY' },
    { product_id: 14, name: 'Biodegradable Bubble Cushion Wrap 100m', sku: 'WRAP-BUBB-100', category_id: 4, category_name: 'Packaging & Logistics', unit: 'rolls', price: 1200, cost_price: 680, reorder_level: 50, target_stock: 300, image_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=300', status: 'ACTIVE', total_quantity: 180, stock_status: 'HEALTHY' },
    { product_id: 15, name: 'Euro Standard Wooden Pallet 120x80cm', sku: 'PALLET-EURO-WD', category_id: 4, category_name: 'Packaging & Logistics', unit: 'pcs', price: 1800, cost_price: 950, reorder_level: 40, target_stock: 200, image_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=300', status: 'ACTIVE', total_quantity: 180, stock_status: 'HEALTHY' },
    { product_id: 16, name: 'Automatic Polypropylene Strapping Machine', sku: 'MACH-STRAP-PP', category_id: 4, category_name: 'Packaging & Logistics', unit: 'unit', price: 45000, cost_price: 31000, reorder_level: 2, target_stock: 10, image_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=300', status: 'ACTIVE', total_quantity: 6, stock_status: 'HEALTHY' },
    { product_id: 17, name: '48V 100Ah Lithium Iron Phosphate Battery', sku: 'BAT-LFP-48V', category_id: 5, category_name: 'Power Supplies & Batteries', unit: 'unit', price: 64000, cost_price: 45000, reorder_level: 5, target_stock: 30, image_url: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=300', status: 'ACTIVE', total_quantity: 35, stock_status: 'HEALTHY' },
    { product_id: 18, name: 'Online Double Conversion UPS 10kVA', sku: 'UPS-10KVA-IND', category_id: 5, category_name: 'Power Supplies & Batteries', unit: 'unit', price: 88000, cost_price: 61000, reorder_level: 3, target_stock: 15, image_url: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=300', status: 'ACTIVE', total_quantity: 2, stock_status: 'CRITICAL' },
    { product_id: 19, name: 'Pure Sine Wave Solar Inverter 5kW', sku: 'INV-SOLAR-5KW', category_id: 5, category_name: 'Power Supplies & Batteries', unit: 'unit', price: 38000, cost_price: 26000, reorder_level: 8, target_stock: 40, image_url: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=300', status: 'ACTIVE', total_quantity: 22, stock_status: 'HEALTHY' },
    { product_id: 20, name: 'Industrial Lithium Battery Management System', sku: 'BMS-IND-48V', category_id: 5, category_name: 'Power Supplies & Batteries', unit: 'pcs', price: 6500, cost_price: 4100, reorder_level: 20, target_stock: 100, image_url: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=300', status: 'ACTIVE', total_quantity: 80, stock_status: 'HEALTHY' },
    { product_id: 21, name: 'Smart IoT Temperature & Humidity Sensor', sku: 'SENS-IOT-TH', category_id: 1, category_name: 'Electronics & Chips', unit: 'pcs', price: 1400, cost_price: 850, reorder_level: 40, target_stock: 250, image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=300', status: 'ACTIVE', total_quantity: 180, stock_status: 'HEALTHY' },
    { product_id: 22, name: 'Automated Guided Vehicle (AGV) Wheel Motor', sku: 'AGV-MTR-100W', category_id: 2, category_name: 'Industrial Hardware', unit: 'pcs', price: 14500, cost_price: 9800, reorder_level: 6, target_stock: 25, image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300', status: 'ACTIVE', total_quantity: 14, stock_status: 'HEALTHY' },
    { product_id: 23, name: 'High-Density Barcode Handheld Scanner', sku: 'SCN-BAR-HD', category_id: 3, category_name: 'Computer Peripherals', unit: 'pcs', price: 4900, cost_price: 2900, reorder_level: 15, target_stock: 80, image_url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300', status: 'ACTIVE', total_quantity: 50, stock_status: 'HEALTHY' },
    { product_id: 24, name: 'Thermal Transfer Shipping Label Printer', sku: 'PRNT-LBL-TT', category_id: 3, category_name: 'Computer Peripherals', unit: 'pcs', price: 18500, cost_price: 12400, reorder_level: 8, target_stock: 35, image_url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300', status: 'ACTIVE', total_quantity: 18, stock_status: 'HEALTHY' },
    { product_id: 25, name: 'Smart Logistics GPS Tracking Tag Module', sku: 'TAG-GPS-LOG', category_id: 1, category_name: 'Electronics & Chips', unit: 'pcs', price: 2200, cost_price: 1350, reorder_level: 50, target_stock: 400, image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=300', status: 'ACTIVE', total_quantity: 210, stock_status: 'HEALTHY' }
  ];

  public suppliers: Supplier[] = [
    { supplier_id: 1, name: 'TechSupply India Pvt Ltd', contact_person: 'Vikramaditya Roy', email: 'contact@techsupply.in', phone: '+91 98200 11223', address: 'Plot 42, Electronic City Phase 1, Bengaluru', rating: 4.90, on_time_delivery_rate: 98.4, quality_score: 96, status: 'PREFERRED', total_orders: 14 },
    { supplier_id: 2, name: 'Global Logistics & Hardware Components', contact_person: 'Sarah Jenkins', email: 'orders@globallogistics.com', phone: '+1 408 555 0199', address: '104 Tech Boulevard, San Jose, CA, USA', rating: 4.75, on_time_delivery_rate: 94.2, quality_score: 92, status: 'PREFERRED', total_orders: 11 },
    { supplier_id: 3, name: 'SmartParts Electronics Ltd', contact_person: 'Rohan Mehta', email: 'support@smartparts.co.in', phone: '+91 98111 44556', address: 'Sector 62, Industrial Area, Noida, UP', rating: 4.60, on_time_delivery_rate: 91.8, quality_score: 89, status: 'ACTIVE', total_orders: 8 },
    { supplier_id: 4, name: 'Nexus Power Systems Inc', contact_person: 'David Chen', email: 'sales@nexuspower.com', phone: '+886 2 2700 8899', address: 'Hsinchu Science Park, Hsinchu, Taiwan', rating: 4.85, on_time_delivery_rate: 97.5, quality_score: 95, status: 'PREFERRED', total_orders: 9 },
    { supplier_id: 5, name: 'Apex Industrial Motors & Automation', contact_person: 'Sanjay Deshmukh', email: 'info@apexindustrial.in', phone: '+91 97690 33445', address: 'MIDC Industrial Zone, Bhosari, Pune', rating: 4.40, on_time_delivery_rate: 88.5, quality_score: 85, status: 'ACTIVE', total_orders: 6 },
    { supplier_id: 6, name: 'EcoPack Materials & Containers', contact_person: 'Anita Nair', email: 'anita@ecopack.in', phone: '+91 94470 66778', address: 'Kalamassery Industrial Estate, Kochi, Kerala', rating: 4.70, on_time_delivery_rate: 96.0, quality_score: 94, status: 'ACTIVE', total_orders: 12 },
    { supplier_id: 7, name: 'OmniSens IoT Technologies', contact_person: 'Marcus Vance', email: 'mvance@omnisens.de', phone: '+49 89 4110 9900', address: 'Siemensstrasse 12, Munich, Germany', rating: 4.65, on_time_delivery_rate: 93.0, quality_score: 91, status: 'ACTIVE', total_orders: 5 },
    { supplier_id: 8, name: 'Vanguard Batteries & Energy Corp', contact_person: 'Kavita Patel', email: 'sales@vanguardenergy.in', phone: '+91 98980 22334', address: 'GIDC Estate, Makarpura, Vadodara, Gujarat', rating: 4.80, on_time_delivery_rate: 95.5, quality_score: 93, status: 'PREFERRED', total_orders: 7 },
    { supplier_id: 9, name: 'Precision Hydraulics & Valves', contact_person: 'Gaurav Joshi', email: 'gjoshi@precisionhyd.com', phone: '+91 93220 88776', address: 'Peenya Industrial Area, Bengaluru', rating: 4.30, on_time_delivery_rate: 86.0, quality_score: 82, status: 'UNDER_REVIEW', total_orders: 4 },
    { supplier_id: 10, name: 'Quantum Chipsets & Semiconductor Ltd', contact_person: 'Kenji Sato', email: 'sato@quantumchips.jp', phone: '+81 3 5555 1234', address: 'Akihabara Tech Plaza, Tokyo, Japan', rating: 4.95, on_time_delivery_rate: 99.1, quality_score: 98, status: 'PREFERRED', total_orders: 16 }
  ];

  public warehouses: Warehouse[] = [
    { warehouse_id: 1, name: 'Pune Central Logistics Hub', code: 'WH-PNE-01', location: 'Chakan Industrial Hub, Pune, MH', total_capacity: 25000, current_utilization_pct: 82.5, inventory_value: 12450000, status: 'OPERATIONAL', unique_sku_count: 9, stored_units: 1459 },
    { warehouse_id: 2, name: 'Bengaluru Tech Fulfillment Center', code: 'WH-BLR-02', location: 'Whitefield Industrial Zone, Bengaluru, KA', total_capacity: 20000, current_utilization_pct: 74.0, inventory_value: 9800000, status: 'OPERATIONAL', unique_sku_count: 9, stored_units: 1120 },
    { warehouse_id: 3, name: 'Mumbai Sea Port Transit Yard', code: 'WH-BOM-03', location: 'Nhava Sheva, Navi Mumbai, MH', total_capacity: 35000, current_utilization_pct: 68.0, inventory_value: 8500000, status: 'OPERATIONAL', unique_sku_count: 8, stored_units: 1088 },
    { warehouse_id: 4, name: 'Delhi NCR Northern Gateway Hub', code: 'WH-DEL-04', location: 'Gurugram Expressway Zone 4, HR', total_capacity: 18000, current_utilization_pct: 89.2, inventory_value: 6400000, status: 'OPERATIONAL', unique_sku_count: 7, stored_units: 191 },
    { warehouse_id: 5, name: 'Ahmedabad Solar & Energy Logistics', code: 'WH-AMD-05', location: 'Sanand Industrial Estate, Ahmedabad, GJ', total_capacity: 15000, current_utilization_pct: 52.0, inventory_value: 3900000, status: 'OPERATIONAL', unique_sku_count: 5, stored_units: 140 }
  ];

  public warehouseInventory: WarehouseInventory[] = [
    { warehouse_id: 1, product_id: 1, quantity: 240, reserved_quantity: 20, available_quantity: 220, zone_location: 'Zone A-01' },
    { warehouse_id: 1, product_id: 2, quantity: 45, reserved_quantity: 5, available_quantity: 40, zone_location: 'Zone A-02' },
    { warehouse_id: 1, product_id: 3, quantity: 120, reserved_quantity: 15, available_quantity: 105, zone_location: 'Zone A-03' },
    { warehouse_id: 1, product_id: 5, quantity: 65, reserved_quantity: 8, available_quantity: 57, zone_location: 'Zone B-01' },
    { warehouse_id: 1, product_id: 6, quantity: 42, reserved_quantity: 4, available_quantity: 38, zone_location: 'Zone B-02' },
    { warehouse_id: 1, product_id: 9, quantity: 25, reserved_quantity: 2, available_quantity: 23, zone_location: 'Zone C-01' },
    { warehouse_id: 1, product_id: 13, quantity: 850, reserved_quantity: 50, available_quantity: 800, zone_location: 'Zone D-01' },
    { warehouse_id: 1, product_id: 17, quantity: 12, reserved_quantity: 1, available_quantity: 11, zone_location: 'Zone E-01' },
    { warehouse_id: 1, product_id: 18, quantity: 2, reserved_quantity: 0, available_quantity: 2, zone_location: 'Zone E-02' },

    { warehouse_id: 2, product_id: 1, quantity: 150, reserved_quantity: 10, available_quantity: 140, zone_location: 'Zone A-01' },
    { warehouse_id: 2, product_id: 2, quantity: 85, reserved_quantity: 10, available_quantity: 75, zone_location: 'Zone A-02' },
    { warehouse_id: 2, product_id: 4, quantity: 320, reserved_quantity: 30, available_quantity: 290, zone_location: 'Zone A-03' },
    { warehouse_id: 2, product_id: 9, quantity: 30, reserved_quantity: 5, available_quantity: 25, zone_location: 'Zone B-01' },
    { warehouse_id: 2, product_id: 10, quantity: 95, reserved_quantity: 12, available_quantity: 83, zone_location: 'Zone B-02' },
    { warehouse_id: 2, product_id: 11, quantity: 140, reserved_quantity: 15, available_quantity: 125, zone_location: 'Zone B-03' },

    { warehouse_id: 3, product_id: 3, quantity: 90, reserved_quantity: 10, available_quantity: 80, zone_location: 'Zone A-01' },
    { warehouse_id: 3, product_id: 7, quantity: 160, reserved_quantity: 20, available_quantity: 140, zone_location: 'Zone B-01' },
    { warehouse_id: 3, product_id: 13, quantity: 600, reserved_quantity: 40, available_quantity: 560, zone_location: 'Zone D-01' },
    { warehouse_id: 3, product_id: 14, quantity: 180, reserved_quantity: 15, available_quantity: 165, zone_location: 'Zone D-02' },

    { warehouse_id: 4, product_id: 6, quantity: 4, reserved_quantity: 1, available_quantity: 3, zone_location: 'Zone B-02' },
    { warehouse_id: 4, product_id: 17, quantity: 8, reserved_quantity: 2, available_quantity: 6, zone_location: 'Zone E-01' },
    { warehouse_id: 4, product_id: 18, quantity: 5, reserved_quantity: 1, available_quantity: 4, zone_location: 'Zone E-02' },

    { warehouse_id: 5, product_id: 17, quantity: 15, reserved_quantity: 2, available_quantity: 13, zone_location: 'Zone A-01' },
    { warehouse_id: 5, product_id: 19, quantity: 22, reserved_quantity: 3, available_quantity: 19, zone_location: 'Zone A-03' }
  ];

  public purchaseOrders: PurchaseOrder[] = [
    { po_id: 1, po_number: 'PO-2026-1001', supplier_id: 1, supplier_name: 'TechSupply India Pvt Ltd', warehouse_id: 1, warehouse_name: 'Pune Central Logistics Hub', status: 'DELIVERED', total_amount: 234000, order_date: '2026-08-01', expected_delivery_date: '2026-08-05' },
    { po_id: 2, po_number: 'PO-2026-1002', supplier_id: 2, supplier_name: 'Global Logistics & Hardware Components', warehouse_id: 2, warehouse_name: 'Bengaluru Tech Fulfillment Center', status: 'SHIPPED', total_amount: 585000, order_date: '2026-08-25', expected_delivery_date: '2026-09-02' },
    { po_id: 3, po_number: 'PO-2026-1003', supplier_id: 4, supplier_name: 'Nexus Power Systems Inc', warehouse_id: 5, warehouse_name: 'Ahmedabad Solar & Energy Logistics', status: 'APPROVED', total_amount: 900000, order_date: '2026-08-28', expected_delivery_date: '2026-09-07' },
    { po_id: 4, po_number: 'PO-2026-1004', supplier_id: 6, supplier_name: 'EcoPack Materials & Containers', warehouse_id: 3, warehouse_name: 'Mumbai Sea Port Transit Yard', status: 'PENDING', total_amount: 110000, order_date: '2026-09-01', expected_delivery_date: '2026-09-04' },
    { po_id: 5, po_number: 'PO-2026-1005', supplier_id: 8, supplier_name: 'Vanguard Batteries & Energy Corp', warehouse_id: 4, warehouse_name: 'Delhi NCR Northern Gateway Hub', status: 'APPROVED', total_amount: 445000, order_date: '2026-09-02', expected_delivery_date: '2026-09-09' }
  ];

  public salesOrders: SalesOrder[] = [
    { so_id: 1, order_number: 'SO-2026-8001', customer_id: 1, customer_name: 'Reliance Logistics Solutions', warehouse_id: 1, warehouse_name: 'Pune Central Logistics Hub', status: 'COMPLETED', total_amount: 145000, order_date: '2026-08-15' },
    { so_id: 2, order_number: 'SO-2026-8002', customer_id: 3, customer_name: 'Mahindra Electric Mobility', warehouse_id: 1, warehouse_name: 'Pune Central Logistics Hub', status: 'PROCESSING', total_amount: 384000, order_date: '2026-08-29' },
    { so_id: 3, order_number: 'SO-2026-8003', customer_id: 2, customer_name: 'Tata Consultancy Services Hardware Div', warehouse_id: 2, warehouse_name: 'Bengaluru Tech Fulfillment Center', status: 'SHIPPED', total_amount: 578000, order_date: '2026-08-30' },
    { so_id: 4, order_number: 'SO-2026-8004', customer_id: 8, customer_name: 'Tata Power Renewable Microgrids', warehouse_id: 5, warehouse_name: 'Ahmedabad Solar & Energy Logistics', status: 'COMPLETED', total_amount: 640000, order_date: '2026-08-20' }
  ];

  public transfers: InventoryTransfer[] = [
    { transfer_id: 1, transfer_number: 'TRF-2026-01', source_warehouse_id: 1, source_warehouse_name: 'Pune Central Logistics Hub', destination_warehouse_id: 3, destination_warehouse_name: 'Mumbai Sea Port Transit Yard', status: 'COMPLETED', notes: 'Urgent stock balancing for export shipments', created_at: '2026-08-22 14:30:00', completed_at: '2026-08-22 14:30:00' },
    { transfer_id: 2, transfer_number: 'TRF-2026-02', source_warehouse_id: 2, source_warehouse_name: 'Bengaluru Tech Fulfillment Center', destination_warehouse_id: 4, destination_warehouse_name: 'Delhi NCR Northern Gateway Hub', status: 'IN_TRANSIT', notes: 'Re-allocating Wi-Fi chips to Delhi NCR Hub', created_at: '2026-09-04 10:15:00' },
    { transfer_id: 3, transfer_number: 'TRF-2026-03', source_warehouse_id: 3, source_warehouse_name: 'Mumbai Sea Port Transit Yard', destination_warehouse_id: 1, destination_warehouse_name: 'Pune Central Logistics Hub', status: 'PENDING', notes: 'Returning unused corrugated packaging boxes', created_at: '2026-09-06 16:45:00' }
  ];

  public alerts: LowStockAlert[] = [
    { alert_id: 1, product_id: 18, product_name: 'Online Double Conversion UPS 10kVA', sku: 'UPS-10KVA-IND', warehouse_id: 1, warehouse_name: 'Pune Central Logistics Hub', current_stock: 2, reorder_level: 3, severity: 'CRITICAL', status: 'ACTIVE', created_at: '2026-09-06 18:22:00' },
    { alert_id: 2, product_id: 6, product_name: 'Hydraulic Control Valve 3/4 inch', sku: 'VALVE-HYD-075', warehouse_id: 4, warehouse_name: 'Delhi NCR Northern Gateway Hub', current_stock: 4, reorder_level: 10, severity: 'WARNING', status: 'ACTIVE', created_at: '2026-09-07 08:15:00' },
    { alert_id: 3, product_id: 17, product_name: '48V 100Ah Lithium Iron Phosphate Battery', sku: 'BAT-LFP-48V', warehouse_id: 4, warehouse_name: 'Delhi NCR Northern Gateway Hub', current_stock: 8, reorder_level: 5, severity: 'WARNING', status: 'ACKNOWLEDGED', created_at: '2026-09-05 14:10:00' }
  ];

  public stockMovements: StockMovement[] = [
    { movement_id: 1, product_id: 1, product_name: 'Arm Pro-X Microcontroller Unit', warehouse_id: 1, warehouse_name: 'Pune Central Logistics Hub', movement_type: 'INBOUND', quantity: 300, reference_type: 'PO', reference_id: 'PO-2026-1001', notes: 'Received PO delivery from TechSupply', timestamp: '2026-08-05 10:15:00' },
    { movement_id: 2, product_id: 1, product_name: 'Arm Pro-X Microcontroller Unit', warehouse_id: 1, warehouse_name: 'Pune Central Logistics Hub', movement_type: 'OUTBOUND', quantity: -50, reference_type: 'SO', reference_id: 'SO-2026-8001', notes: 'Fulfilled SO for Reliance Logistics', timestamp: '2026-08-15 11:30:00' },
    { movement_id: 3, product_id: 3, product_name: '512GB NVMe High-Speed SSD Flash', warehouse_id: 1, warehouse_name: 'Pune Central Logistics Hub', movement_type: 'TRANSFER', quantity: -50, reference_type: 'TRANSFER', reference_id: 'TRF-2026-01', notes: 'Transferred to Mumbai Port Yard', timestamp: '2026-08-22 14:30:00' },
    { movement_id: 4, product_id: 3, product_name: '512GB NVMe High-Speed SSD Flash', warehouse_id: 3, warehouse_name: 'Mumbai Sea Port Transit Yard', movement_type: 'TRANSFER', quantity: 50, reference_type: 'TRANSFER', reference_id: 'TRF-2026-01', notes: 'Received transfer from Pune Central', timestamp: '2026-08-22 14:30:00' }
  ];

  public aiInsights: AIInsight[] = [
    {
      id: 'insight-1',
      title: 'Critical Stockout Risk Detected',
      description: 'Inventory for Online Double Conversion UPS 10kVA in Pune Central Hub is at 2 units (Reorder Level: 3). Predicted stockout within 48 hours based on recent demand.',
      category: 'INVENTORY',
      severity: 'HIGH',
      recommended_action: 'Generate Purchase Order for 15 units from Vanguard Batteries immediately.',
      timestamp: 'Just now'
    },
    {
      id: 'insight-2',
      title: 'Supplier Performance Enhancement',
      description: 'Quantum Chipsets Ltd achieved 99.1% on-time delivery rate over the last 30 days (+4.2% QoQ improvement).',
      category: 'SUPPLIER',
      severity: 'LOW',
      recommended_action: 'Consider awarding preferred vendor status for Wi-Fi 6E microchip contracts.',
      timestamp: '10 mins ago'
    },
    {
      id: 'insight-3',
      title: 'Delhi NCR Hub Approaching Capacity',
      description: 'Delhi NCR Northern Gateway Hub capacity utilization reached 89.2% (Target threshold: 85%).',
      category: 'CAPACITY',
      severity: 'MEDIUM',
      recommended_action: 'Initiate stock rebalancing transfer of packaging items to Mumbai Transit Yard.',
      timestamp: '1 hour ago'
    },
    {
      id: 'insight-4',
      title: 'Surge Demand Spike Warning',
      description: 'Demand for 48V Lithium Iron Phosphate Batteries increased 28.5% this month due to renewable grid orders.',
      category: 'DEMAND',
      severity: 'MEDIUM',
      recommended_action: 'Increase reorder buffer level from 5 to 12 units in Gujarat & Pune facilities.',
      timestamp: '3 hours ago'
    }
  ];
}

export const mockStore = new MockDataStore();
