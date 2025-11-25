import express from 'express';
import dotenv from 'dotenv';
import app from './app';
import sequelize from './db';
import './models/index'; // register models

dotenv.config();

const PORT = process.env.PORT || 5000;

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to SQL database');
        // sync models (use { alter: true } or migrations in production)
        await sequelize.sync({ alter: true });
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('Database connection error:', err);
        process.exit(1);
    }
})();