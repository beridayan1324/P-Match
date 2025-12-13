import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import Party from '../models/Party';
import PartyParticipant from '../models/PartyParticipant';
import User from '../models/User';
import Match from '../models/Match';
import { MatchingService } from '../services/matchingService';

// Create a new party
export const createParty = async (req: any, res: Response) => {
  try {
    const { name, date, location, description, image, ticketPrice, expenses } = req.body;
    const userId = req.userId;
    
    // Calculate matching start time (24 hours before party)
    const partyDate = new Date(date);
    const matchingStartTime = new Date(partyDate.getTime() - 24 * 60 * 60 * 1000);
    
    const party = await Party.create({
      name,
      date: partyDate,
      location,
      description,
      image,
      matchingStartTime,
      matchingStarted: false,
      ticketPrice: ticketPrice || 0,
      expenses: expenses || 0,
      createdBy: userId,
    });
    
    res.status(201).json(party);
  } catch (error) {
    console.error('Create party error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllParties = async (req: any, res: Response) => {
  try {
    const userId = req.userId;
    
    // Check user role
    const user = await User.findByPk(userId);
    const isManager = user?.role === 'manager';

    const whereClause: any = {};
    if (isManager) {
        whereClause.createdBy = userId;
    }

    const parties = await Party.findAll({
      where: whereClause,
      order: [['date', 'ASC']],
    });
    
    // Check which parties the user has joined
    const userParticipations = await PartyParticipant.findAll({
      where: { userId },
    });
    
    const joinedPartyIds = userParticipations.map(p => p.partyId);
    
    const now = new Date();
    const partiesWithInfo = parties.map(party => {
      const matchingTime = party.matchingStartTime ? new Date(party.matchingStartTime) : null;
      const timeUntilMatching = matchingTime ? matchingTime.getTime() - now.getTime() : null;
      const participation = userParticipations.find(p => p.partyId === party.id);
      
      return {
        ...party.toJSON(),
        timeUntilMatching: timeUntilMatching && timeUntilMatching > 0 ? timeUntilMatching : null,
        matchingAvailable: party.matchingStarted,
        hasJoined: !!participation,
        ticketCode: participation ? participation.ticketCode : null,
        isOptedIn: participation ? participation.optIn : false,
      };
    });
    
    res.json(partiesWithInfo);
  } catch (error) {
    console.error('Get parties error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPartyDetails = async (req: any, res: Response) => {
  try {
    const userId = req.userId;
    const { partyId } = req.params;
    
    const party = await Party.findByPk(partyId);
    if (!party) {
      return res.status(404).json({ message: 'Party not found' });
    }
    
    const participation = await PartyParticipant.findOne({
      where: { userId, partyId },
    });
    
    const now = new Date();
    const matchingTime = party.matchingStartTime ? new Date(party.matchingStartTime) : null;
    const timeUntilMatching = matchingTime ? matchingTime.getTime() - now.getTime() : null;

    const partyData = {
      ...party.toJSON(),
      timeUntilMatching: timeUntilMatching && timeUntilMatching > 0 ? timeUntilMatching : null,
      matchingAvailable: party.matchingStarted,
      hasJoined: !!participation,
      ticketCode: participation ? participation.ticketCode : null,
      isOptedIn: participation ? participation.optIn : false,
    };
    
    res.json(partyData);
  } catch (error) {
    console.error('Get party details error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const joinParty = async (req: any, res: Response) => {
  try {
    const userId = req.userId;
    const { partyId } = req.params;
    
    // Check if user exists and profile is complete
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'manager' || user.role === 'admin') {
      return res.status(403).json({ message: 'Managers cannot join parties as participants.' });
    }
    
    if (!MatchingService.isProfileComplete(user)) {
      return res.status(400).json({ 
        message: 'Profile incomplete. Please complete your profile first.',
        missingFields: {
          name: !user.name,
          gender: !user.gender,
          genderPreference: !user.genderPreference,
          profileImage: !user.profileImage,
          bio: !user.bio || user.bio.length < 20,
        }
      });
    }
    
    // Check if party exists
    const party = await Party.findByPk(partyId);
    if (!party) {
      return res.status(404).json({ message: 'Party not found' });
    }
    
    // Check if already joined
    const existing = await PartyParticipant.findOne({
      where: { userId, partyId },
    });
    
    if (existing) {
      return res.status(400).json({ message: 'Already joined this party' });
    }
    
    // Join party - default status is pending
    const participant = await PartyParticipant.create({
      userId,
      partyId,
      optIn: false, // Default to false, user must opt-in separately
      status: 'pending',
      paid: true, // Assuming payment is successful for now
      ticketCode: uuidv4(), // Generate unique ticket code
    });
    
    res.status(201).json({ message: 'Successfully joined party', participant });
  } catch (error) {
    console.error('Join party error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const toggleMatchingStatus = async (req: any, res: Response) => {
  try {
    const userId = req.userId;
    const { partyId } = req.params;
    const { optIn } = req.body;

    const participant = await PartyParticipant.findOne({
      where: { userId, partyId },
    });

    if (!participant) {
      return res.status(404).json({ message: 'Not a participant of this party' });
    }

    // Check if profile is complete before opting in
    if (optIn) {
        const user = await User.findByPk(userId);
        if (!user || !MatchingService.isProfileComplete(user)) {
             return res.status(400).json({ 
                message: 'Profile incomplete. Please complete your profile first.',
            });
        }

        // Check if matching has already started
        const party = await Party.findByPk(partyId);
        if (party && party.matchingStartTime && new Date() > new Date(party.matchingStartTime)) {
             return res.status(400).json({ message: 'Matching has already started. You cannot join the matching pool now.' });
        }
    } else {
        // User is trying to leave (optIn = false)
        const party = await Party.findByPk(partyId);
        if (party && party.matchingStartTime && new Date() > new Date(party.matchingStartTime)) {
             return res.status(400).json({ message: 'Matching has already started. You cannot leave the matching pool now.' });
        }
    }

    console.log(`Updating matching status for user ${userId} in party ${partyId} to ${optIn}`);
    participant.optIn = optIn;
    await participant.save();

    res.json({ message: 'Matching status updated', optIn: participant.optIn });
  } catch (error) {
    console.error('Toggle matching status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPartyParticipants = async (req: Request, res: Response) => {
  try {
    const { partyId } = req.params;
    const { optInOnly } = req.query;

    const whereClause: any = { partyId };
    // Check for string 'true' or boolean true
    if (String(optInOnly) === 'true') {
      whereClause.optIn = true;
    }
    
    console.log(`Getting participants for party ${partyId}. OptInOnly: ${optInOnly}, Where:`, whereClause);

    const participants = await PartyParticipant.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'profileImage', 'gender', 'email'],
        },
      ],
      order: [['joinedAt', 'ASC']],
    });
    
    const participantData = participants.map(p => ({
      id: p.id,
      userId: p.userId,
      name: (p as any).user?.name,
      email: (p as any).user?.email,
      gender: (p as any).user?.gender,
      profileImage: (p as any).user?.profileImage,
      joinedAt: p.joinedAt,
      status: p.status,
      paid: p.paid,
      ticketCode: p.ticketCode,
      checkedIn: p.checkedIn,
      checkedInAt: p.checkedInAt
    }));
    
    res.json({
      total: participantData.length,
      participants: participantData,
    });
  } catch (error) {
    console.error('Get participants error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserMatches = async (req: any, res: Response) => {
  try {
    const userId = req.userId;
    const { partyId } = req.params;
    
    // Find matches where user is either user1 or user2
    const matches = await Match.findAll({
      where: {
        partyId,
        [Op.or]: [
          { user1Id: userId },
          { user2Id: userId },
        ],
      },
    });
    
    // Get matched user details with their status
    const matchesWithUsers = await Promise.all(
      matches.map(async (match) => {
        const isUser1 = match.user1Id === userId;
        const otherUserId = isUser1 ? match.user2Id : match.user1Id;
        const myStatus = isUser1 ? match.user1Status : match.user2Status;
        const theirStatus = isUser1 ? match.user2Status : match.user1Status;
        
        const otherUser = await User.findByPk(otherUserId, {
          attributes: { exclude: ['password'] },
        });

        // Parse interests if it's a string
        if (otherUser && typeof otherUser.interests === 'string') {
          try {
            otherUser.interests = JSON.parse(otherUser.interests as string) as any;
          } catch (e) {
            otherUser.interests = [] as any;
          }
        }
        
        return {
          matchId: match.id,
          user: otherUser,
          myStatus,
          theirStatus,
          mutualMatch: match.mutualMatch,
        };
      })
    );
    
    res.json({ matches: matchesWithUsers });
  } catch (error) {
    console.error('Get matches error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const respondToMatch = async (req: any, res: Response) => {
  try {
    const userId = req.userId;
    const { matchId } = req.params;
    const { action } = req.body; // 'accept' or 'reject'
    
    if (!['accept', 'reject'].includes(action)) {
      return res.status(400).json({ message: 'Invalid action' });
    }
    
    const match = await Match.findByPk(matchId);
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }
    
    // Check if user is part of this match
    const isUser1 = match.user1Id === userId;
    const isUser2 = match.user2Id === userId;
    
    if (!isUser1 && !isUser2) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Update status
    if (isUser1) {
      match.user1Status = action === 'accept' ? 'accepted' : 'rejected';
    } else {
      match.user2Status = action === 'accept' ? 'accepted' : 'rejected';
    }
    
    // Check for mutual match
    if (match.user1Status === 'accepted' && match.user2Status === 'accepted') {
      match.mutualMatch = true;
    }
    
    await match.save();
    
    res.json({ 
      message: `Match ${action}ed successfully`,
      mutualMatch: match.mutualMatch,
    });
  } catch (error) {
    console.error('Respond to match error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Keep existing functions
export const getParties = async (req: Request, res: Response) => {
  try {
    const parties = await Party.findAll();
    res.status(200).json(parties);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching parties', error });
  }
};

export const listParties = async (req: Request, res: Response) => {
  const parties = await Party.findAll();
  return res.json(parties);
};

export const toggleOptIn = async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { partyId } = req.params;
  const pp = await PartyParticipant.findOne({ where: { userId, partyId } });
  if (!pp) return res.status(404).json({ message: 'Not joined' });
  pp.optIn = !pp.optIn;
  await pp.save();
  return res.json(pp);
};

// --- NEW MANAGER FUNCTIONS ---

export const getManagerParties = async (req: any, res: Response) => {
  try {
    const userId = req.userId;
    const parties = await Party.findAll({
      where: { createdBy: userId },
      order: [['date', 'DESC']]
    });
    res.json(parties);
  } catch (error) {
    console.error('Get manager parties error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPartyStats = async (req: any, res: Response) => {
  try {
    const { partyId } = req.params;
    const party = await Party.findByPk(partyId);
    
    if (!party) {
      return res.status(404).json({ message: 'Party not found' });
    }

    const participants = await PartyParticipant.findAll({
      where: { partyId },
      include: [{ model: User, as: 'user', attributes: ['gender', 'id'] }]
    });

    const stats = {
      accepted: 0,
      pending: 0,
      rejected: 0,
      abandoned: 0,
      totalIncome: 0,
      expenses: party.expenses || 0,
      grossRevenue: 0,
      genderStats: {
        male: 0,
        female: 0,
        other: 0
      }
    };

    participants.forEach((p: any) => {
      // Count status
      if (p.status === 'accepted') stats.accepted++;
      else if (p.status === 'pending') stats.pending++;
      else if (p.status === 'rejected') stats.rejected++;
      else if (p.status === 'abandoned') stats.abandoned++;

      // Calculate income (assuming accepted users pay)
      if (p.status === 'accepted') {
        stats.totalIncome += party.ticketPrice || 0;
      }

      // Gender stats
      if (p.user?.gender === 'male') stats.genderStats.male++;
      else if (p.user?.gender === 'female') stats.genderStats.female++;
      else stats.genderStats.other++;
    });

    stats.grossRevenue = stats.totalIncome - stats.expenses;

    res.json(stats);
  } catch (error) {
    console.error('Get party stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateParticipantStatus = async (req: any, res: Response) => {
  try {
    const { partyId, userId } = req.params;
    const { status } = req.body;

    if (!['accepted', 'rejected', 'pending', 'abandoned'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const participant = await PartyParticipant.findOne({
      where: { partyId, userId }
    });

    if (!participant) {
      return res.status(404).json({ message: 'Participant not found' });
    }

    participant.status = status;
    await participant.save();

    res.json({ message: 'Status updated', participant });
  } catch (error) {
    console.error('Update participant status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const scanTicket = async (req: any, res: Response) => {
  try {
    const { partyId } = req.params;
    const { ticketCode } = req.body;

    const participant = await PartyParticipant.findOne({
      where: { ticketCode, partyId },
      include: [{ model: User, as: 'user', attributes: ['name', 'email', 'gender', 'profileImage'] }]
    });

    if (!participant) {
      return res.status(404).json({ valid: false, message: 'Invalid ticket code for this party' });
    }

    if (participant.status !== 'accepted') {
      return res.status(400).json({ valid: false, message: `Ticket is not accepted (Status: ${participant.status})` });
    }

    if (participant.checkedIn) {
      return res.status(400).json({ 
        valid: false, 
        message: 'Ticket already used', 
        checkedInAt: participant.checkedInAt,
        user: (participant as any).user 
      });
    }

    // Mark as checked in
    participant.checkedIn = true;
    participant.checkedInAt = new Date();
    await participant.save();

    res.json({ 
      valid: true, 
      message: 'Check-in successful', 
      user: (participant as any).user 
    });
  } catch (error) {
    console.error('Scan ticket error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};