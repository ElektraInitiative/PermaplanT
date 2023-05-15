import '@testing-library/jest-dom';

// https://docs.pmnd.rs/zustand/guides/testing
jest.mock('zustand');
// needed because jest doesn't support import.meta.env
jest.mock('@/config/env');
