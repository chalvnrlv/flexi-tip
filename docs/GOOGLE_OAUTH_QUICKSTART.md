# 🚀 Google OAuth Quick Setup

## 1️⃣ Install Dependencies

### Frontend
```bash
# Install Google OAuth library
npm install @react-oauth/google

# Or with yarn
yarn add @react-oauth/google
```

### Backend
```bash
cd backend
# Dependencies already in package.json (google-auth-library)
npm install
```

---

## 2️⃣ Get Google Credentials

### A. Open Google Cloud Console
```
https://console.cloud.google.com/
```

### B. Create Project
1. Click "Select a Project" → "New Project"
2. Name: `FlexiTip`
3. Click "Create"

### C. Enable Google+ API
1. Go to "APIs & Services" → "Library"
2. Search: `Google+ API`
3. Click "Enable"

### D. Configure OAuth Consent Screen
1. Go to "APIs & Services" → "OAuth consent screen"
2. User Type: **External**
3. Fill in:
   - App name: `FlexiTip`
   - User support email: your-email@gmail.com
   - Developer contact: your-email@gmail.com
4. Scopes: Add these
   - `./auth/userinfo.email`
   - `./auth/userinfo.profile`
   - `openid`
5. Test users: Add your email for testing
6. Save

### E. Create OAuth Credentials
1. Go to "APIs & Services" → "Credentials"
2. "Create Credentials" → "OAuth client ID"
3. Application type: **Web application**
4. Name: `FlexiTip Web Client`
5. Authorized JavaScript origins:
   ```
   http://localhost:5173
   http://localhost:3000
   ```
6. Authorized redirect URIs:
   ```
   http://localhost:5173/auth/google/callback
   http://localhost:5000/api/auth/google/callback
   ```
7. Click "Create"
8. **COPY** the Client ID and Client Secret!

---

## 3️⃣ Configure Environment Variables

### Frontend `.env`
Create `.env` file di root folder:
```bash
# Copy from example
cp .env.example .env
```

Edit `.env`:
```env
VITE_GOOGLE_CLIENT_ID=123456789-abcdefg.apps.googleusercontent.com
VITE_API_URL=http://localhost:5000
```

### Backend `.env`
File `backend/.env` already exists, tambahkan:
```env
GOOGLE_CLIENT_ID=123456789-abcdefg.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxx
FRONTEND_URL=http://localhost:5173
```

---

## 4️⃣ Update Code

### Option A: Use New Files (Recommended)
```bash
# Backup current files
mv App.tsx App_backup.tsx
mv pages/AuthPage.tsx pages/AuthPage_backup.tsx

# Use new files with Google OAuth
mv App_with_Google.tsx App.tsx
mv pages/AuthPage_with_Google.tsx pages/AuthPage.tsx
```

### Option B: Manual Integration
Follow the code in:
- `App_with_Google.tsx`
- `pages/AuthPage_with_Google.tsx`

---

## 5️⃣ Test the Setup

### Start Backend
```bash
cd backend
npm run dev
```

Expected output:
```
🚀 Server running on port 5000
✅ MySQL Connected Successfully
```

### Start Frontend
```bash
# In root folder
npm run dev
```

### Test OAuth
1. Open: `http://localhost:5173`
2. Click "Login" 
3. You should see "Sign in with Google" button
4. Click it and select your Google account
5. Should redirect to Dashboard
6. Check database:
   ```sql
   SELECT * FROM users WHERE googleId IS NOT NULL;
   ```

---

## 6️⃣ Troubleshooting

### Error: "redirect_uri_mismatch"
**Fix:** Check authorized redirect URIs di Google Console match exactly:
```
http://localhost:5173/auth/google/callback
```

### Error: "Access blocked: This app's request is invalid"
**Fix:** 
1. Add your email as Test User di OAuth Consent Screen
2. Make sure app is in "Testing" mode

### Error: "Cannot find module '@react-oauth/google'"
**Fix:**
```bash
npm install @react-oauth/google
```

### Error: Token verification failed
**Fix:** Check backend `.env`:
```env
GOOGLE_CLIENT_ID=same-as-frontend
GOOGLE_CLIENT_SECRET=from-google-console
```

### CORS Error
**Fix:** Check `backend/src/server.js`:
```javascript
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

---

## 7️⃣ Verify Setup

Run these checks:

### ✅ Frontend Checklist
- [ ] `@react-oauth/google` installed
- [ ] `.env` file created with VITE_GOOGLE_CLIENT_ID
- [ ] `vite-env.d.ts` exists for TypeScript types
- [ ] `App.tsx` wrapped with GoogleOAuthProvider
- [ ] `AuthPage.tsx` has GoogleLogin button
- [ ] Frontend runs without errors: `npm run dev`

### ✅ Backend Checklist
- [ ] `.env` has GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
- [ ] `google-auth-library` installed
- [ ] `authController.js` has googleAuth function
- [ ] `authRoutes.js` has `/api/auth/google` route
- [ ] Backend runs without errors: `npm run dev`
- [ ] MySQL database connected

### ✅ Google Console Checklist
- [ ] Project created
- [ ] Google+ API enabled
- [ ] OAuth consent screen configured
- [ ] OAuth credentials created
- [ ] Authorized origins added
- [ ] Redirect URIs added
- [ ] Test users added (for development)

---

## 8️⃣ Testing Flow

```bash
# 1. Start MySQL
# Windows: MySQL should be running in services
# Or: net start MySQL80

# 2. Start Backend
cd backend
npm run dev

# 3. Start Frontend (in new terminal)
cd ..
npm run dev

# 4. Open Browser
# http://localhost:5173

# 5. Test Login
# Click "Sign in with Google"
# Select your test account
# Should redirect to Dashboard

# 6. Verify Database
mysql -u root -p
USE flexitip;
SELECT id, name, email, googleId FROM users;
```

Expected result:
```
+--------------------------------------+----------+------------------+---------------------+
| id                                   | name     | email            | googleId            |
+--------------------------------------+----------+------------------+---------------------+
| 550e8400-e29b-41d4-a716-446655440000 | John Doe | john@gmail.com   | 123456789012345678  |
+--------------------------------------+----------+------------------+---------------------+
```

---

## 🎉 Done!

Google OAuth is now working! Users can:
- Login with Google (no registration needed)
- Or use traditional email/password
- Profile automatically created from Google data
- Email automatically verified (isVerified = true)

---

## 📚 Next Steps

1. **Add more OAuth providers:**
   - Facebook Login
   - Apple Sign In
   - GitHub OAuth

2. **Enhance security:**
   - Add rate limiting
   - Implement 2FA
   - Add session management

3. **Improve UX:**
   - Remember me functionality
   - Social profile picture sync
   - Auto-fill user info from Google

---

## 📖 Documentation Reference

- Full guide: `GOOGLE_OAUTH_SETUP.md`
- Example code: `App_with_Google.tsx` & `AuthPage_with_Google.tsx`
- Environment types: `vite-env.d.ts`
- Backend controller: `backend/src/controllers/authController.js`
