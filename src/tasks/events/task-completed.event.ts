export class TaskCompletedEvent {
  constructor(
    public readonly taskId: string,
    public readonly taskTitle: string,
    public readonly userId: string,
  ) {}
}