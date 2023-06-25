import { Router } from 'express';
import managementRouter from './management';

const router = Router();

router.use('/managements', managementRouter);

export default router;
