export default interface Task {
  _id: string;
  payload: Record<string, unknown>;
  triggerAt: number;
  createdAt: number;
  updatedAt: number;

  _processingId: string;
  _processingAt: number;
}
