import { Response } from 'express';

interface ApiResponseOptions<T> {
  res: Response;
  statusCode?: number;
  message: string;
  data?: T;
}

/**
 * Sends a standardized JSON success response.
 */
export const sendSuccess = <T>({
  res,
  statusCode = 200,
  message,
  data,
}: ApiResponseOptions<T>): void => {
  res.status(statusCode).json({
    success: true,
    message,
    data: data ?? null,
  });
};

/**
 * Sends a standardized JSON error response.
 */
export const sendError = (
  res: Response,
  statusCode: number,
  message: string
): void => {
  res.status(statusCode).json({
    success: false,
    message,
    data: null,
  });
};
