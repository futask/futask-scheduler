import { Schema, model } from 'mongoose';
import { getCollectionName } from './utils/collection';
import Task from '../models/sample';
import { ID_DEFINITION } from './utils/schema';

const TaskSchema = new Schema<Task>({
  _id: ID_DEFINITION,
  payload: Object,
  triggerAt: Number,

  createdAt: Number,
  updatedAt: Number,

  _processingAt: Number,
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

export const markCompleted = (processId: string) => collection.deleteMany({ _processingId: processId }).then(res => res.deletedCount);

export const find = (condition: Partial<Task>, options?: { fields: (keyof Task)[] }) =>
  collection.find(condition, options?.fields)
  .lean();

export const findAvailable = (period: { from: number, to: number }, limit: number, options?: { fields: (keyof Task)[] }) =>
  collection.find(
    {
      _processingId: { $exists: false },
      triggerAt: { $gte: period.from, $lte: period.to }
    },
    options?.fields
  )
    .limit(limit)
    .lean();

