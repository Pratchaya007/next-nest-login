import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from './config/config.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { SecurityModule } from './security/security.module';

@Module({
  imports: [DatabaseModule, ConfigModule, AuthModule, UserModule, SecurityModule],
  providers: [],
})
export class AppModule {}
