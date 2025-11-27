import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, gender } = req.body;
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword, name, gender, isAdmin: false });
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    
    console.log('Register - User created:', { id: user.id, email: user.email, isAdmin: user.isAdmin });
    
    res.status(201).json({ 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name,
        isAdmin: user.isAdmin || false
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
    
    console.log('Login - User found:', { id: user.id, email: user.email, isAdmin: user.isAdmin });
    
    res.json({ 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name,
        isAdmin: user.isAdmin || false
      } 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};