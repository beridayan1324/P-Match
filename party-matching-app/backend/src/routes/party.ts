import { Router } from 'express';
import authenticate from '../middleware/auth';
import isAdmin from '../middleware/isAdmin';
import { createParty, getAllParties, joinParty, toggleOptIn } from '../controllers/partyController';

const router = Router();

// Admin only - create party
router.post('/', authenticate, isAdmin, createParty);

// All users - get parties
router.get('/', authenticate, getAllParties);

// Join party
router.post('/:partyId/join', authenticate, joinParty);

// Toggle opt-in
router.post('/:partyId/opt-in', authenticate, toggleOptIn);

export default router;