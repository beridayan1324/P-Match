import dotenv from 'dotenv';
import app from './app';
import sequelize from './db';
import './models/index';
import { MatchingService } from './services/matchingService';
import { CleanupService } from './services/cleanupService';
import chatRoutes from './routes/chat';

dotenv.config();

const PORT = process.env.PORT || 5000;

app.use('/api/chat', chatRoutes);

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Connected to SQL database');
    
    // Disable foreign keys for SQLite to allow table alterations
    if (sequelize.getDialect() === 'sqlite') {
      await sequelize.query('PRAGMA foreign_keys = OFF;');
    }

    await sequelize.sync({ alter: false });
    console.log('Database schema loaded');

    // Re-enable foreign keys
    if (sequelize.getDialect() === 'sqlite') {
      await sequelize.query('PRAGMA foreign_keys = ON;');
    }
    
    // Start cron job for automatic matching and cleanup (check every 1 minute)
    setInterval(async () => {
      console.log('--- Running scheduled tasks ---');
      await MatchingService.checkAndRunMatching();
      await CleanupService.deleteOldParties();
    }, 1 * 60 * 1000); // Every 1 minute
    
    app.listen(PORT, () => {
      console.log(`Server is running on http://10.0.0.16:${PORT}`);
      console.log('Automatic matching checker is active (every 1 minute)');
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
}

startServer();