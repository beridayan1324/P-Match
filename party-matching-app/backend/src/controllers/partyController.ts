import { Request, Response } from 'express';
import Party from '../models/Party';
import PartyParticipant from '../models/PartyParticipant';

// Create a new party
export const createParty = async (req: Request, res: Response) => {
    const { name, date, location, participants } = req.body;

    try {
        const newParty = await Party.create({ name, date, location });

        // If an array of participant user IDs is provided, create join records
        if (Array.isArray(participants) && participants.length) {
            const records = participants.map((userId: string) => ({
                userId,
                partyId: newParty.id,
                optIn: false
            }));
            await PartyParticipant.bulkCreate(records);
        }

        res.status(201).json(newParty);
    } catch (error) {
        res.status(500).json({ message: 'Error creating party', error });
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