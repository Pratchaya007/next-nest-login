import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from 'src/auth/auth.module';
import { SecurityModule } from 'src/shared/security/security.module';


@Module({
  imports: [SecurityModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [ UserService],
})
export class UserModule {}
