require('dotenv').config({ path: './backend/.env' });
const { sequelize } = require('./backend/src/config/database');
const User = require('./backend/src/models/User');

const forceUpdate = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected.');

        // Pre-calculated hash for 'password123' (bcrypt cost 10)
        // Note: bcryptjs usually generates $2a$ or $2b$. 
        // generated via: require('bcryptjs').hashSync('password123', 10)
        // Example: $2a$10$wI.qN.jN.kN.lN.mN.nN.oN.pN.qN.rN.sN.tN.uN.vN.wN.xN.yN
        // I will let the script generate it synchronously to be safe, then raw query update.

        const bcrypt = require('bcryptjs');
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync('password123', salt);

        console.log('Generated Hash:', hash);

        // Use raw query to bypass any Sequelize hook weirdness
        await sequelize.query(
            `UPDATE users SET password = :pass WHERE email = 'usersatu@user.com'`,
            {
                replacements: { pass: hash },
                type: sequelize.QueryTypes.UPDATE
            }
        );

        console.log('Password force updated via Raw SQL.');

    } catch (e) {
        console.error(e);
    } finally {
        await sequelize.close();
    }
};

forceUpdate();
