import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { Task } from '@/database/entities/task.entity';
import { TaskStatus } from '@/shared/enums/task-status.enum';
import { UpdateTaskCommand } from '../commands/update-task.command';
import { TaskCompletedEvent } from '../events/task-completed.event';

@CommandHandler(UpdateTaskCommand)
export class UpdateTaskHandler implements ICommandHandler<UpdateTaskCommand> {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    private eventBus: EventBus,
  ) {}

  async execute(command: UpdateTaskCommand): Promise<Task> {
    const { id, userId, title, description, status } = command;

    const task = await this.taskRepository.findOne({
      where: { id, userId },
      lock: { mode: 'pessimistic_write' },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const previousStatus = task.status;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;

    const updatedTask = await this.taskRepository.save(task);

    // Trigger notification if task is completed
    if (status === TaskStatus.COMPLETED && previousStatus !== TaskStatus.COMPLETED) {
      this.eventBus.publish(new TaskCompletedEvent(updatedTask.id, updatedTask.title, userId));
    }

    return updatedTask;
  }
}