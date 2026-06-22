import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from './creat-user.dto';

export class CreateAdminDto extends PickType(CreateUserDto, [
  'email',
  'password',
  'name',
  'role'
] as const ) {}
