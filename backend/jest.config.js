/** @type {import('ts-jest').JestConfigWithTsJest} */

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testTimeout: 10000,
  clearMocks: true,
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
};
