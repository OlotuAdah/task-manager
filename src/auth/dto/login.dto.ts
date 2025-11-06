import { IsEmail, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty({ example: "adaholotu@gmail.com" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "Test@123456" })
  @IsString()
  password: string;
}
