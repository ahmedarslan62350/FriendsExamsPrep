// App-wide constants

export const SUBJECTS = [
  'Physics',
  'Computer',
  'Math',
  'English',
  'Urdu',
  'TarjumaTulQuran',
  'PakStudies',
] as const;

export type SubjectName = (typeof SUBJECTS)[number];

export const ACTIVITY_TYPES = {
  CHAPTER_COMPLETED: 'chapter_completed',
  STUDY_SESSION_STARTED: 'study_session_started',
  STUDY_SESSION_ENDED: 'study_session_ended',
  STREAK_UPDATED: 'streak_updated',
  RANK_CHANGED: 'rank_changed',
  TASK_COMPLETED: 'task_completed',
} as const;

export type ActivityType = (typeof ACTIVITY_TYPES)[keyof typeof ACTIVITY_TYPES];

export const JWT_COOKIE_NAME = 'token';

export const LEADERBOARD_LIMIT = 50;

export const XP_REWARDS = {
  CHAPTER_COMPLETE: 50,
  DAILY_TASK: 20,
  STREAK_BONUS: 10,
  STUDY_SESSION_PER_HOUR: 15,
} as const;
