import { ApiProperty } from '@nestjs/swagger';
import { Trim } from 'src/common/decorators/trim.decorator';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from 'src/database/generated/prisma/enums';

export class CreateUserDto {
  @ApiProperty({
    example: 'Test_01@gmail.com',
    description: 'An email address to be registered. Must be unique',
  })
  @Trim()
  @IsEmail({}, { message: 'Invalid email address' })
  @IsString({ message: 'Email must be string' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;

  @ApiProperty({
    example: 'Test_01.web',
    description: 'A user password. Must have at least 6 charaters',
  })
  @Trim()
  @MinLength(6, { message: 'Password must have at least 6 characters' })
  @IsString({ message: 'Password must be a string ' })
  @IsNotEmpty({ message: 'Password is required ' })
  password!: string;

  @ApiProperty({
    example: 'Pratchaya',
  })
  @Trim()
  @IsString({ message: 'name must be a string' })
  @IsNotEmpty({ message: 'name is required' })
  name!: string;

  @ApiProperty({
    example: 'ADMIN',
  })
  @IsEnum(Role, {
    message:
      'Role must be one fo th following values: ADMIN , USER ,SUPERADMIN ',
  })
  @IsNotEmpty({ message: 'Role is required ' })
  role!: Role;

  avatarUrl?: string;

  coverUrl?: string;
}
