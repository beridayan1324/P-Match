import { Request, Response } from 'express';
import User from '../models/User';

export const getManagers = async (req: Request, res: Response) => {
  try {
    const managers = await User.findAll({
      where: { role: 'manager' },
      attributes: { exclude: ['password'] }
    });
    res.json(managers);
  } catch (error) {
    console.error('Get managers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const approveManager = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role !== 'manager') {
      return res.status(400).json({ message: 'User is not a manager' });
    }

    user.isApproved = true;
    await user.save();
    
    res.json({ message: 'Manager approved successfully', user });
  } catch (error) {
    console.error('Approve manager error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isAdmin) {
        return res.status(403).json({ message: 'Cannot delete admin' });
    }

    await user.destroy();
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
