# 🎯 Quick Fix: Google OAuth Error 401

## Error Anda:
```
Access blocked: Authorization Error
Error 401: invalid_client
no registered origin
```

---

## ⚡ SOLUSI CEPAT (5 Langkah)

### 1️⃣ Buka Google Cloud Console
```
https://console.cloud.google.com/apis/credentials
```

### 2️⃣ Edit OAuth Client
- Cari client dengan ID: `35947141276-poi1u1sl523hoqq273jsfvq6topghmta`
- Klik nama atau icon pensil ✏️

### 3️⃣ Tambahkan Origins
Di bagian **Authorized JavaScript origins**, tambahkan:
```
http://localhost:3000
```

### 4️⃣ Tambahkan Redirect URIs  
Di bagian **Authorized redirect URIs**, tambahkan:
```
http://localhost:3000
http://localhost:3000/auth/callback
```

### 5️⃣ SAVE & Tunggu
- Klik **SAVE** di bagian bawah
- Tunggu **5 menit**
- Clear browser cache
- Test lagi!

---

## 📸 Visual Guide

```
┌─────────────────────────────────────────────────┐
│  Google Cloud Console                           │
│  ┌────────────────────────────────────┐        │
│  │ OAuth 2.0 Client IDs               │        │
│  │                                    │        │
│  │ Name: [Your App]                   │        │
│  │ Client ID: 35947141276-poi...      │  ← Ini │
│  │                                    │        │
│  │ [Edit] ← Klik ini                  │        │
│  └────────────────────────────────────┘        │
└─────────────────────────────────────────────────┘

                     ↓

┌─────────────────────────────────────────────────┐
│  Edit OAuth 2.0 Client                          │
│                                                 │
│  ┌─ Authorized JavaScript origins ──────────┐  │
│  │                                           │  │
│  │  ✓ http://localhost:3000 ← TAMBAHKAN INI │  │
│  │  ✓ http://localhost:5173                 │  │
│  │                                           │  │
│  │  [+ ADD URI]                              │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  ┌─ Authorized redirect URIs ────────────────┐  │
│  │                                           │  │
│  │  ✓ http://localhost:3000                 │  │
│  │  ✓ http://localhost:3000/auth/callback   │  │
│  │                                           │  │
│  │  [+ ADD URI]                              │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  [CANCEL]              [SAVE] ← KLIK INI       │
└─────────────────────────────────────────────────┘
```

---

## ✅ Checklist Cepat

Pastikan sudah:
- [ ] Buka Google Cloud Console
- [ ] Masuk ke APIs & Services → Credentials  
- [ ] Edit OAuth client yang benar (35947141276...)
- [ ] Tambah `http://localhost:3000` di JavaScript origins
- [ ] Tambah `http://localhost:3000` di Redirect URIs
- [ ] Klik **SAVE**
- [ ] Tunggu 5 menit
- [ ] Clear cache browser (Ctrl+Shift+Delete)
- [ ] Test lagi di incognito window

---

## 🔄 After Fix

```bash
# 1. Clear cache
# Chrome: Ctrl+Shift+Delete → Clear cache

# 2. Restart frontend
cd C:\Users\KATANA GF66\Downloads\flexi-tip
npm run dev

# 3. Test di browser
# http://localhost:3000
```

---

## ❓ Still Not Working?

### Option 1: Wait Longer
Google bisa butuh hingga **10 menit** untuk update credentials.

### Option 2: Use Different Email
Tambahkan email Anda sebagai **Test User**:
1. Google Cloud Console
2. OAuth consent screen
3. Test users → ADD USERS
4. Tambah: `ChalvinReza654@gmail.com`
5. SAVE

### Option 3: Check Client ID
```bash
# Verify .env
cat .env
# Pastikan VITE_GOOGLE_CLIENT_ID sama dengan di Google Console
```

---

## 📝 URIs yang Harus Ditambahkan

### Minimal (untuk development):
```
JavaScript Origins:
✓ http://localhost:3000

Redirect URIs:
✓ http://localhost:3000
```

### Recommended (lebih lengkap):
```
JavaScript Origins:
✓ http://localhost:3000
✓ http://localhost:5173
✓ http://127.0.0.1:3000

Redirect URIs:
✓ http://localhost:3000
✓ http://localhost:3000/auth/callback
✓ http://localhost:5173
```

---

## 🎯 Summary

**Root Cause:** Origin `http://localhost:3000` tidak terdaftar

**Solution:** Tambahkan origin tersebut di Google Cloud Console

**Steps:**
1. Console → Credentials → Edit OAuth Client
2. Add `http://localhost:3000` to JavaScript origins
3. Add `http://localhost:3000` to Redirect URIs  
4. SAVE
5. Wait 5 min + clear cache
6. Test!

---

**Need help? Check: `FIX_OAUTH_ERROR.md` untuk panduan lengkap!**
