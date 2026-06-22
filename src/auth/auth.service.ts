import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { TypedConfigService } from 'src/config/typed-config.service';
import { PrismaService } from 'src/database/prisma.service';
import { BcryptService } from 'src/shared/security/services/bcrypt.service';
import { RegisterDto } from './dtos/register.dto';
import { User } from 'src/database/generated/prisma/client';
import { PrismaClientKnownRequestError } from 'src/database/generated/prisma/internal/prismaNamespace';
import { LoginDto } from './dtos/login.dto';
import { AuthTokenService } from 'src/shared/security/services/auth-token.service';
import { UserWithOutPassword } from 'src/user/types/user.type';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly typedConfigService: TypedConfigService,
    private readonly prisma: PrismaService,
    private readonly bcryptSservice: BcryptService,
    private readonly authTokenService: AuthTokenService,
    private readonly userService: UserService
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

  async getCurrentUser(id:string): Promise<UserWithOutPassword> {
    return this.userService.findById(id)
  }
}
