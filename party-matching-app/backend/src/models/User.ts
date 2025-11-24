import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
    email: string;
    password: string;
    name?: string;
    gender?: string;
    profileImage?: string;
    preferences?: string[];
}

const UserSchema: Schema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String },
    gender: { type: String },
    profileImage: { type: String },
    preferences: { type: [String] }
}, { timestamps: true });

const User = mongoose.model<IUser>('User', UserSchema);

export default User;