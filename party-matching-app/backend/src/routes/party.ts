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
  toggleMatchingStatus,
  respondToMatch,
  getManagerParties,
  getPartyStats,
  updateParticipantStatus,
  scanTicket
} from '../controllers/partyController';

const router = Router();

// Manager routes
router.get('/manager/my-parties', authenticate, isManager, getManagerParties);
router.get('/:partyId/stats', authenticate, isManager, getPartyStats);
router.post('/:partyId/participants/:userId/status', authenticate, isManager, updateParticipantStatus);
router.post('/:partyId/scan', authenticate, isManager, scanTicket);

// Manager or Admin - create party
router.post('/', authenticate, isManager, createParty);

// All users - get parties
router.get('/', authenticate, getAllParties);

// Join party (Buy Ticket)
router.post('/:partyId/join', authenticate, joinParty);

// Toggle matching status
router.post('/:partyId/matching-status', authenticate, toggleMatchingStatus);

// Get party participants
router.get('/:partyId/participants', authenticate, getPartyParticipants);

// Accept/Reject match
router.post('/match/:matchId/respond', authenticate, respondToMatch);

export default router;