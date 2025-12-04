import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';

class Match extends Model {
  public id!: string;
  public partyId!: string;
  public user1Id!: string;
  public user2Id!: string;
  public user1Status!: string;
  public user2Status!: string;
  public mutualMatch!: boolean;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Match.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    partyId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'parties',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    user1Id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    user2Id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    user1Status: {
      type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
      defaultValue: 'pending',
    },
    user2Status: {
      type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
      defaultValue: 'pending',
    },
    mutualMatch: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'matches',
    timestamps: true,
  }
);

export default Match;