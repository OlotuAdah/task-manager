import { TaskStatus } from '@/shared/enums/task-status.enum';

export class CreateTaskCommand {
  constructor(
    public readonly title: string,
    public readonly userId: string,
    public readonly description?: string,
    public readonly status: TaskStatus = TaskStatus.PENDING,
  ) {}
}