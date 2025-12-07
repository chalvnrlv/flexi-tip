# 🔐 Google OAuth Flow Diagram

## Complete Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          GOOGLE OAUTH FLOW                               │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────┐
│   USER       │
│  (Browser)   │
└──────┬───────┘
       │
       │ 1. Clicks "Sign in with Google"
       ▼
┌──────────────────────┐
│   FRONTEND           │
│  (React App)         │
│  localhost:5173      │
└──────┬───────────────┘
       │
       │ 2. Opens Google OAuth Popup
       ▼
┌──────────────────────────┐
│   GOOGLE                 │
│   OAuth Server           │
│   accounts.google.com    │
└──────┬───────────────────┘
       │
       │ 3. User logs in & grants permissions
       │
       │ 4. Returns ID Token (JWT)
       ▼
┌──────────────────────┐
│   FRONTEND           │
│  Receives token      │
└──────┬───────────────┘
       │
       │ 5. POST /api/auth/google
       │    Body: { credential: "eyJhbG..." }
       ▼
┌──────────────────────┐
│   BACKEND            │
│  (Express API)       │
│  localhost:5000      │
└──────┬───────────────┘
       │
       │ 6. Verify token with Google
       ▼
┌──────────────────────────┐
│   GOOGLE                 │
│   Token Verification     │
└──────┬───────────────────┘
       │
       │ 7. Returns user info (if valid)
       │    { email, name, picture, ... }
       ▼
┌──────────────────────┐
│   BACKEND            │
│  Process user data   │
└──────┬───────────────┘
       │
       │ 8. Check if user exists
       ▼
┌──────────────────────┐
│   MySQL DATABASE     │
│  SELECT ... WHERE    │
│  googleId = ?        │
└──────┬───────────────┘
       │
       │ 9a. User exists → Get user
       │ 9b. New user → Create user
       ▼
┌──────────────────────┐
│   BACKEND            │
│  Generate JWT token  │
└──────┬───────────────┘
       │
       │ 10. Return response
       │     { token, user }
       ▼
┌──────────────────────┐
│   FRONTEND           │
│  Save to localStorage│
└──────┬───────────────┘
       │
       │ 11. Redirect to Dashboard
       ▼
┌──────────────────────┐
│   DASHBOARD PAGE     │
│   Welcome, User!     │
└──────────────────────┘
```

---

## Data Flow Details

### 1. Frontend → Google
```javascript
// User clicks Google button
<GoogleLogin
  onSuccess={handleGoogleSuccess}
  onError={handleGoogleError}
/>

// Google popup opens automatically
// User selects account & grants permissions
```

### 2. Google → Frontend
```javascript
// Google returns credential (ID Token)
{
  credential: "eyJhbGciOiJSUzI1NiIsImtpZCI6IjdkYjk...",
  clientId: "123456789-xxx.apps.googleusercontent.com",
  select_by: "user"
}
```

### 3. Frontend → Backend
```javascript
// POST /api/auth/google
fetch('http://localhost:5000/api/auth/google', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    credential: credentialResponse.credential
  })
})
```

### 4. Backend → Google (Verification)
```javascript
// Verify ID Token
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

const ticket = await client.verifyIdToken({
  idToken: credential,
  audience: GOOGLE_CLIENT_ID
});

const payload = ticket.getPayload();
// payload contains: email, name, picture, email_verified, etc.
```

### 5. Backend → Database
```javascript
// Check if user exists
let user = await User.findOne({ 
  where: { googleId: payload.sub } 
});

if (!user) {
  // Create new user
  user = await User.create({
    googleId: payload.sub,
    email: payload.email,
    name: payload.name,
    profilePicture: payload.picture,
    isVerified: true // Auto-verified via Google
  });
}
```

### 6. Backend → Frontend (Response)
```javascript
// Generate JWT token
const token = jwt.sign(
  { id: user.id, email: user.email },
  JWT_SECRET,
  { expiresIn: '7d' }
);

// Return to frontend
res.json({
  token,
  user: {
    id: user.id,
    name: user.name,
    email: user.email,
    isJastiper: user.isJastiper
  }
});
```

### 7. Frontend Storage & Redirect
```javascript
// Save to localStorage
localStorage.setItem('token', data.token);
localStorage.setItem('user', JSON.stringify(data.user));

// Redirect to dashboard
navigate('/dashboard');
```

---

## Security Flow

```
┌─────────────────────────────────────────────────────────┐
│              SECURITY CHECKPOINTS                        │
└─────────────────────────────────────────────────────────┘

1️⃣  GOOGLE VERIFICATION
    ✓ User must have valid Google account
    ✓ User must grant app permissions
    ✓ Google generates cryptographically signed token

2️⃣  TOKEN VERIFICATION (Backend)
    ✓ Verify token signature with Google's public keys
    ✓ Check token audience matches our CLIENT_ID
    ✓ Verify token hasn't expired
    ✓ Validate issuer is accounts.google.com

3️⃣  DATABASE CHECK
    ✓ Check if googleId already exists
    ✓ If exists: fetch existing user
    ✓ If new: create user with verified email

