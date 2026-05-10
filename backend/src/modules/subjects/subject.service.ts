import { Subject } from './subject.model';
import { SUBJECTS } from '../../config/constants';
import { AppError } from '../../utils/AppError';

export const getAllSubjects = async () => {
  return Subject.find().sort({ name: 1 });
};

export const getSubjectById = async (subjectId: string) => {
  const subject = await Subject.findById(subjectId);
  if (!subject) throw new AppError('Subject not found.', 404);
  return subject;
};

/**
 * Seeds all predefined subjects into the database.
 * Safe to call multiple times (upserts by name).
 */
export const seedSubjects = async () => {
  const ops = SUBJECTS.map((name) => ({
    updateOne: {
      filter: { name },
      update: { $setOnInsert: { name } },
      upsert: true,
    },
  }));
  await Subject.bulkWrite(ops);
  return Subject.find();
};
