require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const http = require('http');
const socketIO = require('socket.io');
const { connectDB } = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const jastipRoutes = require('./routes/jastipRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const chatRoutes = require('./routes/chatRoutes');
const assistantRoutes = require('./routes/assistantRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Initialize express app
const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000'
];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

const io = socketIO(server, {
  cors: corsOptions,
});

// Connect to database
connectDB();

// Middleware
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Make io accessible to routes
app.set('io', io);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jastip', jastipRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/assistant', assistantRoutes);
app.use('/api/payment', paymentRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
  });
});

// Error handler middleware (must be last)
app.use(errorHandler);

// Socket.IO connection handling
const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // User joins
  socket.on('join', (userId) => {
    connectedUsers.set(userId, socket.id);
    socket.join(userId);
    io.emit('user-online', userId);
  });

  // Join chat room
  socket.on('join-chat', (chatId) => {
    socket.join(chatId);
  });

  // Send message
  socket.on('send-message', (data) => {
    io.to(data.chatId).emit('new-message', data.message);
  });

  // Typing indicator
  socket.on('typing', (data) => {
    socket.to(data.chatId).emit('user-typing', {
      userId: data.userId,
      isTyping: data.isTyping,
    });
  });

  // Order status update
  socket.on('order-status-update', (data) => {
    io.to(data.userId).emit('order-update', data.order);
  });

  // User disconnects
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);

    // Find and remove user
    for (const [userId, socketId] of connectedUsers.entries()) {
      if (socketId === socket.id) {
        connectedUsers.delete(userId);
        io.emit('user-offline', userId);
        break;
      }
    }
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
