import { Request, Response, NextFunction } from 'express';
import { db } from '../lib/db';
import type { AuthUser } from '../types';

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
      db: typeof db; // Non-null because databaseMiddleware always runs first
    }
  }
}

export const databaseMiddleware = (req: Request, res: Response, next: NextFunction) => {
  req.db = db;
  next();
};
