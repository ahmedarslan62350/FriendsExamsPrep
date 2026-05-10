import { StudySession } from './studySession.model';
import { AppError } from '../../utils/AppError';
import { StartSessionInput } from './studySession.validation';
import { ACTIVITY_TYPES } from '../../config/constants';
import { applyEngagementUpdate } from '../users/userStats.service';

export const startSession = async (userId: string, input: StartSessionInput) => {
  const now = new Date();

  // Keep at most one active session and close previous one safely.
  const activeSession = await StudySession.findOne({ userId, isActive: true });
  if (activeSession) {
    const activeSubjectId = activeSession.subjectId?.toString();
    if (activeSubjectId && input.subjectId && activeSubjectId === input.subjectId) {
      return activeSession;
    }

    const durationMs = now.getTime() - activeSession.startTime.getTime();
    activeSession.isActive = false;
    activeSession.endTime = now;
    activeSession.durationMinutes = Math.max(0, Math.floor(durationMs / (1000 * 60)));
    await activeSession.save();
  }

  try {
    const session = await StudySession.create({
      userId,
      subjectId: input.subjectId,
      isActive: true,
      startTime: now,
    });
    await applyEngagementUpdate({
      userId,
      activityType: ACTIVITY_TYPES.STUDY_SESSION_STARTED,
      activityMessage: 'Started a study session.',
    });
    return session;
  } catch (error: unknown) {
    // If concurrent starts happen, rely on unique active-session index and return the winner.
    const mongoError = error as { code?: number };
    if (mongoError.code === 11000) {
      const currentActive = await StudySession.findOne({ userId, isActive: true });
      if (currentActive) return currentActive;
    }
    throw error;
  }
};

export const endSession = async (userId: string, sessionId: string) => {
  const session = await StudySession.findOne({ _id: sessionId, userId, isActive: true });
  if (!session) throw new AppError('Active session not found.', 404);

  const endTime = new Date();
  const durationMs = endTime.getTime() - session.startTime.getTime();
  const durationMinutes = Math.floor(durationMs / (1000 * 60));

  session.isActive = false;
  session.endTime = endTime;
  session.durationMinutes = durationMinutes;
  
  await session.save();
  await applyEngagementUpdate({
    userId,
    studyMinutesDelta: Math.max(durationMinutes, 0),
    activityType: ACTIVITY_TYPES.STUDY_SESSION_ENDED,
    activityMessage: `Completed study session of ${Math.max(durationMinutes, 0)} minute(s).`,
  });
  return session;
};

export const getActiveSession = async (userId: string) => {
  return StudySession.findOne({ userId, isActive: true }).populate('subjectId', 'name');
};

export const getUserSessions = async (userId: string) => {
  return StudySession.find({ userId }).sort({ startTime: -1 }).limit(10).populate('subjectId', 'name');
};
