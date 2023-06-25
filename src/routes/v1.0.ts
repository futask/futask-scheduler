import { Router } from 'express';
import managementRouter from './management';
import consumptionRouter from './consumption';

const router = Router();

router.use('/managements', managementRouter);
router.use('/consumptions', consumptionRouter);

export default router;
