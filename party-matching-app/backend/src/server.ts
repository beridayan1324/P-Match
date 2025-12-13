import dotenv from 'dotenv';
import app from './app';
import sequelize from './db';
import './models/index';
import { MatchingService } from './services/matchingService';
import chatRoutes from './routes/chat';

dotenv.config();

const PORT = process.env.PORT || 5000;

app.use('/api/chat', chatRoutes);

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Connected to SQL database');
    
    await sequelize.sync({ alter: false });
    console.log('Database schema loaded');
    
    // Start cron job for automatic matching (check every 1 minute for debugging)
    setInterval(async () => {
      console.log('--- Checking for parties ready for matching ---');
      await MatchingService.checkAndRunMatching();
    }, 1 * 60 * 1000); // Changed from 5 minutes to 1 minute
    
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