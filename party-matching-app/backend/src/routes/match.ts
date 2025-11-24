import { Router } from 'express';
import { getMatchPreview, updateMatchStatus } from '../controllers/matchController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Route to get match preview
router.get('/preview', authenticate, getMatchPreview);

// Route to update match status
router.post('/status', authenticate, updateMatchStatus);

export default router;