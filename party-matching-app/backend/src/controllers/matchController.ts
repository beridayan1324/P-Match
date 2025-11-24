import { Request, Response } from 'express';
import Match from '../models/Match';
import User from '../models/User';

// Get match preview for a user
export const getMatchPreview = async (req: Request, res: Response) => {
    try {
        const userId = req.user.id; // Assuming user ID is stored in req.user
        const matches = await Match.find({ userId }).populate('matchedUserId');
        res.status(200).json(matches);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching match preview', error });
    }
};

// Update match status
export const updateMatchStatus = async (req: Request, res: Response) => {
    const { matchId, status } = req.body;
    try {
        const match = await Match.findById(matchId);
        if (!match) {
            return res.status(404).json({ message: 'Match not found' });
        }
        match.status = status;
        await match.save();
        res.status(200).json({ message: 'Match status updated', match });
    } catch (error) {
        res.status(500).json({ message: 'Error updating match status', error });
    }
};

// Confirm match if both users accept
export const confirmMatch = async (req: Request, res: Response) => {
    const { matchId } = req.body;
    try {
        const match = await Match.findById(matchId);
        if (!match) {
            return res.status(404).json({ message: 'Match not found' });
        }
        if (match.status === 'accepted') {
            match.status = 'confirmed';
            await match.save();
            res.status(200).json({ message: 'Match confirmed', match });
        } else {
            res.status(400).json({ message: 'Both users must accept the match' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error confirming match', error });
    }
};