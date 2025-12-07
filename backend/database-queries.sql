-- ============================================
-- Database Relationships & ERD
-- FlexiTip MySQL Database
-- ============================================

-- ============================================
-- RELATIONSHIPS OVERVIEW
-- ============================================

/*
1. users → jastip_services (One to Many)
   - Satu user (jastiper) bisa punya banyak jastip services
   - FK: jastip_services.jastiperId → users.id

2. jastip_services → products (One to Many)
   - Satu jastip service bisa punya banyak products
   - FK: products.jastipServiceId → jastip_services.id

3. users → orders (One to Many) - as Customer
   - Satu user bisa punya banyak orders sebagai customer
   - FK: orders.customerId → users.id

4. users → orders (One to Many) - as Jastiper
   - Satu user (jastiper) bisa handle banyak orders
   - FK: orders.jastiperId → users.id

5. jastip_services → orders (One to Many)
   - Satu jastip service bisa punya banyak orders
   - FK: orders.jastipServiceId → jastip_services.id

6. chats → messages (One to Many)
   - Satu chat bisa punya banyak messages
   - FK: messages.chatId → chats.id

7. users → messages (One to Many)
   - Satu user bisa kirim banyak messages
   - FK: messages.senderId → users.id

8. jastip_services → chats (One to Many)
   - Satu jastip service bisa punya banyak chat rooms
   - FK: chats.jastipServiceId → jastip_services.id
*/

-- ============================================
-- QUERY: View All Relationships
-- ============================================

SELECT 
  CONCAT(TABLE_NAME, '.', COLUMN_NAME) AS 'Foreign Key',
  CONCAT(REFERENCED_TABLE_NAME, '.', REFERENCED_COLUMN_NAME) AS 'References',
  CONSTRAINT_NAME AS 'Constraint'
FROM
  INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE
  TABLE_SCHEMA = 'flexitip'
  AND REFERENCED_TABLE_NAME IS NOT NULL
ORDER BY
  TABLE_NAME, COLUMN_NAME;

-- ============================================
-- USEFUL JOIN QUERIES
-- ============================================

-- 1. Get Jastip Services with Jastiper Info
SELECT 
  js.id,
  js.title,
  js.origin,
  js.destination,
  js.departureDate,
  js.status,
  js.pricePerKg,
  u.name AS jastiper_name,
  u.email AS jastiper_email,
  u.phone AS jastiper_phone,
  JSON_EXTRACT(u.jastipProfile, '$.rating') AS jastiper_rating
FROM jastip_services js
INNER JOIN users u ON js.jastiperId = u.id
WHERE js.status = 'active'
ORDER BY js.departureDate ASC;

-- 2. Get Products with Jastip Service Info
SELECT 
  p.id,
  p.name AS product_name,
  p.price,
  p.category,
  p.stock,
  js.title AS service_title,
  js.origin,
  js.destination,
  u.name AS jastiper_name
FROM products p
INNER JOIN jastip_services js ON p.jastipServiceId = js.id
INNER JOIN users u ON js.jastiperId = u.id
WHERE p.status = 'available'
ORDER BY p.createdAt DESC;

-- 3. Get Orders with Full Details
SELECT 
  o.id,
  o.orderNumber,
  o.orderStatus,
  o.paymentStatus,
  JSON_EXTRACT(o.pricing, '$.total') AS total_amount,
  customer.name AS customer_name,
  customer.email AS customer_email,
  jastiper.name AS jastiper_name,
  js.title AS service_title,
  js.origin,
  js.destination,
  o.createdAt
FROM orders o
INNER JOIN users customer ON o.customerId = customer.id
INNER JOIN users jastiper ON o.jastiperId = jastiper.id
INNER JOIN jastip_services js ON o.jastipServiceId = js.id
ORDER BY o.createdAt DESC
LIMIT 50;

