import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';

interface PartyParticipantAttributes {
  id?: string;
  userId?: string | null;
  guestName?: string | null;
  guestEmail?: string | null;
  partyId: string;
  joinedAt?: Date;
  status?: 'pending' | 'accepted' | 'rejected' | 'abandoned';
  paid?: boolean;
  optIn?: boolean;
  ticketCode?: string;
  checkedIn?: boolean;
  checkedInAt?: Date;
}

class PartyParticipant extends Model<PartyParticipantAttributes> implements PartyParticipantAttributes {
  public id!: string;
  public userId!: string | null;
  public guestName!: string | null;
  public guestEmail!: string | null;
  public partyId!: string;
  public joinedAt!: Date;
  public status!: 'pending' | 'accepted' | 'rejected' | 'abandoned';
  public paid!: boolean;
  public optIn!: boolean;
  public ticketCode!: string;
  public checkedIn!: boolean;
  public checkedInAt?: Date;
  
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
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    guestName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    guestEmail: {
      type: DataTypes.STRING,
      allowNull: true,
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
    ticketCode: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    checkedIn: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    checkedInAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'party_participants',
    timestamps: true,
    indexes: [
      // Removed unique index on userId+partyId to allow multiple guests (userId=null)
      // We will enforce uniqueness for registered users in the controller logic
    ],
  }
);

export default PartyParticipant;