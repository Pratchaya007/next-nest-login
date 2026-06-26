import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './creat-user.dto';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['email']),
) {}
