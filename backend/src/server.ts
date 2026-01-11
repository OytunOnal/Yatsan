import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cron from 'node-cron';
import authRoutes from './routes/auth.routes';
import listingRoutes from './routes/listing.routes';
import adminRoutes from './routes/admin.routes';
import { databaseMiddleware } from './middleware/database';
import prisma from './lib/prisma';

dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors({
  origin: '*'
}));

app.use(express.json());

app.use(databaseMiddleware);

app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Cron job to delete expired unverified users every day at midnight
cron.schedule('0 0 * * *', async () => {
  try {
    const expiredUsers = await prisma.user.deleteMany({
      where: {
        phoneVerified: false,
        emailVerificationExpires: {
          lt: new Date()
        }
      }
    });
    if (expiredUsers.count > 0) {
      console.log(`Deleted ${expiredUsers.count} expired unverified users`);
    }
  } catch (error) {
    console.error('Error deleting expired users:', error);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});