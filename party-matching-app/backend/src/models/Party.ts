import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';
import User from './User';

class Party extends Model {
  public id!: string;
  public name!: string;
  public date!: Date;
  public location?: string;
}

Party.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: { type: DataTypes.STRING, allowNull: false },
  date: { type: DataTypes.DATE, allowNull: false },
  location: { type: DataTypes.STRING }
}, {
  sequelize,
  modelName: 'Party',
  tableName: 'parties',
  timestamps: true,
});

export default Party;