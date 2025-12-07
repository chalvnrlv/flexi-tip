# 🗄️ MongoDB Configuration Guide - FlexiTip

## Pilihan Database

### Opsi 1: MongoDB Lokal (Development) 💻

#### **Windows Installation**

1. **Download MongoDB:**
   - Kunjungi: https://www.mongodb.com/try/download/community
   - Pilih versi: Windows, Latest Version
   - Download MSI installer

2. **Install MongoDB:**
   ```
   - Jalankan installer
   - Choose "Complete" installation
   - Install as Windows Service ✓
   - Install MongoDB Compass ✓ (GUI tool)
   ```

3. **Verify Installation:**
   ```bash
   # Buka Command Prompt
   mongod --version
   
   # Output: db version v7.x.x
   ```

4. **Start MongoDB Service:**
   ```bash
   # Start service
   net start MongoDB
   
   # Check status
   sc query MongoDB
   
   # Stop service (jika perlu)
   net stop MongoDB
   ```

5. **MongoDB Compass (GUI):**
   - Buka MongoDB Compass
   - Connection string: `mongodb://localhost:27017`
   - Klik "Connect"
   - Database akan otomatis dibuat saat aplikasi pertama kali run

#### **Connection String:**
```env
MONGODB_URI=mongodb://localhost:27017/flexitip
```

---

### Opsi 2: MongoDB Atlas (Cloud) ☁️ **RECOMMENDED**

#### **Keuntungan:**
- ✅ Free tier 512MB
- ✅ Automatic backups
- ✅ No installation needed
- ✅ Production-ready
- ✅ Global deployment
- ✅ Built-in monitoring

#### **Setup Steps:**

#### 1. **Create Account**
   - Kunjungi: https://www.mongodb.com/cloud/atlas/register
   - Sign up dengan Google/GitHub atau email
   - Pilih plan: **M0 Sandbox (FREE)**

#### 2. **Create Cluster**
   ```
   Build a Database → Shared (Free) → Create
   
   Provider: AWS/Google Cloud/Azure
   Region: Singapore (ap-southeast-1) atau terdekat
   Cluster Name: FlexiTip
   
   Klik: Create Cluster (tunggu 3-5 menit)
   ```

#### 3. **Create Database User**
   ```
   Security → Database Access → Add New Database User
   
   Authentication Method: Password
   Username: flexitip_admin
   Password: [Generate Secure Password] atau buat sendiri
   
   Database User Privileges:
   - Built-in Role: Read and write to any database
   
   Klik: Add User
   ```

   **⚠️ SIMPAN PASSWORD INI!** Anda akan memerlukannya untuk connection string.

#### 4. **Whitelist IP Address**
   ```
   Security → Network Access → Add IP Address
   
   Option 1 (Development):
   - Allow Access from Anywhere
   - IP Address: 0.0.0.0/0
   - Description: Allow all IPs (dev only)
   
   Option 2 (Production):
   - Add Your Current IP Address
   - Atau IP server hosting Anda
   
   Klik: Confirm
   ```

#### 5. **Get Connection String**
   ```
   Database → Connect → Connect your application
   
   Driver: Node.js
   Version: 5.5 or later
   
   Copy connection string:
   mongodb+srv://flexitip_admin:<password>@flexitip.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

#### 6. **Configure Environment**

   Buka `backend/.env` dan update:

   ```env
   # MongoDB Atlas
   MONGODB_URI=mongodb+srv://flexitip_admin:YOUR_ACTUAL_PASSWORD@flexitip.xxxxx.mongodb.net/flexitip?retryWrites=true&w=majority
   ```

   **Replace:**
   - `YOUR_ACTUAL_PASSWORD` → password yang Anda buat di step 3
   - `xxxxx` → cluster ID dari Atlas
   - `/flexitip` setelah `.net/` → nama database (akan auto-created)

   **Example:**
   ```env
   MONGODB_URI=mongodb+srv://flexitip_admin:MySecurePass123@flexitip.abc123.mongodb.net/flexitip?retryWrites=true&w=majority
   ```

---

## File Konfigurasi Backend

### **1. Database Connection (`backend/src/config/database.js`)**

Sudah dibuat dengan konfigurasi optimal:

```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Mongoose 6+ tidak perlu useNewUrlParser dan useUnifiedTopology
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Exit dengan failure
  }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error(`❌ MongoDB error: ${err}`);
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('👋 MongoDB connection closed through app termination');
  process.exit(0);
});

module.exports = connectDB;
```

### **2. Environment Variables (`backend/.env`)**

```env
# Environment
NODE_ENV=development
PORT=5000

# ====================================
# MongoDB Configuration
# ====================================

# Pilih salah satu:

# Local MongoDB (Development)
# MONGODB_URI=mongodb://localhost:27017/flexitip

# MongoDB Atlas (Production/Cloud)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/flexitip?retryWrites=true&w=majority

# ====================================
# JWT Configuration
# ====================================
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-minimum-32-characters
JWT_EXPIRE=7d

# ====================================
# Email Configuration (Gmail example)
# ====================================
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
EMAIL_FROM=noreply@flexitip.com
EMAIL_FROM_NAME=FlexiTip

# ====================================
# Cloudinary (File Upload)
# ====================================
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# ====================================
# Stripe (Payment)
# ====================================
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key

