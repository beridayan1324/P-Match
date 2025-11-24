import express from 'express';
import authenticate from '../middleware/auth';
import {
  createParty,
  listParties,
  joinParty,
  toggleOptIn
} from '../controllers/partyController';

const router = express.Router();

// Create a party
router.post('/', authenticate, createParty);

// List parties
router.get('/', listParties);

// Join a party
router.post('/:partyId/join', authenticate, joinParty);

// Toggle matching opt-in for a participant
router.post('/:partyId/toggle-optin', authenticate, toggleOptIn);

export default router;