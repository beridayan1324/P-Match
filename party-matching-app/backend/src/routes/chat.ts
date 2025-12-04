import express from 'express';
import authMiddleware from '../middleware/auth';
import { Message, Match, User } from '../models';
import { Op } from 'sequelize';

const router = express.Router();

// Get all chats (matches with messages or just matches)
router.get('/', authMiddleware, async (req: any, res) => {
  try {
    const matches = await Match.findAll({
      where: {
        [Op.or]: [{ user1Id: req.userId }, { user2Id: req.userId }],
        mutualMatch: true, // Only show chats for mutual matches
      },
      include: [
        { model: User, as: 'user1', attributes: ['id', 'name', 'profileImage'] },
        { model: User, as: 'user2', attributes: ['id', 'name', 'profileImage'] },
        { 
          model: Message, 
          as: 'messages', 
          limit: 1, 
          order: [['createdAt', 'DESC']] 
        }
      ],
      order: [['updatedAt', 'DESC']],
    });
    res.json({ chats: matches });
  } catch (error) {
    console.error('Get chats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get messages for a specific match
router.get('/:matchId/messages', authMiddleware, async (req: any, res) => {
  try {
    const messages = await Message.findAll({
      where: { matchId: req.params.matchId },
      include: [{ model: User, as: 'sender', attributes: ['id', 'name', 'profileImage'] }],
      order: [['createdAt', 'ASC']],
    });
    res.json({ messages });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Send a message
router.post('/:matchId/send', authMiddleware, async (req: any, res) => {
  console.log(`📨 Sending message to match: ${req.params.matchId}`); // Log request
  
  try {
    const { text } = req.body;
    
    // 1. Create the message
    const message = await Message.create({
      matchId: req.params.matchId,
      senderId: req.userId,
      text,
    });

    // 2. Try to update match timestamp, but don't crash if it fails
    try {
       // We use 'as any' to bypass the TypeScript error for now
       await Match.update({ updatedAt: new Date() } as any, { where: { id: req.params.matchId }});
    } catch (err) {
       console.log('⚠️ Could not update match timestamp, but message was sent.');
    }

    // 3. Fetch sender info to return to frontend
    const fullMessage = await Message.findByPk(message.id, {
      include: [{ model: User, as: 'sender', attributes: ['id', 'name', 'profileImage'] }]
    });

    console.log('✅ Message sent successfully');
    res.status(201).json({ message: fullMessage });
    
  } catch (error) {
    console.error('❌ Send message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;