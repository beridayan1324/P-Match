import { Request, Response, NextFunction } from 'express';
import User from '../models/User';

export default async function isAdmin(req: any, res: Response, next: NextFunction) {
  try {
    const user = await User.findByPk(req.userId);
    
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    
    next();
  } catch (error) {
    console.error('Admin check error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}