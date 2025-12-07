const { Sequelize } = require('sequelize');

// Create Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME || 'flexitip',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions: process.env.DB_SSL === 'true' ? {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    } : {},
  }
);

// Test connection
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL Connected:', process.env.DB_HOST || 'localhost');
    console.log('📊 Database:', process.env.DB_NAME || 'flexitip');

    // Sync models in development
    if (process.env.NODE_ENV === 'development') {
      // await sequelize.sync({ alter: true }); // Disabled to prevent "Too many keys" error on reload
      await sequelize.sync();
      console.log('📋 Database synchronized');
    }
  } catch (error) {
    console.error('❌ MySQL Connection Error:', error.message);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
  await sequelize.close();
  console.log('👋 MySQL connection closed');
  process.exit(0);
});

module.exports = { sequelize, connectDB };
