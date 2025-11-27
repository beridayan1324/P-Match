import User from './User';
import Party from './Party';
import PartyParticipant from './PartyParticipant';
import Match from './Match';

// PartyParticipant associations
PartyParticipant.belongsTo(User, { foreignKey: 'userId', as: 'user' });
PartyParticipant.belongsTo(Party, { foreignKey: 'partyId', as: 'party' });

User.hasMany(PartyParticipant, { foreignKey: 'userId', as: 'participations' });
Party.hasMany(PartyParticipant, { foreignKey: 'partyId', as: 'participants' });

// Match associations
Match.belongsTo(User, { foreignKey: 'user1Id', as: 'user1' });
Match.belongsTo(User, { foreignKey: 'user2Id', as: 'user2' });
Match.belongsTo(Party, { foreignKey: 'partyId', as: 'party' });

export { User, Party, PartyParticipant, Match };