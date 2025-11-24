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
      userAId: male.id,
      userBId: female.id,
      acceptedA: false,
      acceptedB: false,
      status: 'pending'
    });
  }
};

export const getMatchPreview = async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const match = await Match.findOne({ where: { [Op.or]: [{ userAId: userId }, { userBId: userId }], status: 'pending' } });
  if (!match) return res.status(404).json({ message: 'No match' });

  const otherId = match.userAId === userId ? match.userBId : match.userAId;
  const other = await User.findByPk(otherId);
  return res.json({ matchId: match.id, other: { id: other?.id, name: other?.name, profileImage: other?.profileImage } });
};

export const respondToMatch = async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { matchId } = req.params;
  const { accept } = req.body;
  const match = await Match.findByPk(matchId);
  if (!match) return res.status(404).json({ message: 'Not found' });

  if (match.userAId === userId) match.acceptedA = !!accept;
  if (match.userBId === userId) match.acceptedB = !!accept;
  if (match.acceptedA && match.acceptedB) match.status = 'confirmed';
  if (!match.acceptedA && !match.acceptedB && (match.acceptedA === false || match.acceptedB === false)) match.status = 'declined';

  await match.save();
  return res.json(match);
};