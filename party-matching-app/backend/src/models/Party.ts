import mongoose, { Schema, Document } from 'mongoose';

interface IParty extends Document {
    name: string;
    date: Date;
    location: string;
    participants: string[];
}

const PartySchema: Schema = new Schema({
    name: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    participants: { type: [String], default: [] }
});

const Party = mongoose.model<IParty>('Party', PartySchema);

export default Party;