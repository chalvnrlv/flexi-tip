# 🔐 Google OAuth Setup Guide

## Overview
Google OAuth memungkinkan user login menggunakan akun Google mereka tanpa perlu registrasi manual.

---

## 📋 Prerequisites
- Google Account
- Project sudah berjalan di `http://localhost:5000` (backend) dan `http://localhost:5173` (frontend)

---

## 1️⃣ Setup Google Cloud Console

### Step 1: Buat Project Baru
1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Klik **Select a Project** → **New Project**
3. Masukkan nama project: `FlexiTip`
4. Klik **Create**

### Step 2: Enable Google+ API
1. Di dashboard, cari **APIs & Services** → **Library**
2. Search: `Google+ API`
3. Klik **Enable**

### Step 3: Configure OAuth Consent Screen
1. Pilih **APIs & Services** → **OAuth consent screen**
2. Pilih **External** (untuk testing dengan email manapun)
3. Klik **Create**

4. **App Information:**
   - App name: `FlexiTip`
   - User support email: `your-email@gmail.com`
   - Developer contact: `your-email@gmail.com`

5. **Scopes:**
   - Klik **Add or Remove Scopes**
   - Pilih:
     - `./auth/userinfo.email`
     - `./auth/userinfo.profile`
     - `openid`
   - Klik **Update**

6. **Test Users** (untuk development):
   - Tambahkan email yang akan digunakan untuk testing
   - Contoh: `test@gmail.com`, `dev@gmail.com`

7. Klik **Save and Continue** hingga selesai

### Step 4: Create OAuth 2.0 Credentials
1. Pilih **APIs & Services** → **Credentials**
2. Klik **Create Credentials** → **OAuth client ID**
3. Application type: **Web application**
4. Name: `FlexiTip Web Client`

5. **Authorized JavaScript origins:**
   ```
   http://localhost:5173
   http://localhost:3000
   ```

6. **Authorized redirect URIs:**
   ```
   http://localhost:5173/auth/google/callback
   http://localhost:5000/api/auth/google/callback
   ```

7. Klik **Create**
8. **SIMPAN** Client ID dan Client Secret yang muncul!

---

## 2️⃣ Update Backend Configuration

### Update `.env` File
```env
# Google OAuth
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxxxxxx

# Frontend URL (untuk redirect)
FRONTEND_URL=http://localhost:5173
```

### File Structure yang Diperlukan
```
backend/
├── src/
│   ├── controllers/
│   │   └── authController.js    ✅ Sudah ada
│   ├── routes/
│   │   └── authRoutes.js        ✅ Sudah ada
│   ├── middleware/
│   │   └── auth.js              ✅ Sudah ada
│   └── models/
│       └── User.js              ✅ Sudah ada (supports googleId)
```

---

## 3️⃣ Testing OAuth Flow

### Backend Endpoint
Endpoint OAuth sudah tersedia di `authController.js`:

```javascript
// POST /api/auth/google
{
  "credential": "eyJhbGciOiJSUzI1NiIsImtpZCI6..." // Google ID Token
}
```

### Flow Diagram
```
User → Click "Login with Google"
  ↓
Frontend → Google OAuth Popup
  ↓
Google → Returns ID Token
  ↓
Frontend → POST /api/auth/google { credential }
  ↓
Backend → Verify token with Google
  ↓
Backend → Find or Create User
  ↓
Backend → Generate JWT Token
  ↓
Frontend → Save token & redirect to dashboard
```

---

## 4️⃣ Frontend Integration

### Install Google OAuth Library
```bash
npm install @react-oauth/google
```

### Wrap App with GoogleOAuthProvider

**Update `App.tsx`:**
```tsx
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      {/* Your existing routes */}
    </GoogleOAuthProvider>
  );
}
```

### Add Google Login Button

**Update `AuthPage.tsx`:**
```tsx
import { GoogleLogin } from '@react-oauth/google';

function AuthPage() {
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          credential: credentialResponse.credential
        })
      });

      const data = await response.json();
      
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.href = '/dashboard';
      }
    } catch (error) {
      console.error('Google login failed:', error);
    }
  };

  return (
    <div>
      {/* Existing login form */}
      
      <div className="or-divider">
        <span>OR</span>
      </div>

      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => console.log('Login Failed')}
        useOneTap
      />
    </div>
  );
}
```

---

## 5️⃣ Testing Checklist

### ✅ Pre-Testing
- [ ] MySQL database running
- [ ] Backend running (`npm run dev`)
- [ ] Frontend running (`npm run dev`)
- [ ] Google credentials di `.env` sudah benar

