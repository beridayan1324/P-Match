import { Router } from 'express';
import { createParty, getParties, joinParty, toggleOptIn } from '../controllers/partyController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Route to create a new party
router.post('/', authenticate, createParty);

// Route to get the list of parties
router.get('/', getParties);

// Route to join a party
router.post('/:partyId/join', authenticate, joinParty);

// Route to toggle matching opt-in status
router.post('/:partyId/toggle-opt-in', authenticate, toggleOptIn);

export default router;