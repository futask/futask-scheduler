import { NextFunction, Request, Response } from 'express';
import { attachResponseData } from './utils/response';
import * as TaskCollection from '../db/task';
import AppError from '../helpers/error';
import logger from '../helpers/logger';

export const createTasks = (req: Request, res: Response, next: NextFunction) => {
  const { tasks } = req.body;
  if (!tasks || !tasks.length) {
    return next(AppError.badRequest('Empty tasks'));
  }

  TaskCollection.insertMany(tasks).then(ts => {
    // TODO::later notify added tasks
    logger.info('✅ Added %o', ts.length)
    attachResponseData(res, { tasks: ts });
    next();
  }).catch(err => {
    logger.error('🛑 Create tasks failed: error %o, tasks: %o', err.message, tasks);
    next(AppError.badRequest());
  });
};

export const updateTask = async (req: Request, _: Response, next: NextFunction) => {
  const { id } = req.params;
  const { task } = req.body;
  TaskCollection.update(id, task)
    .then(() => next())
    .catch(err => {
      logger.error('🛑 update task failed, err: %o, task: %o', err.message, task);
      next(AppError.badRequest());
    });
};

export const deleteTasks = async (req: Request, res: Response, next: NextFunction) => {
  const { ids } = req.body;
  TaskCollection.deleteMany(ids)
    .then((deletedCount) => {
      // TODO:later notify deleted amount
      logger.info('✅ Deleted amount %o', deletedCount);

      next();
    })
    .catch(err => {
      logger.error('🛑 delete tasks failed, err: %o, ids: %o', err.message, ids);
      next(AppError.badRequest());
    });


};
