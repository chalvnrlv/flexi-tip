const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Chat = sequelize.define('Chat', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  jastipServiceId: {
    type: DataTypes.UUID,
    references: {
      model: 'jastip_services',
      key: 'id',
    },
    onDelete: 'SET NULL',
  },
  participants: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
  },
  lastMessageId: {
    type: DataTypes.UUID,
  },
}, {
  tableName: 'chats',
  timestamps: true,
  indexes: [
    { fields: ['jastipServiceId'] },
  ],
});

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  chatId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'chats',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  senderId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('text', 'image', 'file', 'location'),
    defaultValue: 'text',
  },
  attachments: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  readAt: {
    type: DataTypes.DATE,
  },
  metadata: {
    type: DataTypes.JSON,
    defaultValue: {},
  },
}, {
  tableName: 'messages',
  timestamps: true,
  indexes: [
    { fields: ['chatId'] },
    { fields: ['senderId'] },
    { fields: ['isRead'] },
  ],
});

module.exports = { Chat, Message };
