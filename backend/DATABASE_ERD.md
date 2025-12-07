# 📊 Database Schema - FlexiTip

## Entity Relationship Diagram (ERD)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         FlexiTip Database Schema                        │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────────┐
│      users       │
├──────────────────┤
│ id (PK)          │──┐
│ name             │  │
│ email (UQ)       │  │
│ password         │  │
│ googleId (UQ)    │  │
│ isVerified       │  │
│ phone            │  │
│ birthdate        │  │
│ avatar           │  │
│ role             │  │
│ isJastiper       │  │
│ jastipProfile    │  │
│ addresses        │  │
│ createdAt        │  │
│ updatedAt        │  │
└──────────────────┘  │
         │            │
         │ 1          │ 1
         │            │
         │ jastiperId │ customerId & jastiperId
         ▼            ▼
┌──────────────────┐  ┌──────────────────┐
│ jastip_services  │  │     orders       │
├──────────────────┤  ├──────────────────┤
│ id (PK)          │──│ id (PK)          │
│ jastiperId (FK)  │  │ orderNumber (UQ) │
│ title            │  │ customerId (FK)  │
│ description      │  │ jastiperId (FK)  │
│ type             │  │ jastipServiceId  │
│ origin           │  │ items (JSON)     │
│ destination      │  │ shippingAddress  │
│ departureDate    │  │ shippingMethod   │
│ arrivalDate      │  │ pricing (JSON)   │
│ capacity         │  │ orderStatus      │
│ availableCapacity│  │ paymentStatus    │
│ pricePerKg       │  │ paymentMethod    │
│ serviceFee       │  │ paymentProof     │
│ status           │  │ statusHistory    │
│ categories (JSON)│  │ trackingNumber   │
│ restrictions     │  │ notes            │
│ images (JSON)    │  │ cancellationReason│
│ rating           │  │ rating (JSON)    │
│ totalRatings     │  │ createdAt        │
│ createdAt        │  │ updatedAt        │
│ updatedAt        │  └──────────────────┘
└──────────────────┘         ▲
         │                   │
         │ 1                 │
         │                   │
         │ jastipServiceId   │
         │                   │
         ▼                   │
┌──────────────────┐         │
│    products      │         │
├──────────────────┤         │
│ id (PK)          │         │
│ jastipServiceId  │─────────┘
│ name             │
│ description      │
│ category         │
│ brand            │
│ price            │
│ currency         │
│ estimatedWeight  │
│ images (JSON)    │
│ variants (JSON)  │
│ stock            │
│ specifications   │
│ status           │
│ createdAt        │
│ updatedAt        │
└──────────────────┘

┌──────────────────┐
│      chats       │
├──────────────────┤
│ id (PK)          │──┐
│ jastipServiceId  │  │ 1
│ participants     │  │
│ lastMessageId    │  │
│ createdAt        │  │
│ updatedAt        │  │
└──────────────────┘  │
         │            │
         │ 1          │
         │            │
         │ chatId     │
         ▼            │
┌──────────────────┐  │
│    messages      │  │
├──────────────────┤  │
│ id (PK)          │◄─┘
│ chatId (FK)      │
│ senderId (FK)    │
│ content          │
│ type             │
│ attachments      │
│ isRead           │
│ readAt           │
│ metadata (JSON)  │
│ createdAt        │
│ updatedAt        │
└──────────────────┘
         ▲
         │
         │ senderId
         │
      (users)
