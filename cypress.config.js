const { defineConfig } = require("cypress");
const { allureCypress } = require("allure-cypress/reporter");
const os = require("os");

module.exports = defineConfig({
  projectId: '9qg512',
  e2e: {
    baseUrl: 'https://demo.evershop.io',
    env: {
      apiUrl: 'https://demo.evershop.io/api'
    },
    setupNodeEvents(on, config) {
      allureCypress(on, config, {
        resultsDir: "allure-results",
        environmentInfo: {
          app_url: "https://demo.evershop.io",
          os_platform: os.platform(),
          os_version: os.version ? os.version() : os.release(),
          node_version: process.version,
        },
      });
      return config;
    },
  },
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    reporterEnabled: 'mochawesome',
    mochawesomeReporterOptions: {
      reportDir: 'cypress/reports',
      quiet: true,
      overwrite: false,
      html: true,
      json: true
    }
  }
});
