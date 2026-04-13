require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/user.model');
const bcrypt = require('bcryptjs');

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = new User({
      name: 'Super Admin',
      email: 'admin@recipenest.com',
      password: hashedPassword,
      role: 'admin',
      isActive: true,
      bio: 'Platform Administrator'
    });
    await admin.save();
    console.log('Admin created successfully');
    console.log('Email: admin@recipenest.com');
    console.log('Password: admin123');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
};

createAdmin();