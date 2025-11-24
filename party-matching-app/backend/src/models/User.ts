import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';

class User extends Model {
  public id!: string;
  public email!: string;
  public passwordHash!: string;
  public name?: string;
  public gender?: 'male' | 'female' | 'other';
  public profileImage?: string;
  public preferences?: any;
}

User.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  passwordHash: { type: DataTypes.STRING, allowNull: false },
  name: { type: DataTypes.STRING },
  gender: { type: DataTypes.ENUM('male', 'female', 'other') },
  profileImage: { type: DataTypes.STRING },
  preferences: { type: DataTypes.JSON },
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  timestamps: true,
});

export default User;