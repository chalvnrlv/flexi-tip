# FlexiTip - Setup dan Deployment Guide

## Quick Start

### Prerequisites
- Node.js v16+ dan npm
- MySQL 8.0+
- Git

### 1. Clone & Install

```bash
# Clone repository
git clone <repository-url>
cd flexi-tip

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Setup Database

```bash
# Login ke MySQL
mysql -u root -p

# Buat database
CREATE DATABASE flexitip;
USE flexitip;

# Import schema
SOURCE backend/database-schema.sql;

# (Optional) Jika update dari versi lama, jalankan migration
SOURCE backend/database-migration.sql;
```

### 3. Environment Variables

#### Backend (.env di folder backend/)
```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=flexitip

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=30d

# Server
PORT=5000
NODE_ENV=development

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

#### Frontend (.env di root folder)
```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### 4. Run Development

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend (di root folder)
npm run dev
```

Aplikasi akan berjalan di:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

---

## Testing Flow

### Test sebagai Customer

1. **Registrasi Customer**
   - Buka http://localhost:5173
   - Klik "Daftar"
   - Isi form:
     - Nama: "Customer Test"
     - Email: "customer@test.com"
     - Password: "password123"
     - Phone: "08123456789"
     - Asal Daerah: "Jakarta"
     - Role: Pilih "Customer"
   - Klik "Daftar"

2. **Login & Browse Produk**
   - Login dengan email & password
   - Akan masuk ke halaman ProductCatalog
   - Toggle Lokal/Global
   - Input asal produk (misal: "Bandung")
   - Klik Search
   - Lihat katalog produk

3. **Beli Produk**
   - Klik "Beli Sekarang" pada produk
   - Masuk halaman checkout
   - Atur jumlah produk
   - Isi alamat pengiriman
   - Pilih metode pembayaran
   - Klik "Proses Checkout"
   - Konfirmasi pembayaran (simulasi)

### Test sebagai Jastiper

1. **Registrasi Jastiper**
   - Buka http://localhost:5173
   - Klik "Daftar"
   - Isi form:
     - Nama: "Jastiper Test"
     - Email: "jastiper@test.com"
     - Password: "password123"
     - Phone: "08987654321"
     - Asal Daerah: "Jakarta"
     - Role: Pilih "Jastiper"
   - Klik "Daftar"

2. **Login & Kelola Produk**
   - Login dengan email & password
   - Akan masuk ke JastiperDashboard
   - Klik "Tambah Produk Baru"

3. **Tambah Produk**
   - Isi form produk:
     - Nama: "Baju Thailand"
     - Deskripsi: "Baju import Thailand"
     - Brand: "Thai Fashion"
     - Kategori: "Fashion"
     - Harga: 250000
     - Stok: 10
     - Asal Produk: "Bangkok"
     - Tujuan: Jakarta (otomatis)
   - Tambah foto (URL)
   - Klik "Tambah"

4. **Edit/Hapus Produk**
   - Klik icon Edit (pensil) untuk edit
   - Klik icon Hapus (trash) untuk delete

---

## Production Deployment

### Backend (Node.js)

```bash
# Build (jika ada TypeScript)
npm run build

# Start production
npm start

# Atau dengan PM2
pm2 start src/server.js --name "flexitip-backend"
```

### Frontend (Vite)

```bash
# Build production
npm run build

# Preview build
npm run preview

# Deploy folder 'dist' ke hosting (Vercel, Netlify, dll)
```

### Database

```bash
# Backup database
mysqldump -u root -p flexitip > backup.sql

# Restore database
mysql -u root -p flexitip < backup.sql
```

---

## Troubleshooting

### Error: Cannot connect to database
- Pastikan MySQL running
- Cek credentials di `.env`
- Cek database sudah dibuat

### Error: JWT secret not defined
- Tambahkan `JWT_SECRET` di backend/.env
- Generate random string untuk production

### Error: CORS
- Pastikan `FRONTEND_URL` di backend/.env sesuai
- Cek CORS middleware di backend/src/server.js

### Products tidak muncul
- Cek apakah jastiper sudah buat produk
- Cek filter asal/tujuan produk sesuai
- Cek console browser untuk error

### Checkout gagal
- Pastikan stok produk cukup
- Cek token authentication
- Cek network tab di browser devtools

---

## Architecture

```
flexi-tip/
├── backend/
│   ├── src/
│   │   ├── config/        # Database & upload config
│   │   ├── controllers/   # Route handlers
│   │   ├── middleware/    # Auth, error handling
│   │   ├── models/        # Sequelize models
│   │   ├── routes/        # API routes
│   │   ├── utils/         # JWT, email utilities
│   │   └── server.js      # Express app
│   ├── database-schema.sql
│   ├── database-migration.sql
│   └── package.json
├── pages/                 # React pages
│   ├── AuthPage.tsx
│   ├── Dashboard.tsx
│   ├── ProductCatalog.tsx
│   ├── JastiperDashboard.tsx
│   ├── CheckoutPage.tsx
│   └── WelcomePage.tsx
├── components/            # React components
├── store/                 # Zustand state management
├── App.tsx
└── package.json
```

---

## API Documentation

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - List products
- `GET /api/products/filter` - Filter products by location
- `GET /api/products/:id` - Get product detail
- `POST /api/products` - Create product (Jastiper)
- `PUT /api/products/:id` - Update product (Jastiper)
- `DELETE /api/products/:id` - Delete product (Jastiper)

### Orders
- `POST /api/orders/quick-checkout` - Quick checkout
- `POST /api/orders/:id/payment` - Confirm payment
- `GET /api/orders` - List user orders
- `GET /api/orders/:id` - Get order detail

Lihat `IMPLEMENTATION_GUIDE.md` untuk dokumentasi lengkap.

---

## Support

Untuk pertanyaan atau issue:
1. Cek IMPLEMENTATION_GUIDE.md
2. Cek troubleshooting section di atas
3. Buat issue di repository

---

**Version:** 2.0.0  
**Last Updated:** December 7, 2025
