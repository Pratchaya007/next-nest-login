import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserWithOutPassword } from './types/user.type';
import { PrismaService } from 'src/database/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { CreateAdminDto } from './dtos/create-admin.dto';
import { BcryptService } from 'src/shared/security/services/bcrypt.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly bcryptService: BcryptService,
  ) {}
  async findById(id: string): Promise<UserWithOutPassword> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      omit: { password: true },
    });
    if (!user)
      throw new NotFoundException({
        message: 'User with provided in not found',
        code: 'USER_NOT_FOUND',
      });
    return user;
  }

  async createAdmin(creaAdminDto: CreateAdminDto): Promise<void> {
    const hashPassword = await this.bcryptService.hash(creaAdminDto.password);
    try {
      await this.prisma.user.create({
        data: { ...creaAdminDto, password: hashPassword, role: 'ADMIN' },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      )
        throw new ConflictException('Email address already exists');
      throw error;
    }
  }
}
