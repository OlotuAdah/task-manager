import { TaskStatus } from '@/shared/enums/task-status.enum';

export class UpdateTaskCommand {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly title?: string,
    public readonly description?: string,
    public readonly status?: TaskStatus,
  ) {}
}