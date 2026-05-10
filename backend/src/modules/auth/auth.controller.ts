import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendSuccess } from '../../utils/apiResponse';
import * as authService from './auth.service';
import { RegisterInput, LoginInput } from './auth.validation';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const input = req.body as RegisterInput;
  const result = await authService.registerUser(input);
  sendSuccess({ res, statusCode: 201, message: 'Account created successfully.', data: result });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const input = req.body as LoginInput;
  const result = await authService.loginUser(input);
  sendSuccess({ res, message: 'Logged in successfully.', data: result });
});
