import { Router } from 'express';
import { startSession, endSession, getActiveSession, getMySessions } from './studySession.controller';
import { protect } from '../../middleware/authMiddleware';
import { validate } from '../../middleware/validate';
import { endSessionParamsSchema, startSessionSchema } from './studySession.validation';

const router = Router();

router.use(protect);

router.get('/active', getActiveSession);
router.get('/me', getMySessions);
router.post('/start', validate(startSessionSchema), startSession);
router.patch('/:id/end', validate(endSessionParamsSchema, 'params'), endSession);

export default router;
