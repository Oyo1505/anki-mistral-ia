/**
 * Jest configuration for Next.js 15 with TypeScript
 * For detailed configuration options: https://jestjs.io/docs/configuration
 */

const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Path to Next.js app (load next.config.ts and .env files)
  dir: './',
})

/** @type {import('jest').Config} */
const config = {
  // Test environment for React components
  testEnvironment: 'jsdom',

  // Setup files after environment initialization
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // Coverage configuration
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/__tests__/**',
  ],

  // Module path aliases matching tsconfig.json
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  // Test match patterns
  testMatch: [
    '**/__tests__/**/*.{js,jsx,ts,tsx}',
    '**/*.{spec,test}.{js,jsx,ts,tsx}',
  ],

  // Ignore patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.next/',
  ],

  // Transform ignore patterns for ES modules in node_modules
  transformIgnorePatterns: [
    '/node_modules/(?!(tesseract.js|pdf-to-png-converter)/)',
  ],

  // Module file extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

  // Clear mocks between tests
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
}

// Export config with Next.js Jest configuration
module.exports = createJestConfig(config)
