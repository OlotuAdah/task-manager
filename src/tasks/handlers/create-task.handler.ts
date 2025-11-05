import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '@/database/entities/task.entity';
import { CreateTaskCommand } from '../commands/create-task.command';

@CommandHandler(CreateTaskCommand)
export class CreateTaskHandler implements ICommandHandler<CreateTaskCommand> {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    private eventBus: EventBus,
  ) {}

  async execute(command: CreateTaskCommand): Promise<Task> {
    const { title, description, status, userId } = command;

    const task = this.taskRepository.create({
      title,
      description,
      status,
      userId,
    });

    return await this.taskRepository.save(task);
  }
}