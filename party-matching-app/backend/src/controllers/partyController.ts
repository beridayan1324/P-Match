import { Request, Response } from 'express';
import { Op } from 'sequelize';
import Party from '../models/Party';
import PartyParticipant from '../models/PartyParticipant';
import User from '../models/User';
import Match from '../models/Match';
import { MatchingService } from '../services/matchingService';

// Create a new party
export const createParty = async (req: any, res: Response) => {
  try {
    const { name, date, location, description, image } = req.body;
    
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
    
    const parties = await Party.findAll({
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
      
      return {
        ...party.toJSON(),
        timeUntilMatching: timeUntilMatching && timeUntilMatching > 0 ? timeUntilMatching : null,
        matchingAvailable: party.matchingStarted,
        hasJoined: joinedPartyIds.includes(party.id),
      };
    });
    
    res.json(partiesWithInfo);
  } catch (error) {
    console.error('Get parties error:', error);
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
    
    // Join party
    const participant = await PartyParticipant.create({
      userId,
      partyId,
      optIn: true,
    });
    
    res.status(201).json({ message: 'Successfully joined party', participant });
  } catch (error) {
    console.error('Join party error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPartyParticipants = async (req: Request, res: Response) => {
  try {
    const { partyId } = req.params;
    
    const participants = await PartyParticipant.findAll({
      where: { partyId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'profileImage'],
        },
      ],
      order: [['joinedAt', 'ASC']],
    });
    
    const participantData = participants.map(p => ({
      id: p.id,
      userId: p.userId,
      name: (p as any).user?.name,
      profileImage: (p as any).user?.profileImage,
      joinedAt: p.joinedAt,
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
    
    // Get matched user details
    const matchedUserIds = matches.map(m => 
      m.user1Id === userId ? m.user2Id : m.user1Id
    );
    
    const matchedUsers = await User.findAll({
      where: { id: matchedUserIds },
      attributes: { exclude: ['password'] },
    });
    
    res.json({ matches: matchedUsers });
  } catch (error) {
    console.error('Get matches error:', error);
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