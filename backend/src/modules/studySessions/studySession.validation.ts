import { z } from 'zod';

const objectIdRegex = /^[a-f\d]{24}$/i;

export const startSessionSchema = z.object({
  subjectId: z.string().regex(objectIdRegex, 'subjectId must be a valid ObjectId').optional(),
});

export const endSessionParamsSchema = z.object({
  id: z.string().regex(objectIdRegex, 'id must be a valid ObjectId'),
});

export type StartSessionInput = z.infer<typeof startSessionSchema>;
export type EndSessionParamsInput = z.infer<typeof endSessionParamsSchema>;
