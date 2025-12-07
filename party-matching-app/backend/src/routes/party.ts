import { Router } from 'express';
import authenticate from '../middleware/auth';
import isAdmin from '../middleware/isAdmin';
import isManager from '../middleware/isManager';
import { 
  createParty, 
  getAllParties, 
  joinParty, 
  getPartyParticipants,
  getUserMatches,
  toggleOptIn,
  respondToMatch,
  getManagerParties,
  getPartyStats,
  updateParticipantStatus
} from '../controllers/partyController';

const router = Router();

// Manager routes
router.get('/manager/my-parties', authenticate, isManager, getManagerParties);
router.get('/:partyId/stats', authenticate, isManager, getPartyStats);
router.post('/:partyId/participants/:userId/status', authenticate, isManager, updateParticipantStatus);

// Manager or Admin - create party
router.post('/', authenticate, isManager, createParty);

// All users - get parties
router.get('/', authenticate, getAllParties);

// Join party
router.post('/:partyId/join', authenticate, joinParty);

// Get party participants
router.get('/:partyId/participants', authenticate, getPartyParticipants);

// Get user's matches for a party
router.get('/:partyId/matches', authenticate, getUserMatches);

// Toggle opt-in
router.post('/:partyId/opt-in', authenticate, toggleOptIn);

// Accept/Reject match
router.post('/match/:matchId/respond', authenticate, respondToMatch);

export default router;