# 🗄️ MySQL Setup Guide - FlexiTip Backend

## 📥 Install MySQL

### Windows

#### **Option 1: MySQL Installer (Recommended)**

1. **Download MySQL Installer:**
   - Visit: https://dev.mysql.com/downloads/installer/
   - Choose: `mysql-installer-web-community-8.x.x.msi`
   - Download dan jalankan installer

2. **Installation Steps:**
   ```
   ├─ Choose Setup Type: Developer Default
   ├─ Check Requirements (install semua yang diperlukan)
   ├─ Installation: Install semua components
   ├─ Product Configuration:
   │  ├─ MySQL Server:
   │  │  ├─ Config Type: Development Computer
   │  │  ├─ Port: 3306 (default)
   │  │  ├─ Root Password: [buat password strong]
   │  │  └─ Windows Service: ✓ Start at System Startup
   │  └─ MySQL Workbench: Install
   └─ Apply Configuration
   ```

3. **Verify Installation:**
   ```cmd
   mysql --version
   ```

   Output: `mysql  Ver 8.x.x for Win64`

#### **Option 2: Via Chocolatey**

```powershell
# Install Chocolatey first if not installed
# https://chocolatey.org/install

choco install mysql
```

### Test MySQL Service

```cmd
# Check service status
sc query MySQL80

# Start service
net start MySQL80

# Stop service (jika perlu)
net stop MySQL80
```

---

## 🔧 Configure MySQL Database

### 1. **Create Database**

```bash
# Login to MySQL
mysql -u root -p
# Enter password yang dibuat saat install
```

```sql
-- Create database
CREATE DATABASE flexitip CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user (optional, untuk production)
CREATE USER 'flexitip_user'@'localhost' IDENTIFIED BY 'your_secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON flexitip.* TO 'flexitip_user'@'localhost';
FLUSH PRIVILEGES;

-- Verify
SHOW DATABASES;
USE flexitip;

-- Exit
EXIT;
```

### 2. **Configure Environment Variables**

Edit `backend/.env`:

```env
# MySQL Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=flexitip
DB_USER=root
DB_PASSWORD=your_mysql_password

# Or use custom user
# DB_USER=flexitip_user
# DB_PASSWORD=your_secure_password
```

---

## 🚀 Backend Setup

### 1. **Install Dependencies**

```bash
cd backend
npm install
```

Packages yang diinstall:
- `sequelize` - ORM untuk MySQL
- `mysql2` - MySQL driver

### 2. **Test Database Connection**

```bash
npm run test:db
```

**Expected Output:**
```
🔄 Testing MySQL Connection...

Connection Details:
├─ 🌐 Host: localhost
├─ 🔌 Port: 3306
├─ 📊 Database: flexitip
└─ 👤 User: root

✅ MySQL Connected Successfully!

🧪 Testing CRUD Operations...
✅ All tests passed!
```

### 3. **Run Database Migrations**

```bash
npm run dev
```

Server akan otomatis:
- Connect ke MySQL
- Create semua tables
- Sync schema
- Start server di port 5000

**Tables yang dibuat:**
```
flexitip
├── users
├── jastip_services
├── products
├── orders
├── chats
└── messages
```

---

## 🔍 Verify Tables

### **MySQL Workbench (GUI):**
1. Open MySQL Workbench
2. Connect to localhost (port 3306)
3. Schemas → flexitip → Tables
4. View structure dan data

### **Command Line:**
```bash
mysql -u root -p flexitip
```

```sql
-- List all tables
SHOW TABLES;

-- Describe table structure
DESCRIBE users;
DESCRIBE jastip_services;

-- View data
SELECT * FROM users;

-- Exit
EXIT;
```

---

## 🌐 Remote MySQL (Cloud)

### **Option 1: PlanetScale (Recommended)** ⭐

1. **Create Account:**
   - Visit: https://planetscale.com/
   - Sign up gratis (5GB storage)

2. **Create Database:**
   ```
   Dashboard → New Database
   Name: flexitip
   Region: AWS ap-southeast-1 (Singapore)
   ```

3. **Get Connection String:**
   ```
   Database → Connect
   Framework: Node.js - Sequelize
   ```

4. **Configure .env:**
   ```env
   DB_HOST=aws.connect.psdb.cloud
   DB_PORT=3306
   DB_NAME=flexitip
   DB_USER=your_username
   DB_PASSWORD=pscale_pw_xxxxx
   DB_SSL=true
   ```

### **Option 2: AWS RDS**

1. Create RDS MySQL instance
2. Configure security group (allow port 3306)
3. Get endpoint URL
4. Update .env:
   ```env
   DB_HOST=your-instance.xxxxx.rds.amazonaws.com
   DB_PORT=3306
   DB_NAME=flexitip
   DB_USER=admin
   DB_PASSWORD=your_password
   DB_SSL=true
   ```

### **Option 3: Railway**

1. Visit: https://railway.app/
2. New Project → Add MySQL
3. Copy credentials
4. Update .env

---

## 📋 Database Schema

