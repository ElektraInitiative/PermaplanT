import type { Config } from 'jest';

const config: Config = {
  verbose: true,
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '^.+\\.svg$': '<rootDir>/src/__mocks__/svg.ts',
  },
};

export default config;
