# 📚 FlexiTip Documentation Index

## 🎯 Quick Navigation

### For Beginners
Start here if you're setting up the project for the first time:
1. **[QUICKSTART.md](./backend/QUICKSTART.md)** - Complete project setup
2. **[GOOGLE_OAUTH_QUICKSTART.md](./GOOGLE_OAUTH_QUICKSTART.md)** - Quick Google OAuth setup

### For Developers
Technical documentation for development:
1. **[README.md](./README.md)** - Project overview
2. **[DATABASE_QUICK_REFERENCE.md](./backend/DATABASE_QUICK_REFERENCE.md)** - Database commands
3. **[OAUTH_FLOW_DIAGRAM.md](./OAUTH_FLOW_DIAGRAM.md)** - OAuth flow visualization

### For Advanced Users
Deep dive into specific topics:
1. **[GOOGLE_OAUTH_SETUP.md](./backend/GOOGLE_OAUTH_SETUP.md)** - Complete OAuth guide
2. **[MYSQL_SETUP.md](./backend/MYSQL_SETUP.md)** - MySQL setup guide
3. **[MIGRATION_GUIDE.md](./backend/MIGRATION_GUIDE.md)** - MongoDB → MySQL migration
4. **[DATABASE_ERD.md](./backend/DATABASE_ERD.md)** - Database schema diagram

---

## 📖 Documentation Files

### 🚀 Getting Started
| File | Description | For |
|------|-------------|-----|
| **QUICKSTART.md** | Step-by-step setup guide | Beginners |
| **README.md** | Project overview & features | Everyone |
| **.env.example** | Environment variables template | Setup |

### 🔐 Authentication
| File | Description | For |
|------|-------------|-----|
| **GOOGLE_OAUTH_SETUP.md** | Complete Google OAuth guide | Advanced |
| **GOOGLE_OAUTH_QUICKSTART.md** | Quick OAuth setup (5 min) | Developers |
| **OAUTH_FLOW_DIAGRAM.md** | Visual flow diagram | Understanding |

### 🗄️ Database
| File | Description | For |
|------|-------------|-----|
| **MYSQL_SETUP.md** | MySQL installation & config | Setup |
| **database-schema.sql** | CREATE TABLE statements | Setup |
| **database-queries.sql** | Sample queries & JOINs | Development |
| **DATABASE_ERD.md** | Schema diagram & relationships | Understanding |
| **DATABASE_QUICK_REFERENCE.md** | Quick SQL commands | Daily use |

### 🔄 Migration
| File | Description | For |
|------|-------------|-----|
| **MIGRATION_GUIDE.md** | MongoDB → MySQL guide | Migration |
| **MYSQL_MIGRATION_SUMMARY.md** | Migration summary | Reference |

### 💻 Code Examples
| File | Description | For |
|------|-------------|-----|
| **App_with_Google.tsx** | App.tsx with OAuth | Implementation |
| **AuthPage_with_Google.tsx** | Login page with Google | Implementation |
| **vite-env.d.ts** | TypeScript environment types | TypeScript |

---

## 🎓 Learning Path

### Path 1: Complete Setup (Recommended)
```
1. QUICKSTART.md
   ↓ Project setup, npm install
   
2. MYSQL_SETUP.md
   ↓ Database installation
   
3. DATABASE_QUICK_REFERENCE.md
   ↓ Create tables & test
   
4. GOOGLE_OAUTH_QUICKSTART.md
   ↓ Setup OAuth (optional)
   
5. Start developing! 🎉
```

### Path 2: OAuth Only
```
1. GOOGLE_OAUTH_QUICKSTART.md
   ↓ Quick 5-minute setup
   
2. Install @react-oauth/google
   ↓ npm install
   
3. Copy example files
   ↓ App_with_Google.tsx
   
4. Test login! 🎉
```

### Path 3: Database Only
```
1. MYSQL_SETUP.md
   ↓ Install MySQL
   
2. database-schema.sql
   ↓ Import tables
   
3. DATABASE_QUICK_REFERENCE.md
   ↓ Test queries
   
4. database-queries.sql
   ↓ Learn JOINs
   
5. Ready to code! 🎉
```

