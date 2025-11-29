import { Controller, Get, Post, Patch, Body } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AppService } from "../services/app.service";
import type { HealthStatusResponse } from "../types/index";

@ApiTags("app")
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: "Get status message" })
  @ApiResponse({
    status: 200,
    description: "Returns a status message",
    schema: {
      type: "object",
      properties: {
        status: { type: "string", example: "OK" },
        statusCode: { type: "number", example: 200 },
      },
    },
  })
  getHealthCheck(): HealthStatusResponse {
    return this.appService.getHealthCheck();
  }

  @Get("manifest")
  @ApiOperation({ summary: "Get manifest" })
  async getManifest() {
    return this.appService.getManifest();
  }

  @Post("manifest")
  @ApiOperation({ summary: "Post manifest" })
  async postManifest(@Body() body: any) {
    return this.appService.postManifest(body);
  }

  @Patch("manifest")
  @ApiOperation({ summary: "Patch manifest" })
  async patchManifest(@Body() body: any) {
    return this.appService.patchManifest(body);
  }
}
