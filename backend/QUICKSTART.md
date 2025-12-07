# 🚀 Quick Start - FlexiTip Backend

## Step-by-Step Setup (10 menit)

### 1️⃣ Install Dependencies

```bash
cd backend
npm install
```

### 2️⃣ Setup MySQL

**Pilih salah satu:**

#### **Opsi A: MySQL Local** 

1. Download & Install MySQL dari https://dev.mysql.com/downloads/installer/
2. Atau via Chocolatey:
   ```bash
   choco install mysql
   ```
3. Create database:
   ```sql
   mysql -u root -p
   CREATE DATABASE flexitip CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   EXIT;
   ```

#### **Opsi B: PlanetScale (Cloud) - RECOMMENDED ⭐**

1. Buka https://planetscale.com/
2. Sign up gratis (5GB)
3. Create database: `flexitip`
4. Get connection credentials

### 3️⃣ Configure Environment Variables

```bash
# Copy .env.example
copy .env.example .env

# Edit .env file
notepad .env
```

**Minimal Configuration:**
```env
PORT=5000
NODE_ENV=development

# MySQL (pilih salah satu)
# Local:
DB_HOST=localhost
DB_PORT=3306
DB_NAME=flexitip
DB_USER=root
DB_PASSWORD=your_mysql_password

# Or PlanetScale:
# DB_HOST=aws.connect.psdb.cloud
# DB_NAME=flexitip
# DB_USER=your_username
# DB_PASSWORD=pscale_pw_xxxxx
# DB_SSL=true

# JWT
JWT_SECRET=your-super-secret-key-minimum-32-characters-here
JWT_EXPIRE=7d

# Frontend
FRONTEND_URL=http://localhost:5173
```

### 4️⃣ Test MySQL Connection

```bash
npm run test:db
```

**Expected Output:**
```
✅ MySQL Connected Successfully!
🧪 Testing CRUD Operations...
✅ All tests passed!
```

### 5️⃣ Start Development Server

```bash
npm run dev
```

**Expected Output:**
```
✅ MySQL Connected: localhost
📊 Database: flexitip
📋 Database synchronized
Server running on port 5000
```

### 6️⃣ Test API

Open browser atau Postman:

**Health Check:**
```
GET http://localhost:5000/health
```

**Response:**
```json
{
  "success": true,
  "message": "Server is running"
}
```

**Register User:**
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "phone": "08123456789"
}
```

---

## 🎯 Quick Reference

### Available Scripts

```bash
npm start          # Production mode
npm run dev        # Development mode (with nodemon)
npm run test:db    # Test MongoDB connection
npm test           # Run tests
```

### API Endpoints

```
📍 Base URL: http://localhost:5000/api

Authentication:
├─ POST   /auth/register          # Register new user
├─ POST   /auth/login             # Login
├─ POST   /auth/google            # Google OAuth
├─ GET    /auth/me                # Get current user (protected)
├─ PUT    /auth/profile           # Update profile (protected)
└─ PUT    /auth/password          # Update password (protected)

Jastip Services:
├─ GET    /jastip                 # Get all services
├─ GET    /jastip/:id             # Get single service
├─ POST   /jastip                 # Create service (jastiper only)
├─ PUT    /jastip/:id             # Update service (owner only)
├─ DELETE /jastip/:id             # Delete service (owner only)
└─ POST   /jastip/:id/rating      # Add rating

Products:
├─ GET    /products               # Get all products
├─ GET    /products/:id           # Get single product
├─ POST   /products               # Create product (jastiper only)
├─ PUT    /products/:id           # Update product
└─ DELETE /products/:id           # Delete product

Orders:
├─ POST   /orders                 # Create order
├─ GET    /orders                 # Get user orders
├─ GET    /orders/:id             # Get single order
├─ PUT    /orders/:id/status      # Update status (jastiper)
├─ PUT    /orders/:id/payment     # Update payment
├─ PUT    /orders/:id/cancel      # Cancel order
└─ POST   /orders/:id/rating      # Add rating

Chat:
├─ GET    /chats                  # Get all chats
├─ POST   /chats                  # Create chat
├─ GET    /chats/:id              # Get single chat
├─ GET    /chats/:id/messages     # Get messages
├─ POST   /chats/:id/messages     # Send message
├─ PUT    /chats/:id/read         # Mark as read
└─ DELETE /chats/:chatId/messages/:messageId  # Delete message
```

### Environment Variables Checklist

```env
✅ REQUIRED (untuk basic functionality):
   ├─ DB_HOST
   ├─ DB_PORT
   ├─ DB_NAME
   ├─ DB_USER
   ├─ DB_PASSWORD
   ├─ JWT_SECRET
   └─ PORT

⚠️ OPTIONAL (untuk fitur lengkap):
   ├─ GOOGLE_CLIENT_ID (Google OAuth)
   ├─ GOOGLE_CLIENT_SECRET (Google OAuth)
   ├─ CLOUDINARY_* (File upload)
   ├─ STRIPE_* (Payment)
   └─ EMAIL_* (Email notifications)
```

---

## 🔧 Troubleshooting

### MySQL Connection Failed

```bash
# Check .env file
cat .env | findstr DB_

# Test connection
npm run test:db

# Common fixes:
# 1. Check DB_USER/DB_PASSWORD
# 2. Create database: CREATE DATABASE flexitip;
# 3. Start MySQL service: net start MySQL80
```

### Port Already in Use

```bash
# Change port in .env
PORT=5001

# Or kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Module Not Found

```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

---

## 📚 Documentation

- `README.md` - Project overview & features
- `MYSQL_SETUP.md` - Detailed MySQL setup
- `MIGRATION_GUIDE.md` - MongoDB to MySQL migration
- `AUTHENTICATION_GUIDE.md` - Auth implementation guide
- `.env.example` - Environment variables template

---

## 🎉 Next Steps

1. ✅ Setup MySQL
2. ✅ Start backend server
3. 🔄 Setup frontend (di folder root)
4. 🔄 Connect frontend ke backend
5. 🔄 Test full authentication flow
6. 🔄 Add optional services (Cloudinary, Stripe, etc.)

---

## 💬 Need Help?

Common issues & solutions ada di `MYSQL_SETUP.md` section "Troubleshooting".

Backend dengan MySQL siap digunakan! 🚀
