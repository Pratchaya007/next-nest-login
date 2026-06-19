import { Module } from '@nestjs/common';
import { AuthTokenService } from './services/auth-token.service';
import { BcryptService } from './services/bcrypt.service';
import { ConfigModule } from 'src/config/config.module';

@Module({
  imports: [ConfigModule],
  providers: [AuthTokenService, BcryptService],
  exports: [BcryptService, AuthTokenService],
})
export class SecurityModule {}
