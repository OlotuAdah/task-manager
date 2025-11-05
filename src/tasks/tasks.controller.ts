import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { User } from '@/database/entities/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTasksDto } from './dto/get-tasks.dto';
import { CreateTaskCommand } from './commands/create-task.command';
import { UpdateTaskCommand } from './commands/update-task.command';
import { DeleteTaskCommand } from './commands/delete-task.command';
import { GetTasksQuery } from './queries/get-tasks.query';
import { GetTaskByIdQuery } from './queries/get-task-by-id.query';

@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'Task successfully created' })
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @CurrentUser() user: User,
  ) {
    return this.commandBus.execute(
      new CreateTaskCommand(
        createTaskDto.title,
        user.id,
        createTaskDto.description,
        createTaskDto.status,
      ),
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get user tasks with pagination' })
  @ApiResponse({ status: 200, description: 'Tasks retrieved successfully' })
  async getTasks(
    @Query() getTasksDto: GetTasksDto,
    @CurrentUser() user: User,
  ) {
    return this.queryBus.execute(
      new GetTasksQuery(
        user.id,
        getTasksDto.page,
        getTasksDto.limit,
        getTasksDto.status,
      ),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task by ID' })
  @ApiResponse({ status: 200, description: 'Task retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async getTaskById(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ) {
    return this.queryBus.execute(new GetTaskByIdQuery(id, user.id));
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update task' })
  @ApiResponse({ status: 200, description: 'Task successfully updated' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @CurrentUser() user: User,
  ) {
    return this.commandBus.execute(
      new UpdateTaskCommand(
        id,
        user.id,
        updateTaskDto.title,
        updateTaskDto.description,
        updateTaskDto.status,
      ),
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete task' })
  @ApiResponse({ status: 200, description: 'Task successfully deleted' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async deleteTask(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ) {
    await this.commandBus.execute(new DeleteTaskCommand(id, user.id));
    return { message: 'Task deleted successfully' };
  }
}