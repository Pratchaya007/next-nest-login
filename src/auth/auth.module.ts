import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './service/auth.service';
import { SecurityModule } from 'src/shared/security/security.module';
import { UserModule } from 'src/user/user.module';
import { EmailService } from './service/email.service';

@Module({
  imports: [SecurityModule, UserModule],
  controllers: [AuthController],
  providers: [AuthService, EmailService],
  exports: [AuthService],
})
export class AuthModule {}
