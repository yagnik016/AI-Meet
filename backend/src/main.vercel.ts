import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.vercel';

let cachedApp: any;

async function bootstrap() {
  if (cachedApp) return cachedApp;

  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
  });

  // Set global API prefix
  app.setGlobalPrefix('api');

  // Enable validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('AI Meeting Platform API')
    .setDescription('API for AI-powered meeting intelligence platform')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.init();
  cachedApp = app;
  return app;
}

// Vercel serverless handler
export default async function handler(req: any, res: any) {
  const app = await bootstrap();
  const httpAdapter = app.getHttpAdapter();
  const instance = httpAdapter.getInstance();
  return instance(req, res);
}

// For local development
if (process.env.NODE_ENV !== 'production') {
  bootstrap().then(async (app) => {
    await app.listen(process.env.PORT ?? 3001);
    console.log(`Application is running on: ${await app.getUrl()}`);
  });
}
