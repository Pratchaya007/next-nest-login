import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalValidationPip } from './common/pipes/global-validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new GlobalValidationPip());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
