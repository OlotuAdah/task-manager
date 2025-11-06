import { IsString, IsNotEmpty, IsOptional, IsEnum, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus } from '@/shared/enums/task-status.enum';
import { Sanitize } from '@/shared/decorators/sanitize.decorator';

export class CreateTaskDto {
  @ApiProperty({ example: 'Complete project documentation' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  @Sanitize()
  title: string;

  @ApiPropertyOptional({ example: 'Write comprehensive documentation for the API' })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  @Sanitize()
  description?: string;

  @ApiPropertyOptional({ enum: TaskStatus, default: TaskStatus.PENDING })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus = TaskStatus.PENDING;
}