---

## 📋 Checklists

### Initial Setup Checklist
- [ ] Node.js installed (v18+)
- [ ] MySQL installed (v8.0+)
- [ ] Git cloned repository
- [ ] Frontend dependencies: `npm install`
- [ ] Backend dependencies: `cd backend && npm install`
- [ ] Database created: `CREATE DATABASE flexitip`
- [ ] Tables imported: `mysql < database-schema.sql`
- [ ] `.env` files configured
- [ ] Backend running: `npm run dev`
- [ ] Frontend running: `npm run dev`

### Google OAuth Checklist
- [ ] Google Cloud project created
- [ ] OAuth consent screen configured
- [ ] OAuth credentials created
- [ ] Client ID & Secret copied
- [ ] Redirect URIs configured
- [ ] Test users added
- [ ] `@react-oauth/google` installed
- [ ] `.env` updated with credentials
- [ ] Code updated with OAuth
- [ ] OAuth tested successfully

### Database Checklist
- [ ] MySQL service running
- [ ] Database created
- [ ] Schema imported
- [ ] Connection tested: `npm run test:db`
- [ ] Sample data inserted
- [ ] Queries tested
- [ ] Indexes verified
- [ ] Foreign keys working

---

## 🔍 Find What You Need

### "How do I..."

#### ...set up the project?
→ **[QUICKSTART.md](./backend/QUICKSTART.md)**

#### ...add Google login?
→ **[GOOGLE_OAUTH_QUICKSTART.md](./GOOGLE_OAUTH_QUICKSTART.md)**

#### ...create database tables?
→ **[database-schema.sql](./backend/database-schema.sql)**

#### ...run SQL queries?
→ **[DATABASE_QUICK_REFERENCE.md](./backend/DATABASE_QUICK_REFERENCE.md)**

#### ...understand the database structure?
→ **[DATABASE_ERD.md](./backend/DATABASE_ERD.md)**

#### ...migrate from MongoDB?
→ **[MIGRATION_GUIDE.md](./backend/MIGRATION_GUIDE.md)**

#### ...understand OAuth flow?
→ **[OAUTH_FLOW_DIAGRAM.md](./OAUTH_FLOW_DIAGRAM.md)**

#### ...configure environment variables?
→ **[.env.example](./.env.example)** & **[backend/.env.example](./backend/.env.example)**

---

## 🛠️ Development Workflow

### Day 1: Setup
1. Clone repo
2. Read **QUICKSTART.md**
3. Install dependencies
4. Setup database
5. Test connection

### Day 2: Database
1. Import **database-schema.sql**
2. Explore **DATABASE_ERD.md**
3. Test queries from **database-queries.sql**
4. Learn **DATABASE_QUICK_REFERENCE.md**

### Day 3: Authentication
1. Setup Google OAuth (**GOOGLE_OAUTH_QUICKSTART.md**)
2. Install dependencies
3. Update code
4. Test login flow

### Day 4+: Development
1. Start building features
2. Refer to **DATABASE_QUICK_REFERENCE.md** for queries
3. Check **OAUTH_FLOW_DIAGRAM.md** for auth flows
4. Read API documentation in controller files

---

## 📁 File Structure Reference

