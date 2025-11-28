import sequelize from '../db';
import User from '../models/User';
import bcrypt from 'bcryptjs';

async function seedAdmin() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ where: { email: 'admin@gmail.com' } });
    
    if (existingAdmin) {
      console.log('Admin user already exists!');
      process.exit(0);
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@gmail.com',
      password: hashedPassword,
      gender: 'other',
      genderPreference: 'any',
      bio: 'System administrator account for managing parties and events.',
      interests: JSON.stringify(['Admin', 'Management']) as any,
      location: 'System',
      profileImage: 'https://i.pravatar.cc/300?img=60',
      isAdmin: true,
    });

    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@gmail.com');
    console.log('Password: admin123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
}

seedAdmin();