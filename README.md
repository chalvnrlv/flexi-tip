<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# FlexiTip - Platform Jastip Modern (Demo App)

Platform marketplace untuk layanan jasa titip (jastip) yang menghubungkan customer dengan jastiper untuk belanja dari berbagai daerah.

**🎯 APLIKASI DEMO - Frontend Only dengan Mock Data**

Aplikasi ini dibuat untuk tujuan demonstrasi dan simulasi. Semua data menggunakan mock data dengan locale Indonesia yang disimpan di localStorage browser. Tidak memerlukan backend server atau database.

## 🌟 Fitur Utama

### Untuk Customer:
- ✅ Registrasi dengan asal daerah
- ✅ Browse katalog produk dari berbagai lokasi (Thailand, Korea, Jepang, Singapore, Bali, Jogja)
- ✅ Filter produk lokal/global berdasarkan rute
- ✅ Checkout langsung dengan simulasi pembayaran
- ✅ Data tersimpan di localStorage browser

### Untuk Jastiper:
- ✅ Dashboard kelola produk
- ✅ Tambah, edit, hapus produk
- ✅ Otomatis set rute produk (asal → tujuan)
- ✅ Manajemen stok dengan mock data

## 🚀 Quick Start (Demo Mode)

**Prerequisites:** Node.js v16+

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Access Application
Open browser: http://localhost:5173

## 🎭 Demo Accounts

### Customers:
- **Email:** budi@customer.com | **Password:** password123 | **Daerah:** Jakarta
- **Email:** siti@customer.com | **Password:** password123 | **Daerah:** Bandung
- **Email:** andi@customer.com | **Password:** password123 | **Daerah:** Surabaya

### Jastipers:
- **Email:** sarah@jastiper.com | **Password:** password123 | **Daerah:** Jakarta
- **Email:** thailand@jastiper.com | **Password:** password123 | **Daerah:** Jakarta (Thailand Import)
- **Email:** korea@jastiper.com | **Password:** password123 | **Daerah:** Bandung (Korea Shop)

## 📖 Dokumentasi

Lihat dokumentasi lengkap di:
- **[RINGKASAN.md](RINGKASAN.md)** - Ringkasan perubahan & konsep (START HERE)
- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Panduan setup & deployment
- **[IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md)** - Dokumentasi teknis lengkap
- **[IMPLEMENTATION_CHECKLIST.md](IMPLEMENTATION_CHECKLIST.md)** - Checklist implementasi

## 🎯 Konsep Flow

### Customer Flow:
```
Daftar (Customer + Asal Daerah)
    ↓
Login → Katalog Produk (20+ produk dari Thailand, Korea, Japan, Singapore, Bali, Jogja)
    ↓
Filter (Lokal/Global + Asal Produk)
    ↓
Pilih Produk → Checkout
    ↓
Bayar (Simulasi) → Order Tersimpan di localStorage
```

### Jastiper Flow:
```
Daftar (Jastiper + Asal Daerah)
    ↓
Login → Dashboard Jastiper
    ↓
Tambah Produk (Asal = Lokasi Anda, Tujuan Custom)
    ↓
Produk Tersimpan di localStorage
    ↓
Muncul di Katalog untuk Customer
```

## 🛠 Tech Stack

### Frontend Only:
- React + TypeScript
- Vite
- TailwindCSS
- Zustand (state management)
- React Router
- localStorage untuk persistensi data

### Mock Data:
- 20+ produk dengan gambar dari placehold.co
- 12 user (5 customer, 7 jastiper) dengan avatar dari pravatar.cc
- 20 kota Indonesia + 10 lokasi global
- Helper functions untuk CRUD operations

## 📂 Struktur Project

```
flexi-tip/
├── pages/                # React pages
│   ├── ProductCatalog.tsx      # Katalog produk dengan filter
│   ├── JastiperDashboard.tsx   # CRUD produk untuk jastiper
│   ├── CheckoutPage.tsx        # Checkout & payment
│   └── AuthPage.tsx            # Login/Register
├── components/           # React components
│   ├── layout/
│   │   ├── MainLayout.tsx
│   │   ├── Navbar.tsx
│   │   └── BottomNav.tsx
│   ├── Button.tsx
│   └── Input.tsx
├── src/
│   ├── mockData.ts      # Mock data & helper functions
│   └── config.ts
├── store/
│   └── authStore.ts     # Zustand auth state
└── docs/                # Documentation
```

## 🧪 Testing

### Test Customer:
1. Register: role=Customer, asalDaerah=Jakarta
2. Login dengan budi@customer.com / password123
3. Lihat katalog → Filter: Global, dari Bangkok
4. Pilih Srichand Powder → Checkout → Pilih metode bayar → Konfirmasi

### Test Jastiper:
1. Register: role=Jastiper, asalDaerah=Surabaya
2. Login dengan korea@jastiper.com / password123
3. Dashboard → Tambah produk baru
4. Isi form: Nama, harga, stok, kategori
5. Produk tersimpan dan muncul di katalog

## 💾 Data Storage

Aplikasi menggunakan localStorage browser untuk menyimpan:
- `flexitip_users` - Daftar user (customer & jastiper)
- `flexitip_products` - Daftar produk dari semua jastiper
- `flexitip_orders` - Daftar order customer
- `flexitip_auth` - Session authentication

## 🎨 Mock Data Highlights

### 20 Produk dari:
- **Thailand:** Srichand Powder, Mistine Mascara, Snake Brand Powder
- **Korea:** Laneige Sleeping Mask, Innisfree Serum, Samyang Ramen
- **Japan:** Shiseido Whip, Pocky, Hatomugi Lotion
- **Singapore:** Tiger Balm, Kaya Spread
- **Bali:** Pie Susu, Kopi Luwak, Bali Soap
- **Yogyakarta:** Bakpia Pathok, Batik Tulis, Gudeg Kaleng

### 12 Users:
- 5 Customer (Budi, Siti, Andi, Dewi, Rudi) di Jakarta, Bandung, Surabaya, Yogyakarta, Medan
- 7 Jastiper dengan spesialisasi Thailand, Korea, Japan, Singapore, Bali, Jogja

## 🚀 Deployment

Karena aplikasi frontend-only, bisa deploy ke:
- **Vercel:** `vercel --prod`
- **Netlify:** `netlify deploy --prod`
- **GitHub Pages:** Build dan push ke gh-pages
- **Cloudflare Pages:** Connect repo dan auto-deploy

```bash
# Build production
npm run build

# Output akan di folder dist/
# Upload dist/ ke hosting pilihan Anda
```

## 🤝 Contributing

Contributions are welcome! Please read IMPLEMENTATION_GUIDE.md first.

## 📄 License

MIT License

## 📞 Support

Baca dokumentasi lengkap atau create issue di repository.

---

**Version:** 3.0.0 (Demo Mode)  
**Last Updated:** December 2024  
**Mode:** Frontend Only - Mock Data
