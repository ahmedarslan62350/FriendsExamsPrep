import mongoose, { Schema, Model } from 'mongoose';
import { SUBJECTS } from '../../config/constants';
import { ISubject } from '../../types';

const subjectSchema = new Schema<ISubject>(
  {
    name: {
      type: String,
      required: [true, 'Subject name is required'],
      enum: {
        values: SUBJECTS,
        message: `Subject must be one of: ${SUBJECTS.join(', ')}`,
      },
      unique: true,
    },
  },
  { timestamps: true }
);

export const Subject: Model<ISubject> = mongoose.model<ISubject>('Subject', subjectSchema);
