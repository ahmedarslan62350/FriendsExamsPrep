import { Task } from './task.model';
import { AppError } from '../../utils/AppError';
import { CreateTaskInput } from './task.validation';
import { XP_REWARDS, ACTIVITY_TYPES } from '../../config/constants';
import { applyEngagementUpdate } from '../users/userStats.service';

export const getUserTasks = async (userId: string) => {
  return Task.find({ userId }).sort({ createdAt: -1 });
};

export const createTask = async (userId: string, input: CreateTaskInput) => {
  return Task.create({ ...input, userId });
};

export const completeTask = async (userId: string, taskId: string) => {
  const task = await Task.findOne({ _id: taskId, userId });
  if (!task) throw new AppError('Task not found.', 404);
  if (task.completed) return task;

  task.completed = true;
  await task.save();

  await applyEngagementUpdate({
    userId,
    xpDelta: task.xpReward || XP_REWARDS.DAILY_TASK,
    activityType: ACTIVITY_TYPES.TASK_COMPLETED,
    activityMessage: `Completed task: ${task.title}`,
  });

  return task;
};

export const deleteTask = async (userId: string, taskId: string) => {
  const task = await Task.findOneAndDelete({ _id: taskId, userId });
  if (!task) throw new AppError('Task not found.', 404);
  return task;
};
