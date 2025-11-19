
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { loadEnvConfig } from './configuration';

// Determine environment (default to 'dev' if not set)
const NODE_ENV = process.env.NODE_ENV || process.env.npm_lifecycle_event?.split(':')[1] || 'dev';
loadEnvConfig(NODE_ENV);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('My NestJS App')
    .setDescription('API documentation for My NestJS Application')
    .setVersion('1.0')
    .addTag('app', 'Application endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((error) => console.error(error));
