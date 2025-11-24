import { Request, Response } from 'express';
import User from '../models/User';

// Update user profile
export const updateProfile = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { name, gender, preferences } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(userId, {
            name,
            gender,
            preferences,
            profileImage: req.file ? req.file.path : undefined
        }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile', error });
    }
};

// Get user profile
export const getProfile = async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error });
    }
};