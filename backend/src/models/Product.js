const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  jastipServiceId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'jastip_services',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  category: {
    type: DataTypes.STRING(50),
  },
  brand: {
    type: DataTypes.STRING(100),
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'IDR',
  },
  estimatedWeight: {
    type: DataTypes.DECIMAL(10, 2),
    comment: 'in KG',
  },
  images: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  variants: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  specifications: {
    type: DataTypes.JSON,
    defaultValue: {},
  },
  status: {
    type: DataTypes.ENUM('available', 'out_of_stock', 'discontinued'),
    defaultValue: 'available',
  },
}, {
  tableName: 'products',
  timestamps: true,
  indexes: [
    { fields: ['jastipServiceId'] },
    { fields: ['category'] },
    { fields: ['status'] },
  ],
});

module.exports = Product;
