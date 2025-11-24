import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';
import User from './User';
import Party from './Party';

class PartyParticipant extends Model {
  public id!: string;
  public userId!: string;
  public partyId!: string;
  public optIn!: boolean;
}

PartyParticipant.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.UUID, allowNull: false },
  partyId: { type: DataTypes.UUID, allowNull: false },
  optIn: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  sequelize,
  modelName: 'PartyParticipant',
  tableName: 'party_participants',
  timestamps: true,
});

User.belongsToMany(Party, { through: PartyParticipant, foreignKey: 'userId' });
Party.belongsToMany(User, { through: PartyParticipant, foreignKey: 'partyId' });

export default PartyParticipant;