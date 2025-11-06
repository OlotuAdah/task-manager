import { IsEmail, IsString, MinLength, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RegisterDto {
  @ApiProperty({ example: "adaholotu@gmail.com" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "Test@123456", minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: "Adah" })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: "Olotu" })
  @IsString()
  @IsNotEmpty()
  lastName: string;
}
