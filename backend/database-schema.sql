-- ============================================
-- FlexiTip Database Schema - MySQL
-- ============================================
-- Database: flexitip
-- Version: 1.0
-- Created: 2025-11-30
-- ============================================

-- Drop tables if exist (untuk development/testing)
-- Uncomment jika ingin reset database
-- DROP TABLE IF EXISTS messages;
-- DROP TABLE IF EXISTS chats;
-- DROP TABLE IF EXISTS orders;
-- DROP TABLE IF EXISTS products;
-- DROP TABLE IF EXISTS jastip_services;
-- DROP TABLE IF EXISTS users;

-- ============================================
-- Table: users
-- Description: User accounts, authentication, profiles
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  googleId VARCHAR(100) UNIQUE,
  isVerified BOOLEAN DEFAULT FALSE,
  phone VARCHAR(20),
  birthdate DATE,
  avatar VARCHAR(500),
  role ENUM('user', 'admin') DEFAULT 'user',
  isJastiper BOOLEAN DEFAULT FALSE,
  
  -- Jastip Profile (JSON)
  jastipProfile JSON DEFAULT (JSON_OBJECT(
    'rating', 0,
    'totalTrips', 0,
    'verificationStatus', 'unverified',
    'verificationDocuments', JSON_ARRAY()
  )),
  
  -- Addresses (JSON Array)
  addresses JSON DEFAULT (JSON_ARRAY()),
  
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_email (email),
  INDEX idx_googleId (googleId),
  INDEX idx_isJastiper (isJastiper),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: jastip_services
