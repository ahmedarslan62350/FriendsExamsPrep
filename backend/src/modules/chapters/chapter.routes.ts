import { Router } from 'express';
import { getChaptersBySubject, getChapterById, createChapter } from './chapter.controller';
import { protect } from '../../middleware/authMiddleware';

const router = Router();

// GET /api/v1/chapters/subject/:subjectId
router.get('/subject/:subjectId', protect, getChaptersBySubject);

// GET /api/v1/chapters/:id
router.get('/:id', protect, getChapterById);

// POST /api/v1/chapters
router.post('/', protect, createChapter);

export default router;
