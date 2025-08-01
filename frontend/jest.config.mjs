/**
 * @file jest.config.mjs
 * @description Jest configuration file for a Next.js project.
 * This setup uses the next/jest preset to handle all necessary code transformations.
 */

import nextJest from "next/jest.js";

const createJestConfig = nextJest({
    // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
    dir: "./",
});

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const customJestConfig = {
    // Add more setup options before each test is run
    setupFilesAfterEnv: ["<rootDir>/src/lib/jest.setup.ts"],
    // Use jsdom to simulate a browser environment
    testEnvironment: "jest-environment-jsdom",
    // Map module aliases from tsconfig.json
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
    },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(customJestConfig);
