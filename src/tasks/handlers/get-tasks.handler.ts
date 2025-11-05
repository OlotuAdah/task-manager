import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '@/database/entities/task.entity';
import { PaginatedResult } from '@/shared/dto/pagination.dto';
import { GetTasksQuery } from '../queries/get-tasks.query';

@QueryHandler(GetTasksQuery)
export class GetTasksHandler implements IQueryHandler<GetTasksQuery> {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async execute(query: GetTasksQuery): Promise<PaginatedResult<Task>> {
    const { userId, page, limit, status } = query;

    const queryBuilder = this.taskRepository
      .createQueryBuilder('task')
      .where('task.userId = :userId', { userId })
      .orderBy('task.createdAt', 'DESC');

    if (status) {
      queryBuilder.andWhere('task.status = :status', { status });
    }

    const [data, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}