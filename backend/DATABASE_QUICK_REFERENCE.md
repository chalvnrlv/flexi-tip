# 🗄️ Database Quick Reference

## Setup Database

### 1. Create Database
```sql
mysql -u root -p

CREATE DATABASE flexitip CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE flexitip;
EXIT;
```

### 2. Import Schema
```bash
mysql -u root -p flexitip < database-schema.sql
```

### 3. Verify Tables
```sql
mysql -u root -p flexitip

SHOW TABLES;
-- Output:
-- +--------------------+
-- | Tables_in_flexitip |
-- +--------------------+
-- | chats              |
-- | jastip_services    |
-- | messages           |
-- | orders             |
-- | products           |
-- | users              |
-- +--------------------+
```

---

## Table Structure

### Check Table Structure
```sql
DESCRIBE users;
DESCRIBE jastip_services;
DESCRIBE products;
DESCRIBE orders;
DESCRIBE chats;
DESCRIBE messages;
```

### View All Relationships
```sql
SELECT 
  CONCAT(TABLE_NAME, '.', COLUMN_NAME) AS 'Foreign Key',
  CONCAT(REFERENCED_TABLE_NAME, '.', REFERENCED_COLUMN_NAME) AS 'References'
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'flexitip'
  AND REFERENCED_TABLE_NAME IS NOT NULL;
```

---

## Common Queries

### Users

```sql
-- Get all jastipers
SELECT id, name, email, phone, 
       JSON_EXTRACT(jastipProfile, '$.rating') AS rating
FROM users
WHERE isJastiper = TRUE;

-- Get user with orders count
SELECT u.id, u.name, u.email,
       COUNT(o.id) AS total_orders
FROM users u
LEFT JOIN orders o ON u.id = o.customerId
GROUP BY u.id;
```

### Jastip Services

```sql
-- Get active services with jastiper info
SELECT js.*, u.name AS jastiper_name, u.phone
FROM jastip_services js
JOIN users u ON js.jastiperId = u.id
WHERE js.status = 'active'
ORDER BY js.departureDate ASC;

-- Get services by destination
SELECT * FROM jastip_services
WHERE destination LIKE '%Singapore%'
  AND status = 'active';
```

### Products

```sql
-- Get products by jastip service
SELECT p.*, js.title AS service_title
FROM products p
JOIN jastip_services js ON p.jastipServiceId = js.id
WHERE js.id = 'SERVICE_ID';

-- Get products by category
SELECT * FROM products
WHERE category = 'Electronics'
  AND status = 'available'
ORDER BY price ASC;
```

### Orders

```sql
-- Get order with full details
SELECT 
  o.*,
  c.name AS customer_name,
  j.name AS jastiper_name,
  s.title AS service_title
FROM orders o
JOIN users c ON o.customerId = c.id
JOIN users j ON o.jastiperId = j.id
JOIN jastip_services s ON o.jastipServiceId = s.id
WHERE o.id = 'ORDER_ID';

-- Get pending orders
SELECT * FROM orders
WHERE orderStatus = 'pending'
ORDER BY createdAt DESC;
```

### Chats & Messages

```sql
-- Get user's chats
SELECT * FROM chats
WHERE JSON_CONTAINS(participants, JSON_QUOTE('USER_ID'));

-- Get chat messages
SELECT m.*, u.name AS sender_name
FROM messages m
JOIN users u ON m.senderId = u.id
WHERE m.chatId = 'CHAT_ID'
ORDER BY m.createdAt ASC;
```

---

## JSON Field Queries

### Query JSON Arrays
```sql
-- Check if user is in chat participants
SELECT * FROM chats
WHERE JSON_CONTAINS(participants, JSON_QUOTE('user-id-here'));

-- Get user addresses
SELECT 
  name,
  JSON_EXTRACT(addresses, '$[0].city') AS city
FROM users
WHERE id = 'USER_ID';
```

### Query JSON Objects
```sql
-- Get jastiper rating
SELECT 
  name,
  JSON_EXTRACT(jastipProfile, '$.rating') AS rating,
  JSON_EXTRACT(jastipProfile, '$.totalTrips') AS trips
FROM users
WHERE isJastiper = TRUE;

-- Get order total
SELECT 
  orderNumber,
  JSON_EXTRACT(pricing, '$.total') AS total_price
FROM orders;
```

---

## Aggregations

### Statistics
```sql
-- Total records per table
SELECT 'users' AS table_name, COUNT(*) AS total FROM users
UNION ALL
SELECT 'jastip_services', COUNT(*) FROM jastip_services
UNION ALL
SELECT 'products', COUNT(*) FROM products
UNION ALL
SELECT 'orders', COUNT(*) FROM orders
UNION ALL
SELECT 'chats', COUNT(*) FROM chats
UNION ALL
SELECT 'messages', COUNT(*) FROM messages;

-- Order statistics by status
SELECT 
  orderStatus,
  COUNT(*) AS total,
  SUM(JSON_EXTRACT(pricing, '$.total')) AS total_revenue
FROM orders
GROUP BY orderStatus;

-- Top destinations
SELECT 
  destination,
  COUNT(*) AS total_services,
  AVG(pricePerKg) AS avg_price
FROM jastip_services
GROUP BY destination
ORDER BY total_services DESC
LIMIT 10;
```

---

## Maintenance

### Reset Database (⚠️ DANGER - Deletes all data!)
```sql
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS chats;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS jastip_services;
DROP TABLE IF EXISTS users;

-- Then re-import schema
SOURCE database-schema.sql;
```

### Backup Database
```bash
# Export
mysqldump -u root -p flexitip > flexitip_backup.sql

# Import
mysql -u root -p flexitip < flexitip_backup.sql
```

### Check Table Sizes
```sql
SELECT 
  table_name,
  ROUND(((data_length + index_length) / 1024 / 1024), 2) AS size_mb
FROM information_schema.TABLES
WHERE table_schema = 'flexitip'
ORDER BY (data_length + index_length) DESC;
```

---

## Testing Data

### Insert Test User
```sql
INSERT INTO users (id, name, email, password, isVerified) 
VALUES (UUID(), 'Test User', 'test@example.com', '$2a$10$hashedpassword', TRUE);
```

### Insert Test Jastip Service
```sql
INSERT INTO jastip_services (
  id, jastiperId, title, type, origin, destination,
  departureDate, capacity, availableCapacity, pricePerKg, status
) VALUES (
  UUID(),
  'USER_ID_HERE',
  'Singapore Shopping Trip',
  'global',
  'Singapore',
  'Jakarta',
  '2025-12-15 10:00:00',
  50.00,
  50.00,
  75000,
  'active'
);
```

---

## Useful Commands

```sql
-- Show current database
SELECT DATABASE();

-- Show all tables
SHOW TABLES;

-- Show table structure
DESCRIBE table_name;

-- Show indexes
SHOW INDEX FROM table_name;

-- Show create table statement
SHOW CREATE TABLE table_name;

-- Count all records
SELECT COUNT(*) FROM table_name;

-- Get last inserted ID
SELECT LAST_INSERT_ID();
```

---

## Files Reference

- `database-schema.sql` - Full DDL statements
- `database-queries.sql` - Sample queries with JOINs
- `DATABASE_ERD.md` - ERD diagram & documentation
- `DATABASE_QUICK_REFERENCE.md` - This file
