import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/database/generated/prisma/enums';

export class UserResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  password!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  role!: Role;
}
