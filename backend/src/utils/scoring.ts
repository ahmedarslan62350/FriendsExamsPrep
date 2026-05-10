import { XP_REWARDS } from '../config/constants';

/**
 * Placeholder utility to calculate a user's leaderboard score.
 * 
 * Inputs come from the user document. This function returns a numeric score
 * that can be stored in `user.leaderboardScore`.
 *
 * Extend this logic as the platform grows.
 */
export const calculateLeaderboardScore = (params: {
  xp: number;
  streak: number;
  totalStudyMinutes: number;
}): number => {
  const { xp, streak, totalStudyMinutes } = params;

  // Basic weighted formula — replace with real logic as needed
  const streakBonus = streak * XP_REWARDS.STREAK_BONUS;
  const studyBonus = Math.floor(totalStudyMinutes / 60) * XP_REWARDS.STUDY_SESSION_PER_HOUR;

  return xp + streakBonus + studyBonus;
};

/**
 * Placeholder to update a user's streak.
 * Returns { newStreak, isNewDay } based on lastActiveDate.
 */
export const calculateStreak = (lastActiveDate: Date | null): { newStreak: number; isNewDay: boolean } => {
  if (!lastActiveDate) {
    return { newStreak: 1, isNewDay: true };
  }

  const now = new Date();
  const last = new Date(lastActiveDate);

  const diffMs = now.getTime() - last.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return { newStreak: 0, isNewDay: false }; // Same day — no change
  } else if (diffDays === 1) {
    return { newStreak: 1, isNewDay: true }; // Consecutive day — increment
  } else {
    return { newStreak: -1, isNewDay: true }; // Missed a day — reset (caller handles reset)
  }
};
