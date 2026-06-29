import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from './config/config.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { SecurityModule } from './shared/security/security.module';
import { UploadModule } from './shared/upload/upload.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { AuthGuard } from './auth/guards/auth.guard';
import { RoleGuard } from './auth/guards/role.guard';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule,
    AuthModule,
    UserModule,
    SecurityModule,
    UploadModule,
    TasksModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
