import { Chapter } from './chapter.model';
import { AppError } from '../../utils/AppError';

export const getChaptersBySubject = async (subjectId: string) => {
  return Chapter.find({ subjectId }).populate('subjectId', 'name').sort({ title: 1 });
};

export const getChapterById = async (chapterId: string) => {
  const chapter = await Chapter.findById(chapterId).populate('subjectId', 'name');
  if (!chapter) throw new AppError('Chapter not found.', 404);
  return chapter;
};

export const createChapter = async (data: {
  subjectId: string;
  title: string;
  totalTopics: number;
}) => {
  return Chapter.create(data);
};