```

## Relationships

### 1. Users ↔ Jastip Services (One-to-Many)
- **Type**: One user can create many jastip services
- **FK**: `jastip_services.jastiperId` → `users.id`
- **Cascade**: ON DELETE CASCADE

### 2. Jastip Services ↔ Products (One-to-Many)
- **Type**: One jastip service can have many products
- **FK**: `products.jastipServiceId` → `jastip_services.id`
- **Cascade**: ON DELETE CASCADE

### 3. Users ↔ Orders (One-to-Many as Customer)
- **Type**: One user can place many orders
- **FK**: `orders.customerId` → `users.id`
- **Cascade**: ON DELETE RESTRICT

### 4. Users ↔ Orders (One-to-Many as Jastiper)
- **Type**: One jastiper can handle many orders
- **FK**: `orders.jastiperId` → `users.id`
- **Cascade**: ON DELETE RESTRICT

### 5. Jastip Services ↔ Orders (One-to-Many)
- **Type**: One jastip service can have many orders
- **FK**: `orders.jastipServiceId` → `jastip_services.id`
- **Cascade**: ON DELETE RESTRICT

### 6. Chats ↔ Messages (One-to-Many)
- **Type**: One chat can have many messages
- **FK**: `messages.chatId` → `chats.id`
- **Cascade**: ON DELETE CASCADE

### 7. Users ↔ Messages (One-to-Many)
- **Type**: One user can send many messages
- **FK**: `messages.senderId` → `users.id`
- **Cascade**: ON DELETE RESTRICT

### 8. Jastip Services ↔ Chats (One-to-Many)
- **Type**: One jastip service can have many chats
- **FK**: `chats.jastipServiceId` → `jastip_services.id`
- **Cascade**: ON DELETE SET NULL

## Tables Overview

### **users** (User Management)
- **Primary Key**: `id` (UUID)
- **Unique Keys**: `email`, `googleId`
- **Indexes**: email, googleId, isJastiper, role
- **Features**: Password hashing, JSON profile data

### **jastip_services** (Service Listings)
- **Primary Key**: `id` (UUID)
- **Foreign Keys**: `jastiperId` → users
- **Indexes**: jastiperId, type, status, departureDate, destination, rating
- **Features**: Capacity tracking, JSON categories/restrictions/images

### **products** (Product Catalog)
- **Primary Key**: `id` (UUID)
- **Foreign Keys**: `jastipServiceId` → jastip_services
- **Indexes**: jastipServiceId, category, status, brand
- **Features**: JSON variants/specifications/images

### **orders** (Transactions)
- **Primary Key**: `id` (UUID)
- **Unique Keys**: `orderNumber`
- **Foreign Keys**: 
  - `customerId` → users
  - `jastiperId` → users
  - `jastipServiceId` → jastip_services
- **Indexes**: orderNumber, customerId, jastiperId, jastipServiceId, orderStatus, paymentStatus, createdAt
- **Features**: JSON items/pricing/statusHistory/rating

### **chats** (Chat Rooms)
- **Primary Key**: `id` (UUID)
- **Foreign Keys**: `jastipServiceId` → jastip_services
- **Indexes**: jastipServiceId, updatedAt
- **Features**: JSON participants array

### **messages** (Chat Messages)
- **Primary Key**: `id` (UUID)
- **Foreign Keys**: 
  - `chatId` → chats
  - `senderId` → users
- **Indexes**: chatId, senderId, isRead, createdAt
- **Features**: JSON attachments/metadata

## Data Types Summary

### Primary Keys
- All tables use **UUID** (CHAR(36))
- Generated via `UUID()` function

### Enumerations
- **users.role**: `'user'`, `'admin'`
- **jastip_services.type**: `'local'`, `'global'`
- **jastip_services.status**: `'active'`, `'full'`, `'closed'`, `'completed'`
- **products.status**: `'available'`, `'out_of_stock'`, `'discontinued'`
- **orders.orderStatus**: `'pending'`, `'confirmed'`, `'purchased'`, `'shipping'`, `'delivered'`, `'completed'`, `'cancelled'`
- **orders.paymentStatus**: `'pending'`, `'paid'`, `'failed'`, `'refunded'`
- **messages.type**: `'text'`, `'image'`, `'file'`, `'location'`

### JSON Fields
- **users**: `jastipProfile`, `addresses`
- **jastip_services**: `categories`, `restrictions`, `images`
- **products**: `images`, `variants`, `specifications`
- **orders**: `items`, `shippingAddress`, `pricing`, `statusHistory`, `rating`
- **chats**: `participants`
- **messages**: `attachments`, `metadata`

### Timestamps
- All tables have: `createdAt`, `updatedAt`
- Auto-updated via `ON UPDATE CURRENT_TIMESTAMP`

## Indexes Strategy

### Performance Indexes
- **Foreign Keys**: All FK columns indexed
- **Search Columns**: email, destination, category, brand
- **Status Fields**: orderStatus, paymentStatus, status
- **Dates**: departureDate, createdAt
- **Rating**: rating field for sorting

### Unique Indexes
- `users.email`
- `users.googleId`
- `orders.orderNumber`

## Files

- **database-schema.sql** - Full DDL with CREATE TABLE statements
- **database-queries.sql** - Common queries and JOINs
- **DATABASE_ERD.md** - This file (ERD documentation)

## Usage

### Create All Tables
```bash
mysql -u root -p flexitip < database-schema.sql
```

### Verify Tables
```sql
USE flexitip;
SHOW TABLES;
```

### Check Relationships
```sql
SELECT 
  TABLE_NAME, COLUMN_NAME, 
  REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'flexitip'
AND REFERENCED_TABLE_NAME IS NOT NULL;
```
