import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema({
    userId1: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    userId2: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'declined'],
        default: 'pending'
    },
    partyId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Party'
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '24h' // Automatically remove the match after 24 hours
    }
});

const Match = mongoose.model('Match', matchSchema);

export default Match;