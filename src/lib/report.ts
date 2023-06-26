// TODO: the following function will need to send to metric server url that register to the scheduler,
// currently, we only inc the number in the process for tracking

import logger from '../helpers/logger';
import { getEnvNumber, incEnv } from '../helpers/system'

export const notifyProcessedTasks = (count: number) => {
  if (!count) {
    return;
  }
  incEnv('PROCESSED_TASK_COUNT', count);
  logger.info('✅ PROCESSED: %o', getEnvNumber('PROCESSED_TASK_COUNT'));
};

export const notifyAddedTasks = (count: number) => {
  if (!count) {
    return;
  }
  incEnv('ADDED_TASK_COUNT', count);
  logger.info('🎉 ADDED: %o', getEnvNumber('ADDED_TASK_COUNT'));
};

export const notifyDeletedTasks = (count: number) => {
  if (!count) {
    return;
  }
  incEnv('DELETED_TASK_COUNT', count);
  logger.info('🔥 DELETED: %o', getEnvNumber('DELETED_TASK_COUNT'));
};
