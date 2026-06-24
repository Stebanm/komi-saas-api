import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Main');
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  );

  // El filtro y el interceptor están acotados a inventory (vía @UseFilters/@UseInterceptors
  // en su controller). Así, mientras el resto está en construcción, conservas los errores
  // genéricos de Nest fuera de inventory. Para hacerlo global: descomenta las dos líneas de
  // abajo, reimporta AllExceptionsFilter/ResponseInterceptor y quita los decoradores del controller.
  // app.useGlobalFilters(new AllExceptionsFilter());
  // app.useGlobalInterceptors(new ResponseInterceptor(app.get(Reflector)));

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') ?? 3000;

  await app.listen(port);

  logger.log(`🚀 Servidor corriendo exitosamente en: ${await app.getUrl()}`)
};

bootstrap();
