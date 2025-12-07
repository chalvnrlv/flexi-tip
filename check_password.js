require('dotenv').config({ path: './backend/.env' });
const { sequelize } = require('./backend/src/config/database');
const User = require('./backend/src/models/User');

const checkUser = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        const user = await User.findOne({ where: { email: 'usersatu@user.com' } });
        if (user) {
            console.log('User found:', user.email);
            console.log('Stored Password Hash (first 20 chars):', user.password.substring(0, 20));
            console.log('Password length:', user.password.length);
            // Check if it looks like a bcrypt hash (starts with $2a$ or $2b$)
            if (user.password.startsWith('$2')) {
                console.log('Format looks like Bcrypt.');
            } else {
                console.log('Format DOES NOT look like Bcrypt (likely plain text).');
            }
        } else {
            console.log('User not found.');
        }
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    } finally {
        await sequelize.close();
    }
};

checkUser();
