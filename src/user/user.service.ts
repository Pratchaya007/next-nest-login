import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserWithOutPassword } from './types/user.type';
import { PrismaService } from 'src/database/prisma.service';
import { AuthService } from 'src/auth/service/auth.service';
import { CreateAdminDto } from './dtos/create-admin.dto';
import { BcryptService } from 'src/shared/security/services/bcrypt.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { UpdateUserDto } from './dtos/update-user.dto';
import { CloudinaryService } from 'src/shared/upload/cloudinary.service';
import { UpdateNameDto } from './dtos/updata-name.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly bcryptService: BcryptService,
    private readonly cloudinaryService: CloudinaryService,
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

  async updataUser(
    id: string,
    updataUserdto: UpdateNameDto,
  ): Promise<UserWithOutPassword> {
    return this.prisma.user.update({
      where: { id },
      data: updataUserdto
    })
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

  // Upload Image
  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserWithOutPassword> {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      omit: { password: true },
    });
  }

  // UploadAvatar
  async uploadAvatar(
    userId: string,
    file: Express.Multer.File,
  ): Promise<string> {
    // 1. Upload Cloudinary
    const result = await this.cloudinaryService.upload(file);
    // 2. Upadate in db
    await this.update(userId, { avatarUrl: result.secure_url });
    return result.secure_url;
  }

  // UploadCover
  async uploadCover(
    userId: string,
    file: Express.Multer.File,
  ): Promise<string> {
    const result = await this.cloudinaryService.upload(file);
    await this.update(userId, { coverUrl: result.secure_url });
    return result.secure_url;
  }
}
