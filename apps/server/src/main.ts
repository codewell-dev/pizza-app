import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security headers — sets X-Content-Type, X-Frame-Options, etc.
  app.use(helmet());

  // Global API prefix
  app.setGlobalPrefix('api');

  // CORS — origins from ALLOWED_ORIGINS env variable
  const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? 'http://localhost:3000')
    .split(',')
    .map((o) => o.trim());

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  // Global validation pipe — strips unknown fields, auto-transforms types
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Pizza House API')
    .setDescription(
      `## Pizza House REST API\n\n` +
        `### Authentication\n` +
        `Most write endpoints require a Bearer JWT token.\n` +
        `1. Register via \`POST /api/users\`\n` +
        `2. Login via \`POST /api/auth/login\` — get \`access_token\`\n` +
        `3. Click **Authorize** and paste the token\n\n` +
        `### Public endpoints\n` +
        `All \`GET\` endpoints for products, categories and modifiers are public.`,
    )
    .setVersion('1.0')
    .addServer('/', 'Default')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Paste your JWT access_token here',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // keeps token after page refresh
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  const port = process.env.PORT ?? 5000;
  await app.listen(port);
  console.log(`🚀 Server: http://localhost:${port}/api`);
  console.log(`📖 Swagger: http://localhost:${port}/docs`);
}
bootstrap();
