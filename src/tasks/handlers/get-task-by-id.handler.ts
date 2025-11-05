import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { Task } from '@/database/entities/task.entity';
import { GetTaskByIdQuery } from '../queries/get-task-by-id.query';

@QueryHandler(GetTaskByIdQuery)
export class GetTaskByIdHandler implements IQueryHandler<GetTaskByIdQuery> {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async execute(query: GetTaskByIdQuery): Promise<Task> {
    const { id, userId } = query;

    const task = await this.taskRepository.findOne({
      where: { id, userId },
      relations: ['comments', 'comments.user'],
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }
}