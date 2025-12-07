require('dotenv').config();
const { sequelize } = require('./src/config/database');
const User = require('./src/models/User');

const resetPassword = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        const user = await User.findOne({ where: { email: 'usersatu@user.com' } });
        if (user) {
            console.log('User found:', user.email);
            // Updating password will trigger beforeUpdate hook to hash it
            user.password = 'password123';
            await user.save();
            console.log('Password reset to: password123');
        } else {
            console.log('User not found. Creating it...');
            await User.create({
                name: 'User Satu',
                email: 'usersatu@user.com',
                password: 'password123',
                role: 'user',
                isVerified: true
            });
            console.log('User created with password: password123');
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
};

resetPassword();
