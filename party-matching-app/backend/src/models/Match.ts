import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';

interface MatchAttributes {
  id?: string;
  partyId: string;
  user1Id: string;
  user2Id: string;
  status?: 'pending' | 'accepted' | 'rejected';
}

class Match extends Model<MatchAttributes> implements MatchAttributes {
  public id!: string;
  public partyId!: string;
  public user1Id!: string;
  public user2Id!: string;
  public status!: 'pending' | 'accepted' | 'rejected';
  
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
    status: {
      type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
      defaultValue: 'pending',
    },
  },
  {
    sequelize,
    tableName: 'matches',
    timestamps: true,
    indexes: [
      {
        fields: ['partyId', 'user1Id'],
      },
      {
        fields: ['partyId', 'user2Id'],
      },
    ],
  }
);

export default Match;