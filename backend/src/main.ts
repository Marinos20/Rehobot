import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  //**je vais préfixer api */
  app.setGlobalPrefix('omertaa')
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
