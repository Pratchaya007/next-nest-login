import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import { AuthService } from './service/auth.service';
import { ResponseMessage } from 'src/common/decorators/message-response.decorator';
import { LoginDto } from './dtos/login.dto';
import { UserWithOutPassword } from 'src/user/types/user.type';
import { CurrentUser } from './decorators/current-user.decorators';
import type { JwtPayload } from 'src/types/jwt-payload.type';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Public } from './decorators/public.decorator';
import { LoginResponseDto } from './dtos/login-response.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ResponseMessage('register account create successfuly!')
  @Post('register')
  async register(@Body() registerdto: RegisterDto): Promise<void> {
    await this.authService.register(registerdto);
  }

  @Public()
  @ApiOkResponse({
    description: 'Successfully operation',
    type: LoginResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'The provided credentials is ivalid',
  })
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<{
    accessToken: string;
    user: UserWithOutPassword;
  }> {
    return await this.authService.login(loginDto);
  }

  // POST /api/auth/forgot-password
  @Public()
  @ApiOperation({ summary: 'Request a password reset email' })
  @HttpCode(HttpStatus.OK)
  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  // POST /api/auth/reset-password
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password using token from email' })
  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.password,
    );
  }

  @ApiBearerAuth()
  @Get('me')
  async getCurrentUser(
    @CurrentUser() userId: JwtPayload,
  ): Promise<UserWithOutPassword> {
    return this.authService.getCurrentUser(userId.sub);
  }
}
