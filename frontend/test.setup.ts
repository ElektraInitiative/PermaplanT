import '@testing-library/jest-dom';
import matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';
import { vi, expect, afterEach } from 'vitest';

// https://docs.pmnd.rs/zustand/guides/testing
vi.mock('zustand');
// needed because jest doesn't support import.meta.env
vi.mock('@/config/env');

expect.extend(matchers);

afterEach(() => {
  cleanup();
});
