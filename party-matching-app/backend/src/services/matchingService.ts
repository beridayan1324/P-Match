import { Op } from 'sequelize';
import User from '../models/User';
import Party from '../models/Party';
import PartyParticipant from '../models/PartyParticipant';
import Match from '../models/Match';

export class MatchingService {
  
  // Check if user profile is complete
  static isProfileComplete(user: User): boolean {
    return !!(
      user.name &&
      user.gender &&
      user.genderPreference &&
      user.profileImage &&
      user.bio &&
      user.bio.length >= 20
    );
  }

  // Run matching algorithm for a party
  static async runMatching(partyId: string): Promise<void> {
    try {
      console.log(`Starting matching for party ${partyId}`);
      
      // Get all participants
      const participants = await PartyParticipant.findAll({
        where: { partyId, optIn: true },
        include: [{ model: User, as: 'user' }],
      });

      console.log(`Found ${participants.length} participants`);

      // Need minimum 6 people
      if (participants.length < 6) {
        console.log('Not enough participants (minimum 6 required)');
        return;
      }

      // Get user data
      // Filter out null userIds (guests)
      const userIds = participants
        .map(p => p.userId)
        .filter((id): id is string => id !== null);

      const users = await User.findAll({
        where: {
          id: userIds,
        },
      });

      console.log(`Processing ${users.length} users for matching`);

      // Create matches for each user
      for (const user of users) {
        await this.createMatchesForUser(user, users, partyId);
      }

      // Mark party as matching started
      await Party.update(
        { matchingStarted: true },
        { where: { id: partyId } }
      );

      console.log(`✅ Matching completed for party ${partyId}`);
    } catch (error) {
      console.error('Error running matching:', error);
      throw error;
    }
  }

  // Create 3 matches for a specific user
  private static async createMatchesForUser(
    user: User,
    allUsers: User[],
    partyId: string
  ): Promise<void> {
    // Filter compatible users
    const compatibleUsers = allUsers.filter(otherUser => {
      if (otherUser.id === user.id) return false;
      
      // Check if they match each other's preferences
      const userWants = user.genderPreference;
      const otherUserWants = otherUser.genderPreference;
      
      const userMatchesOther = 
        otherUserWants === 'any' || 
        otherUserWants === user.gender;
      
      const otherMatchesUser = 
        userWants === 'any' || 
        userWants === otherUser.gender;
      
      return userMatchesOther && otherMatchesUser;
    });

    console.log(`User ${user.name} has ${compatibleUsers.length} compatible matches`);

    // Shuffle and take 3
    const shuffled = compatibleUsers.sort(() => Math.random() - 0.5);
    const selectedMatches = shuffled.slice(0, Math.min(3, shuffled.length));

    // Create match records
    for (const matchedUser of selectedMatches) {
      // Check if match already exists (avoid duplicates)
      const existingMatch = await Match.findOne({
        where: {
          partyId,
          [Op.or]: [
            {
              [Op.and]: [
                { user1Id: user.id },
                { user2Id: matchedUser.id }
              ]
            },
            {
              [Op.and]: [
                { user1Id: matchedUser.id },
                { user2Id: user.id }
              ]
            }
          ]
        },
      });

      if (!existingMatch) {
        await Match.create({
          partyId,
          user1Id: user.id,
          user2Id: matchedUser.id,
          user1Status: 'pending',
          user2Status: 'pending',
          mutualMatch: false,
        });
        
        console.log(`✓ Created match: ${user.name} ↔ ${matchedUser.name}`);
      }
    }
  }

  // Check which parties need matching to start
  static async checkAndRunMatching(): Promise<void> {
    try {
      const now = new Date();
      
      console.log(`[CRON] Checking parties at ${now.toISOString()}`);
      
      // Find parties where matching should start but hasn't
      const parties = await Party.findAll({
        where: {
          matchingStarted: false,
          matchingStartTime: {
            [Op.lte]: now,
          },
        },
      });

      console.log(`[CRON] Found ${parties.length} parties ready for matching`);

      for (const party of parties) {
        console.log(`[CRON] Running matching for party: ${party.name} (${party.id})`);
        await this.runMatching(party.id);
      }
      
      if (parties.length === 0) {
        console.log('[CRON] No parties need matching right now');
      }
    } catch (error) {
      console.error('[CRON] Error checking matching:', error);
    }
  }
}