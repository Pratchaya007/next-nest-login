import {
  Body,
  Controller,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CreateAdminDto } from './dtos/create-admin.dto';
import { UserService } from './user.service';
import { Roles } from 'src/auth/decorators/role.decorator';
import { ResponseMessage } from 'src/common/decorators/message-response.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from 'src/auth/decorators/current-user.decorators';
import type { JwtPayload } from 'src/types/jwt-payload.type';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UpdateNameDto } from './dtos/updata-name.dto';

@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ResponseMessage('Create Admin Successfully!')
  @Roles('SUPERADMIN')
  @Post('admin')
  async createAdmin(@Body() createAdminDto: CreateAdminDto): Promise<void> {
    await this.userService.createAdmin(createAdminDto);
  }

  @UseInterceptors(FileInterceptor('avatar'))
  @Patch('/avatar')
  uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: JwtPayload,
  ): Promise<string> {
    return this.userService.uploadAvatar(user.sub, file);
  }

  @ResponseMessage('Updata User Successfully!')
  @Post('/updata')
  async updataUser(
    @CurrentUser() user: JwtPayload,
    @Body() updataUserDto: UpdateNameDto,
  ): Promise<void> {
    await this.userService.updataUser(user.sub , updataUserDto)
  }
}
