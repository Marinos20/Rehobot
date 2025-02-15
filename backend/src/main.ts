
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MulterExceptionFilter } from './filters/MulterExceptionFilter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    
    app.setGlobalPrefix('omertaa')
    
    // Applique le filtre globalement
    app.useGlobalFilters(new MulterExceptionFilter());
    await app.listen(process.env.PORT ?? 3000)

}

bootstrap();



