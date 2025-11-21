import { Injectable } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import type { HealthStatusResponse } from "../types/index";

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  getStatus(): HealthStatusResponse & {
    environment: string;
    dbHost: string | undefined;
  } {
    return {
      status: "OK",
      statusCode: 200,
      environment: this.configService.get<string>("NODE_ENV") || "dev",
      dbHost: this.configService.get<string>("DB_HOST"),
    };
  }
}
