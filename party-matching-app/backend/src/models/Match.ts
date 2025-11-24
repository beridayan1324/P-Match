import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';
import User from './User';
import Party from './Party';

class Match extends Model {
  public id!: string;
  public partyId!: string;
  public userAId!: string;
  public userBId!: string;
  public acceptedA!: boolean;
  public acceptedB!: boolean;
  public status!: 'pending' | 'confirmed' | 'declined';
}

Match.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  partyId: { type: DataTypes.UUID, allowNull: false },
  userAId: { type: DataTypes.UUID, allowNull: false },
  userBId: { type: DataTypes.UUID, allowNull: false },
  acceptedA: { type: DataTypes.BOOLEAN, defaultValue: false },
  acceptedB: { type: DataTypes.BOOLEAN, defaultValue: false },
  status: { type: DataTypes.ENUM('pending', 'confirmed', 'declined'), defaultValue: 'pending' },
}, {
  sequelize,
  modelName: 'Match',
  tableName: 'matches',
  timestamps: true,
});

export default Match;