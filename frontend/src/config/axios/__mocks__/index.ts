import axios from 'axios';

/**
 * Mock axios.create() to return a mock axios instance.
 * This is useful for writing tests that use axios.
 */
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(() => Promise.resolve({ data: {} })),
    post: jest.fn(() => Promise.resolve({ data: {} })),
    put: jest.fn(() => Promise.resolve({ data: {} })),
    patch: jest.fn(() => Promise.resolve({ data: {} })),
    delete: jest.fn(() => Promise.resolve({ data: {} })),
  })),
}));

export function createAPI() {
  return axios.create();
}

export function createNextcloudAPI() {
  return axios.create();
}
