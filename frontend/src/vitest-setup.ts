import '@testing-library/jest-dom/vitest';
// we need to mock canvas because
// node canvas does not work correctly with jsdom
import 'vitest-canvas-mock';

// https://docs.pmnd.rs/zustand/guides/testing
vi.mock('zustand');
