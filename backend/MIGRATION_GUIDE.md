# 🔄 MongoDB to MySQL Migration Guide

## ⚠️ Important Changes

Backend FlexiTip telah **dimigrasi dari MongoDB ke MySQL** menggunakan **Sequelize ORM**.

### **Perubahan Utama:**

| Aspek | MongoDB (Lama) | MySQL (Baru) |
|-------|---------------|--------------|
| **Database** | MongoDB | MySQL 8.0+ |
| **ORM/ODM** | Mongoose | Sequelize |
| **Schema** | Flexible (NoSQL) | Fixed (SQL) |
| **ID Type** | ObjectId | UUID |
| **Relationships** | Embedded/Referenced | Foreign Keys |
| **JSON Fields** | Native | JSON column type |

---

## 📦 Updated Dependencies

### **Removed:**
```json
{
  "mongoose": "^8.0.0"
}
```

### **Added:**
```json
{
  "sequelize": "^6.35.0",
  "mysql2": "^3.6.5"
}
```

---

## 🗄️ Database Setup

### **1. Install MySQL**

**Windows:**
```bash
# Download from: https://dev.mysql.com/downloads/installer/
# Atau via Chocolatey:
choco install mysql
```

### **2. Create Database**

```sql
mysql -u root -p

CREATE DATABASE flexitip CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### **3. Update Environment Variables**

**OLD (.env):**
```env
MONGODB_URI=mongodb://localhost:27017/flexitip
```

**NEW (.env):**
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=flexitip
DB_USER=root
DB_PASSWORD=your_mysql_password
```

---

## 📋 Schema Changes

### **User Model**

**MongoDB (Old):**
```javascript
const userSchema = new mongoose.Schema({
  _id: ObjectId,
  name: String,
  email: String,
  // ...
});
```

**MySQL (New):**
```javascript
const User = sequelize.define('User', {
  id: DataTypes.UUID,  // UUID instead of ObjectId
  name: DataTypes.STRING(100),
  email: DataTypes.STRING(100),
  // ...
});
```

### **Key Differences:**

1. **Primary Key:**
   - MongoDB: `_id` (ObjectId)
   - MySQL: `id` (UUID v4)

2. **Timestamps:**
   - MongoDB: `createdAt`, `updatedAt` (auto)
   - MySQL: `createdAt`, `updatedAt` (auto via Sequelize)

3. **References:**
   - MongoDB: `ref: 'ModelName'`
   - MySQL: `foreignKey` with `references`

4. **JSON Fields:**
   - MongoDB: Native support
   - MySQL: `DataTypes.JSON` column type

---

## 🔧 Code Changes

### **Database Connection**

**OLD (MongoDB):**
```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('MongoDB Connected');
};

module.exports = connectDB;
```

**NEW (MySQL):**
```javascript
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
  }
);

const connectDB = async () => {
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });
  console.log('MySQL Connected');
};

module.exports = { sequelize, connectDB };
```

### **Model Definition**

**OLD (Mongoose):**
```javascript
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true },
});

module.exports = mongoose.model('User', userSchema);
```

**NEW (Sequelize):**
```javascript
const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    unique: true,
  },
}, {
  tableName: 'users',
  timestamps: true,
});

module.exports = User;
```

### **CRUD Operations**

**OLD (Mongoose):**
```javascript
// Create
const user = await User.create({ name, email });

// Find
const user = await User.findById(id);
const users = await User.find({ email });

// Update
await User.findByIdAndUpdate(id, { name });

// Delete
await User.findByIdAndDelete(id);

// Populate
await User.findById(id).populate('orders');
```

**NEW (Sequelize):**
```javascript
// Create
const user = await User.create({ name, email });

// Find
const user = await User.findByPk(id);
const users = await User.findAll({ where: { email } });

// Update
await User.update({ name }, { where: { id } });
// Or:
await user.update({ name });

// Delete
await User.destroy({ where: { id } });
// Or:
await user.destroy();

// Include (like populate)
await User.findByPk(id, {
  include: [{ model: Order, as: 'orders' }]
});
```

