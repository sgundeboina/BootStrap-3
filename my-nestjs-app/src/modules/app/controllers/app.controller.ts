import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from '../services/app.service';
import type { HealthStatusResponse } from '../types/index';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get status message' })
  @ApiResponse({
    status: 200,
    description: 'Returns a status message',
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          example: 'OK',
        },
        statusCode: {
          type: 'number',
          example: 200,
        },
      },
    },
  })
  getStatus(): HealthStatusResponse {
    return this.appService.getStatus();
  }
}
