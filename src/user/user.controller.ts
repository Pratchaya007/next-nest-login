import { Body, Controller, Post } from '@nestjs/common';
import { CreateAdminDto } from './dtos/create-admin.dto';
import { UserService } from './user.service';
import { Roles } from 'src/auth/decorators/role.decorator';
import { ResponseMessage } from 'src/common/decorators/message-response.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ResponseMessage('Create Admin Successfully!')
  @Roles('SUPERADMIN')
  @Post('admin')
  async createAdmin(@Body() createAdminDto: CreateAdminDto): Promise<void> {
    await this.userService.createAdmin(createAdminDto)
  }
}
