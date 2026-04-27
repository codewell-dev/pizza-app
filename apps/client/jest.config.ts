import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

const config: Config = {
  displayName: "client",
  testEnvironment: "node",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  testMatch: ["**/__tests__/**/*.spec.ts?(x)", "**/__tests__/**/*.test.ts?(x)"],
  coverageDirectory: "coverage",
  collectCoverageFrom: [
    "app/stores/**/*.ts",
    "lib/**/*.ts",
    "!lib/use-favorites.ts", // needs DOM
  ],
};

export default createJestConfig(config);
