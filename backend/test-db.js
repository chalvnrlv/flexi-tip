require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

const testConnection = async () => {
  try {
    console.log('🔄 Testing MySQL Connection...\n');
    
    const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = process.env;
    
    // Validate environment variables
    if (!DB_HOST || !DB_NAME || !DB_USER || !DB_PASSWORD) {
      throw new Error('Missing database configuration in .env file');
    }
    
    console.log('📍 Connection Info:');
    console.log('├─ 🌐 Host:', DB_HOST);
    console.log('├─ 🔌 Port:', DB_PORT || '3306');
    console.log('├─ 📊 Database:', DB_NAME);
    console.log('├─ 👤 User:', DB_USER);
    console.log('└─ 🔑 Password:', '****');
    console.log('');
    
    // Create Sequelize instance
    const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
      host: DB_HOST,
      port: DB_PORT || 3306,
      dialect: 'mysql',
      logging: false, // Disable query logging for cleaner output
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    });
    
    // Test authentication
    console.log('🔐 Testing authentication...');
    await sequelize.authenticate();
    console.log('✅ MySQL Connected Successfully!\n');
    
    // Test CRUD operations
    console.log('🧪 Testing CRUD Operations...\n');
    
    // Define test model
    const TestModel = sequelize.define('connection_test', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      message: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {
      timestamps: true,
      tableName: 'connection_tests'
    });
    
    // Sync model (create table)
    console.log('📋 Creating test table...');
    await TestModel.sync({ force: true });
    console.log('   ✅ Table created');
    
    // Create
    console.log('1️⃣ Creating test record...');
    const record = await TestModel.create({ 
      message: 'MySQL connection test successful!' 
    });
    console.log('   ✅ Created:', record.id);
    
    // Read
    console.log('2️⃣ Reading test record...');
    const found = await TestModel.findByPk(record.id);
    console.log('   ✅ Found:', found.message);
    
    // Update
    console.log('3️⃣ Updating test record...');
    await found.update({ message: 'Updated!' });
    console.log('   ✅ Updated successfully');
    
    // Delete
    console.log('4️⃣ Deleting test record...');
    await TestModel.destroy({ where: {} });
    console.log('   ✅ Deleted successfully');
    
    // Drop test table
    console.log('5️⃣ Cleaning up test table...');
    await TestModel.drop();
    console.log('   ✅ Table dropped');
    
    console.log('\n🎉 All tests passed!');
    console.log('👋 Closing connection...\n');
    
    await sequelize.close();
    console.log('✅ Connection closed successfully');
    console.log('\n🚀 You can now start your server with: npm run dev');
    console.log('📝 Or import schema with: mysql -u root -p flexitip < database-schema.sql\n');
    
  } catch (error) {
    console.error('\n❌ Connection Error:\n');
    console.error('Error Name:', error.name);
    console.error('Error Message:', error.message);
    
    if (error.original) {
      console.error('Original Error:', error.original.message);
    }
    
    console.error('\n💡 Common Solutions:');
    console.error('   1. Check database credentials in .env file');
    console.error('   2. Ensure MySQL server is running');
    console.error('   3. Verify database exists: CREATE DATABASE flexitip;');
    console.error('   4. Check user permissions: GRANT ALL ON flexitip.* TO "user"@"localhost";');
    console.error('   5. Verify host and port are correct');
    console.error('   6. Check firewall settings\n');
    process.exit(1);
  }
};

testConnection();
