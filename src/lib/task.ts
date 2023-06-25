import * as TaskCollection from '../db/task';
import { getEnv } from '../helpers/system';
import { nowMs } from '../helpers/datetime';
import uuid from '../helpers/uuid';

const flagProcessingTasks = async (processId: string, amount: number) => {
  const currentTimeAccepted = +(getEnv('CURRENT_TIME_ACCEPTED_SECOND') || 60) * 1000;
  const now = nowMs();
  const tasks = await TaskCollection.findAvailable({ from: now - currentTimeAccepted, to: now }, amount, { fields: ['_id'] });

  return TaskCollection.updateManyById(tasks.map(t => t._id), { _processingId: processId, _processingAt: now });
}

export const getConsumptionTasks = async (amount: number) => {
  const processId = uuid();

  await flagProcessingTasks(processId, amount);

  return TaskCollection.find({ _processingId: processId }, { fields: ['payload']}).then(tasks => ({ tasks, processId }));
}
