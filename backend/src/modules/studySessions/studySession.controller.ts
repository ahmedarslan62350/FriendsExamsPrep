import { Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendSuccess } from '../../utils/apiResponse';
import { AuthenticatedRequest } from '../../types';
import * as sessionService from './studySession.service';
import { StartSessionInput } from './studySession.validation';
import { AppError } from '../../utils/AppError';

export const startSession = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) throw new AppError('Unauthorized', 401);
  const session = await sessionService.startSession(req.user.id, req.body as StartSessionInput);
  sendSuccess({ res, statusCode: 201, message: 'Study session started.', data: session });
});

export const endSession = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) throw new AppError('Unauthorized', 401);
  const session = await sessionService.endSession(req.user.id, req.params.id as string);
  sendSuccess({ res, message: 'Study session ended.', data: session });
});

export const getActiveSession = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) throw new AppError('Unauthorized', 401);
  const session = await sessionService.getActiveSession(req.user.id);
  sendSuccess({ res, message: 'Active session fetched.', data: session });
});

export const getMySessions = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) throw new AppError('Unauthorized', 401);
  const sessions = await sessionService.getUserSessions(req.user.id);
  sendSuccess({ res, message: 'Sessions fetched.', data: sessions });
});
