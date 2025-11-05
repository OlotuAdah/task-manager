import { IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus } from '@/shared/enums/task-status.enum';
import { PaginationDto } from '@/shared/dto/pagination.dto';

export class GetTasksDto extends PaginationDto {
  @ApiPropertyOptional({ enum: TaskStatus })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;
}