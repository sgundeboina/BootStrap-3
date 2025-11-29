import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { AxiosResponse } from "axios";
import { firstValueFrom } from "rxjs";

@Injectable()
export class ManifestRepository {
  private readonly apiUrl: string;
  private readonly apiToken: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiUrl = this.configService.get<string>("MANIFEST_API_URL", "");
    this.apiToken = this.configService.get<string>("MANIFEST_API_TOKEN", "");
  }

  async getManifest(): Promise<AxiosResponse<any>> {
    return firstValueFrom(
      this.httpService.get(this.apiUrl, {
        headers: {
          "x-drc-auth-token": this.apiToken,
          "Content-Type": "application/json",
        },
      }),
    );
  }

  async postManifest(payload: any): Promise<AxiosResponse<any>> {
    return firstValueFrom(
      this.httpService.post(this.apiUrl, payload, {
        headers: {
          "x-drc-auth-token": this.apiToken,
          "Content-Type": "application/json",
        },
      }),
    );
  }

  async patchManifest(payload: any): Promise<AxiosResponse<any>> {
    return firstValueFrom(
      this.httpService.patch(this.apiUrl, payload, {
        headers: {
          "x-drc-auth-token": this.apiToken,
          "Content-Type": "application/json",
        },
      }),
    );
  }
}
