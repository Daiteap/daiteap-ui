module.exports = {
  setupFilesAfterEnv: ["./jest.setup.js"],
  preset: "@vue/cli-plugin-unit-jest",
  // collectCoverage: true,
  // collectCoverageFrom: [
  //   "src/**/*.{js,vue}",
  //   "!src/main.js", // No need to cover bootstrap file
  // ],
  // coverageProvider: "v8",
};
