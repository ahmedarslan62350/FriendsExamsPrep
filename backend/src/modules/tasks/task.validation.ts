import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string({ message: 'Task title is required' }).min(2),
  xpReward: z.number().min(0).default(20),
  estimatedMinutes: z.number().min(1, 'Must be at least 1 minute'),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
