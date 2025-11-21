

import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './modules/app/app.module';
import { ConfigModule } from '@nestjs/config';
import { config as loadEnv } from 'dotenv';
import { join } from 'path';

// Set NODE_ENV and load the correct .env file
let nodeEnv = process.env.NODE_ENV;
if (!nodeEnv || nodeEnv === '') {
  nodeEnv = 'dev';
  process.env.NODE_ENV = 'dev';
}

let envFilePath = '';
if (nodeEnv === 'dev') {
  envFilePath = join(__dirname, '..', 'config', '.env.dev');
} else if (nodeEnv === "qa") {
  envFilePath = join(__dirname, "..", "config", ".env.qa");
} else {
  envFilePath = join(__dirname, '..', 'config', `.env.${nodeEnv}`);
}
loadEnv({ path: envFilePath });

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
