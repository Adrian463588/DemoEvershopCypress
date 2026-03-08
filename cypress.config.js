const { defineConfig } = require("cypress");
const { allureCypress } = require("allure-cypress/reporter");
const os = require("os");
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const { addCucumberPreprocessorPlugin } = require("@badeball/cypress-cucumber-preprocessor");
const { createEsbuildPlugin } = require("@badeball/cypress-cucumber-preprocessor/esbuild");

module.exports = defineConfig({
  projectId: '9qg512',
  e2e: {
    baseUrl: 'https://demo.evershop.io',
    chromeWebSecurity: false,
    specPattern: 'cypress/e2e/features/**/*.feature',
    env: {
      apiUrl: 'https://demo.evershop.io/api',
      tags: process.env.CYPRESS_TAGS || '',
      allure: true
    },
    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config);
      on('file:preprocessor',
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        })
      );
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
