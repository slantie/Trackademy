/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    testTimeout: 10000, // Optional: increase timeout for API tests
    // Automatically clear mock calls and instances between every test
    clearMocks: true,
};
