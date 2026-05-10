import { Router } from 'express';
import { getActivities, getMyActivities } from './activity.controller';
import { protect } from '../../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.get('/', getActivities);
router.get('/me', getMyActivities);

export default router;
