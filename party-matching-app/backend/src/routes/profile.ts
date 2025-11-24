import { Router } from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/profileController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Route to get user profile
router.get('/profile', authenticate, getUserProfile);

// Route to update user profile
router.put('/profile', authenticate, updateUserProfile);

export default router;