import type { StatusResponse } from '../../src/types';

export const mockStatusResponse: StatusResponse = {
  status: 'OK',
  statusCode: 200,
};

export const mockStatusResponseError: StatusResponse = {
  status: 'ERROR',
  statusCode: 500,
};

export const mockStatusResponseNotFound: StatusResponse = {
  status: 'NOT_FOUND',
  statusCode: 404,
};

// API endpoints for testing
export const API_ENDPOINTS = {
  status: '/',
  swagger: '/swagger',
} as const;

// HTTP status codes
export const HTTP_STATUS = {
  OK: 200,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;