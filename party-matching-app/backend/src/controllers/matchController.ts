import { Request, Response } from 'express';
import PartyParticipant from '../models/PartyParticipant';
import User from '../models/User';
import Match from '../models/Match';
import { Op } from 'sequelize';

export const runMatchingForParty = async (partyId: string) => {
  // find opt-in participants
  const participants = await PartyParticipant.findAll({ where: { partyId, optIn: true } });
  const userIds = participants.map(p => p.userId);
  const users = await User.findAll({ where: { id: userIds } });

  const males = users.filter(u => u.gender === 'male');
  const females = users.filter(u => u.gender === 'female');

  // random pairing
  const pairs: Array<[any, any]> = [];
  while (males.length && females.length) {
    const mi = Math.floor(Math.random() * males.length);
    const fi = Math.floor(Math.random() * females.length);
    pairs.push([males.splice(mi,1)[0], females.splice(fi,1)[0]]);
  }

  // save matches
  for (const [male, female] of pairs) {
    await Match.create({
      partyId,
      user1Id: male.id,
      user2Id: female.id,
      user1Status: 'pending',
      user2Status: 'pending',
      mutualMatch: false,
    });
  }
};

export const getMatchPreview = async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const match = await Match.findOne({ 
    where: { 
      [Op.and]: [
        { [Op.or]: [{ user1Id: userId }, { user2Id: userId }] },
        { [Op.or]: [{ user1Status: 'pending' }, { user2Status: 'pending' }] }
      ]
    } 
  });
  
  if (!match) return res.status(404).json({ message: 'No match' });

  const otherId = match.user1Id === userId ? match.user2Id : match.user1Id;
  const other = await User.findByPk(otherId);
  return res.json({ matchId: match.id, other: { id: other?.id, name: other?.name, profileImage: other?.profileImage } });
};

export const respondToMatch = async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { matchId } = req.params;
  const { accept } = req.body;
  const match = await Match.findByPk(matchId);
  if (!match) return res.status(404).json({ message: 'Not found' });

  // Update user's status
  if (match.user1Id === userId) {
    match.user1Status = accept ? 'accepted' : 'rejected';
  }
  if (match.user2Id === userId) {
    match.user2Status = accept ? 'accepted' : 'rejected';
  }
  
  // Check if both accepted
  if (match.user1Status === 'accepted' && match.user2Status === 'accepted') {
    match.mutualMatch = true;
  }

  await match.save();
  return res.json(match);
};

export const getMyMatches = async (req: any, res: Response) => {
  try {
    const userId = req.userId;

    const matches = await Match.findAll({
      where: {
        [Op.or]: [{ user1Id: userId }, { user2Id: userId }],
      },
      include: [
        {
          model: User,
          as: 'user1',
          attributes: ['id', 'name', 'profileImage', 'bio', 'interests'],
        },
        {
          model: User,
          as: 'user2',
          attributes: ['id', 'name', 'profileImage', 'bio', 'interests'],
        },
      ],
    });

    res.json({ matches });
  } catch (error) {
    console.error('Get matches error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};