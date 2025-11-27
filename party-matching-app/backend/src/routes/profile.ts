import express from 'express';
import User from '../models/User';
import authenticate from '../middleware/auth';

const router = express.Router();

// Get user profile
router.get('/', authenticate, async (req: any, res) => {
  try {
    console.log('Getting profile for userId:', req.userId);
    
    const user = await User.findByPk(req.userId, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      console.log('User not found with id:', req.userId);
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log('User found:', user.email);
    res.json(user);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/', authenticate, async (req: any, res) => {
  try {
    const { name, gender, preferences, profileImage, additionalImages, bio, interests, location } = req.body;
    
    console.log('Updating profile for userId:', req.userId);
    console.log('Received additionalImages count:', additionalImages?.length);
    
    const user = await User.findByPk(req.userId);
    
    if (!user) {
      console.log('User not found with id:', req.userId);
      return res.status(404).json({ message: 'User not found' });
    }
    
    const updateData: any = {};
    
    if (name !== undefined) updateData.name = name;
    if (gender !== undefined) updateData.gender = gender;
    if (preferences !== undefined) updateData.preferences = preferences;
    if (profileImage !== undefined) updateData.profileImage = profileImage;
    if (additionalImages !== undefined) updateData.additionalImages = additionalImages;
    if (bio !== undefined) updateData.bio = bio;
    if (interests !== undefined) updateData.interests = interests;
    if (location !== undefined) updateData.location = location;
    
    console.log('Updating with fields:', Object.keys(updateData));
    
    await user.update(updateData);
    
    const updatedUser = await User.findByPk(req.userId, {
      attributes: { exclude: ['password'] }
    });
    
    console.log('User updated successfully');
    
    res.json(updatedUser);
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;