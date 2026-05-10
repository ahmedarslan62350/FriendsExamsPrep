import { Progress } from './progress.model';
import { AppError } from '../../utils/AppError';
import { UpdateProgressInput } from './progress.validation';
import { Chapter } from '../chapters/chapter.model';
import { Subject } from '../subjects/subject.model';
import { ACTIVITY_TYPES, XP_REWARDS } from '../../config/constants';
import { applyEngagementUpdate } from '../users/userStats.service';

export const getUserProgress = async (userId: string) => {
  return Progress.find({ userId })
    .populate({ path: 'chapterId', populate: { path: 'subjectId', select: 'name' } });
};

export const getSubjectProgress = async (userId: string, subjectId: string) => {
  return Progress.find({ userId }).populate({
    path: 'chapterId',
    match: { subjectId },
    populate: { path: 'subjectId', select: 'name' },
  });
};

export const updateProgress = async (userId: string, input: UpdateProgressInput) => {
  const { chapterId, ...updates } = input;
  const existing = await Progress.findOne({ userId, chapterId });

  const progress = await Progress.findOneAndUpdate(
    { userId, chapterId },
    { $set: updates, $setOnInsert: { userId, chapterId } },
    { new: true, upsert: true }
  ).populate({ path: 'chapterId', select: 'title totalTopics' });

  if (!progress) throw new AppError('Failed to update progress.', 500);

  const wasComplete = (existing?.completionPercent ?? 0) >= 100;
  const nowComplete = (progress.completionPercent ?? 0) >= 100;
  const gainedStudy = Math.max(0, (progress.studyMinutes ?? 0) - (existing?.studyMinutes ?? 0));

  if (nowComplete && !wasComplete) {
    const chapterDoc = await Chapter.findById(chapterId).select('title');
    await applyEngagementUpdate({
      userId,
      xpDelta: XP_REWARDS.CHAPTER_COMPLETE,
      studyMinutesDelta: gainedStudy,
      activityType: ACTIVITY_TYPES.CHAPTER_COMPLETED,
      activityMessage: `Completed chapter: ${chapterDoc?.title ?? 'Chapter'}.`,
    });
  } else {
    await applyEngagementUpdate({
      userId,
      studyMinutesDelta: gainedStudy,
    });
  }

  return progress;
};

export const completeSubjectProgress = async (userId: string, subjectId: string) => {
  const subject = await Subject.findById(subjectId).select('name');
  if (!subject) throw new AppError('Subject not found.', 404);
  const chapters = await Chapter.find({ subjectId }).select('_id title');
  if (chapters.length === 0) throw new AppError('No chapters found for subject.', 404);

  let newlyCompleted = 0;
  for (const chapter of chapters) {
    const previous = await Progress.findOne({ userId, chapterId: chapter._id });
    const wasComplete = (previous?.completionPercent ?? 0) >= 100;

    await Progress.findOneAndUpdate(
      { userId, chapterId: chapter._id },
      {
        $set: {
          completionPercent: 100,
          studyMinutes: Math.max(previous?.studyMinutes ?? 0, 90),
          revisionCount: Math.max(previous?.revisionCount ?? 0, 2),
        },
        $setOnInsert: { userId, chapterId: chapter._id },
      },
      { new: true, upsert: true },
    );

    if (!wasComplete) newlyCompleted += 1;
  }

  if (newlyCompleted > 0) {
    await applyEngagementUpdate({
      userId,
      xpDelta: newlyCompleted * XP_REWARDS.CHAPTER_COMPLETE,
      studyMinutesDelta: newlyCompleted * 60,
      activityType: ACTIVITY_TYPES.CHAPTER_COMPLETED,
      activityMessage: `Completed ${newlyCompleted} chapter(s) in ${subject.name}.`,
    });
  }

  return { subjectName: subject.name, updatedChapters: chapters.length, newlyCompleted };
};
