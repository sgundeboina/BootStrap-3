import { Injectable } from '@nestjs/common';
import type { StatusResponse } from './types';

@Injectable()
export class AppService {
  getStatus(): StatusResponse & {
    environment: string;
    dbHost: string | undefined;
  } {
    return {
      status: "OK",
      statusCode: 200,
      environment: process.env.NODE_ENV || "dev",
      dbHost: process.env.DB_HOST,
    };
  }
}
