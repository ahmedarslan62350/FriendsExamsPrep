import { Activity } from './activity.model';
import { ActivityType } from '../../config/constants';

export const logActivity = async (userId: string, type: ActivityType, message: string) => {
  return Activity.create({ userId, type, message });
};

export const getActivities = async (limit = 20) => {
  return Activity.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('userId', 'name');
};

export const getUserActivities = async (userId: string, limit = 20) => {
  return Activity.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit);
};
