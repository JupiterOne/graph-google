module.exports = {
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  testMatch: ["<rootDir>/**/*.test.{js,ts}"],
  collectCoverageFrom: [
    "src/**/*.ts",
    "!<rootDir>/src/executionHandler.ts",
    "!<rootDir>/src/initializeContext.ts"
  ],
  coveragePathIgnorePatterns: ["<rootDir>/src/index.ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  testEnvironment: "node",
  clearMocks: true,
  collectCoverage: true,
  coverageThreshold: {
    global: {
      statements: 90,
      branches: 90,
      functions: 90,
      lines: 90
    }
  }
};
