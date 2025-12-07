# 🔧 Fix: Authorization Error - Invalid Client

## Error yang Anda Alami:
```
Access blocked: Authorization Error
Error 401: invalid_client
no registered origin
```

## Penyebab:
Google OAuth memblokir request karena origin `http://localhost:5173` tidak terdaftar di Google Cloud Console.

---

## ✅ Solusi Lengkap

### Step 1: Buka Google Cloud Console
```
https://console.cloud.google.com/
```

### Step 2: Pilih Project Anda
- Klik dropdown project di header
- Pilih project yang Anda gunakan (yang punya Client ID: `35947141276...`)

### Step 3: Ke OAuth Credentials
1. Menu kiri → **APIs & Services**
2. Klik **Credentials**
3. Cari OAuth 2.0 Client IDs Anda
4. Klik nama client (atau icon pensil untuk edit)

### Step 4: Tambahkan Authorized JavaScript Origins
Scroll ke bagian **Authorized JavaScript origins**, klik **+ ADD URI**

Tambahkan URIs ini **SATU PER SATU**:
```
http://localhost:3000
http://localhost:5173
http://127.0.0.1:3000
```

### Step 5: Tambahkan Authorized Redirect URIs
Scroll ke bagian **Authorized redirect URIs**, klik **+ ADD URI**

Tambahkan URIs ini **SATU PER SATU**:
```
http://localhost:3000
http://localhost:3000/auth/callback
http://localhost:3000/auth/google/callback
http://localhost:5173
http://localhost:5000/api/auth/google/callback
```

### Step 6: SAVE
⚠️ **PENTING:** Klik tombol **SAVE** di bagian bawah!

### Step 7: Tunggu 5 Menit
Google perlu waktu untuk propagate perubahan (~1-5 menit)

---

## 🖼️ Screenshot Panduan

### Tampilan yang Benar:

**Authorized JavaScript origins:**
```
✓ http://localhost:3000
✓ http://localhost:5173
✓ http://127.0.0.1:3000
```

**Authorized redirect URIs:**
```
✓ http://localhost:3000
✓ http://localhost:3000/auth/callback
✓ http://localhost:3000/auth/google/callback
✓ http://localhost:5173
✓ http://localhost:5000/api/auth/google/callback
```

---

## 🔄 Setelah Save, Test Lagi:

### 1. Hapus Cache Browser
```
Ctrl + Shift + Delete
→ Clear cookies and cache
→ Last hour
```

### 2. Restart Dev Servers
```bash
# Stop both servers (Ctrl+C)

# Restart backend
cd backend
npm run dev

# Restart frontend (terminal baru)
cd ..
npm run dev
```

### 3. Test di Incognito/Private Window
- Buka browser private/incognito
- Go to `http://localhost:5173`
- Try Google login again

---

## 📝 Checklist Lengkap

Pastikan di Google Cloud Console:

### OAuth Consent Screen:
- [x] App name: sudah diisi
- [x] User support email: sudah diisi
- [x] Scopes added:
  - `./auth/userinfo.email`
  - `./auth/userinfo.profile`
  - `openid`

### Credentials (OAuth 2.0 Client):
- [x] Application type: **Web application**
- [x] Name: sudah diisi
- [x] Authorized JavaScript origins:
  - `http://localhost:3000` ✅
  - `http://localhost:5173` ✅
  - `http://127.0.0.1:3000` ✅
- [x] Authorized redirect URIs:
  - `http://localhost:3000` ✅
  - `http://localhost:3000/auth/callback` ✅
  - `http://localhost:5173` ✅
- [x] **SAVED** ✅

### Test Users (untuk Testing mode):
- [x] Email Anda ditambahkan: `ChalvinReza654@gmail.com`

---

## 🎯 Quick Fix Commands

### Verify Environment Variables
```bash
# Check frontend .env
cat .env | grep VITE_GOOGLE_CLIENT_ID

# Should output:
# VITE_GOOGLE_CLIENT_ID=35947141276-poi1u1sl523hoqq273jsfvq6topghmta.apps.googleusercontent.com

# Check backend .env
cat backend/.env | grep GOOGLE_CLIENT_ID

# Should output same Client ID
```

### Hard Reset (jika masih error)
```bash
# 1. Clear node modules
rm -rf node_modules
npm install

# 2. Clear browser cache completely
# Chrome: chrome://settings/clearBrowserData
# Firefox: about:preferences#privacy

# 3. Restart everything
npm run dev
```

---

## ⚠️ Common Mistakes

### ❌ SALAH:
```
Authorized JavaScript origins:
- http://localhost:3000/  ← Ada trailing slash
- localhost:3000          ← Tanpa http://
- https://localhost:3000  ← Pakai https (seharusnya http untuk localhost)
```

### ✅ BENAR:
```
Authorized JavaScript origins:
- http://localhost:3000   ← Tanpa trailing slash
- http://localhost:5173
- http://127.0.0.1:3000
```

---

## 🔍 Troubleshooting Lanjutan

### Jika masih error setelah save:

#### 1. Verify Client ID Match
```bash
# Di browser console (F12), check:
console.log(import.meta.env.VITE_GOOGLE_CLIENT_ID);

# Harus sama dengan yang di Google Console
```

#### 2. Check Network Tab
- Buka Dev Tools (F12)
- Tab Network
- Klik Google login button
- Lihat request yang gagal
- Check error message detail

#### 3. Test dengan curl
```bash
# Test backend endpoint
curl -X POST http://localhost:5000/api/auth/google \
  -H "Content-Type: application/json" \
  -d '{"credential":"test"}'

# Should return error (karena token invalid)
# Tapi TIDAK boleh CORS error
```

---

## 📞 Alternative: Buat OAuth Client Baru

Jika masih bermasalah, buat credential baru:

### 1. Google Cloud Console → Credentials
- Klik **+ CREATE CREDENTIALS**
- Pilih **OAuth client ID**

### 2. Configure:
- Application type: **Web application**
- Name: `FlexiTip Local Dev`

### 3. Authorized JavaScript origins:
```
http://localhost:3000
http://localhost:5173
http://127.0.0.1:3000
```

### 4. Authorized redirect URIs:
```
http://localhost:3000
http://localhost:3000/auth/callback
http://localhost:5173
```

### 5. Create & Copy New Credentials
- Copy Client ID
- Copy Client Secret

### 6. Update .env Files
```env
# Frontend .env
VITE_GOOGLE_CLIENT_ID=NEW_CLIENT_ID_HERE

# Backend backend/.env
GOOGLE_CLIENT_ID=NEW_CLIENT_ID_HERE
GOOGLE_CLIENT_SECRET=NEW_CLIENT_SECRET_HERE
```

### 7. Restart servers & test

---

## ✨ Expected Result

Setelah fix, Anda harus bisa:

1. ✅ Click "Continue with Google"
2. ✅ Google popup terbuka
3. ✅ Pilih akun tanpa error
4. ✅ Grant permissions
5. ✅ Redirect ke dashboard

---

## 📚 Resources

- [Google OAuth 2.0 Setup](https://developers.google.com/identity/protocols/oauth2)
- [Common OAuth Errors](https://developers.google.com/identity/protocols/oauth2/web-server#error-codes)
- [Testing OAuth Apps](https://developers.google.com/identity/gsi/web/guides/test-your-app)

---

**🎯 Main Solution: Add `http://localhost:3000` to Authorized JavaScript origins di Google Cloud Console, SAVE, tunggu 5 menit, test lagi!**
