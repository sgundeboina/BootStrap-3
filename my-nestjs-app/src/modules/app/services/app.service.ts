import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ManifestRepository } from "../repositories/manifest.repository";
import type { HealthStatusResponse } from "../types/index";

@Injectable()
export class AppService {
  constructor(
    private readonly configService: ConfigService,
    private readonly manifestRepository: ManifestRepository
  ) {}

  getHealthCheck(): HealthStatusResponse {
    return {
      status: "OK",
      statusCode: 200,
      environment: this.configService.get<string>("NODE_ENV") || "",
      dbHost: this.configService.get<string>("DB_HOST") || "",
    };
  }

  async getManifest(): Promise<any> {
    const response = await this.manifestRepository.getManifest();
    return response.data;
  }

  async postManifest(payload: any): Promise<any> {
    const response = await this.manifestRepository.postManifest(payload);
    return response.data;
  }

  async patchManifest(payload: any): Promise<any> {
    const response = await this.manifestRepository.patchManifest(payload);
    return response.data;
  }
}
