import type { HealthStatusResponse } from "../../src/modules/app/types/health-status.response";

export const mockStatusResponse: HealthStatusResponse = {
  status: "OK",
  statusCode: 200,
  environment: "test-env",
  dbHost: "test-db-host",
};

export const mockStatusResponseError: HealthStatusResponse = {
  status: "ERROR",
  statusCode: 500,
  environment: "test-env",
  dbHost: "test-db-host",
};

export const mockStatusResponseNotFound: HealthStatusResponse = {
  status: "NOT_FOUND",
  statusCode: 404,
  environment: "test-env",
  dbHost: "test-db-host",
};

// API endpoints for testing
export const API_ENDPOINTS = {
  status: "/",
  swagger: "/swagger",
} as const;

// HTTP status codes
export const HTTP_STATUS = {
  OK: 200,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;
