require('dotenv').config({ path: './backend/.env' });
const { sequelize } = require('./backend/src/config/database');
const User = require('./backend/src/models/User');
const bcrypt = require('bcryptjs');

const debugAuth = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ DB Connection OK');

        const email = 'usersatu@user.com';
        const password = 'password123';

        const user = await User.findOne({ where: { email } });
        if (!user) {
            console.log('❌ User not found!');
            return;
        }

        console.log(`👤 User Found: ${user.email}`);
        console.log(`🔒 Stored Hash: ${user.password}`);

        // Test 1: Direct Bcrypt Compare
        const isBcryptMatch = await bcrypt.compare(password, user.password);
        console.log(`🧪 bcrypt.compare('${password}', hash): ${isBcryptMatch ? '✅ MATCH' : '❌ FAIL'}`);

        // Test 2: Model Method
        const isModelMatch = await user.matchPassword(password);
        console.log(`🧪 user.matchPassword('${password}'): ${isModelMatch ? '✅ MATCH' : '❌ FAIL'}`);

        // Test 3: If fail, force update and re-test
        if (!isBcryptMatch) {
            console.log('⚠️ Hash mismatch. Attempting forced update...');
            // Manually hash to be sure
            const salt = await bcrypt.genSalt(10);
            const newHash = await bcrypt.hash(password, salt);
            console.log(`Generated new hash: ${newHash}`);

            // Update directly to DB to bypass hooks for a moment, or use save to test hooks
            // We use user.update -> triggers hooks
            user.password = password;
            await user.save();
            // NOTE: The hook should hash this. 

            console.log('User saved. Refetching...');
            const updatedUser = await User.findOne({ where: { email } });
            console.log(`🔒 New Stored Hash: ${updatedUser.password}`);

            const retryMatch = await updatedUser.matchPassword(password);
            console.log(`🧪 Retry user.matchPassword('${password}'): ${retryMatch ? '✅ MATCH' : '❌ FAIL'}`);
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await sequelize.close();
    }
};

debugAuth();
