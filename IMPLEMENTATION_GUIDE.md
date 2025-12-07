# Dokumentasi Perubahan Sistem FlexiTip

## Ringkasan Perubahan

Sistem FlexiTip telah dimodifikasi untuk mengimplementasikan flow baru dengan dua peran utama: **Customer** dan **Jastiper**. Perubahan ini mencakup update pada backend, frontend, dan database schema.

---

## 1. Perubahan Database

### 1.1 Tabel `users`
**Field Baru:**
- `role` - ENUM('customer', 'jastiper', 'admin') - Menggantikan enum lama ('user', 'admin')
- `asalDaerah` - VARCHAR(200) - Asal daerah user untuk filter produk

**Perubahan:**
- Role sekarang lebih eksplisit: `customer` untuk user biasa, `jastiper` untuk penyedia layanan jastip
- `asalDaerah` digunakan sebagai filter default untuk customer melihat produk

### 1.2 Tabel `products`
**Field Baru:**
- `asalProduk` - VARCHAR(200) - Lokasi asal produk (dari mana produk dijastip)
- `tujuanProduk` - VARCHAR(200) - Tujuan pengiriman produk (ke mana produk dikirim)

**Perubahan:**
- Produk sekarang memiliki informasi lengkap tentang rute jastip
- Customer hanya perlu memilih asal produk, tujuan otomatis dari `asalDaerah` mereka

### 1.3 Migration
File: `backend/database-migration.sql`
- Jalankan migration untuk update database yang sudah ada
- **PENTING:** Backup database sebelum menjalankan migration!

---

## 2. Perubahan Backend

### 2.1 Models

#### `User.js`
```javascript
role: ENUM('customer', 'jastiper', 'admin') DEFAULT 'customer'
asalDaerah: VARCHAR(200)
```

#### `Product.js`
```javascript
asalProduk: VARCHAR(200) NOT NULL
tujuanProduk: VARCHAR(200) NOT NULL
```

### 2.2 Controllers

#### `authController.js`
**Endpoint: POST /api/auth/register**
- Sekarang menerima `role` ('customer' atau 'jastiper')
- Sekarang menerima `asalDaerah` (required)
- Validasi role dan asalDaerah ditambahkan

Request body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "08123456789",
  "birthdate": "1990-01-01",
  "role": "customer",
  "asalDaerah": "Jakarta"
}
```

#### `productController.js`
**Endpoint Baru: GET /api/products/filter**
- Filter produk berdasarkan type (lokal/global), asalProduk, dan tujuanDaerah
- Digunakan oleh customer untuk melihat katalog sesuai preferensi

Query parameters:
```
type=lokal&asalProduk=Bandung&tujuanDaerah=Jakarta
```

**Endpoint: GET /api/products**
- Ditambahkan filter optional: `asalProduk`, `tujuanProduk`

#### `orderController.js`
**Endpoint Baru: POST /api/orders/quick-checkout**
- Checkout langsung dari halaman produk
- Auto-calculate pricing (item price + shipping + service fee)
- Update stock otomatis
- Update jastip service capacity

Request body:
```json
{
  "productId": "uuid",
  "quantity": 1,
  "shippingAddress": {
    "fullAddress": "Jl. Example No. 123",
    "city": "Jakarta"
  },
  "paymentMethod": "transfer",
  "notes": "Optional notes"
}
```

**Endpoint Baru: POST /api/orders/:id/payment**
- Simulasi konfirmasi pembayaran
- Update status order ke 'paid' dan 'confirmed'

---

## 3. Perubahan Frontend

### 3.1 Types (`types.ts`)
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isJastiper?: boolean;
  role?: 'customer' | 'jastiper' | 'admin';
  asalDaerah?: string;
  phone?: string;
}
```

### 3.2 Pages

#### `AuthPage.tsx`
**Perubahan:**
- Form registrasi sekarang menampilkan pilihan role (radio button)
- Input `asalDaerah` ditambahkan (required)
- Checkbox `isJastiper` diganti dengan radio button role

**UI:**
```
[ ] Customer  [x] Jastiper
Asal Daerah: [____________]
```

#### `Dashboard.tsx` (New)
**Fungsi:**
- Router berdasarkan role user
- Jika `role === 'jastiper'` → redirect ke `JastiperDashboard`
- Jika `role === 'customer'` → redirect ke `ProductCatalog`

#### `ProductCatalog.tsx` (New)
**Fungsi:** Halaman katalog untuk Customer

**Fitur:**
- Toggle filter Lokal/Global
- Input asal produk (dari mana dijastip)
- Tujuan produk otomatis dari `user.asalDaerah`
- Search bar untuk cari produk
- Grid produk dengan info lengkap
- Button "Beli Sekarang" langsung ke checkout

**Filter:**
```
[ Lokal ] [ Global ]
Asal Produk: [Singapore_____] [Search]
Tujuan: Jakarta (otomatis dari profile)
```

#### `JastiperDashboard.tsx` (New)
**Fungsi:** Dashboard untuk Jastiper mengelola produk

**Fitur:**
- List semua produk milik jastiper
- Tambah produk baru
- Edit produk existing
- Hapus produk
- Form produk lengkap dengan:
  - Nama, deskripsi, brand, kategori
  - Harga, stok
  - **Asal produk** (user input)
  - **Tujuan produk** (otomatis dari `asalDaerah` jastiper)
  - Upload gambar (URL)

**Catatan:**
- Tujuan produk otomatis diisi dari asal daerah jastiper
- Jastiper hanya perlu input asal produk (dari mana barang dijastip)

#### `CheckoutPage.tsx` (New)
**Fungsi:** Halaman checkout untuk pembelian langsung

