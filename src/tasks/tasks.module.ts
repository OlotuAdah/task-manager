import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DatabaseModule } from '@/database/database.module';
import { TasksController } from './tasks.controller';
import { CreateTaskHandler } from './handlers/create-task.handler';
import { UpdateTaskHandler } from './handlers/update-task.handler';
import { DeleteTaskHandler } from './handlers/delete-task.handler';
import { GetTasksHandler } from './handlers/get-tasks.handler';
import { GetTaskByIdHandler } from './handlers/get-task-by-id.handler';

const CommandHandlers = [CreateTaskHandler, UpdateTaskHandler, DeleteTaskHandler];
const QueryHandlers = [GetTasksHandler, GetTaskByIdHandler];

@Module({
  imports: [CqrsModule, DatabaseModule],
  controllers: [TasksController],
  providers: [...CommandHandlers, ...QueryHandlers],
})
export class TasksModule {}