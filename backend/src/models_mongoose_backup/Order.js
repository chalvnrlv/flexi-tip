const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  jastiper: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  jastipService: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JastipService',
    required: true,
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    name: String,
    variant: String,
    price: Number,
    quantity: Number,
    weight: Number,
    image: String,
  }],
  shippingAddress: {
    recipientName: String,
    phone: String,
    address: String,
    city: String,
    province: String,
    postalCode: String,
  },
  shippingMethod: {
    name: String,
    estimatedDays: String,
    cost: Number,
  },
  pricing: {
    subtotal: {
      type: Number,
      required: true,
    },
    shippingCost: {
      type: Number,
      required: true,
    },
    jastipFee: {
      type: Number,
      required: true,
    },
    adminFee: {
      type: Number,
      default: 5000,
    },
    tax: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
    },
  },
  paymentMethod: {
    type: String,
    enum: ['transfer', 'ewallet', 'cod', 'card'],
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending',
  },
  paymentProof: {
    url: String,
    public_id: String,
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'completed', 'cancelled'],
    default: 'pending',
  },
  statusHistory: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now,
    },
    note: String,
  }],
  trackingNumber: String,
  notes: String,
  cancellationReason: String,
  rating: {
    score: Number,
    comment: String,
    createdAt: Date,
  },
}, {
  timestamps: true,
});

// Generate order number
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `JTC${Date.now()}${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
