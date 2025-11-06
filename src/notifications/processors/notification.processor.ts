import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';

export interface NotificationJobData {
  taskId: string;
  taskTitle: string;
  userId: string;
}

@Processor('notifications')
export class NotificationProcessor {
  private readonly logger = new Logger(NotificationProcessor.name);

  @Process('task-completed')
  async handleTaskCompleted(job: Job<NotificationJobData>) {
    const { taskId, taskTitle, userId } = job.data;

    try {
      // Simulate email notification
      this.logger.log(`Email notification sent for completed task: ${taskTitle} (ID: ${taskId}) to user: ${userId}`);

      // Write to file as additional notification method
      const notificationMessage = `[${new Date().toISOString()}] Task Completed: "${taskTitle}" (ID: ${taskId}) for User: ${userId}\n`;
      const logPath = path.join(process.cwd(), 'notifications.log');
      
      try {
        await fs.appendFile(logPath, notificationMessage);
      } catch (fileError) {
        // If file doesn't exist, create it
        await fs.writeFile(logPath, notificationMessage);
      }
      
      this.logger.log(`Notification logged to file for task: ${taskId}`);
    } catch (error) {
      this.logger.error(`Failed to process notification for task ${taskId}:`, error);
      throw error;
    }
  }
}