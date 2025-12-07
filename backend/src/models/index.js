const { sequelize } = require('../config/database');
const User = require('./User');
const JastipService = require('./JastipService');
const Product = require('./Product');
const Order = require('./Order');
const { Chat, Message } = require('./Chat');

// Define associations
User.hasMany(JastipService, {
  foreignKey: 'jastiperId',
  as: 'jastipServices',
});
JastipService.belongsTo(User, {
  foreignKey: 'jastiperId',
  as: 'jastiper',
});

JastipService.hasMany(Product, {
  foreignKey: 'jastipServiceId',
  as: 'products',
});
Product.belongsTo(JastipService, {
  foreignKey: 'jastipServiceId',
  as: 'jastipService',
});

User.hasMany(Order, {
  foreignKey: 'customerId',
  as: 'ordersAsCustomer',
});
User.hasMany(Order, {
  foreignKey: 'jastiperId',
  as: 'ordersAsJastiper',
});

Order.belongsTo(User, {
  foreignKey: 'customerId',
  as: 'customer',
});
Order.belongsTo(User, {
  foreignKey: 'jastiperId',
  as: 'jastiper',
});
Order.belongsTo(JastipService, {
  foreignKey: 'jastipServiceId',
  as: 'jastipService',
});

Chat.hasMany(Message, {
  foreignKey: 'chatId',
  as: 'messages',
});
Message.belongsTo(Chat, {
  foreignKey: 'chatId',
  as: 'chat',
});
Message.belongsTo(User, {
  foreignKey: 'senderId',
  as: 'sender',
});

module.exports = {
  sequelize,
  User,
  JastipService,
  Product,
  Order,
  Chat,
  Message,
};
