// Cypress commands for EverShop
// Note: Most interactions now go through Page Objects in cypress/pages/
// These commands are kept for backward compatibility (e.g., logout.cy.js beforeEach)

import LoginPage from '../pages/LoginPage'

Cypress.Commands.add('login', (email, password) => {
  cy.visit('/account/login')
  cy.wait(1000)
  LoginPage.login(email, password)
  cy.wait(3000)
  cy.url({ timeout: 10000 }).should('not.include', '/login')
})
