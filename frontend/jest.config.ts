import type { Config } from 'jest';

const config: Config = {
  verbose: true,
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': 'babel-jest',
    '^.+\\.svg$': '<rootDir>/svg-transform.ts',
  },
  moduleNameMapper: {
    '^konva': 'konva/konva',
    '^@/(.*)': '<rootDir>/src/$1',
  },
};

export default config;
