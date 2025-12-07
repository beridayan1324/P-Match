import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';

interface UserAttributes {
  id?: string;
  name: string;
  email: string;
  password: string;
  isAdmin?: boolean;
  role?: 'user' | 'manager' | 'admin';
  isApproved?: boolean;
  gender?: 'male' | 'female' | 'other';
  genderPreference?: 'male' | 'female' | 'other' | 'any';
  profileImage?: string;
  additionalImages?: string[];
  bio?: string;
  interests?: string[];
  location?: string;
}

class User extends Model<UserAttributes> implements UserAttributes {
  public id!: string;
  public name!: string;
  public email!: string;
  public password!: string;
  public isAdmin!: boolean;
  public role!: 'user' | 'manager' | 'admin';
  public isApproved!: boolean;
  public gender?: 'male' | 'female' | 'other';
  public genderPreference?: 'male' | 'female' | 'other' | 'any';
  public profileImage?: string;
  public additionalImages?: string[];
  public bio?: string;
  public interests?: string[];
  public location?: string;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    role: {
      type: DataTypes.ENUM('user', 'manager', 'admin'),
      defaultValue: 'user',
    },
    isApproved: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    gender: {
      type: DataTypes.ENUM('male', 'female', 'other'),
      allowNull: true,
    },
    genderPreference: {
      type: DataTypes.ENUM('male', 'female', 'other', 'any'),
      allowNull: true,
      defaultValue: 'any',
    },
    profileImage: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
    },
    additionalImages: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    interests: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
  }
);

export default User;