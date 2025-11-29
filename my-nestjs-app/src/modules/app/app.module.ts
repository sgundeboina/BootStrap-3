import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./controllers/app.controller";
import { AppService } from "./services/app.service";
import * as path from "path";
import { HttpModule } from "@nestjs/axios";
import { ManifestRepository } from "./repositories/manifest.repository";

export function getEnvFilePath(): string {
  const nodeEnv = process.env.NODE_ENV || "dev";
  const root = process.cwd();
  switch (nodeEnv) {
    case "dev":
      return path.join(root, "config", ".env.dev");
    case "qa":
      return path.join(root, "config", ".env.qa");
    default:
      return path.join(root, "config", `.env.${nodeEnv}`);
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: getEnvFilePath(),
    }),
    HttpModule,
  ],
  controllers: [AppController],
  providers: [AppService, ManifestRepository],
})
export class AppModule {}