```
flexi-tip/
├── 📄 README.md                          # Project overview
├── 📄 QUICKSTART.md                      # Quick setup guide
├── 📄 GOOGLE_OAUTH_QUICKSTART.md         # OAuth quick guide
├── 📄 OAUTH_FLOW_DIAGRAM.md              # OAuth visualization
├── 📄 DOCUMENTATION_INDEX.md             # This file
├── 📄 .env.example                       # Frontend env template
├── 📄 vite-env.d.ts                      # TypeScript types
├── 📄 App_with_Google.tsx                # OAuth example
│
├── pages/
│   └── 📄 AuthPage_with_Google.tsx       # Login with OAuth
│
└── backend/
    ├── 📄 QUICKSTART.md                  # Backend setup
    ├── 📄 README.md                      # Backend docs
    ├── 📄 GOOGLE_OAUTH_SETUP.md          # Complete OAuth guide
    ├── 📄 MYSQL_SETUP.md                 # MySQL setup
    ├── 📄 MIGRATION_GUIDE.md             # Migration guide
    ├── 📄 MYSQL_MIGRATION_SUMMARY.md     # Migration summary
    ├── 📄 DATABASE_ERD.md                # Schema diagram
    ├── 📄 DATABASE_QUICK_REFERENCE.md    # SQL quick ref
    ├── 📄 database-schema.sql            # CREATE tables
    ├── 📄 database-queries.sql           # Sample queries
    ├── 📄 .env.example                   # Backend env template
    └── 📄 test-db.js                     # DB connection test
```

---

## 🆘 Troubleshooting Guide

### Issue: Can't connect to database
1. Check MySQL is running: `net start MySQL80`
2. Verify credentials in `.env`
3. Test connection: `npm run test:db`
4. See: **[DATABASE_QUICK_REFERENCE.md](./backend/DATABASE_QUICK_REFERENCE.md)**

### Issue: Google OAuth not working
1. Check Client ID in `.env`
2. Verify redirect URIs in Google Console
3. Check test users added
4. See: **[GOOGLE_OAUTH_SETUP.md](./backend/GOOGLE_OAUTH_SETUP.md)** → Troubleshooting

### Issue: Frontend won't start
1. Run `npm install`
2. Check `.env` file exists
3. Verify port 5173 is free
4. See: **[QUICKSTART.md](./backend/QUICKSTART.md)**

### Issue: Backend errors
1. Check all env variables set
2. Verify MySQL connection
3. Check port 5000 is free
4. See backend logs for details

---

## 📞 Quick Commands Reference

### Development
```bash
# Start frontend
npm run dev

# Start backend
cd backend && npm run dev

# Test database
cd backend && npm run test:db
```

### Database
```bash
# Connect to MySQL
mysql -u root -p

# Import schema
mysql -u root -p flexitip < backend/database-schema.sql

# Backup database
mysqldump -u root -p flexitip > backup.sql
```

### Installation
```bash
# Install all dependencies
npm install
cd backend && npm install

# Install OAuth library
npm install @react-oauth/google
```

---

## 🎯 Quick Reference Cards

### Environment Variables
```env
# Frontend (.env)
VITE_GOOGLE_CLIENT_ID=your-client-id
VITE_API_URL=http://localhost:5000

# Backend (backend/.env)
DB_HOST=localhost
DB_NAME=flexitip
DB_USER=root
DB_PASSWORD=
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-secret
JWT_SECRET=your-jwt-secret
```

### Essential URLs
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Google Console: https://console.cloud.google.com
- MySQL: localhost:3306

### Key Endpoints
- Login: `POST /api/auth/login`
- Register: `POST /api/auth/register`
- Google OAuth: `POST /api/auth/google`
- Get Profile: `GET /api/auth/profile`

---

## 📊 Documentation Stats

- **Total Files**: 15+ documentation files
- **Quick Start Time**: ~15 minutes
- **Complete Setup Time**: ~30 minutes
- **OAuth Setup Time**: ~5 minutes
- **Code Examples**: 4 files
- **SQL Files**: 2 files
- **Guides**: 8 comprehensive guides

---

## 🎓 Next Steps

After reading this index:
1. **New User?** → Start with **[QUICKSTART.md](./backend/QUICKSTART.md)**
2. **Need OAuth?** → Go to **[GOOGLE_OAUTH_QUICKSTART.md](./GOOGLE_OAUTH_QUICKSTART.md)**
3. **Database Help?** → Check **[DATABASE_QUICK_REFERENCE.md](./backend/DATABASE_QUICK_REFERENCE.md)**
4. **Understanding Flow?** → Read **[OAUTH_FLOW_DIAGRAM.md](./OAUTH_FLOW_DIAGRAM.md)**

---

**Happy Coding! 🚀**

*Last Updated: November 30, 2025*
