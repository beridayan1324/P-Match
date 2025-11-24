import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import profileRoutes from './routes/profile';
import partyRoutes from './routes/party';
import matchRoutes from './routes/match';
import { json, urlencoded } from 'body-parser';

dotenv.config();

const app = express();

// Middleware
app.use(json());
app.use(urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/party', partyRoutes);
app.use('/api/match', matchRoutes);

export default app;