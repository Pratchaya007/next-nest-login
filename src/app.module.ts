import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from './config/config.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { SecurityModule } from './shared/security/security.module';
import { UploadModule } from './shared/upload/upload.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule,
    AuthModule,
    UserModule,
    SecurityModule,
    UploadModule,
  ],
  providers: [],
})
export class AppModule {}
