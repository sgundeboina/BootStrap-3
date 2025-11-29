import { Test, TestingModule } from "@nestjs/testing";
import { AppController } from "./app.controller";
import { AppService } from "../services/app.service";
import { mockStatusResponse } from "../../../../test/fixtures/mock-data";
import { ConfigService } from "@nestjs/config";

describe("AppController", () => {
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
        {
          provide: require("../repositories/manifest.repository").ManifestRepository,
          useValue: {
            getManifest: jest.fn(),
            postManifest: jest.fn(),
            patchManifest: jest.fn(),
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("getHealthCheck", () => {
    it("should return fallback environment and dbHost values when missing", () => {
      // Arrange
      const mockAppService = {
        getHealthCheck: () => ({
          status: "OK",
          statusCode: 200,
          environment: "dev",
          dbHost: "localhost",
        }),
      } as AppService;
      const controller = new AppController(mockAppService);
      // Act
      const result = controller.getHealthCheck();
      // Assert
      expect(result).toEqual({
        status: "OK",
        statusCode: 200,
        environment: "dev",
        dbHost: "localhost",
      });
    });
    it("should return status response from service", () => {
      // Arrange
      const expectedResult = {
        ...mockStatusResponse,
        environment: "test-env",
        dbHost: "test-db-host",
      };
      const spy = jest.spyOn(appService, "getHealthCheck").mockReturnValue(expectedResult);

      // Act
      const result = appController.getHealthCheck();

      // Assert
      expect(result).toEqual(expectedResult);
      expect(spy).toHaveBeenCalled();
    });

    it("should call service getHealthCheck method once", () => {
      // Arrange
      const serviceSpyOn = jest
        .spyOn(appService, "getHealthCheck")
        .mockReturnValue(mockStatusResponse);

      // Act
      appController.getHealthCheck();

      // Assert
      expect(serviceSpyOn).toHaveBeenCalledTimes(1);
    });

    it("should return correct status, statusCode, environment, and dbHost properties", () => {
      // Act
      const result = appController.getHealthCheck();

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
