import { Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendSuccess } from '../../utils/apiResponse';
import { AuthenticatedRequest } from '../../types';
import { AppError } from '../../utils/AppError';
import * as progressService from './progress.service';
import { UpdateProgressInput } from './progress.validation';

export const getUserProgress = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) throw new AppError('Unauthorized', 401);
  const progress = await progressService.getUserProgress(req.user.id);
  sendSuccess({ res, message: 'Progress fetched successfully.', data: progress });
});

export const getSubjectProgress = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) throw new AppError('Unauthorized', 401);
  const progress = await progressService.getSubjectProgress(req.user.id, req.params.subjectId as string);
  sendSuccess({ res, message: 'Subject progress fetched.', data: progress });
});

export const updateProgress = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) throw new AppError('Unauthorized', 401);
  const progress = await progressService.updateProgress(req.user.id, req.body as UpdateProgressInput);
  sendSuccess({ res, message: 'Progress updated.', data: progress });
});

export const completeSubject = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) throw new AppError('Unauthorized', 401);
  const result = await progressService.completeSubjectProgress(req.user.id, req.params.subjectId as string);
  sendSuccess({ res, message: 'Subject marked as completed.', data: result });
});
