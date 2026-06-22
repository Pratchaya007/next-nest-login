import { Body, Controller, Get, Post } from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import { AuthService } from './auth.service';
import { ResponseMessage } from 'src/common/decorators/message-response.decorator';
import { LoginDto } from './dtos/login.dto';
import { UserWithOutPassword } from 'src/user/types/user.type';
import { CurrentUser } from './decorators/current-user.decorators';
import type { JwtPayload } from 'src/types/jwt-payload.type';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ResponseMessage('register account create successfuly!')
  @Post('register')
  async register(@Body() registerdto: RegisterDto): Promise<void> {
    await this.authService.register(registerdto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<{
    accessToken: string;
    user: UserWithOutPassword;
  }> {
    return await this.authService.login(loginDto);
  }

  @ApiBearerAuth()
  @Get('me')
  async getCurrentUser(
    @CurrentUser() userId: JwtPayload,
  ): Promise<UserWithOutPassword> {
    return this.authService.getCurrentUser(userId.sub);
  }
}
