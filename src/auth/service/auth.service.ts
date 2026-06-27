import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { TypedConfigService } from 'src/config/typed-config.service';
import { PrismaService } from 'src/database/prisma.service';
import { BcryptService } from 'src/shared/security/services/bcrypt.service';
import { RegisterDto } from '../dtos/register.dto';
import { User } from 'src/database/generated/prisma/client';
import { PrismaClientKnownRequestError } from 'src/database/generated/prisma/internal/prismaNamespace';
import { LoginDto } from '../dtos/login.dto';
import { AuthTokenService } from 'src/shared/security/services/auth-token.service';
import { UserWithOutPassword } from 'src/user/types/user.type';
import { UserService } from 'src/user/user.service';
import { createHash } from 'crypto';
import { ResponseMessage } from 'src/common/decorators/message-response.decorator';
import crypto from 'crypto';
import { EmailService } from './email.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly typedConfigService: TypedConfigService,
    private readonly prisma: PrismaService,
    private readonly bcryptSservice: BcryptService,
    private readonly authTokenService: AuthTokenService,
    private readonly userService: UserService,
    private readonly emailService: EmailService
  ) {}

  async register(registerDto: RegisterDto): Promise<User> {
    // hash Password
    const hashPassword = await this.bcryptSservice.hash(registerDto.password);
    // insert data to database
    try {
      const user = await this.prisma.user.create({
        data: { ...registerDto, password: hashPassword },
      });
      return user;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException({
          message: `Email: ${registerDto.email} is already in use`,
          code: 'EMAIL_ALREADY_EXISTS',
        });
      }
      throw error;
    }
  }

  async login(logindto: LoginDto): Promise<{
    accessToken: string;
    user: Omit<User, 'password'>;
  }> {
    //1. ค้นหา user in database ไม่มีก็แจ้ง error ออกไป
    const user = await this.prisma.user.findUnique({
      where: { email: logindto.email },
    });
    if (!user)
      throw new UnauthorizedException({
        message: 'The provided email or password is incorrect',
        code: 'INVALID_CREDENTIALS',
      });
    //2. compare password ว่าตรงกันไหม
    const isMatch = await this.bcryptSservice.compare(
      logindto.password,
      user.password,
    );
    if (!isMatch)
      throw new UnauthorizedException({
        message: 'The provided email or password is incorrent',
        code: 'INVALID_CREDENTIALS',
      });
    //3. gen access Token
    const accessToken = await this.authTokenService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    const { password, ...rest } = user;

    return { accessToken, user: rest };
  }

  @ResponseMessage('If an account with that eamil existe, a reset link has been sent')
  async forgotPassword(email: string) {
    // find email
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user)
      throw new BadRequestException({
        message: 'No account found with this email address',
        code: 'NO_ACCOUNT_IN_DATABASE',
      });

    //Create token new in db
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hr

    // insert to db
    await this.prisma.user.update({
      where: {id: user.id},
      data: {
        resetToken,
        resetTokenExpiresAt
      }
    })

    // send mail
    void this.emailService.sendPasswordResetEmail(user.email, resetToken);
    
  }

  @ResponseMessage('Password reset successfully. You can now log in')
  async resetPassword(token: string, newPassword: string) {
    //find email
    const user = await this.prisma.user.findFirst({
      where: { resetToken: token },
    });
    if (!user || !user.resetToken) {
      throw new BadRequestException({
        message: 'Invalid reset Token',
        code: 'INVALID_RESET_TOKEN',
      });
    }
    //เช็กว่า resetTokenExpiresAt มีค่าไหม  ถ้ามี และเวลาหมดอายุ น้อยกว่าเวลาปัจจุบัน  แปลว่า Reset Token หมดอายุแล้ว
    if (user.resetTokenExpiresAt && user.resetTokenExpiresAt < new Date()) {
      throw new BadRequestException({
        message: 'Reset Token has Expired. Please request a new one',
        code: 'RESET_TOKEN_HAS_EXPIRED',
      });
    }

    // Hash Password
    const password = await this.bcryptSservice.hash(newPassword);

    // insert to db
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password,
        resetToken: null,
        resetTokenExpiresAt: null,
        refreshTokenHash: null,
      },
    });
  }

  async getCurrentUser(id: string): Promise<UserWithOutPassword> {
    return this.userService.findById(id);
  }
}
