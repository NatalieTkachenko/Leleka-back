import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import {
  createTask,
  getTasks,
  taskStatusUpdate,
} from '../controllers/tasksController.js';

import { celebrate } from 'celebrate';
import {
  taskStatusUpdateValidationSchema,
  taskValidationSchema,
} from '../validations/taskValidation.js';

const router = Router();

router.post(
  '/tasks/new',
  authenticate,
  celebrate(taskValidationSchema),
  createTask,
);

router.get('/tasks', authenticate, getTasks);
router.patch(
  '/tasks/:taskId',
  authenticate,
  celebrate(taskStatusUpdateValidationSchema),
  taskStatusUpdate,
);

export default router;
