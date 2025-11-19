import { Injectable } from '@nestjs/common';
import type { StatusResponse } from './types';

@Injectable()
export class AppService {
  getStatus(): StatusResponse {
    return { status: 'OK', statusCode: 200 };
  }
}
