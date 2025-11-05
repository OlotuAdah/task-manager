import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { Comment } from '@/database/entities/comment.entity';
import { Task } from '@/database/entities/task.entity';
import { CreateCommentCommand } from '../commands/create-comment.command';

@CommandHandler(CreateCommentCommand)
export class CreateCommentHandler implements ICommandHandler<CreateCommentCommand> {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async execute(command: CreateCommentCommand): Promise<Comment> {
    const { content, taskId, userId } = command;

    // Verify task exists and user has access
    const task = await this.taskRepository.findOne({
      where: { id: taskId, userId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const comment = this.commentRepository.create({
      content,
      taskId,
      userId,
    });

    return await this.commentRepository.save(comment);
  }
}