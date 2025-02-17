import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MulterExceptionFilter } from './filters/MulterExceptionFilter';
import { AllExceptionsFilter } from './core/all-exceptions.filter';


async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: ['log', 'warn', 'debug', 'verbose'], // Exclut 'error'
    });

    app.enableCors();
    app.setGlobalPrefix('omertaa');

    // Applique les filtres globalement
    app.useGlobalFilters(new MulterExceptionFilter(), new AllExceptionsFilter());

    await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
