import User from './User';
import Party from './Party';
import PartyParticipant from './PartyParticipant';
import Match from './Match';
import Message from './Message';

// PartyParticipant associations
PartyParticipant.belongsTo(User, { foreignKey: 'userId', as: 'user' });
PartyParticipant.belongsTo(Party, { foreignKey: 'partyId', as: 'party' });

User.hasMany(PartyParticipant, { foreignKey: 'userId', as: 'participations' });
Party.hasMany(PartyParticipant, { foreignKey: 'partyId', as: 'participants' });

// Match associations
Match.belongsTo(User, { foreignKey: 'user1Id', as: 'user1' });
Match.belongsTo(User, { foreignKey: 'user2Id', as: 'user2' });
Match.belongsTo(Party, { foreignKey: 'partyId', as: 'party' });

// Message associations
Match.hasMany(Message, { foreignKey: 'matchId', as: 'messages' });
Message.belongsTo(Match, { foreignKey: 'matchId', as: 'match' });

User.hasMany(Message, { foreignKey: 'senderId', as: 'sentMessages' });
Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });

export { User, Party, PartyParticipant, Match, Message };