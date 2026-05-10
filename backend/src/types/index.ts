import { Request } from 'express';
import { Document, Types } from 'mongoose';
import { ActivityType, SubjectName } from '../config/constants';

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface JwtPayload {
  id: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

// ─── User ────────────────────────────────────────────────────────────────────

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  xp: number;
  streak: number;
  lastActiveDate: Date | null;
  totalStudyMinutes: number;
  leaderboardScore: number;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// ─── Subject ─────────────────────────────────────────────────────────────────

export interface ISubject extends Document {
  _id: Types.ObjectId;
  name: SubjectName;
  createdAt: Date;
}

// ─── Chapter ─────────────────────────────────────────────────────────────────

export interface IChapter extends Document {
  _id: Types.ObjectId;
  subjectId: Types.ObjectId;
  title: string;
  totalTopics: number;
  createdAt: Date;
}

// ─── Progress ─────────────────────────────────────────────────────────────────

export interface IProgress extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  chapterId: Types.ObjectId;
  completionPercent: number;
  studyMinutes: number;
  revisionCount: number;
  updatedAt: Date;
}

// ─── Activity ────────────────────────────────────────────────────────────────

export interface IActivity extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  type: ActivityType;
  message: string;
  createdAt: Date;
}

// ─── Task ────────────────────────────────────────────────────────────────────

export interface ITask extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  title: string;
  xpReward: number;
  estimatedMinutes: number;
  completed: boolean;
  createdAt: Date;
}

// ─── Study Session ────────────────────────────────────────────────────────────

export interface IStudySession extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  subjectId?: Types.ObjectId;
  startTime: Date;
  endTime?: Date;
  durationMinutes?: number;
  isActive: boolean;
  createdAt: Date;
}
