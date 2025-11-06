import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BullModule } from "@nestjs/bull";
import { CqrsModule } from "@nestjs/cqrs";
import { DatabaseModule } from "./database/database.module";
import { AuthModule } from "./auth/auth.module";
import { TasksModule } from "./tasks/tasks.module";
import { CommentsModule } from "./comments/comments.module";
import { NotificationsModule } from "./notifications/notifications.module";
import { User } from "./database/entities/user.entity";
import { Task } from "./database/entities/task.entity";
import { Comment } from "./database/entities/comment.entity";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DATABASE_HOST || "localhost",
      port: parseInt(process.env.DATABASE_PORT) || 5432,
      username: process.env.DATABASE_USERNAME || "postgres",
      password: process.env.DATABASE_PASSWORD || "password",
      database: process.env.DATABASE_NAME || "taskmanager",
      entities: [User, Task, Comment],
      synchronize: process.env.NODE_ENV === "development",
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || "localhost",
        port: parseInt(process.env.REDIS_PORT) || 6379,
      },
    }),
    CqrsModule,
    DatabaseModule,
    AuthModule,
    TasksModule,
    CommentsModule,
    NotificationsModule,
  ],
})
export class AppModule {}
