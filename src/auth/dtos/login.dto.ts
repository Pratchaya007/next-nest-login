import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from 'src/user/dtos/creat-user.dto';

export class LoginDto extends PickType(CreateUserDto, ['email', 'password']) {}
