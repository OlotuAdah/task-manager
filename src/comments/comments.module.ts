import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DatabaseModule } from '@/database/database.module';
import { CommentsController } from './comments.controller';
import { CreateCommentHandler } from './handlers/create-comment.handler';
import { GetCommentsHandler } from './handlers/get-comments.handler';

const CommandHandlers = [CreateCommentHandler];
const QueryHandlers = [GetCommentsHandler];

@Module({
  imports: [CqrsModule, DatabaseModule],
  controllers: [CommentsController],
  providers: [...CommandHandlers, ...QueryHandlers],
})
export class CommentsModule {}