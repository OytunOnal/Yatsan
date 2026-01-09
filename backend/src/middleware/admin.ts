import { Request, Response, NextFunction } from 'express';

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.userType !== 'ADMIN') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};