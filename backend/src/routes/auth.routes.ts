import { Router } from 'express';
import { eq } from 'drizzle-orm';
import { register, login, verifySMS, checkEmail, checkPhone, forgotPassword, validateResetToken, resetPassword, confirmEmail } from '../controllers/auth.controller';
import { passwordResetRateLimit } from '../middleware/rateLimit';
import { authMiddleware } from '../middleware/auth';
import { users } from '../db/schema';
import { assertAuthenticated } from '../types';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/verify-sms', verifySMS);
router.post('/check-email', checkEmail);
router.post('/check-phone', checkPhone);
router.post('/forgot-password', passwordResetRateLimit, forgotPassword);
router.get('/reset-password/validate/:token', validateResetToken);
router.post('/reset-password', resetPassword);
router.get('/confirm-email/:token', confirmEmail);

// Protected routes
router.get('/me', authMiddleware, async (req, res) => {
  try {
    assertAuthenticated(req);
    const foundUsers = await req.db.select({
      id: users.id,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      userType: users.userType
    }).from(users)
      .where(eq(users.id, req.user.id))
      .limit(1);

    const user = foundUsers[0];
    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
