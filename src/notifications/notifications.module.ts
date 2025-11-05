import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { CqrsModule } from '@nestjs/cqrs';
import { NotificationProcessor } from './processors/notification.processor';
import { TaskCompletedHandler } from './handlers/task-completed.handler';

@Module({
  imports: [
    CqrsModule,
    BullModule.registerQueue({
      name: 'notifications',
    }),
  ],
  providers: [NotificationProcessor, TaskCompletedHandler],
})
export class NotificationsModule {}