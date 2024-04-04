/**
 * @type {import('jest').Config}
 **/
module.exports = {
  preset: 'react-native',
  modulePathIgnorePatterns: [
    '<rootDir>/lib/',
    '<rootDir>/example',
    '<rootDir>/storybook',
  ],
  setupFilesAfterEnv: ['<rootDir>/scripts/setupTests.ts'],
  clearMocks: true,
}
