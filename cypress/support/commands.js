// Cypress commands for EverShop

Cypress.Commands.add('login', (email, password) => {
  cy.visit('/account/login')
  cy.get('[data-cy="email-input"]').type(email)
  cy.get('[data-cy="password-input"]').type(password)
  cy.get('[data-cy="login-btn"]').click()
  cy.url().should('not.include', '/login')
})

Cypress.Commands.add('addToCart', (productName) => {
  cy.contains(productName).click()
  cy.get('[data-cy="add-to-cart-btn"]').click()
  cy.get('[data-cy="cart-notification"]').should('be.visible')
})
