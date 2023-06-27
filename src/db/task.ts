import { Schema, model } from 'mongoose';
import { getCollectionName } from './utils/collection';
import Task from '../models/sample';
import { ID_DEFINITION } from './utils/schema';
import { getEnvNumber } from '../helpers/system';
import { nowMs } from '../helpers/datetime';

const TaskSchema = new Schema<Task>({
  _id: ID_DEFINITION,
  payload: Object,
  triggerAt: Number,

  createdAt: Number,
  updatedAt: Number,

  _processingAt: { type: Number, default: 0, required: true },
  _processingId: String
}, {
  versionKey: false,
  timestamps: true
});

const collection =  model<Task>(getCollectionName('Task'), TaskSchema);

export const insertMany = (tasks: Partial<Task>[]) => collection.insertMany(tasks);

export const update = (id: string, task: Partial<Task>[]) => collection.findByIdAndUpdate(id, task);

export const updateManyById = (ids: string[], task: Partial<Task>) =>
  collection.updateMany({ _id: { $in: ids } }, task);

export const deleteManyById = (ids: string[]) => collection.deleteMany({ _id: { $in: ids }}).then(res => res.deletedCount);

export const markFailed = (ids: string[]) => collection.updateMany(
  { _id: { $in: ids } },
  { $unset: { _processingAt: null, _processingId: null }
}).exec();

export const markCompleted = (processId: string) => collection.deleteMany({ _processingId: processId }).then(res => res.deletedCount);

export const find = (condition: Partial<Task>, options?: { fields: (keyof Task)[] }) =>
  collection.find(condition, options?.fields)
  .lean();

export const findAvailable = (limit: number, options?: { fields: (keyof Task)[] }) =>
  collection.find(
    {
      $or: [
        { _processingId: { $exists: false } },
        { _processingAt: { $lt: nowMs() - getEnvNumber('OVERDUE_PROCESSING_MS') } }
      ]
    },
    options?.fields
  ).sort({ triggerAt: 1 })
    .limit(limit)
    .lean();
