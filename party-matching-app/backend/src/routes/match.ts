import express from 'express';
import authenticate from '../middleware/auth';
import { getMatchPreview, respondToMatch } from '../controllers/matchController';

const router = express.Router();

// Get current user's pending match preview
router.get('/preview', authenticate, getMatchPreview);

// Respond to a match (accept/decline)
router.post('/:matchId/respond', authenticate, respondToMatch);

export default router;