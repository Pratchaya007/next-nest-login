import { Injectable, NotFoundException } from '@nestjs/common';
import { UserWithOutPassword } from './types/user.type';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  async findById(id: string): Promise<UserWithOutPassword> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user)
      throw new NotFoundException({
        message: 'User with provided in not found',
        code: 'USER_NOT_FOUND',
      });
    return user;
  }
}
