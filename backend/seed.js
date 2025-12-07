const { sequelize } = require('./src/config/database');
require('dotenv').config();
const { User, JastipService } = require('./src/models');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        // Sync database (altering is safer than force for now, or just trust it exists)
        // await sequelize.sync({ alter: true });

        console.log('Seeding data...');

        // 1. Create Consumer
        const consumerEmail = 'consumer@example.com';
        const consumerPassword = 'password123';
        let consumer = await User.findOne({ where: { email: consumerEmail } });
        if (!consumer) {
            consumer = await User.create({
                name: 'John Consumer',
                email: consumerEmail,
                password: consumerPassword, // model hook will hash it
                phone: '081234567890',
                role: 'user',
                isJastiper: false,
                isVerified: true
            });
            console.log(`Consumer created: ${consumerEmail} / ${consumerPassword}`);
        } else {
            console.log(`Consumer already exists: ${consumerEmail}`);
        }

        // 2. Create Jastiper
        const jastiperEmail = 'jastiper@example.com';
        const jastiperPassword = 'password123';
        let jastiper = await User.findOne({ where: { email: jastiperEmail } });
        if (!jastiper) {
            jastiper = await User.create({
                name: 'Jane Jastip',
                email: jastiperEmail,
                password: jastiperPassword,
                phone: '081987654321',
                role: 'user',
                isJastiper: true,
                isVerified: true,
                jastipProfile: {
                    rating: 4.8,
                    totalTrips: 12,
                    verificationStatus: 'verified'
                }
            });
            console.log(`Jastiper created: ${jastiperEmail} / ${jastiperPassword}`);
        } else {
            console.log(`Jastiper already exists: ${jastiperEmail}`);
        }

        // 3. Create Assistant User (for AI Chat)
        const assistantEmail = 'assistant@flexitip.com';
        let assistant = await User.findOne({ where: { email: assistantEmail } });
        if (!assistant) {
            assistant = await User.create({
                name: 'Flexi Assistant',
                email: assistantEmail,
                password: 'secureassistantpass',
                role: 'admin', // or special
                phone: '0000000000',
                avatar: 'https://cdn-icons-png.flaticon.com/512/4712/4712035.png', // Robot icon
                isVerified: true
            });
            console.log(`Assistant created: ${assistantEmail}`);
        }

        // 4. Create Jastip Services (Stores/Trips) for Jastiper
        // Need jastiper ID
        if (jastiper) {
            const services = [
                {
                    title: 'Open Jastip Japan - Tokyo Snacks & Merch',
                    description: 'Buying Tokyo Banana, Shiroi Koibito, and Anime Merch. Departure next week!',
                    type: 'global',
                    origin: 'Japan',
                    destination: 'Jakarta',
                    departureDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
                    arrivalDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
                    capacity: 20.0,
                    availableCapacity: 20.0,
                    pricePerKg: 250000,
                    serviceFee: 50000,
                    images: ['https://example.com/japan.jpg'],
                    status: 'active'
                },
                {
                    title: 'Jastip Singapore - Charles & Keith, Sephora',
                    description: 'Hand carry from Singapore for Charles & Keith bags and Sephora cosmetics.',
                    type: 'global',
                    origin: 'Singapore',
                    destination: 'Bandung',
                    departureDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                    arrivalDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
                    capacity: 15.0,
                    availableCapacity: 10.5,
                    pricePerKg: 150000,
                    serviceFee: 25000,
                    images: ['https://example.com/sg.jpg'],
                    status: 'active'
                }
            ];

            for (const svc of services) {
                // Check if similar exists to avoid dupe on re-run
                const exists = await JastipService.findOne({
                    where: {
                        jastiperId: jastiper.id,
                        title: svc.title
                    }
                });

                if (!exists) {
                    await JastipService.create({
                        ...svc,
                        jastiperId: jastiper.id
                    });
                    console.log(`Created service: ${svc.title}`);
                }
            }
        }

        console.log('Database seeding completed.');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
