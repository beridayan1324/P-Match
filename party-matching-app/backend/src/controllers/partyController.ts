import { Request, Response } from 'express';
import Party from '../models/Party';

// Create a new party
export const createParty = async (req: Request, res: Response) => {
    const { name, date, location, participants } = req.body;

    try {
        const newParty = new Party({ name, date, location, participants });
        await newParty.save();
        res.status(201).json(newParty);
    } catch (error) {
        res.status(500).json({ message: 'Error creating party', error });
    }
};

// Get all parties
export const getParties = async (req: Request, res: Response) => {
    try {
        const parties = await Party.find();
        res.status(200).json(parties);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching parties', error });
    }
};

// Join a party
export const joinParty = async (req: Request, res: Response) => {
    const { partyId, userId } = req.body;

    try {
        const party = await Party.findById(partyId);
        if (!party) {
            return res.status(404).json({ message: 'Party not found' });
        }

        if (!party.participants.includes(userId)) {
            party.participants.push(userId);
            await party.save();
        }

        res.status(200).json(party);
    } catch (error) {
        res.status(500).json({ message: 'Error joining party', error });
    }
};

// Toggle matching opt-in
export const toggleOptIn = async (req: Request, res: Response) => {
    const { partyId, userId } = req.body;

    try {
        const party = await Party.findById(partyId);
        if (!party) {
            return res.status(404).json({ message: 'Party not found' });
        }

        // Logic to toggle opt-in status (not implemented)
        // This would typically involve updating a field in the party or user model

        res.status(200).json({ message: 'Opt-in status toggled' });
    } catch (error) {
        res.status(500).json({ message: 'Error toggling opt-in', error });
    }
};