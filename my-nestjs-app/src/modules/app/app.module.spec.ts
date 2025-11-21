import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';

describe('AppModule', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should compile the module', () => {
    expect(module).toBeDefined();
  });

  it('should provide AppController', () => {
    const controller = module.get<AppController>(AppController);
    expect(controller).toBeInstanceOf(AppController);
  });

  it('should provide AppService', () => {
    const service = module.get<AppService>(AppService);
    expect(service).toBeInstanceOf(AppService);
  });

  it('should provide ConfigService', () => {
    const configService = module.get<ConfigService>(ConfigService);
    expect(configService).toBeInstanceOf(ConfigService);
  });

  it('should load correct env file', () => {
    const configService = module.get<ConfigService>(ConfigService);
    // NODE_ENV is set in app.module.ts logic
    const nodeEnv = configService.get<string>('NODE_ENV');
    expect(nodeEnv).toBeDefined();
    // DB_HOST may not be set, but should not throw
    expect(() => configService.get<string>('DB_HOST')).not.toThrow();
  });
});
