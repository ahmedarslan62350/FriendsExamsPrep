import { Router } from 'express';
import { getLeaderboard, getMyRank } from './leaderboard.controller';
import { protect } from '../../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.get('/', getLeaderboard);
router.get('/me/rank', getMyRank);

export default router;
