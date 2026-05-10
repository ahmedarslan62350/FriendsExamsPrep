import { Router } from 'express';
import { getUserTasks, createTask, completeTask, deleteTask } from './task.controller';
import { protect } from '../../middleware/authMiddleware';
import { validate } from '../../middleware/validate';
import { createTaskSchema } from './task.validation';

const router = Router();

router.use(protect);

router.get('/', getUserTasks);
router.post('/', validate(createTaskSchema), createTask);
router.patch('/:id/complete', completeTask);
router.delete('/:id', deleteTask);

export default router;
