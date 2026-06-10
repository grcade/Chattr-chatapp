import { Router } from 'express';
import { getConversation } from '../controllers/conversation.controller';

const router = Router();

router.get('/:username', getConversation);

export default router;