-- Description: Jastip service listings
-- ============================================
CREATE TABLE IF NOT EXISTS jastip_services (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  jastiperId CHAR(36) NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  type ENUM('local', 'global') NOT NULL,
  origin VARCHAR(100) NOT NULL,
  destination VARCHAR(100) NOT NULL,
  departureDate DATETIME NOT NULL,
  arrivalDate DATETIME,
  
  -- Capacity in KG
  capacity DECIMAL(10,2) NOT NULL,
  availableCapacity DECIMAL(10,2) NOT NULL,
  
  -- Pricing
  pricePerKg DECIMAL(10,2) NOT NULL,
  serviceFee DECIMAL(10,2) DEFAULT 0,
  
  -- Status
  status ENUM('active', 'full', 'closed', 'completed') DEFAULT 'active',
  
  -- JSON fields
  categories JSON DEFAULT (JSON_ARRAY()),
  restrictions JSON DEFAULT (JSON_ARRAY()),
  images JSON DEFAULT (JSON_ARRAY()),
  
  -- Rating
  rating DECIMAL(3,2) DEFAULT 0.00,
  totalRatings INT DEFAULT 0,
  
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Foreign Keys
  FOREIGN KEY (jastiperId) REFERENCES users(id) ON DELETE CASCADE,
  
  -- Indexes
  INDEX idx_jastiperId (jastiperId),
  INDEX idx_type (type),
  INDEX idx_status (status),
  INDEX idx_departureDate (departureDate),
  INDEX idx_destination (destination),
  INDEX idx_rating (rating)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: products
-- Description: Products available in jastip services
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  jastipServiceId CHAR(36) NOT NULL,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  brand VARCHAR(100),
  
  -- Pricing
  price DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'IDR',
  
  -- Weight in KG
  estimatedWeight DECIMAL(10,2),
  
  -- JSON fields
  images JSON DEFAULT (JSON_ARRAY()),
  variants JSON DEFAULT (JSON_ARRAY()),
  specifications JSON DEFAULT (JSON_OBJECT()),
  
  -- Stock
  stock INT DEFAULT 0,
  status ENUM('available', 'out_of_stock', 'discontinued') DEFAULT 'available',
  
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Foreign Keys
  FOREIGN KEY (jastipServiceId) REFERENCES jastip_services(id) ON DELETE CASCADE,
  
  -- Indexes
  INDEX idx_jastipServiceId (jastipServiceId),
  INDEX idx_category (category),
  INDEX idx_status (status),
  INDEX idx_brand (brand)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: orders
-- Description: Order transactions
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  orderNumber VARCHAR(50) UNIQUE NOT NULL,
  
  -- User references
  customerId CHAR(36) NOT NULL,
  jastiperId CHAR(36) NOT NULL,
  jastipServiceId CHAR(36) NOT NULL,
  
  -- Order details (JSON)
  items JSON NOT NULL,
  shippingAddress JSON NOT NULL,
  shippingMethod VARCHAR(50),
  
  -- Pricing breakdown (JSON)
  pricing JSON NOT NULL DEFAULT (JSON_OBJECT(
    'itemsTotal', 0,
    'shippingCost', 0,
    'serviceFee', 0,
    'tax', 0,
    'total', 0
  )),
  
  -- Status
  orderStatus ENUM(
    'pending',
    'confirmed',
    'purchased',
    'shipping',
    'delivered',
    'completed',
    'cancelled'
  ) DEFAULT 'pending',
  
  paymentStatus ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
  paymentMethod VARCHAR(50),
  paymentProof VARCHAR(500),
  
  -- History & tracking
  statusHistory JSON DEFAULT (JSON_ARRAY()),
  trackingNumber VARCHAR(100),
  
  -- Notes
  notes TEXT,
  cancellationReason TEXT,
  
  -- Rating (JSON)
  rating JSON,
  
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Foreign Keys
  FOREIGN KEY (customerId) REFERENCES users(id) ON DELETE RESTRICT,
  FOREIGN KEY (jastiperId) REFERENCES users(id) ON DELETE RESTRICT,
  FOREIGN KEY (jastipServiceId) REFERENCES jastip_services(id) ON DELETE RESTRICT,
  
  -- Indexes
  INDEX idx_orderNumber (orderNumber),
  INDEX idx_customerId (customerId),
  INDEX idx_jastiperId (jastiperId),
  INDEX idx_jastipServiceId (jastipServiceId),
  INDEX idx_orderStatus (orderStatus),
  INDEX idx_paymentStatus (paymentStatus),
  INDEX idx_createdAt (createdAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: chats
-- Description: Chat rooms between users
-- ============================================
CREATE TABLE IF NOT EXISTS chats (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  jastipServiceId CHAR(36),
  
  -- Participants (JSON array of user IDs)
  participants JSON NOT NULL,
  
  -- Last message reference
  lastMessageId CHAR(36),
  
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Foreign Keys
  FOREIGN KEY (jastipServiceId) REFERENCES jastip_services(id) ON DELETE SET NULL,
  
  -- Indexes
  INDEX idx_jastipServiceId (jastipServiceId),
  INDEX idx_updatedAt (updatedAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: messages
-- Description: Chat messages
-- ============================================
CREATE TABLE IF NOT EXISTS messages (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  chatId CHAR(36) NOT NULL,
  senderId CHAR(36) NOT NULL,
  content TEXT NOT NULL,
  type ENUM('text', 'image', 'file', 'location') DEFAULT 'text',
  
  -- Attachments (JSON)
  attachments JSON DEFAULT (JSON_ARRAY()),
  
  -- Read status
  isRead BOOLEAN DEFAULT FALSE,
  readAt TIMESTAMP NULL,
  
  -- Metadata (JSON)
  metadata JSON DEFAULT (JSON_OBJECT()),
  
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Foreign Keys
  FOREIGN KEY (chatId) REFERENCES chats(id) ON DELETE CASCADE,
  FOREIGN KEY (senderId) REFERENCES users(id) ON DELETE RESTRICT,
  
  -- Indexes
  INDEX idx_chatId (chatId),
  INDEX idx_senderId (senderId),
  INDEX idx_isRead (isRead),
  INDEX idx_createdAt (createdAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Sample Data (Optional - untuk testing)
-- ============================================

-- Insert sample admin user
-- Password: admin123 (hashed dengan bcrypt)
INSERT INTO users (id, name, email, password, role, isVerified) VALUES
(UUID(), 'Admin', 'admin@flexitip.com', '$2a$10$YourHashedPasswordHere', 'admin', TRUE);

-- Insert sample jastiper
INSERT INTO users (id, name, email, password, phone, isJastiper, isVerified) VALUES
(UUID(), 'John Doe', 'jastiper@example.com', '$2a$10$YourHashedPasswordHere', '08123456789', TRUE, TRUE);

-- ============================================
-- Useful Queries for Maintenance
-- ============================================

-- View all tables
-- SHOW TABLES;

-- View table structure
-- DESCRIBE users;
-- DESCRIBE jastip_services;
-- DESCRIBE products;
-- DESCRIBE orders;
-- DESCRIBE chats;
-- DESCRIBE messages;

-- Count records in each table
-- SELECT 'users' AS table_name, COUNT(*) AS total FROM users
-- UNION ALL
-- SELECT 'jastip_services', COUNT(*) FROM jastip_services
-- UNION ALL
-- SELECT 'products', COUNT(*) FROM products
-- UNION ALL
-- SELECT 'orders', COUNT(*) FROM orders
-- UNION ALL
-- SELECT 'chats', COUNT(*) FROM chats
-- UNION ALL
-- SELECT 'messages', COUNT(*) FROM messages;

-- View foreign key relationships
-- SELECT 
--   TABLE_NAME,
--   COLUMN_NAME,
--   CONSTRAINT_NAME,
--   REFERENCED_TABLE_NAME,
--   REFERENCED_COLUMN_NAME
-- FROM
--   INFORMATION_SCHEMA.KEY_COLUMN_USAGE
-- WHERE
--   REFERENCED_TABLE_SCHEMA = 'flexitip'
--   AND REFERENCED_TABLE_NAME IS NOT NULL;

-- ============================================
-- End of Schema
-- ============================================
