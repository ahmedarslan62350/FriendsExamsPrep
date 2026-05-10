import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import { errorMiddleware } from './middleware/errorMiddleware';

// Route imports
import authRoutes from './modules/auth/auth.routes';
import subjectRoutes from './modules/subjects/subject.routes';
import chapterRoutes from './modules/chapters/chapter.routes';
import progressRoutes from './modules/progress/progress.routes';
import leaderboardRoutes from './modules/leaderboard/leaderboard.routes';
import activityRoutes from './modules/activity/activity.routes';
import taskRoutes from './modules/tasks/task.routes';
import studySessionRoutes from './modules/studySessions/studySession.routes';

const app: Application = express();

// Global Middleware
app.use(helmet());
app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (env.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', message: 'Backend is running' });
});

// API Routes
const API_VERSION = '/api/v1';

app.use(`${API_VERSION}/auth`, authRoutes);
app.use(`${API_VERSION}/subjects`, subjectRoutes);
app.use(`${API_VERSION}/chapters`, chapterRoutes);
app.use(`${API_VERSION}/progress`, progressRoutes);
app.use(`${API_VERSION}/leaderboard`, leaderboardRoutes);
app.use(`${API_VERSION}/activity`, activityRoutes);
app.use(`${API_VERSION}/tasks`, taskRoutes);
app.use(`${API_VERSION}/study-sessions`, studySessionRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Can't find ${req.originalUrl} on this server`,
  });
});

// Global Error Handler
app.use(errorMiddleware);

export default app;
