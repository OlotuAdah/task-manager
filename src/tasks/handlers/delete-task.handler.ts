import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { Task } from '@/database/entities/task.entity';
import { DeleteTaskCommand } from '../commands/delete-task.command';

@CommandHandler(DeleteTaskCommand)
export class DeleteTaskHandler implements ICommandHandler<DeleteTaskCommand> {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async execute(command: DeleteTaskCommand): Promise<void> {
    const { id, userId } = command;

    const result = await this.taskRepository.delete({ id, userId });

    if (result.affected === 0) {
      throw new NotFoundException('Task not found');
    }
  }
}