# ====================================
# Google OAuth
# ====================================
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# ====================================
# Frontend URL
# ====================================
FRONTEND_URL=http://localhost:5173
```

---

## Testing Connection

### **1. Install Dependencies**

```bash
cd backend
npm install
```

### **2. Test MongoDB Connection**

Buat file test sederhana `backend/test-db.js`:

```javascript
require('dotenv').config();
const mongoose = require('mongoose');

const testConnection = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    console.log('URI:', process.env.MONGODB_URI.replace(/:[^:]*@/, ':****@')); // Hide password
    
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('✅ MongoDB Connected Successfully!');
    console.log('📊 Database:', mongoose.connection.name);
    console.log('🌐 Host:', mongoose.connection.host);
    
    // Test create a document
    const TestSchema = new mongoose.Schema({ test: String });
    const TestModel = mongoose.model('Test', TestSchema);
    
    const doc = await TestModel.create({ test: 'Hello MongoDB!' });
    console.log('📝 Test document created:', doc);
    
    // Clean up
    await TestModel.deleteMany({});
    console.log('🧹 Test document deleted');
    
    await mongoose.connection.close();
    console.log('👋 Connection closed');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

testConnection();
```

Jalankan:
```bash
node test-db.js
```

### **3. Start Server**

```bash
npm run dev
```

Output yang diharapkan:
```
✅ MongoDB Connected: flexitip.xxxxx.mongodb.net
📊 Database: flexitip
Server running on port 5000
```

---

## MongoDB Collections Structure

Setelah aplikasi berjalan, collections berikut akan auto-created:

```
flexitip (database)
├── users
├── jastipservices
├── products
├── orders
├── chats
└── messages
```

### **View Data:**

**MongoDB Compass (Local):**
- Connection: `mongodb://localhost:27017`
- Database: `flexitip`

**MongoDB Atlas (Cloud):**
- Dashboard → Database → Browse Collections
- Pilih database `flexitip`

---

## Troubleshooting

### ❌ **Error: Authentication failed**

```bash
# Fix: Check username/password di connection string
MONGODB_URI=mongodb+srv://CORRECT_USER:CORRECT_PASS@cluster.mongodb.net/flexitip
```

### ❌ **Error: Network timeout**

```bash
# Fix: Whitelist IP address di Atlas
# Network Access → Add IP → 0.0.0.0/0
```

### ❌ **Error: ECONNREFUSED (Local)**

```bash
# Fix: Start MongoDB service
net start MongoDB
```

### ❌ **Error: MongooseServerSelectionError**

```bash
# Check:
1. Internet connection
2. Firewall settings
3. MongoDB service running (local)
4. Connection string format
```

### ✅ **Connection String Format**

**Local:**
```
mongodb://localhost:27017/database_name
```

**Atlas:**
```
mongodb+srv://username:password@cluster.id.mongodb.net/database_name?options
```

**With Authentication (Local):**
```
mongodb://username:password@localhost:27017/database_name?authSource=admin
```

---

## Production Best Practices

### **1. Security**
```env
# ❌ Don't commit .env to git
# ✅ Use environment variables di hosting platform

# Heroku
heroku config:set MONGODB_URI="mongodb+srv://..."

# Vercel
# Add in Vercel Dashboard → Settings → Environment Variables

# DigitalOcean App Platform
# Add in App → Settings → App-Level Environment Variables
```

### **2. Connection Pooling**

```javascript
// Sudah di-handle oleh Mongoose secara default
// Max pool size: 10 connections
```

### **3. Monitoring**

**MongoDB Atlas:**
- Dashboard → Metrics
- View: Operations, Connections, Network

**Add to code:**
```javascript
mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});
```

### **4. Backup**

**MongoDB Atlas:**
- Automatic daily backups (Free tier)
- Backup → Configure Cloud Backup

**Local:**
```bash
# Export database
mongodump --uri="mongodb://localhost:27017/flexitip" --out=./backup

# Import database
mongorestore --uri="mongodb://localhost:27017/flexitip" ./backup/flexitip
```

---

## Quick Start Checklist

- [ ] Install MongoDB (local) atau create Atlas account
- [ ] Copy `.env.example` to `.env`
- [ ] Update `MONGODB_URI` in `.env`
- [ ] Install dependencies: `npm install`
- [ ] Test connection: `node test-db.js`
- [ ] Start server: `npm run dev`
- [ ] Verify: Check console for "MongoDB Connected" ✅

---

## Useful Commands

```bash
# MongoDB Service (Windows)
net start MongoDB          # Start
net stop MongoDB           # Stop
sc query MongoDB           # Check status

# Mongoose Commands (in code)
mongoose.connect()         # Connect
mongoose.disconnect()      # Disconnect
mongoose.connection.readyState  # 0=disconnected, 1=connected

# MongoDB Shell
mongosh                    # Open shell
show dbs                   # List databases
use flexitip              # Switch database
show collections          # List collections
db.users.find()           # Query collection
```

---

## Resources

- 📚 MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- 📚 Mongoose Docs: https://mongoosejs.com/docs/
- 📚 MongoDB Compass: https://www.mongodb.com/products/compass
- 📚 Connection String Format: https://www.mongodb.com/docs/manual/reference/connection-string/
