import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import listingRoutes from './routes/listing.routes';
import adminRoutes from './routes/admin.routes';
import { databaseMiddleware } from './middleware/database';

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});