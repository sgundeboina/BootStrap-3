import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { mockStatusResponse } from '../test/fixtures';
import type { StatusResponse } from './types';

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getStatus', () => {

    it('should return the expected status, statusCode, environment, and dbHost', () => {
      // Arrange
      process.env.NODE_ENV = 'test-env';
      process.env.DB_HOST = 'test-db-host';

      // Act
      const result = service.getStatus();

      // Assert
      expect(result.status).toBe('OK');
      expect(result.statusCode).toBe(200);
      expect(result.environment).toBe('test-env');
      expect(result.dbHost).toBe('test-db-host');
    });

    it('should return an object with correct properties', () => {
      // Act
      const result = service.getStatus();

      // Assert
      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('statusCode');
      expect(result).toHaveProperty('environment');
      expect(result).toHaveProperty('dbHost');
      expect(typeof result.status).toBe('string');
      expect(typeof result.statusCode).toBe('number');
      expect(typeof result.environment).toBe('string');
      expect(['string', 'undefined'].includes(typeof result.dbHost)).toBe(true);
    });

    it('should always return the same response for the same environment', () => {
      // Arrange
      process.env.NODE_ENV = 'repeat-env';
      process.env.DB_HOST = 'repeat-db-host';

      // Act
      const result1 = service.getStatus();
      const result2 = service.getStatus();

      // Assert
      expect(result1).toEqual(result2);
      expect(result1.environment).toBe('repeat-env');
      expect(result1.dbHost).toBe('repeat-db-host');
    });
  });
});