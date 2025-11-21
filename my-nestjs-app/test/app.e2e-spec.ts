import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/modules/app/app.module';
import { ConfigService } from "@nestjs/config";
import { mockStatusResponse, API_ENDPOINTS, HTTP_STATUS } from './fixtures';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === "NODE_ENV") return "test";
              if (key === "DB_HOST") return "test-db-host";
              return undefined;
            }),
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    const configService = moduleFixture.get<ConfigService>(ConfigService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /', () => {
    it('should return status response', () => {
      return request(app.getHttpServer())
        .get(API_ENDPOINTS.status)
        .expect(HTTP_STATUS.OK)
        .expect((res) => {
          expect(res.body).toMatchObject({
            status: "OK",
            statusCode: 200,
            environment: "test"
          });
        });
    });

    it('should return proper content-type', () => {
      return request(app.getHttpServer())
        .get(API_ENDPOINTS.status)
        .expect(HTTP_STATUS.OK)
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body).toMatchObject({
            status: "OK",
            statusCode: 200,
            environment: "test"
          });
        });
    });

    it('should have correct response structure', () => {
      return request(app.getHttpServer())
        .get(API_ENDPOINTS.status)
        .expect(HTTP_STATUS.OK)
        .expect((res) => {
          const body = res.body as Record<string, unknown>;
          expect(body).toHaveProperty('status');
          expect(body).toHaveProperty('statusCode');
          expect(typeof body.status).toBe('string');
          expect(typeof body.statusCode).toBe('number');
        });
    });
  });
});
