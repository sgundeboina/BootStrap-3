import { Test, TestingModule } from "@nestjs/testing";
import { AppController } from "./app.controller";
import { AppService } from "../services/app.service";
import type { HealthStatusResponse } from "../types/index";
import { mockStatusResponse } from "../../../../test/fixtures/mock-data";
import { ConfigService } from "@nestjs/config";

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
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

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('getStatus', () => {
    it('should return status response from service', () => {
      // Arrange
      const expectedResult: HealthStatusResponse = mockStatusResponse;
      jest.spyOn(appService, 'getStatus').mockReturnValue(expectedResult);

      // Act
      const result = appController.getStatus();

      // Assert
      expect(result).toEqual(expectedResult);
      expect(appService.getStatus).toHaveBeenCalled();
    });

    it('should call service getStatus method once', () => {
      // Arrange
      const serviceSpyOn = jest
        .spyOn(appService, 'getStatus')
        .mockReturnValue(mockStatusResponse);

      // Act
      appController.getStatus();

      // Assert
      expect(serviceSpyOn).toHaveBeenCalledTimes(1);
    });

    it("should return correct status, statusCode, environment, and dbHost properties", () => {
      // Act
      const result = appController.getStatus();

      // Assert
      expect(result).toHaveProperty("status", "OK");
      expect(result).toHaveProperty("statusCode", 200);
      expect(result).toHaveProperty("environment", "test-env");
      expect(result).toHaveProperty("dbHost", "test-db-host");
      expect(typeof result.status).toBe("string");
      expect(typeof result.statusCode).toBe("number");
      expect(typeof result.environment).toBe("string");
      expect(typeof result.dbHost).toBe("string");
    });
  });
});
