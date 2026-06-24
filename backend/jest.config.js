module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.js', '**/*.test.js', '**/*.spec.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',
    '!src/infrastructure/socket/**',
    '!**/node_modules/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'text-summary'],
  clearMocks: true,
  restoreMocks: true,
  forceExit: true,
  detectOpenHandles: true,
  testTimeout: 15000,
}
