import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { createListing, getListings, getListingById, updateListing, deleteListing } from '../controllers/listing.controller';
import { upload } from '../middleware/upload';

const JWT_SECRET = 'your-secret-key';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const router = Router();

router.get('/', authMiddleware, getListings);
router.get('/:id', authMiddleware, getListingById);
router.post('/', authMiddleware, upload.array('images', 15), createListing);
router.put('/:id', authMiddleware, updateListing);
router.delete('/:id', authMiddleware, deleteListing);

export default router;