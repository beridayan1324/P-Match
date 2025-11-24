import PartyParticipant from '../models/PartyParticipant';
import User from '../models/User';
import Match from '../models/Match';

/**
 * Simple random male<->female matching for a given party.
 * Creates Match records with status 'pending'.
 */
export async function runMatchingForParty(partyId: string) {
    // find opt-in participants
    const participants = await PartyParticipant.findAll({ where: { partyId, optIn: true } });
    const userIds = participants.map(p => p.userId);

    if (!userIds.length) return [];

    const users = await User.findAll({ where: { id: userIds } });

    const males = users.filter(u => u.gender === 'male');
    const females = users.filter(u => u.gender === 'female');

    const pairs: Array<{ userAId: string; userBId: string }> = [];

    // random pairing
    const m = [...males];
    const f = [...females];
    while (m.length && f.length) {
        const mi = Math.floor(Math.random() * m.length);
        const fi = Math.floor(Math.random() * f.length);
        const male = m.splice(mi, 1)[0];
        const female = f.splice(fi, 1)[0];
        pairs.push({ userAId: male.id, userBId: female.id });
    }

    if (!pairs.length) return [];

    // create matches in bulk
    const matchRecords = pairs.map(p => ({
        partyId,
        userAId: p.userAId,
        userBId: p.userBId,
        acceptedA: false,
        acceptedB: false,
        status: 'pending'
    }));

    const created = await Match.bulkCreate(matchRecords);
    return created;
}

export default runMatchingForParty;