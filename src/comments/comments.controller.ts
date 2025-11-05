import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { PaginationDto } from '@/shared/dto/pagination.dto';
import { User } from '@/database/entities/user.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateCommentCommand } from './commands/create-comment.command';
import { GetCommentsQuery } from './queries/get-comments.query';

@ApiTags('Comments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks/:taskId/comments')
export class CommentsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Add comment to task' })
  @ApiResponse({ status: 201, description: 'Comment successfully created' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async createComment(
    @Param('taskId') taskId: string,
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUser() user: User,
  ) {
    return this.commandBus.execute(
      new CreateCommentCommand(createCommentDto.content, taskId, user.id),
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get task comments with pagination' })
  @ApiResponse({ status: 200, description: 'Comments retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async getComments(
    @Param('taskId') taskId: string,
    @Query() paginationDto: PaginationDto,
    @CurrentUser() user: User,
  ) {
    return this.queryBus.execute(
      new GetCommentsQuery(taskId, user.id, paginationDto.page, paginationDto.limit),
    );
  }
}