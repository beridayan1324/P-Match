import dotenv from 'dotenv';
import app from './app';
import sequelize from './db';
import './models/index'; // Import associations
import { MatchingService } from './services/matchingService';

dotenv.config();

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Connected to SQL database');
    
    await sequelize.sync({ alter: false });
    console.log('Database schema updated');
    
    // Start cron job for automatic matching (check every 5 minutes)
    setInterval(async () => {
      console.log('Checking for parties ready for matching...');
      await MatchingService.checkAndRunMatching();
    }, 5 * 60 * 1000); // 5 minutes
    
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log('Automatic matching checker is active');
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
}

startServer();