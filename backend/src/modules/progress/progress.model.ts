import mongoose, { Schema, Model } from 'mongoose';
import { IProgress } from '../../types';

const progressSchema = new Schema<IProgress>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    chapterId: {
      type: Schema.Types.ObjectId,
      ref: 'Chapter',
      required: [true, 'Chapter ID is required'],
    },
    completionPercent: {
      type: Number,
      default: 0,
      min: [0, 'Completion percent cannot be negative'],
      max: [100, 'Completion percent cannot exceed 100'],
    },
    studyMinutes: {
      type: Number,
      default: 0,
      min: [0, 'Study minutes cannot be negative'],
    },
    revisionCount: {
      type: Number,
      default: 0,
      min: [0, 'Revision count cannot be negative'],
    },
  },
  { timestamps: true }
);

// One progress record per user per chapter
progressSchema.index({ userId: 1, chapterId: 1 }, { unique: true });

export const Progress: Model<IProgress> = mongoose.model<IProgress>('Progress', progressSchema);
