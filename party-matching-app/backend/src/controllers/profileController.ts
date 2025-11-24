import { Request, Response } from 'express';
import User from '../models/User';

// Update user profile
export const updateProfile = async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const { name, gender, profileImage, preferences } = req.body;
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'Not found' });
    await user.update({ name, gender, profileImage, preferences });
    return res.json(user);
};

// Get user profile
export const getProfile = async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'Not found' });
    return res.json(user);
};