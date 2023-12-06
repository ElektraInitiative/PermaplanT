import axios from 'axios';

/**
 * Mock axios.create() to return a mock axios instance.
 * This is useful for writing tests that use axios.
 */
vi.mock('axios', async () => {
  const actual = await vi.importActual<typeof import('axios')>('axios');
  return {
    ...actual,
    create: vi.fn(() => ({
      get: vi.fn(() => Promise.resolve({ data: {} })),
      post: vi.fn(() => Promise.resolve({ data: {} })),
      put: vi.fn(() => Promise.resolve({ data: {} })),
      patch: vi.fn(() => Promise.resolve({ data: {} })),
      delete: vi.fn(() => Promise.resolve({ data: {} })),
    })),
  };
});

export function createAPI() {
  return axios.create();
}

export function createNextcloudAPI() {
  return axios.create();
}
