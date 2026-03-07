const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: '9qg512',
  e2e: {
    baseUrl: 'https://demo.evershop.io',
    env: {
      apiUrl: 'https://demo.evershop.io/api'
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
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