-- 4. Get Chat Messages with Sender Info
SELECT 
  m.id,
  m.content,
  m.type,
  m.isRead,
  m.createdAt,
  u.name AS sender_name,
  u.avatar AS sender_avatar,
  c.id AS chat_id
FROM messages m
INNER JOIN users u ON m.senderId = u.id
INNER JOIN chats c ON m.chatId = c.id
WHERE m.chatId = 'YOUR_CHAT_ID'
ORDER BY m.createdAt ASC;

-- 5. Get User's Orders as Customer
SELECT 
  o.id,
  o.orderNumber,
  o.orderStatus,
  o.paymentStatus,
  JSON_EXTRACT(o.pricing, '$.total') AS total,
  js.title AS service_title,
  jastiper.name AS jastiper_name,
  o.createdAt
FROM orders o
INNER JOIN jastip_services js ON o.jastipServiceId = js.id
INNER JOIN users jastiper ON o.jastiperId = jastiper.id
WHERE o.customerId = 'USER_ID'
ORDER BY o.createdAt DESC;

-- 6. Get Jastiper's Orders
SELECT 
  o.id,
  o.orderNumber,
  o.orderStatus,
  o.paymentStatus,
  JSON_EXTRACT(o.pricing, '$.total') AS total,
  customer.name AS customer_name,
  customer.phone AS customer_phone,
  js.title AS service_title,
  o.createdAt
FROM orders o
INNER JOIN users customer ON o.customerId = customer.id
INNER JOIN jastip_services js ON o.jastipServiceId = js.id
WHERE o.jastiperId = 'JASTIPER_ID'
ORDER BY o.createdAt DESC;

-- 7. Get Active Jastip Services with Product Count
SELECT 
  js.id,
  js.title,
  js.origin,
  js.destination,
  js.departureDate,
  js.pricePerKg,
  js.availableCapacity,
  u.name AS jastiper_name,
  COUNT(p.id) AS total_products
FROM jastip_services js
INNER JOIN users u ON js.jastiperId = u.id
LEFT JOIN products p ON js.id = p.jastipServiceId AND p.status = 'available'
WHERE js.status = 'active'
GROUP BY js.id
ORDER BY js.departureDate ASC;

-- 8. Get User's Chats with Last Message
SELECT 
  c.id AS chat_id,
  c.updatedAt,
  js.title AS service_title,
  m.content AS last_message,
  m.createdAt AS last_message_time,
  sender.name AS last_sender_name
FROM chats c
LEFT JOIN jastip_services js ON c.jastipServiceId = js.id
LEFT JOIN messages m ON c.lastMessageId = m.id
LEFT JOIN users sender ON m.senderId = sender.id
WHERE JSON_CONTAINS(c.participants, JSON_QUOTE('USER_ID'))
ORDER BY c.updatedAt DESC;

-- 9. Get Jastip Service Statistics
SELECT 
  js.id,
  js.title,
  js.status,
  COUNT(DISTINCT o.id) AS total_orders,
  COUNT(DISTINCT p.id) AS total_products,
  SUM(CASE WHEN o.orderStatus = 'completed' THEN 1 ELSE 0 END) AS completed_orders,
  AVG(JSON_EXTRACT(o.rating, '$.score')) AS avg_rating
FROM jastip_services js
LEFT JOIN orders o ON js.id = o.jastipServiceId
LEFT JOIN products p ON js.id = p.jastipServiceId
WHERE js.jastiperId = 'JASTIPER_ID'
GROUP BY js.id
ORDER BY js.createdAt DESC;

-- 10. Get Top Rated Jastipers
SELECT 
  u.id,
  u.name,
  u.email,
  u.avatar,
  JSON_EXTRACT(u.jastipProfile, '$.rating') AS rating,
  JSON_EXTRACT(u.jastipProfile, '$.totalTrips') AS total_trips,
  COUNT(DISTINCT js.id) AS total_services,
  COUNT(DISTINCT o.id) AS total_orders
