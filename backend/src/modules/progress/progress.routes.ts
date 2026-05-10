import { Router } from 'express';
import { completeSubject, getUserProgress, getSubjectProgress, updateProgress } from './progress.controller';
import { protect } from '../../middleware/authMiddleware';
import { validate } from '../../middleware/validate';
import { completeSubjectParamsSchema, updateProgressSchema } from './progress.validation';

const router = Router();

// All progress routes require auth
router.use(protect);

// GET /api/v1/progress/me
router.get('/me', getUserProgress);

// GET /api/v1/progress/subject/:subjectId
router.get('/subject/:subjectId', getSubjectProgress);

// PATCH /api/v1/progress
router.patch('/', validate(updateProgressSchema), updateProgress);
router.post('/subject/:subjectId/complete', validate(completeSubjectParamsSchema, 'params'), completeSubject);

export default router;
