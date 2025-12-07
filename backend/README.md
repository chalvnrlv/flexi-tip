# JastipConnect Backend API

Backend API untuk aplikasi JastipConnect - Platform marketplace jasa titip barang dari luar negeri.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL 8.0+ with Sequelize ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time**: Socket.io
- **File Upload**: Multer + Cloudinary
- **Payment**: Stripe
- **Email**: Nodemailer

## Features

- ✅ User Authentication (Register, Login, JWT)
- ✅ User Profile Management
- ✅ Jastip Service Management (CRUD)
- ✅ Product Management
- ✅ Order Management
- ✅ Real-time Chat
- ✅ Rating & Review System
- ✅ Payment Integration
- ✅ File Upload (Avatar, Product Images, Payment Proof)
- ✅ Email Notifications

## Installation

1. Install dependencies:
```bash
cd backend
npm install
```

2. Install MySQL:
```bash
# Windows: Download from https://dev.mysql.com/downloads/installer/
# Or via Chocolatey:
choco install mysql
```

3. Create database:
```sql
mysql -u root -p
CREATE DATABASE flexitip CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

4. Create `.env` file:
```bash
cp .env.example .env
```

5. Configure environment variables in `.env`:
```env
NODE_ENV=development
PORT=5000

# MySQL Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=flexitip
DB_USER=root
DB_PASSWORD=your_mysql_password

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d

# Email (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@jastipconnect.com
EMAIL_FROM_NAME=JastipConnect

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Client URL
CLIENT_URL=http://localhost:5173
```

6. Test database connection:
```bash
npm run test:db
```

7. Start the server:

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/password` - Update password

### Jastip Services
- `GET /api/jastip` - Get all jastip services
- `GET /api/jastip/:id` - Get single jastip service
- `POST /api/jastip` - Create jastip service (Jastiper only)
- `PUT /api/jastip/:id` - Update jastip service (Owner only)
- `DELETE /api/jastip/:id` - Delete jastip service (Owner only)
- `POST /api/jastip/:id/rating` - Add rating to service

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Jastiper only)
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get all orders (filtered by user role)
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/status` - Update order status (Jastiper only)
- `PUT /api/orders/:id/payment` - Update payment status
- `PUT /api/orders/:id/cancel` - Cancel order
- `POST /api/orders/:id/rating` - Add rating to order

### Chat
- `GET /api/chats` - Get all user chats
- `POST /api/chats` - Create or get chat
- `GET /api/chats/:id` - Get single chat
- `GET /api/chats/:id/messages` - Get chat messages
- `POST /api/chats/:id/messages` - Send message
- `PUT /api/chats/:id/read` - Mark messages as read
- `DELETE /api/chats/:chatId/messages/:messageId` - Delete message

## Socket.io Events

### Client → Server
- `join` - User joins with userId
- `join-chat` - Join specific chat room
- `send-message` - Send new message
- `typing` - User typing indicator

### Server → Client
- `user-online` - User comes online
- `user-offline` - User goes offline
- `new-message` - New message received
- `user-typing` - User is typing
- `order-update` - Order status updated

## Database Models

### User
- Authentication & Profile
- Jastiper Profile
- Addresses
- Password hashing with bcrypt hooks

### JastipService
- Service details
- Origin & Destination
- Capacity tracking
- Ratings

### Product
- Product information
- Variants
- Images
- Stock management

### Order
- Order items
- Pricing breakdown
- Status tracking
- Payment info
- Shipping details
- Auto-generated order numbers

### Chat & Message
- Real-time messaging
- Read status
- Attachments support

**All tables use:**
- UUID primary keys
- JSON columns for complex data
- Foreign key constraints
- Timestamps (createdAt, updatedAt)

## Middleware

- `protect` - Verify JWT token
- `authorize` - Check user role
- `isJastiper` - Check if user is jastiper
- `errorHandler` - Global error handling

## File Upload

Supported file uploads:
- User avatars (5MB max)
- Product images (5MB max)
- Payment proofs (5MB max)
- Chat attachments (10MB max)

All files uploaded to Cloudinary with automatic optimization.

## Development

```bash
# Install dependencies
npm install

# Run in development mode with nodemon
npm run dev

# Run tests (if available)
npm test

# Check code style
npm run lint
```

## Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Configure production MongoDB URI
3. Set secure JWT_SECRET
4. Configure production email service
5. Set up Cloudinary production account
6. Configure Stripe production keys
7. Deploy to your hosting service (Heroku, DigitalOcean, AWS, etc.)

## Security

- Passwords hashed with bcrypt
- JWT authentication
- Protected routes
- Input validation
- CORS enabled
- Rate limiting (recommended to add)
- Helmet.js (recommended to add)

## License

MIT
