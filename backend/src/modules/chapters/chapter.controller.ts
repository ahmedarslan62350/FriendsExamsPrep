import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendSuccess } from '../../utils/apiResponse';
import * as chapterService from './chapter.service';

export const getChaptersBySubject = asyncHandler(async (req: Request, res: Response) => {
  const chapters = await chapterService.getChaptersBySubject(req.params.subjectId as string);
  sendSuccess({ res, message: 'Chapters fetched successfully.', data: chapters });
});

export const getChapterById = asyncHandler(async (req: Request, res: Response) => {
  const chapter = await chapterService.getChapterById(req.params.id as string);
  sendSuccess({ res, message: 'Chapter fetched successfully.', data: chapter });
});

export const createChapter = asyncHandler(async (req: Request, res: Response) => {
  const chapter = await chapterService.createChapter(req.body);
  sendSuccess({ res, statusCode: 201, message: 'Chapter created successfully.', data: chapter });
});
