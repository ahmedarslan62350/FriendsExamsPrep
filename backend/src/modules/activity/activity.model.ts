import mongoose, { Schema, Model } from 'mongoose';
import { ACTIVITY_TYPES } from '../../config/constants';
import { IActivity } from '../../types';

const activitySchema = new Schema<IActivity>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    type: {
      type: String,
      enum: {
        values: Object.values(ACTIVITY_TYPES),
        message: `Activity type must be one of: ${Object.values(ACTIVITY_TYPES).join(', ')}`,
      },
      required: [true, 'Activity type is required'],
    },
    message: {
      type: String,
      required: [true, 'Activity message is required'],
      trim: true,
    },
  },
  { timestamps: true }
);

// Index for feed queries (recent activity per user)
activitySchema.index({ userId: 1, createdAt: -1 });
// Index for global activity feed
activitySchema.index({ createdAt: -1 });

export const Activity: Model<IActivity> = mongoose.model<IActivity>('Activity', activitySchema);
