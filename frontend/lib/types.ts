import { type LucideIcon } from "lucide-react";

export type ApiUser = {
  _id: string;
  name: string;
  email: string;
  xp?: number;
  streak?: number;
  leaderboardScore?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type AuthResponse = {
  token: string;
  user: ApiUser;
};

export type Subject = {
  _id: string;
  name: string;
};

export type Chapter = {
  _id: string;
  subjectId?: string;
  title: string;
  totalTopics?: number;
};

export type ProgressRecord = {
  _id?: string;
  chapterId: string | Chapter;
  completionPercent: number;
  studyMinutes?: number;
  revisionCount?: number;
  updatedAt?: string;
};

export type LeaderboardApiUser = {
  _id?: string;
  id?: string;
  name: string;
  email?: string;
  xp?: number;
  streak?: number;
  leaderboardScore?: number;
  totalStudyMinutes?: number;
  progressPercent?: number;
};

export type RankResponse = {
  rank: number;
};

export type StudySession = {
  _id: string;
  subjectId?: string | Subject;
  startTime?: string;
  endTime?: string;
  durationMinutes?: number;
  isActive?: boolean;
};

export type Task = {
  _id: string;
  title: string;
  completed: boolean;
  xpReward?: number;
  estimatedMinutes?: number;
};

export type ActivityEntry = {
  _id?: string;
  id?: string;
  userId?: {
    _id?: string;
    name?: string;
    email?: string;
  };
  type: string;
  message: string;
  createdAt?: string;
};

export type SubjectMeta = {
  slug: string;
  icon: LucideIcon;
};

export type DashboardSubject = {
  id: string;
  name: string;
  slug: string;
  icon: LucideIcon;
  completion: number;
  completedChapters: number;
  totalChapters: number;
  remainingHours: number;
  rank: number;
  aheadCount: number;
};

export type LeaderboardRowData = {
  id: string;
  name: string;
  username?: string;
  avatar: string;
  xp: number;
  streak: number;
  progress: number;
  todayMinutes: number;
  rank: number;
  movement: "up" | "down" | "same";
  glow?: string;
};

export type ActivityItemData = {
  id: string | number;
  friend: string;
  avatar: string;
  action: string;
  time: string;
  type: "chapter" | "milestone" | "session" | "rank" | "streak" | "danger";
};