4️⃣  JWT GENERATION
    ✓ Generate our own JWT token
    ✓ Sign with secret key
    ✓ Set expiration (7 days)
    ✓ Include user ID & email in payload

5️⃣  FRONTEND VALIDATION
    ✓ Token stored in localStorage (httpOnly recommended for production)
    ✓ Included in Authorization header for API calls
    ✓ Validated on every protected route
```

---

## Error Handling Flow

```
┌─────────────────────────────────────────────────────────┐
│                   ERROR SCENARIOS                        │
└─────────────────────────────────────────────────────────┘

ERROR 1: User Cancels Google Login
    ├─ Google popup closed by user
    ├─ onError callback triggered
    └─ Show message: "Login cancelled"

ERROR 2: Invalid Token
    ├─ Token verification fails
    ├─ Backend returns 401
    └─ Show message: "Authentication failed"

ERROR 3: Network Error
    ├─ Can't reach backend
    ├─ Fetch throws error
    └─ Show message: "Connection error"

ERROR 4: Database Error
    ├─ MySQL connection failed
    ├─ Can't create/fetch user
    └─ Return 500 error

ERROR 5: Missing Configuration
    ├─ GOOGLE_CLIENT_ID not set
    ├─ Environment variables missing
    └─ App won't start properly
```

---

## Token Structure

### Google ID Token (JWT)
```json
{
  "header": {
    "alg": "RS256",
    "kid": "7db9ea5e8d...",
    "typ": "JWT"
  },
  "payload": {
    "iss": "https://accounts.google.com",
    "azp": "123456789.apps.googleusercontent.com",
    "aud": "123456789.apps.googleusercontent.com",
    "sub": "110169484474386276334",
    "email": "user@gmail.com",
    "email_verified": true,
    "name": "John Doe",
    "picture": "https://lh3.googleusercontent.com/...",
    "given_name": "John",
    "family_name": "Doe",
    "iat": 1638360000,
    "exp": 1638363600
  },
  "signature": "..."
}
```

### Our Backend JWT Token
```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@gmail.com",
    "iat": 1638360000,
    "exp": 1638964800
  },
  "signature": "..."
}
```

---

## Database Changes

### Before Google Login
```sql
SELECT * FROM users;
-- Empty or only email/password users
```

### After Google Login (New User)
```sql
INSERT INTO users (
  id, 
  googleId, 
  email, 
  name, 
  profilePicture,
  isVerified
) VALUES (
  UUID(),
  '110169484474386276334',
  'john@gmail.com',
  'John Doe',
  'https://lh3.googleusercontent.com/...',
  TRUE
);
```

### After Google Login (Existing User)
```sql
-- Just fetch user, no changes
SELECT * FROM users 
WHERE googleId = '110169484474386276334';
```

---

## API Endpoints

### 1. Google OAuth Endpoint
```
POST /api/auth/google
Content-Type: application/json

Request:
{
  "credential": "eyJhbGciOiJSUzI1NiIsImtpZCI..."
}

Response (Success):
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "email": "john@gmail.com",
    "isJastiper": false
  }
}

Response (Error):
{
  "message": "Invalid Google token"
}
```

### 2. Traditional Login (for comparison)
```
POST /api/auth/login
Content-Type: application/json

Request:
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI...",
  "user": { ... }
}
```

---

## Environment Variables Needed

### Frontend (.env)
```env
VITE_GOOGLE_CLIENT_ID=123456789-xxx.apps.googleusercontent.com
VITE_API_URL=http://localhost:5000
```

### Backend (backend/.env)
```env
GOOGLE_CLIENT_ID=123456789-xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxx
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

---

## Testing Checklist

### ✅ Pre-Flight Checks
- [ ] MySQL running
- [ ] Backend running (port 5000)
- [ ] Frontend running (port 5173)
- [ ] Google credentials configured
- [ ] Environment variables set

### ✅ Test Flow
1. [ ] Open `http://localhost:5173`
2. [ ] See "Sign in with Google" button
3. [ ] Click button → Google popup opens
4. [ ] Select Google account
5. [ ] Grant permissions
6. [ ] Popup closes
7. [ ] Redirected to Dashboard
8. [ ] User info displayed correctly
9. [ ] Token saved in localStorage
10. [ ] Database has new user record

### ✅ Verify Database
```sql
SELECT id, name, email, googleId, isVerified 
FROM users 
WHERE googleId IS NOT NULL;
```

Expected: User record with googleId and isVerified=1

---

## 🎯 Quick Reference

| Step | Location | What Happens |
|------|----------|--------------|
| 1 | Browser | User clicks Google button |
| 2 | Google | OAuth popup, user logs in |
| 3 | Google → Frontend | Returns ID token |
| 4 | Frontend → Backend | Sends token for verification |
| 5 | Backend → Google | Verifies token validity |
| 6 | Backend → Database | Creates/fetches user |
| 7 | Backend → Frontend | Returns JWT + user data |
| 8 | Frontend | Saves token, redirects to dashboard |

---

**✨ That's it! OAuth flow complete!**
