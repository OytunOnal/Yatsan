import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';

declare global {
  namespace Express {
    interface Request {
      prisma: typeof prisma;
    }
  }
}

export const databaseMiddleware = (req: Request, res: Response, next: NextFunction) => {
  req.prisma = prisma;
  // Database connection kontrolü burada eklenebilir
  next();
};