import { Router } from 'express';
import {
  createTasks,
  deleteTasks,
  updateTask
} from '../middlewares/tasks'

const router = Router();

router.post('/tasks', createTasks);
router.patch('/tasks/:id', updateTask);
router.post('/tasks/delete', deleteTasks);

export default router;
