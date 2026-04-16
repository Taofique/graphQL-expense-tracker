export default {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.js"],
  verbose: true,
  transform: {},
  setupFilesAfterFramework: ["./tests/setupTestDB.js"], // ← correct hook
};
