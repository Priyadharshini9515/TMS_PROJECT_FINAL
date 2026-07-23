const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function addDocAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        const defaultUsers = [
            { username: 'superadmin_official', email: 'superadmin@example.com', password: 'SuperAdmin@123', role: 'SuperAdmin' },
            { username: 'admin_official', email: 'admin@example.com', password: 'Admin@123', role: 'SuperAdmin' }
        ];

        for (const u of defaultUsers) {
            let user = await User.findOne({ email: u.email });
            const hashedPassword = await bcrypt.hash(u.password, 10);
            if (user) {
                console.log(`User ${u.email} exists, updating password...`);
                user.password = hashedPassword;
                await user.save();
            } else {
                console.log(`Creating user ${u.email}...`);
                await User.create({
                    username: u.username,
                    email: u.email,
                    password: hashedPassword,
                    phone: '1234567890',
                    role: u.role
                });
            }
        }
        console.log('Done!');
        mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

addDocAdmin();
