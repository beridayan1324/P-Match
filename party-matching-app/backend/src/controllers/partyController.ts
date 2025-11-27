import { Request, Response } from 'express';
import Party from '../models/Party';
import PartyParticipant from '../models/PartyParticipant';

// Create a new party
export const createParty = async (req: any, res: Response) => {
  try {
    const { name, date, location, description, image } = req.body;
    
    // Calculate matching start time (34 hours before party)
    const partyDate = new Date(date);
    const matchingStartTime = new Date(partyDate.getTime() - 34 * 60 * 60 * 1000);
    
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

// Get all parties
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

export const joinParty = async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { partyId } = req.params;
  const [pp] = await PartyParticipant.findOrCreate({ where: { userId, partyId }, defaults: { optIn: false } as any });
  return res.json(pp);
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

export const getAllParties = async (req: Request, res: Response) => {
  try {
    const parties = await Party.findAll({
      order: [['date', 'ASC']],
    });
    
    // Add countdown info to each party
    const now = new Date();
    const partiesWithCountdown = parties.map(party => {
      const matchingTime = party.matchingStartTime ? new Date(party.matchingStartTime) : null;
      const timeUntilMatching = matchingTime ? matchingTime.getTime() - now.getTime() : null;
      
      return {
        ...party.toJSON(),
        timeUntilMatching: timeUntilMatching && timeUntilMatching > 0 ? timeUntilMatching : null,
        matchingAvailable: timeUntilMatching ? timeUntilMatching <= 0 : false,
      };
    });
    
    res.json(partiesWithCountdown);
  } catch (error) {
    console.error('Get parties error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};