const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const JastipService = sequelize.define('JastipService', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  jastiperId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  type: {
    type: DataTypes.ENUM('local', 'global'),
    allowNull: false,
  },
  origin: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  destination: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  departureDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  arrivalDate: {
    type: DataTypes.DATE,
  },
  capacity: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'in KG',
  },
  availableCapacity: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  pricePerKg: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  serviceFee: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  status: {
    type: DataTypes.ENUM('active', 'full', 'closed', 'completed'),
    defaultValue: 'active',
  },
  categories: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  restrictions: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  images: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0,
  },
  totalRatings: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'jastip_services',
  timestamps: true,
  indexes: [
    { fields: ['jastiperId'] },
    { fields: ['status'] },
    { fields: ['type'] },
    { fields: ['departureDate'] },
  ],
});

module.exports = JastipService;
