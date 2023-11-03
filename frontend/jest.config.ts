import type { Config } from 'jest';

const config: Config = {
  verbose: true,
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': 'babel-jest',
    // react-leaflet uses js files that make use of export/import syntax.
    '^.+react-leaflet.+$': 'babel-jest',
  },
  moduleNameMapper: {
    '^.+\\.svg$': '<rootDir>/src/__mocks__/svg.ts',
    '^.+\\.css$': '<rootDir>/src/__mocks__/css.ts',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^import.meta.env$': '<rootDir>/src/env.ts',
  },
  watchPathIgnorePatterns: ['node_modules'],
  // node_modules is automatically ignored by jest if this is not provided.
  // This prevents certain tests from braking, because we use libraries that
  // are delivered as uncompiled typescript files.
  transformIgnorePatterns: [],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};

export default config;
