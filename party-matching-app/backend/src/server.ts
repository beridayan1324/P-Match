import express from 'express';
import dotenv from 'dotenv';
import app from './app';
import sequelize from './db';
import './models/User';
import './models/Party';
import './models/PartyParticipant';
import './models/Match';

dotenv.config();

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Connected to SQL database');
    
    await sequelize.sync({ alter: true });
    console.log('Database schema updated');
    
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
}

startServer();