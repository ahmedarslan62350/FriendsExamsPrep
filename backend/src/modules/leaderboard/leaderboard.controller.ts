import { Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendSuccess } from '../../utils/apiResponse';
import { AuthenticatedRequest } from '../../types';
import * as leaderboardService from './leaderboard.service';
import { AppError } from '../../utils/AppError';

export const getLeaderboard = asyncHandler(async (_req: AuthenticatedRequest, res: Response) => {
  const leaderboard = await leaderboardService.getLeaderboard();
  sendSuccess({ res, message: 'Leaderboard fetched successfully.', data: leaderboard });
});

export const getMyRank = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) throw new AppError('Unauthorized', 401);
  const rank = await leaderboardService.getUserRank(req.user.id);
  sendSuccess({ res, message: 'Rank fetched successfully.', data: { rank } });
});
