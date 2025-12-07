# 🔐 Authentication Guide - FlexiTip Backend

## Database: MongoDB

Menggunakan **MongoDB** dengan **Mongoose** ODM untuk mengelola data user.

## Authentication Flow

### 1. Register (Daftar Akun Baru)

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "08123456789"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "08123456789",
    "role": "user",
    "isJastiper": false
  }
}
```

**Proses Backend:**
1. Validasi input (email unik, password min 6 karakter)
2. Hash password dengan `bcryptjs` (10 rounds)
3. Simpan user ke MongoDB
4. Generate JWT token dengan `jsonwebtoken`
5. Return token & user data (tanpa password)

**Kode:**
```javascript
// Hash password sebelum save (di User model)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
```

---

### 2. Login (Masuk dengan Email & Password)

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "https://...",
    "role": "user"
  }
}
```

**Proses Backend:**
1. Cari user berdasarkan email
2. Verifikasi password dengan `bcrypt.compare()`
3. Generate JWT token
4. Return token & user data

**Kode:**
```javascript
// Di User model - method untuk compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Di authController
const user = await User.findOne({ email }).select('+password');
if (!user || !(await user.matchPassword(password))) {
  return res.status(401).json({ message: 'Invalid credentials' });
}
```

---

### 3. Sign In With Google (OAuth 2.0)

**Endpoint:** `POST /api/auth/google`

**Request Body:**
```json
{
  "credential": "google_jwt_token_from_frontend"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "https://lh3.googleusercontent.com/...",
    "role": "user",
    "isJastiper": false
  }
}
```

**Proses Backend:**
1. Terima Google credential (JWT) dari frontend
2. Verifikasi token dengan `google-auth-library`
3. Extract data user (email, name, picture, googleId)
4. Cek apakah user sudah terdaftar:
   - **Jika sudah:** Login langsung
   - **Jika belum:** Buat akun baru otomatis
5. Generate JWT token
6. Return token & user data

**Setup Google OAuth:**

1. **Install dependency:**
```bash
npm install google-auth-library
```

2. **Setup Google Console:**
   - Buka [Google Cloud Console](https://console.cloud.google.com/)
   - Buat project baru
   - Enable Google+ API
   - Buat OAuth 2.0 Client ID
   - Tambahkan authorized redirect URIs
   - Copy Client ID & Client Secret

3. **Environment Variables:**
```env
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

4. **Frontend Implementation (React):**
```typescript
// Install @react-oauth/google
npm install @react-oauth/google

// Di App.tsx
import { GoogleOAuthProvider } from '@react-oauth/google';

<GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
  <App />
</GoogleOAuthProvider>

// Di Login Component
import { GoogleLogin } from '@react-oauth/google';

<GoogleLogin
  onSuccess={async (credentialResponse) => {
    const response = await fetch('http://localhost:5000/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential: credentialResponse.credential })
    });
    const data = await response.json();
    localStorage.setItem('token', data.token);
  }}
  onError={() => console.log('Login Failed')}
/>
```

---

## JWT Token Structure

**Header:**
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Payload:**
```json
{
  "id": "user_id",
  "iat": 1234567890,
  "exp": 1234567890
}
```

**Expire:** 7 hari (configurable di `.env`)

---

## Protected Routes

Setiap request ke protected route harus menyertakan token:

**Header:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Middleware `protect`:**
```javascript
// Verify token
const token = req.headers.authorization?.split(' ')[1];
const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.user = await User.findById(decoded.id);
```

---

## User Schema di MongoDB

```javascript
{
  name: String,           // Nama user
  email: String,          // Email (unique)
  password: String,       // Hashed password
  googleId: String,       // Google ID (untuk OAuth)
  isVerified: Boolean,    // Email verification status
  phone: String,
  avatar: String,
  role: String,           // 'user' | 'admin'
  isJastiper: Boolean,    // Apakah jastiper
  jastipProfile: {        // Profile khusus jastiper
    rating: Number,
    totalTrips: Number,
    verificationStatus: String,
    verificationDocuments: [String]
  },
  addresses: [{
    label: String,
    fullAddress: String,
    city: String,
    province: String,
    postalCode: String,
    isDefault: Boolean
  }],
  createdAt: Date,
  updatedAt: Date
}
```

---

## Security Best Practices

✅ **Password hashing** dengan bcrypt (10 rounds)  
✅ **JWT token** untuk stateless authentication  
✅ **Token expiration** (7 hari)  
✅ **CORS protection**  
✅ **Input validation** dengan express-validator  
✅ **Password tidak di-return** di response (select: false)  
✅ **HTTPS** untuk production  
✅ **Environment variables** untuk sensitive data  

---

## Testing Authentication

**1. Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "phone": "08123456789"
  }'
```

**2. Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**3. Get Current User:**
```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Error Handling

**Email sudah terdaftar:**
```json
{
  "success": false,
  "message": "Email already exists"
}
```

**Invalid credentials:**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

**Invalid token:**
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

**Google auth failed:**
```json
{
  "success": false,
  "message": "Google authentication failed",
  "error": "Invalid token"
}
```
