import { TaskStatus } from '@/shared/enums/task-status.enum';

export class GetTasksQuery {
  constructor(
    public readonly userId: string,
    public readonly page: number = 1,
    public readonly limit: number = 10,
    public readonly status?: TaskStatus,
  ) {}
}