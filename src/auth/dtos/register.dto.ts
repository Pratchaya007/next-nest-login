import { OmitType } from '@nestjs/swagger';
import { CreateUserDto } from 'src/user/dtos/creat-user.dto';

export class RegisterDto extends OmitType(CreateUserDto, [
  'avatarUrl',
  'coverUrl',
  'role',
]) {}
