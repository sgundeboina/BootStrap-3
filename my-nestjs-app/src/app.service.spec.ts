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
    it('should return the expected status response', () => {
      // Act
      const result: StatusResponse = service.getStatus();

      // Assert
      expect(result).toEqual(mockStatusResponse);
    });

    it('should return an object with correct properties', () => {
      // Act
      const result = service.getStatus();

      // Assert
      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('statusCode');
      expect(typeof result.status).toBe('string');
      expect(typeof result.statusCode).toBe('number');
    });

    it('should always return the same response', () => {
      // Act
      const result1 = service.getStatus();
      const result2 = service.getStatus();

      // Assert
      expect(result1).toEqual(result2);
      expect(result1).toEqual(mockStatusResponse);
    });
  });
});