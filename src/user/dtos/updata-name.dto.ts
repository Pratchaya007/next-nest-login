import { PartialType, PickType } from '@nestjs/swagger';
import { CreateUserDto } from './creat-user.dto';

export class UpdateNameDto extends PartialType(
  PickType(CreateUserDto, ['name']),
) {}
