import { Module } from '@nestjs/common';
import { AuthTokenService } from './services/auth-token.service';

@Module({
  providers: [AuthTokenService]
})
export class SecurityModule {}
