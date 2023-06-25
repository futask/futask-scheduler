import { Router } from 'express';
import {
  flagConsumptionSuccess, getConsumeTasks,
} from '../middlewares/tasks';
const router = Router();

router.get('/tasks', getConsumeTasks);
router.post('/tasks/completions', flagConsumptionSuccess);

export default router;
