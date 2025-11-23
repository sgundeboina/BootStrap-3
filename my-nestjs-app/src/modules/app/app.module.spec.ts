import * as path from "path";
import { getEnvFilePath } from "./app.module";
describe("getEnvFilePath()", () => {
  const root = process.cwd();

  it("should return .env.dev for NODE_ENV=dev", () => {
    process.env.NODE_ENV = "dev";
    expect(getEnvFilePath()).toBe(path.join(root, "config", ".env.dev"));
  });

  it("should return .env.qa for NODE_ENV=qa", () => {
    process.env.NODE_ENV = "qa";
    expect(getEnvFilePath()).toBe(path.join(root, "config", ".env.qa"));
  });

  it("should return .env.prod for NODE_ENV=prod", () => {
    process.env.NODE_ENV = "prod";
    expect(getEnvFilePath()).toBe(path.join(root, "config", ".env.prod"));
  });

  it("should return .env.custom for NODE_ENV=custom", () => {
    process.env.NODE_ENV = "custom";
    expect(getEnvFilePath()).toBe(path.join(root, "config", ".env.custom"));
  });

  it("should default to .env.dev if NODE_ENV is not set", () => {
    delete process.env.NODE_ENV;
    expect(getEnvFilePath()).toBe(path.join(root, "config", ".env.dev"));
  });
});
import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import { AppModule } from "./app.module";
import { AppController } from "./controllers/app.controller";
import { AppService } from "./services/app.service";

describe("AppModule", () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });

  afterAll(async () => {
    await module.close();
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should compile the module", () => {
    expect(module).toBeDefined();
  });

  it("should provide AppController", () => {
    const controller = module.get<AppController>(AppController);
    expect(controller).toBeInstanceOf(AppController);
  });

  it("should provide AppService", () => {
    const service = module.get<AppService>(AppService);
    expect(service).toBeInstanceOf(AppService);
  });

  it("should provide ConfigService", () => {
    const configService = module.get<ConfigService>(ConfigService);
    expect(configService).toBeInstanceOf(ConfigService);
  });

  describe("ConfigModule env file loading", () => {
    let originalEnv: string | undefined;
    beforeAll(() => {
      originalEnv = process.env.NODE_ENV;
    });
    afterAll(() => {
      process.env.NODE_ENV = originalEnv;
    });

    it("should load .env.qa when NODE_ENV=qa", async () => {
      process.env.NODE_ENV = "qa";
      const testModule = await Test.createTestingModule({ imports: [AppModule] }).compile();
      const configService = testModule.get<ConfigService>(ConfigService);
      expect(configService.get<string>("NODE_ENV")).toBe("qa");
      await testModule.close();
    });

    it("should load custom env file for other NODE_ENV values", async () => {
      process.env.NODE_ENV = "prod";
      const testModule = await Test.createTestingModule({ imports: [AppModule] }).compile();
      const configService = testModule.get<ConfigService>(ConfigService);
      expect(configService.get<string>("NODE_ENV")).toBe("prod");
      await testModule.close();
    });
  });
});
