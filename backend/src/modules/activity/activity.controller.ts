import { Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendSuccess } from '../../utils/apiResponse';
import { AuthenticatedRequest } from '../../types';
import * as activityService from './activity.service';
import { AppError } from '../../utils/AppError';

export const getActivities = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const activities = await activityService.getActivities();
  sendSuccess({ res, message: 'Activities fetched successfully.', data: activities });
});

export const getMyActivities = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) throw new AppError('Unauthorized', 401);
  const activities = await activityService.getUserActivities(req.user.id);
  sendSuccess({ res, message: 'Your activities fetched.', data: activities });
});
