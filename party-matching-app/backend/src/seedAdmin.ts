import sequelize from './db';
import User from './models/User';
import bcrypt from 'bcryptjs';

async function seedAdmin() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database');
    
    await sequelize.sync({ alter: true });
    console.log('Database synced');
    
    // Check if admin exists
    const existingAdmin = await User.findOne({ where: { email: 'admin@gmail.com' } });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }
    
    // Create admin user
    const hashedPassword = await bcrypt.hash('nimda', 10);
    
    await User.create({
      email: 'admin@gmail.com',
      password: hashedPassword,
      name: 'Admin',
      isAdmin: true,
    });
    
    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@gmail.com');
    console.log('Password: nimda');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
}

seedAdmin();