FROM users u
LEFT JOIN jastip_services js ON u.id = js.jastiperId
LEFT JOIN orders o ON u.id = o.jastiperId
WHERE u.isJastiper = TRUE
GROUP BY u.id
ORDER BY CAST(JSON_EXTRACT(u.jastipProfile, '$.rating') AS DECIMAL(3,2)) DESC
LIMIT 10;

-- ============================================
-- AGGREGATE QUERIES
-- ============================================

-- Count total records per table
SELECT 
  'Users' AS entity, COUNT(*) AS total FROM users
UNION ALL
SELECT 'Jastipers', COUNT(*) FROM users WHERE isJastiper = TRUE
UNION ALL
SELECT 'Jastip Services', COUNT(*) FROM jastip_services
UNION ALL
SELECT 'Products', COUNT(*) FROM products
UNION ALL
SELECT 'Orders', COUNT(*) FROM orders
UNION ALL
SELECT 'Chats', COUNT(*) FROM chats
UNION ALL
SELECT 'Messages', COUNT(*) FROM messages;

-- Revenue by Jastiper
SELECT 
  u.name AS jastiper_name,
  COUNT(o.id) AS total_orders,
  SUM(JSON_EXTRACT(o.pricing, '$.total')) AS total_revenue,
  AVG(JSON_EXTRACT(o.pricing, '$.total')) AS avg_order_value
FROM users u
INNER JOIN orders o ON u.id = o.jastiperId
WHERE o.paymentStatus = 'paid'
GROUP BY u.id
ORDER BY total_revenue DESC;

-- Popular Destinations
SELECT 
  destination,
  COUNT(*) AS total_services,
  AVG(pricePerKg) AS avg_price_per_kg
FROM jastip_services
GROUP BY destination
ORDER BY total_services DESC
LIMIT 10;

-- Order Status Distribution
SELECT 
  orderStatus,
  COUNT(*) AS total,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM orders), 2) AS percentage
FROM orders
GROUP BY orderStatus
ORDER BY total DESC;

-- ============================================
-- INDEXES FOR OPTIMIZATION
-- ============================================

-- Already created in main schema, but here's the list:
/*
Users:
- idx_email (email)
- idx_googleId (googleId)
- idx_isJastiper (isJastiper)
- idx_role (role)

Jastip Services:
- idx_jastiperId (jastiperId)
- idx_type (type)
- idx_status (status)
- idx_departureDate (departureDate)
- idx_destination (destination)
- idx_rating (rating)

Products:
- idx_jastipServiceId (jastipServiceId)
- idx_category (category)
- idx_status (status)
- idx_brand (brand)

Orders:
- idx_orderNumber (orderNumber)
- idx_customerId (customerId)
- idx_jastiperId (jastiperId)
- idx_jastipServiceId (jastipServiceId)
- idx_orderStatus (orderStatus)
- idx_paymentStatus (paymentStatus)
- idx_createdAt (createdAt)

Chats:
- idx_jastipServiceId (jastipServiceId)
- idx_updatedAt (updatedAt)

Messages:
- idx_chatId (chatId)
- idx_senderId (senderId)
- idx_isRead (isRead)
- idx_createdAt (createdAt)
*/

-- ============================================
-- MAINTENANCE QUERIES
-- ============================================

-- Check table sizes
SELECT 
  table_name AS 'Table',
  ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.TABLES
WHERE table_schema = 'flexitip'
ORDER BY (data_length + index_length) DESC;

-- Check indexes
SELECT 
  TABLE_NAME,
  INDEX_NAME,
  GROUP_CONCAT(COLUMN_NAME ORDER BY SEQ_IN_INDEX) AS Columns
FROM INFORMATION_SCHEMA.STATISTICS
WHERE TABLE_SCHEMA = 'flexitip'
GROUP BY TABLE_NAME, INDEX_NAME
ORDER BY TABLE_NAME, INDEX_NAME;