### ✅ Test OAuth Flow
1. **Buka browser:** `http://localhost:5173`
2. **Klik "Login with Google"**
3. **Pilih Google account** (gunakan test user yang sudah didaftarkan)
4. **Verify redirect** ke dashboard
5. **Check console** untuk errors
6. **Check database** apakah user baru ter-create

### ✅ Verify Database
```sql
SELECT * FROM users WHERE googleId IS NOT NULL;
```

Expected result:
```
| id    | name       | email           | googleId      | isVerified |
|-------|------------|-----------------|---------------|------------|
| uuid  | John Doe   | john@gmail.com  | 123456789...  | 1          |
```

---

## 6️⃣ Common Issues & Solutions

### Issue 1: "redirect_uri_mismatch"
**Solution:** Pastikan redirect URI di Google Console sama persis dengan yang di code
```
Google Console: http://localhost:5173/auth/google/callback
Frontend code:  http://localhost:5173/auth/google/callback
```

### Issue 2: "Access blocked: This app's request is invalid"
**Solution:** 
- Tambahkan email Anda sebagai Test User di OAuth Consent Screen
- Pastikan app masih dalam mode "Testing"

### Issue 3: "Invalid client ID"
**Solution:**
- Copy ulang Client ID dari Google Console
- Pastikan tidak ada spasi di `.env`
- Restart backend setelah update `.env`

### Issue 4: Token verification failed
**Solution:**
```javascript
// Check di authController.js
const ticket = await client.verifyIdToken({
  idToken: credential,
  audience: process.env.GOOGLE_CLIENT_ID // ✅ Pastikan ini benar
});
```

### Issue 5: CORS Error
**Solution:** Update `server.js`
```javascript
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

---

## 7️⃣ Environment Variables Summary

### Backend `.env`
```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=flexitip
DB_USER=root
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d

# Google OAuth
GOOGLE_CLIENT_ID=123456789-xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxx

# Frontend
FRONTEND_URL=http://localhost:5173

# Server
PORT=5000
NODE_ENV=development
```

### Frontend `.env` (if needed)
```env
VITE_GOOGLE_CLIENT_ID=123456789-xxx.apps.googleusercontent.com
VITE_API_URL=http://localhost:5000
```

---

## 8️⃣ Production Deployment

### Update Google Console
1. Tambahkan production URLs:
   ```
   Authorized origins:
   - https://flexitip.com
   
   Redirect URIs:
   - https://flexitip.com/auth/google/callback
   - https://api.flexitip.com/api/auth/google/callback
   ```

2. **Publish OAuth Consent Screen:**
   - Change dari "Testing" → "In Production"
   - Submit for verification (optional, tapi recommended)

### Update `.env` Production
```env
GOOGLE_CLIENT_ID=production_client_id
GOOGLE_CLIENT_SECRET=production_client_secret
FRONTEND_URL=https://flexitip.com
```

---

## 9️⃣ Security Best Practices

### ✅ DO:
- Simpan credentials di `.env`, **JANGAN** commit ke Git
- Gunakan HTTPS di production
- Validate token di backend setiap request
- Set proper CORS headers
- Limit redirect URIs ke domain yang valid
- Rotate secrets secara berkala

### ❌ DON'T:
- Hardcode Client Secret di code
- Expose credentials di frontend bundle
- Allow wildcard redirect URIs
- Skip token verification
- Use same credentials untuk dev & production

---

## 🔟 Quick Start Commands

### 1. Get Google Credentials
```bash
# Visit: https://console.cloud.google.com/
# Create project → Enable APIs → Create OAuth credentials
```

### 2. Update Backend
```bash
cd backend
# Update .env dengan GOOGLE_CLIENT_ID dan GOOGLE_CLIENT_SECRET
npm run dev
```

### 3. Update Frontend
```bash
cd ..
npm install @react-oauth/google
# Update App.tsx dan AuthPage.tsx
npm run dev
```

### 4. Test
```bash
# Open browser
http://localhost:5173
# Click "Login with Google"
```

---

## 📚 Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Sign-In for Web](https://developers.google.com/identity/gsi/web/guides/overview)
- [@react-oauth/google NPM](https://www.npmjs.com/package/@react-oauth/google)
- [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)

---

## ✅ Verification Checklist

Setelah setup selesai, verify:

- [ ] Google Cloud project created
- [ ] OAuth consent screen configured
- [ ] OAuth 2.0 credentials created
- [ ] Redirect URIs configured correctly
- [ ] Test users added (for development)
- [ ] `.env` updated with credentials
- [ ] Backend can verify Google tokens
- [ ] Frontend shows Google login button
- [ ] User can login successfully
- [ ] User data saved to database
- [ ] JWT token generated and stored
- [ ] Redirect to dashboard works

---

**🎉 Setup Complete!** Users sekarang bisa login dengan Google account mereka!
