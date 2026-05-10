import { Router } from 'express';
import { getAllSubjects, getSubjectById, seedSubjects } from './subject.controller';
import { protect, requireAdmin } from '../../middleware/authMiddleware';

const router = Router();

// GET /api/v1/subjects
router.get('/', protect, getAllSubjects);

// GET /api/v1/subjects/:id
router.get('/:id', protect, getSubjectById);

// POST /api/v1/subjects/seed  (Admin/dev utility)
router.post('/seed', protect, requireAdmin, seedSubjects);

export default router;
