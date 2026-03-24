import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import clientRoutes from './routes/clients.js';
import projectRoutes from './routes/projects.js';
import timeEntryRoutes from './routes/timeEntries.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001; 
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_123';

// Middleware - CORS configured for production & development
const allowedOrigins = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : null;
const corsOptions = {
  origin: allowedOrigins 
    ? allowedOrigins 
    : function (origin, callback) {
        // Allow all origins when FRONTEND_URL is not set (dev mode / open API)
        callback(null, true);
      },
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// Health check endpoint (used by Render)
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/time-entries', timeEntryRoutes);

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/freelanceflow';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    if (!process.env.JWT_SECRET) console.log('Warning: JWT_SECRET not set in .env, using default.');
    
    // Bind to 0.0.0.0 so Render can reach the server
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });