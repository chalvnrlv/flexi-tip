const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  orderNumber: {
    type: DataTypes.STRING(50),
    unique: true,
  },
  customerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  jastiperId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  jastipServiceId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'jastip_services',
      key: 'id',
    },
  },
  items: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
  },
  shippingAddress: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  shippingMethod: {
    type: DataTypes.STRING(50),
  },
  pricing: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {
      itemsTotal: 0,
      shippingCost: 0,
      serviceFee: 0,
      tax: 0,
      total: 0,
    },
  },
  orderStatus: {
    type: DataTypes.ENUM(
      'pending',
      'confirmed',
      'purchased',
      'shipping',
      'delivered',
      'completed',
      'cancelled'
    ),
    defaultValue: 'pending',
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
    defaultValue: 'pending',
  },
  paymentMethod: {
    type: DataTypes.STRING(50),
  },
  paymentProof: {
    type: DataTypes.STRING(500),
  },
  statusHistory: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  trackingNumber: {
    type: DataTypes.STRING(100),
  },
  notes: {
    type: DataTypes.TEXT,
  },
  cancellationReason: {
    type: DataTypes.TEXT,
  },
  rating: {
    type: DataTypes.JSON,
    defaultValue: null,
  },
}, {
  tableName: 'orders',
  timestamps: true,
  hooks: {
    beforeCreate: async (order) => {
      // Generate order number
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      order.orderNumber = `ORD-${timestamp}-${random}`;
    },
  },
  indexes: [
    { fields: ['customerId'] },
    { fields: ['jastiperId'] },
    { fields: ['jastipServiceId'] },
    { fields: ['orderNumber'], unique: true },
    { fields: ['orderStatus'] },
    { fields: ['paymentStatus'] },
  ],
});

module.exports = Order;
