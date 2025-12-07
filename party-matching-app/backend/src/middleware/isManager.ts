import { Request, Response, NextFunction } from 'express';
import User from '../models/User';

export default async function isManager(req: any, res: Response, next: NextFunction) {
  try {
    const user = await User.findByPk(req.userId);
    
    if (!user) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    // Allow if admin
    if (user.isAdmin || user.role === 'admin') {
      return next();
    }

    // Allow if manager and approved
    if (user.role === 'manager' && user.isApproved) {
      return next();
    }
    
    return res.status(403).json({ message: 'Access denied. Managers only (must be approved).' });
  } catch (error) {
    console.error('Manager check error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
