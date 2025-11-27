import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';

interface PartyAttributes {
  id?: string;
  name: string;
  date: Date;
  location: string;
  description?: string;
  image?: string;
  matchingStarted?: boolean;
  matchingStartTime?: Date;
}

class Party extends Model<PartyAttributes> implements PartyAttributes {
  public id!: string;
  public name!: string;
  public date!: Date;
  public location!: string;
  public description?: string;
  public image?: string;
  public matchingStarted!: boolean;
  public matchingStartTime?: Date;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Party.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    image: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
    },
    matchingStarted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    matchingStartTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'parties',
    timestamps: true,
  }
);

export default Party;