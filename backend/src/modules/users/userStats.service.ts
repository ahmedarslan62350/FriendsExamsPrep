import { ACTIVITY_TYPES, ActivityType } from '../../config/constants';
import { Activity } from '../activity/activity.model';
import { User } from './user.model';
import { calculateLeaderboardScore } from '../../utils/scoring';

type EngagementInput = {
  userId: string;
  xpDelta?: number;
  studyMinutesDelta?: number;
  activityType?: ActivityType;
  activityMessage?: string;
};

export const applyEngagementUpdate = async ({
  userId,
  xpDelta = 0,
  studyMinutesDelta = 0,
  activityType,
  activityMessage,
}: EngagementInput) => {
  const user = await User.findById(userId);
  if (!user) return null;

  const now = new Date();
  const last = user.lastActiveDate ? new Date(user.lastActiveDate) : null;

  if (!last) {
    user.streak = 1;
  } else {
    const dayMs = 1000 * 60 * 60 * 24;
    const nowDay = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
    const lastDay = Date.UTC(last.getUTCFullYear(), last.getUTCMonth(), last.getUTCDate());
    const diffDays = Math.floor((nowDay - lastDay) / dayMs);

    if (diffDays >= 2) {
      user.streak = 1;
    } else if (diffDays === 1) {
      user.streak += 1;
    }
  }

  user.lastActiveDate = now;
  user.xp += Math.max(0, xpDelta);
  user.totalStudyMinutes += Math.max(0, studyMinutesDelta);
  user.leaderboardScore = calculateLeaderboardScore({
    xp: user.xp,
    streak: user.streak,
    totalStudyMinutes: user.totalStudyMinutes,
  });

  await user.save();

  if (activityType && activityMessage) {
    await Activity.create({
      userId,
      type: activityType,
      message: activityMessage,
    });
  } else if (xpDelta > 0 || studyMinutesDelta > 0) {
    await Activity.create({
      userId,
      type: ACTIVITY_TYPES.STREAK_UPDATED,
      message: `${user.name.split(' ')[0]} maintained streak at ${user.streak} day(s).`,
    });
  }

  return user;
};

