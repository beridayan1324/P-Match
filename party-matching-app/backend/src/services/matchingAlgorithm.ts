import { Match } from '../models/Match';
import { Party } from '../models/Party';
import { User } from '../models/User';

export const matchUsers = async (partyId: string) => {
    const party = await Party.findById(partyId).populate('participants');
    if (!party) {
        throw new Error('Party not found');
    }

    const males = party.participants.filter(user => user.gender === 'male');
    const females = party.participants.filter(user => user.gender === 'female');

    const matches = [];

    females.forEach(female => {
        const randomMale = males[Math.floor(Math.random() * males.length)];
        if (randomMale) {
            matches.push({
                userId1: female._id,
                userId2: randomMale._id,
                status: 'pending',
                partyId: party._id
            });
        }
    });

    await Match.insertMany(matches);
    return matches;
};

export const getMatchPreview = async (userId: string) => {
    const matches = await Match.find({
        $or: [{ userId1: userId }, { userId2: userId }],
        status: 'pending'
    }).populate('userId1 userId2');

    return matches;
};