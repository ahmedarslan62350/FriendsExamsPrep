import { z } from 'zod';

const objectIdRegex = /^[a-f\d]{24}$/i;

export const updateProgressSchema = z.object({
  chapterId: z.string({ message: 'Chapter ID is required' }),
  completionPercent: z
    .number()
    .min(0, 'Cannot be negative')
    .max(100, 'Cannot exceed 100')
    .optional(),
  studyMinutes: z.number().min(0, 'Cannot be negative').optional(),
  revisionCount: z.number().min(0, 'Cannot be negative').optional(),
});

export const completeSubjectParamsSchema = z.object({
  subjectId: z.string().regex(objectIdRegex, 'subjectId must be a valid ObjectId'),
});

export type UpdateProgressInput = z.infer<typeof updateProgressSchema>;
export type CompleteSubjectParamsInput = z.infer<typeof completeSubjectParamsSchema>;
