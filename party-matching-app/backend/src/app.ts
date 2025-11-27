import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import profileRoutes from './routes/profile';
import partyRoutes from './routes/party';

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Register all routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/party', partyRoutes);

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

export default app;