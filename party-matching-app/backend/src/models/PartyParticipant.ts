import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';

interface PartyParticipantAttributes {
  id?: string;
  userId: string;
  partyId: string;
  joinedAt?: Date;
  status?: 'pending' | 'accepted' | 'rejected' | 'abandoned';
  paid?: boolean;
  optIn?: boolean;
}

class PartyParticipant extends Model<PartyParticipantAttributes> implements PartyParticipantAttributes {
  public id!: string;
  public userId!: string;
  public partyId!: string;
  public joinedAt!: Date;
  public status!: 'pending' | 'accepted' | 'rejected' | 'abandoned';
  public paid!: boolean;
  public optIn!: boolean;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

PartyParticipant.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
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
    joinedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.ENUM('pending', 'accepted', 'rejected', 'abandoned'),
      defaultValue: 'pending',
    },
    paid: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    optIn: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'party_participants',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['userId', 'partyId'],
      },
    ],
  }
);

export default PartyParticipant;