---

## 🔄 Migration Steps

### **1. Backup Old Data (jika ada)**

```bash
# MongoDB Export
mongodump --uri="mongodb://localhost:27017/flexitip" --out=./backup

# Save to JSON
mongoexport --uri="mongodb://localhost:27017/flexitip" --collection=users --out=users.json
```

### **2. Install Dependencies**

```bash
cd backend
npm install
```

### **3. Test Connection**

```bash
npm run test:db
```

### **4. Start Server**

```bash
npm run dev
```

Server akan otomatis create tables di MySQL.

### **5. Import Data (Optional)**

Jika punya data lama, buat script migration:

```javascript
// migrate-data.js
const oldData = require('./backup/users.json');
const { User } = require('./src/models');

const migrate = async () => {
  for (const item of oldData) {
    await User.create({
      name: item.name,
      email: item.email,
      // map fields...
    });
  }
};

migrate();
```

---

## 📁 File Structure Changes

```
backend/
├── src/
│   ├── models/
│   │   ├── User.js           (Sequelize model)
│   │   ├── JastipService.js  (Sequelize model)
│   │   ├── Product.js        (Sequelize model)
│   │   ├── Order.js          (Sequelize model)
│   │   ├── Chat.js           (Sequelize model)
│   │   └── index.js          (Model associations)
│   ├── models_mongoose_backup/  (Old Mongoose models)
│   └── config/
│       └── database.js       (Sequelize config)
```

---

## ⚡ Performance Comparison

| Operation | MongoDB | MySQL |
|-----------|---------|-------|
| **Queries** | Flexible but slower joins | Optimized joins with indexes |
| **Transactions** | Limited (need replica set) | Full ACID support |
| **Relationships** | Manual population | Built-in foreign keys |
| **Schema** | Dynamic | Enforced with migrations |
| **Indexing** | Good | Excellent |

---

## 🎯 Benefits of MySQL

✅ **ACID Transactions** - Guaranteed data consistency  
✅ **Foreign Keys** - Enforced relationships  
✅ **Better Joins** - Optimized multi-table queries  
✅ **Schema Validation** - Prevents bad data  
✅ **Mature Ecosystem** - More tools & hosting options  
✅ **Cost Effective** - Cheaper cloud hosting  

---

## 🔍 Testing Migration

### **Test All Endpoints:**

```bash
# Register user
POST http://localhost:5000/api/auth/register
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "phone": "08123456789"
}

# Login
POST http://localhost:5000/api/auth/login
{
  "email": "test@example.com",
  "password": "password123"
}

# Get jastip services
GET http://localhost:5000/api/jastip
```

### **Verify Database:**

```sql
mysql -u root -p flexitip

SHOW TABLES;
SELECT * FROM users;
DESCRIBE jastip_services;
```

---

## 📚 Documentation

- `MYSQL_SETUP.md` - MySQL installation & configuration
- `QUICKSTART.md` - Quick start guide (updated)
- `README.md` - Project overview (updated)

---

## ⚠️ Breaking Changes

1. **ID Format:**
   - Old: `"_id": "507f1f77bcf86cd799439011"` (ObjectId)
   - New: `"id": "550e8400-e29b-41d4-a716-446655440000"` (UUID)

2. **Query Syntax:**
   - Controllers updated to use Sequelize syntax
   - No breaking changes in API endpoints

3. **Environment Variables:**
   - Must update `.env` file
   - See `MYSQL_SETUP.md` for details

---

## 🆘 Need Help?

Check troubleshooting sections in:
- `MYSQL_SETUP.md` - MySQL issues
- GitHub Issues - Report bugs

Migration complete! Database sekarang menggunakan MySQL dengan Sequelize ORM. 🎉
