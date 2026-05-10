import mongoose, { Schema, Model } from 'mongoose';
import { ITask } from '../../types';

const taskSchema = new Schema<ITask>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
    },
    xpReward: {
      type: Number,
      required: [true, 'XP reward is required'],
      min: [0, 'XP reward cannot be negative'],
      default: 20,
    },
    estimatedMinutes: {
      type: Number,
      required: [true, 'Estimated minutes is required'],
      min: [1, 'Must be at least 1 minute'],
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Efficient query for user's pending daily tasks
taskSchema.index({ userId: 1, completed: 1 });

export const Task: Model<ITask> = mongoose.model<ITask>('Task', taskSchema);
