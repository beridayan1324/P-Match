import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, gender, role } = req.body;
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const userRole = role === 'manager' ? 'manager' : 'user';
    const isApproved = userRole !== 'manager';

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ 
      email, 
      password: hashedPassword, 
      name, 
      gender, 
      isAdmin: false,
      role: userRole,
      isApproved
    });
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    
    console.log('Register - User created:', { id: user.id, email: user.email, role: user.role, isApproved: user.isApproved });
    
    res.status(201).json({ 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name,
        isAdmin: user.isAdmin || false,
        role: user.role,
        isApproved: user.isApproved
      } 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    
    console.log('Login - User found:', { id: user.id, email: user.email, isAdmin: user.isAdmin, role: user.role });
    
    res.json({ 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name,
        isAdmin: user.isAdmin || false,
        role: user.role,
        isApproved: user.isApproved
      } 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProfile = async (req: any, res: Response) => {
  try {
    const userId = req.userId;
    
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] },
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Parse interests if it's a string
    let userData = user.toJSON();
    if (typeof userData.interests === 'string') {
      try {
        userData.interests = JSON.parse(userData.interests);
      } catch (e) {
        userData.interests = [];
      }
    }
    
    res.json({ user: userData });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};