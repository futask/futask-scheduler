import * as TaskCollection from '../db/task';
import { nowMs } from '../helpers/datetime';
import uuid from '../helpers/uuid';

const flagProcessingTasks = async (processId: string, amount: number) => {
  const tasks = await TaskCollection.findAvailable(amount, { fields: ['_id'] });

  return TaskCollection.updateManyById(tasks.map(t => t._id), { _processingId: processId, _processingAt: nowMs() });
}

export const getConsumptionTasks = async (amount: number) => {
  const processId = uuid();

  await flagProcessingTasks(processId, amount);

  return TaskCollection.find({ _processingId: processId }, { fields: ['payload']}).then(tasks => ({ tasks, processId }));
}
