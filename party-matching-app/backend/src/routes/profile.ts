import express from 'express';
import { getProfile, updateProfile } from '../controllers/profileController';
import authenticate from '../middleware/auth';

const router = express.Router();

// Route to get user profile
router.get('/', authenticate, getProfile);

// Route to update user profile
router.put('/', authenticate, updateProfile);

export default router;