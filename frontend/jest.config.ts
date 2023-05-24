import type { Config } from 'jest';

const config: Config = {
  verbose: true,
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '^.+\\.svg$': '<rootDir>/src/__mocks__/svg.ts',
    '^konva': 'konva/konva',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^import.meta.env$': '<rootDir>/src/env.ts',
  },
  watchPathIgnorePatterns: ['node_modules'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};

export default config;
