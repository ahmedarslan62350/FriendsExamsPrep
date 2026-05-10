import { User } from '../users/user.model';
import { LEADERBOARD_LIMIT } from '../../config/constants';

export const getLeaderboard = async () => {
  return User.find()
    .sort({ leaderboardScore: -1 })
    .limit(LEADERBOARD_LIMIT)
    .select('name email xp streak leaderboardScore totalStudyMinutes');
};

export const getUserRank = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) return null;

  const count = await User.countDocuments({
    leaderboardScore: { $gt: user.leaderboardScore },
  });

  return count + 1;
};
