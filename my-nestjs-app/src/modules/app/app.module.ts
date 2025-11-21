
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { join } from 'path';

let nodeEnv = process.env.NODE_ENV || 'dev';
let envFilePath = '';
if (nodeEnv === 'dev') {
  envFilePath = join(__dirname, '..', 'config', '.env.dev');
} else if (nodeEnv === "qa") {
  envFilePath = join(__dirname, "..", "config", ".env.qa");
} else {
  envFilePath = join(__dirname, '..', 'config', `.env.${nodeEnv}`);
}

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath,
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
