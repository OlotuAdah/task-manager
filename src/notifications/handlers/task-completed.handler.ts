import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Logger } from '@nestjs/common';
import { TaskCompletedEvent } from '@/tasks/events/task-completed.event';
import { NotificationJobData } from '../processors/notification.processor';

@EventsHandler(TaskCompletedEvent)
export class TaskCompletedHandler implements IEventHandler<TaskCompletedEvent> {
  private readonly logger = new Logger(TaskCompletedHandler.name);

  constructor(
    @InjectQueue('notifications')
    private notificationQueue: Queue,
  ) {}

  async handle(event: TaskCompletedEvent) {
    const { taskId, taskTitle, userId } = event;

    this.logger.log(`Enqueueing notification for completed task: ${taskId}`);

    const jobData: NotificationJobData = {
      taskId,
      taskTitle,
      userId,
    };

    await this.notificationQueue.add('task-completed', jobData, {
      delay: 1000, // 1 second delay
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
    });

    this.logger.log(`Notification job enqueued for task: ${taskId}`);
  }
}