### **Users Table**
```sql
CREATE TABLE users (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  googleId VARCHAR(100) UNIQUE,
  isVerified BOOLEAN DEFAULT FALSE,
  phone VARCHAR(20),
  birthdate DATE,
  avatar VARCHAR(500),
  role ENUM('user', 'admin') DEFAULT 'user',
  isJastiper BOOLEAN DEFAULT FALSE,
  jastipProfile JSON,
  addresses JSON,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### **Jastip Services Table**
```sql
CREATE TABLE jastip_services (
  id CHAR(36) PRIMARY KEY,
  jastiperId CHAR(36) NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  type ENUM('local', 'global') NOT NULL,
  origin VARCHAR(100) NOT NULL,
  destination VARCHAR(100) NOT NULL,
  departureDate DATETIME NOT NULL,
  arrivalDate DATETIME,
  capacity DECIMAL(10,2) NOT NULL,
  availableCapacity DECIMAL(10,2) NOT NULL,
  pricePerKg DECIMAL(10,2) NOT NULL,
  serviceFee DECIMAL(10,2) DEFAULT 0,
  status ENUM('active', 'full', 'closed', 'completed') DEFAULT 'active',
  categories JSON,
  restrictions JSON,
  images JSON,
  rating DECIMAL(3,2) DEFAULT 0,
  totalRatings INT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (jastiperId) REFERENCES users(id) ON DELETE CASCADE
);
```

### **Products Table**
```sql
CREATE TABLE products (
  id CHAR(36) PRIMARY KEY,
  jastipServiceId CHAR(36) NOT NULL,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  brand VARCHAR(100),
  price DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'IDR',
  estimatedWeight DECIMAL(10,2),
  images JSON,
  variants JSON,
  stock INT DEFAULT 0,
  specifications JSON,
  status ENUM('available', 'out_of_stock', 'discontinued') DEFAULT 'available',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (jastipServiceId) REFERENCES jastip_services(id) ON DELETE CASCADE
);
```

### **Orders Table**
```sql
CREATE TABLE orders (
  id CHAR(36) PRIMARY KEY,
  orderNumber VARCHAR(50) UNIQUE NOT NULL,
  customerId CHAR(36) NOT NULL,
  jastiperId CHAR(36) NOT NULL,
  jastipServiceId CHAR(36) NOT NULL,
  items JSON NOT NULL,
  shippingAddress JSON NOT NULL,
  shippingMethod VARCHAR(50),
  pricing JSON NOT NULL,
  orderStatus ENUM('pending', 'confirmed', 'purchased', 'shipping', 'delivered', 'completed', 'cancelled') DEFAULT 'pending',
  paymentStatus ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
  paymentMethod VARCHAR(50),
  paymentProof VARCHAR(500),
  statusHistory JSON,
  trackingNumber VARCHAR(100),
  notes TEXT,
  cancellationReason TEXT,
  rating JSON,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customerId) REFERENCES users(id),
  FOREIGN KEY (jastiperId) REFERENCES users(id),
  FOREIGN KEY (jastipServiceId) REFERENCES jastip_services(id)
);
```

### **Chats & Messages Tables**
```sql
CREATE TABLE chats (
  id CHAR(36) PRIMARY KEY,
  jastipServiceId CHAR(36),
  participants JSON NOT NULL,
  lastMessageId CHAR(36),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (jastipServiceId) REFERENCES jastip_services(id) ON DELETE SET NULL
);

CREATE TABLE messages (
  id CHAR(36) PRIMARY KEY,
  chatId CHAR(36) NOT NULL,
  senderId CHAR(36) NOT NULL,
  content TEXT NOT NULL,
  type ENUM('text', 'image', 'file', 'location') DEFAULT 'text',
  attachments JSON,
  isRead BOOLEAN DEFAULT FALSE,
  readAt TIMESTAMP NULL,
  metadata JSON,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (chatId) REFERENCES chats(id) ON DELETE CASCADE,
  FOREIGN KEY (senderId) REFERENCES users(id)
);
```

---

## 🔧 Troubleshooting

### ❌ **Error: Access denied for user**

```bash
# Reset root password
mysql -u root

# In MySQL console:
ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
FLUSH PRIVILEGES;
```

### ❌ **Error: Cannot connect to MySQL server**

```cmd
# Check if service is running
sc query MySQL80

# Start service
net start MySQL80

# Check port 3306
netstat -ano | findstr :3306
```

### ❌ **Error: Unknown database 'flexitip'**

```sql
# Create database
mysql -u root -p
CREATE DATABASE flexitip;
EXIT;
```

### ❌ **Error: ER_NOT_SUPPORTED_AUTH_MODE**

```sql
# Update authentication method
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';
FLUSH PRIVILEGES;
```

---

## 🛠️ Useful Commands

### **MySQL Service**
```cmd
net start MySQL80          # Start service
net stop MySQL80           # Stop service
sc query MySQL80           # Check status
```

### **MySQL CLI**
```bash
mysql -u root -p           # Login
mysql -u root -p flexitip  # Login to specific database
```

### **MySQL Commands**
```sql
SHOW DATABASES;                    # List databases
USE flexitip;                      # Switch database
SHOW TABLES;                       # List tables
DESCRIBE table_name;               # Table structure
SELECT * FROM users;               # Query data
DROP TABLE table_name;             # Delete table
DROP DATABASE flexitip;            # Delete database
```

### **Sequelize CLI (Future)**
```bash
npm install -g sequelize-cli

sequelize init                     # Initialize
sequelize db:create                # Create database
sequelize db:migrate               # Run migrations
sequelize db:seed:all              # Run seeders
```

---

## 📚 Resources

- MySQL Download: https://dev.mysql.com/downloads/
- MySQL Workbench: https://dev.mysql.com/downloads/workbench/
- Sequelize Docs: https://sequelize.org/docs/v6/
- PlanetScale: https://planetscale.com/
- Railway: https://railway.app/

---

## ✅ Quick Start Checklist

- [ ] Install MySQL Server
- [ ] Create database `flexitip`
- [ ] Configure `.env` file
- [ ] Install npm dependencies
- [ ] Run `npm run test:db`
- [ ] Start server `npm run dev`
- [ ] Verify tables created

Backend dengan MySQL siap digunakan! 🚀
