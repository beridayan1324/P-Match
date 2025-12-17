import { Op } from 'sequelize';
import Party from '../models/Party';

export class CleanupService {
  /**
   * Deletes parties that are older than 24 hours past their start date.
   */
  static async deleteOldParties() {
    try {
      const cutoffDate = new Date();
      cutoffDate.setHours(cutoffDate.getHours() - 24); // 24 hours ago

      const deletedCount = await Party.destroy({
        where: {
          date: {
            [Op.lt]: cutoffDate, // date < cutoffDate
          },
        },
      });

      if (deletedCount > 0) {
        console.log(`🧹 Cleanup: Deleted ${deletedCount} old parties.`);
      }
    } catch (error) {
      console.error('❌ Cleanup Error:', error);
    }
  }
}
