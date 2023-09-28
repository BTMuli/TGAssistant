/**
 * @file jest.config.ts
 * @description Jest configuration file
 * @since 2.0.0
 */

import type { Config } from "jest";

const jestConfig: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  cacheDirectory: ".jest/cache",
  moduleFileExtensions: ["ts", "js"],
  testMatch: ["**/*.test.ts"],
};

export default jestConfig;
