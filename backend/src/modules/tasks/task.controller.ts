import { Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendSuccess } from '../../utils/apiResponse';
import { AuthenticatedRequest } from '../../types';
import * as taskService from './task.service';
import { CreateTaskInput } from './task.validation';

export const getUserTasks = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return;
  const tasks = await taskService.getUserTasks(req.user.id);
  sendSuccess({ res, message: 'Tasks fetched successfully.', data: tasks });
});

export const createTask = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return;
  const task = await taskService.createTask(req.user.id, req.body as CreateTaskInput);
  sendSuccess({ res, statusCode: 201, message: 'Task created.', data: task });
});

export const completeTask = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return;
  const task = await taskService.completeTask(req.user.id, req.params.id as string);
  sendSuccess({ res, message: 'Task completed.', data: task });
});

export const deleteTask = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return;
  await taskService.deleteTask(req.user.id, req.params.id as string);
  sendSuccess({ res, message: 'Task deleted.' });
});