**Fitur:**
- Detail produk dengan gambar
- Quantity selector
- Input alamat pengiriman
- Pilihan metode pembayaran:
  - Transfer Bank
  - E-Wallet (GoPay/OVO/Dana)
  - COD
- Ringkasan harga (item + ongkir + biaya layanan)
- Simulasi pembayaran
- Konfirmasi pembayaran

**Flow:**
1. Customer pilih produk → Checkout
2. Isi jumlah, alamat, metode bayar
3. Proses Checkout → Modal konfirmasi pembayaran
4. Konfirmasi pembayaran (simulasi) → Order berhasil

#### `App.tsx`
**Route Baru:**
```
/checkout/:productId - Halaman checkout produk
```

---

## 4. Flow User

### 4.1 Flow Customer
1. **Register** → Pilih role "Customer" + isi asal daerah
2. **Login** → Masuk ke `ProductCatalog`
3. **Filter Produk** → Pilih Lokal/Global, pilih asal produk
   - Contoh: Lokal, dari Bandung ke Jakarta (Jakarta = asal daerah customer)
4. **Pilih Produk** → Klik "Beli Sekarang"
5. **Checkout** → Isi detail pembelian
6. **Bayar** → Konfirmasi pembayaran (simulasi)
7. **Selesai** → Order berhasil

### 4.2 Flow Jastiper
1. **Register** → Pilih role "Jastiper" + isi asal daerah
2. **Login** → Masuk ke `JastiperDashboard`
3. **Tambah Produk** → Klik "Tambah Produk Baru"
   - Isi nama, harga, stok, dll
   - **Asal Produk:** Input manual (misal: Singapore)
   - **Tujuan Produk:** Otomatis dari asal daerah (misal: Jakarta)
4. **Kelola Produk** → Edit/Hapus produk yang ada
5. **Produk Tampil di Katalog** → Customer bisa lihat dan beli

---

## 5. Validasi & Keamanan

### Backend Validations:
- `role` harus 'customer' atau 'jastiper' saat registrasi
- `asalDaerah` required saat registrasi
- `asalProduk` dan `tujuanProduk` required saat create/update product
- User ownership validation untuk edit/delete product
- Stock validation saat checkout
- Token authentication untuk semua endpoint protected

### Frontend Validations:
- Form validation untuk semua input required
- Stock check sebelum checkout
- Role-based routing (customer vs jastiper)
- Protected routes dengan auth check

---

## 6. API Endpoints Summary

### Authentication
- `POST /api/auth/register` - Register dengan role & asalDaerah
- `POST /api/auth/login` - Login

### Products
- `GET /api/products` - Get all products (dengan optional filters)
- `GET /api/products/filter` - Filter products by location & type
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Jastiper only)
- `PUT /api/products/:id` - Update product (Jastiper only)
- `DELETE /api/products/:id` - Delete product (Jastiper only)

### Orders
- `POST /api/orders/quick-checkout` - Quick checkout dari product
- `POST /api/orders/:id/payment` - Konfirmasi pembayaran (simulasi)
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get single order

---

## 7. Testing

### Test Scenario Customer:
1. Register sebagai customer dengan asal daerah "Jakarta"
2. Login dan lihat katalog
3. Filter: Lokal, dari Bandung
4. Lihat produk dengan rute Bandung → Jakarta
5. Beli produk dan checkout
6. Konfirmasi pembayaran

### Test Scenario Jastiper:
1. Register sebagai jastiper dengan asal daerah "Jakarta"
2. Login ke dashboard jastiper
3. Tambah produk baru:
   - Nama: "Baju Thailand"
   - Asal: "Bangkok"
   - Tujuan: "Jakarta" (otomatis)
4. Produk muncul di katalog customer
5. Edit dan hapus produk

---

## 8. Deployment

### Database Migration:
```bash
mysql -u username -p database_name < backend/database-migration.sql
```

### Backend:
```bash
cd backend
npm install
npm start
```

### Frontend:
```bash
npm install
npm run dev
```

---

## 9. Catatan Penting

1. **Asal Daerah:**
   - Wajib diisi saat registrasi
   - Digunakan sebagai default filter untuk customer
   - Digunakan sebagai tujuan default untuk produk jastiper

2. **Produk Routing:**
   - Customer hanya input asal produk
   - Tujuan produk = asal daerah customer
   - Jastiper input asal produk, tujuan = asal daerah jastiper

3. **Simulasi Pembayaran:**
   - Sistem menggunakan simulasi untuk pembayaran
   - Status order langsung 'paid' setelah konfirmasi
   - Untuk production, integrasikan dengan payment gateway real

4. **JastipService:**
   - Produk masih terikat dengan JastipService
   - Untuk implementasi penuh, perlu buat/update JastipService saat jastiper tambah produk pertama
   - Saat ini bisa di-handle manual atau dengan seeder

---

## 10. Future Improvements

1. **Auto-create JastipService** saat jastiper tambah produk pertama
2. **Real Payment Gateway** integration (Midtrans, Xendit, dll)
3. **Upload Image** menggunakan file upload, bukan URL
4. **Notification System** untuk order updates
5. **Rating & Review** untuk jastiper dan produk
6. **Order Tracking** dengan status updates
7. **Chat System** antara customer dan jastiper
8. **Multi-address** support untuk customer
9. **Product Categories** management
10. **Search & Filter** enhancement dengan autocomplete

---

## Kontak & Support

Jika ada pertanyaan atau issue, silakan dokumentasikan di:
- GitHub Issues
- Project README
- Developer documentation

---

**Last Updated:** December 7, 2025
**Version:** 2.0.0
