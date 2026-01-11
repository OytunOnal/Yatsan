import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { register, login, verifySMS, checkEmail, checkPhone, forgotPassword, validateResetToken, resetPassword, confirmEmail } from '../controllers/auth.controller';
import { passwordResetRateLimit } from '../middleware/rateLimit';

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

router.post('/register', register);
router.post('/login', login);
router.post('/verify-sms', verifySMS);
router.post('/check-email', checkEmail);
router.post('/check-phone', checkPhone);
router.post('/forgot-password', passwordResetRateLimit, forgotPassword);
router.get('/reset-password/validate/:token', validateResetToken);
router.post('/reset-password', resetPassword);
router.get('/confirm-email/:token', confirmEmail);
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await req.prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, firstName: true, lastName: true, userType: true }
    });
    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;