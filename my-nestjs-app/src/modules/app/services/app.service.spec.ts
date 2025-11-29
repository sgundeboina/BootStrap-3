import { Test, TestingModule } from "@nestjs/testing";
import { AppService } from "./app.service";
import { ConfigService } from "@nestjs/config";
import { ManifestRepository } from "../repositories/manifest.repository";

describe("AppService", () => {
  let service: AppService;
  let configService: ConfigService;
  let manifestRepository: any;

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
        {
          provide: ManifestRepository,
          useValue: {
            getManifest: jest.fn(),
            postManifest: jest.fn(),
            patchManifest: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AppService>(AppService);
    configService = module.get<ConfigService>(ConfigService);
    manifestRepository = module.get<ManifestRepository>(ManifestRepository);
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getHealthCheck", () => {
    it("should return the expected status, statusCode, environment, and dbHost", () => {
      // Act
      const result = service.getHealthCheck();

      // Assert
      expect(result.status).toBe("OK");
      expect(result.statusCode).toBe(200);
      expect(result.environment).toBe("test-env");
      expect(result.dbHost).toBe("test-db-host");
    });

    it("should return an object with correct properties", () => {
      // Act
      const result = service.getHealthCheck();

      // Assert
      expect(result).toHaveProperty("status");
      expect(result).toHaveProperty("statusCode");
      expect(result).toHaveProperty("environment");
      expect(result).toHaveProperty("dbHost");
      expect(typeof result.status).toBe("string");
      expect(typeof result.statusCode).toBe("number");
      expect(typeof result.environment).toBe("string");
    });

    it("should always return the same response for the same environment", () => {
      // Arrange
      const configMap: Record<string, string | undefined> = {
        NODE_ENV: "repeat-env",
        DB_HOST: "repeat-db-host",
      };
      (configService.get as jest.Mock).mockImplementation((key: string) => configMap[key]);

      // Act
      const result1 = service.getHealthCheck();
      const result2 = service.getHealthCheck();

      // Assert
      expect(result1).toEqual(result2);
      expect(result1.environment).toBe("repeat-env");
      expect(result1.dbHost).toBe("repeat-db-host");
    });
  });

  it("should call getManifest and return data", async () => {
    const mockData = { foo: "bar" };
    (manifestRepository.getManifest as jest.Mock).mockResolvedValue({ data: mockData });
    const result = await service.getManifest();
    expect(result).toEqual(mockData);
    expect(manifestRepository.getManifest).toHaveBeenCalled();
  });

  it("should call postManifest with payload and return data", async () => {
    const payload = { environment: "sqa", client: "xs" };
    const mockData = { foo: "baz" };
    (manifestRepository.postManifest as jest.Mock).mockResolvedValue({ data: mockData });
    const result = await service.postManifest(payload);
    expect(result).toEqual(mockData);
    expect(manifestRepository.postManifest).toHaveBeenCalledWith(payload);
  });

  it("should call patchManifest with payload and return data", async () => {
    const payload = { environment: "sqa", client: "xs" };
    const mockData = { foo: "patched" };
    (manifestRepository.patchManifest as jest.Mock).mockResolvedValue({ data: mockData });
    const result = await service.patchManifest(payload);
    expect(result).toEqual(mockData);
    expect(manifestRepository.patchManifest).toHaveBeenCalledWith(payload);
  });
});
