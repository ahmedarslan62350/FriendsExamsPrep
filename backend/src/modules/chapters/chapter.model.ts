import mongoose, { Schema, Model } from 'mongoose';
import { IChapter } from '../../types';

const chapterSchema = new Schema<IChapter>(
  {
    subjectId: {
      type: Schema.Types.ObjectId,
      ref: 'Subject',
      required: [true, 'Subject ID is required'],
    },
    title: {
      type: String,
      required: [true, 'Chapter title is required'],
      trim: true,
    },
    totalTopics: {
      type: Number,
      required: [true, 'Total topics count is required'],
      min: [1, 'Must have at least 1 topic'],
    },
  },
  { timestamps: true }
);

// Compound index: unique chapter title per subject
chapterSchema.index({ subjectId: 1, title: 1 }, { unique: true });

export const Chapter: Model<IChapter> = mongoose.model<IChapter>('Chapter', chapterSchema);
