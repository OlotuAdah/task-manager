import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ example: 'This task looks good to me!' })
  @IsString()
  @IsNotEmpty()
  content: string;
}