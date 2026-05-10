import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendSuccess } from '../../utils/apiResponse';
import * as subjectService from './subject.service';

export const getAllSubjects = asyncHandler(async (_req: Request, res: Response) => {
  const subjects = await subjectService.getAllSubjects();
  sendSuccess({ res, message: 'Subjects fetched successfully.', data: subjects });
});

export const getSubjectById = asyncHandler(async (req: Request, res: Response) => {
  const subject = await subjectService.getSubjectById(req.params.id as string);
  sendSuccess({ res, message: 'Subject fetched successfully.', data: subject });
});

export const seedSubjects = asyncHandler(async (_req: Request, res: Response) => {
  const subjects = await subjectService.seedSubjects();
  sendSuccess({ res, statusCode: 201, message: 'Subjects seeded successfully.', data: subjects });
});
