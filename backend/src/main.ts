import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') ?? ['http://localhost:4200'],
    credentials: true,
  });

  const globalPrefix = 'api';

  app.setGlobalPrefix(globalPrefix);

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  //swagger
  if (process.env.SWAGGER_HABILITADO === 'true') {
    const config = new DocumentBuilder()
      .setTitle('Sistema de Gestión de Proyectos')
      .setDescription(
        'Descripción de la API del sistema de gestión de proyectos del TPI.',
      )
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description:
            'Ingresá tu token JWT para acceder a los endpoints protegidos',
          in: 'header',
        },
        'token',
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup(`${globalPrefix}/docs`, app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
