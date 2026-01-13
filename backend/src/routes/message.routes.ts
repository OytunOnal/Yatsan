import { Router } from 'express';
import { getConversations, getMessages, sendMessage, markMessagesAsRead } from '../controllers/message.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/conversations', authMiddleware, getConversations);
router.get('/:otherUserId', authMiddleware, getMessages);
router.post('/', authMiddleware, sendMessage);
router.put('/read', authMiddleware, markMessagesAsRead);

export default router;
