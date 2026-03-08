const { defineConfig } = require("cypress");
const { allureCypress } = require("allure-cypress/reporter");
const os = require("os");

module.exports = defineConfig({
  projectId: '9qg512',
  e2e: {
    baseUrl: 'https://demo.evershop.io',
    chromeWebSecurity: false,
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
  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: 'cypress/reports',
    overwrite: false,
    html: true,
    json: true
  }
});
