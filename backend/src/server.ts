import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cron from 'node-cron';
import path from 'path';
import authRoutes from './routes/auth.routes';
import listingRoutes from './routes/listing.routes';
import adminRoutes from './routes/admin.routes';
import dashboardRoutes from './routes/dashboard.routes';
import messageRoutes from './routes/message.routes';
import profileRoutes from './routes/profile.routes';
import { databaseMiddleware } from './middleware/database';
import { errorHandler } from './middleware/errorHandler';
import { db } from './lib/db';
import { users } from './db/schema';
import { eq, and, gt } from 'drizzle-orm';

// Import global types
import './types';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000', 'http://localhost:3001'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use(databaseMiddleware);

app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/profile', profileRoutes);

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Global error handler (must be last)
app.use(errorHandler);

// Cron job to delete expired unverified users every day at midnight
cron.schedule('0 0 * * *', async () => {
  try {
    const expiredUsers = await db.delete(users)
      .where(
        and(
          eq(users.phoneVerified, false),
          gt(users.emailVerificationExpires!, new Date())
        )
      );
    console.log(`Deleted expired unverified users`);
  } catch (error) {
    console.error('Error deleting expired users:', error);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
