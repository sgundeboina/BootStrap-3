import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from "./app.service";
import { ConfigService } from "@nestjs/config";
import { mockStatusResponse } from "../../../../test/fixtures";
import type { HealthStatusResponse } from "../types/index";

describe('AppService', () => {
  let service: AppService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === "NODE_ENV") return "test-env";
              if (key === "DB_HOST") return "test-db-host";
              return undefined;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AppService>(AppService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getStatus", () => {

    it("should return the expected status, statusCode, environment, and dbHost", () => {
      // Act
      const result = service.getStatus();

      // Assert
      expect(result.status).toBe("OK");
      expect(result.statusCode).toBe(200);
      expect(result.environment).toBe("test-env");
      expect(result.dbHost).toBe("test-db-host");
    });

    it("should return an object with correct properties", () => {
      // Act
      const result = service.getStatus();

      // Assert
      expect(result).toHaveProperty("status");
      expect(result).toHaveProperty("statusCode");
      expect(result).toHaveProperty("environment");
      expect(result).toHaveProperty("dbHost");
      expect(typeof result.status).toBe("string");
      expect(typeof result.statusCode).toBe("number");
      expect(typeof result.environment).toBe("string");
      expect(["string", "undefined"].includes(typeof result.dbHost)).toBe(true);
    });

    it("should always return the same response for the same environment", () => {
      // Arrange
      (configService.get as jest.Mock).mockImplementation((key: string) => {
        if (key === "NODE_ENV") return "repeat-env";
        if (key === "DB_HOST") return "repeat-db-host";
        return undefined;
      });

      // Act
      const result1 = service.getStatus();
      const result2 = service.getStatus();

      // Assert
      expect(result1).toEqual(result2);
      expect(result1.environment).toBe("repeat-env");
      expect(result1.dbHost).toBe("repeat-db-host");
    });
  });
});